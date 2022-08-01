import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
import styles from './SenderPanel.module.scss'
import recordMedia from '../../../utils/writerMedia';
import { msToHMS,hexToRgb } from "../../../utils/helper";
import {getPositionCursore, getFivesLevelParent, replaceSelectionWithHtml} from "../../../utils/textEditor"
import filterMessage from '../../../utils/filterMessage';

const SenderPanel = props => {

    const [recording, setRecording] = useState({ value: false, stopper: null });
    const [typeMedia, setTypeMedia] = useState("audio");
    const [timeRecording, setTimeRecording] = useState(0);
    const [recordingIntervals, setRecordingIntervals] = useState({
        writingPointsInterval: null,
        writeTimerInterval: null
    });
    const [activeTextEditor, setActiveTextEditor] = useState({isActive:false, left:0,top:0});
    const {messageInput, setMessageInput, setTyping} = props;

    const fileInputRef = useRef(null);
    const recordingMessageRef = useRef(null);
    const timerRef = useRef(null);
    const editButtonsParentRef = useRef(null);

    const changeEmojiActive = () => props.setActiveEmojiBlock((prev) => !prev);

    const sendMessage = async () => {
        const message = props.messageDivRef.current.innerHTML;
        const filteredMessage = filterMessage(message);
        if(!filteredMessage){
            props.setError("Empty message!")
            return;
        }
            props.messageDivRef.current.innerHTML="";
            props.sendMessage(message);
            setMessageInput({normal: 0, actualKey:null, marginTopForAnother:0, dif:0, actualHeight:0});
            setActiveTextEditor(prev=>{return{...prev}});
    }

    const afterStopRecording = res => {
        const type = res.type.split("/")[1];
        const url = window.URL.createObjectURL(res);
        props.setActualRecordedData(url, type, "recorded", res);
        setRecording({ value: false, stopper: null });
    }

    const writePointsCallBack = () => {
        let elemText = recordingMessageRef.current.innerHTML;
        const length = elemText.length;
        let points = "";
        if (elemText[length - 1] === '.' && elemText[length - 2] === '.' &&
            elemText[length - 3] === '.')
            points = "";
        else if(elemText[length - 1] === '.' && elemText[length - 2] === '.') points = "...";
        else if(elemText[length - 1] === '.') points = "..";
        else points = ".";
        const temp=(typeMedia === "audio" ? "Recording audio" : "Recording video")+ points;
        recordingMessageRef.current.innerHTML = temp;
    }

    const writeTimeRecordingCallBack = () => {
        setTimeRecording(prev => {
            return prev + 0.1;
        })
    }

    const changeRecording = async (e) => {
        if (recording.stopper) {
            await recording.stopper();
            clearInterval(recordingIntervals.writingPointsInterval);
            clearInterval(recordingIntervals.writeTimerInterval);
        } else {
            const stopper = await recordMedia(typeMedia, afterStopRecording)
            setRecording({ value: true, stopper })

            setTimeRecording(0);
                

            const writingPointsInterval = setInterval(writePointsCallBack, 500);
            const writeTimerInterval = setInterval(writeTimeRecordingCallBack, 100);
            setRecordingIntervals({ writingPointsInterval, writeTimerInterval });
        }
    }

    const handlerContextMenu = (e) => {
        e.preventDefault();
        setTypeMedia(prev => {
            return prev === "video" ? "audio" : "video";
        });
    }


    const handleFileInputClick = () => fileInputRef.current.click();

    const handleSendFileChange = e => {
        props.setActualFile(e.target.files[0]);
        e.target.value = "";
    }

    useLayoutEffect(()=>{
        console.log(messageInput)
        if(!messageInput.normal){
            setMessageInput(prev=>{
                const normal = props.messageDivRef.current.clientHeight;
                return {...prev, normal, actualHeight:normal}
            });
        }
        const hidePopap = e => {
            if (e.target.classList.contains("edit-buttons") || e.target.classList.contains("edit-button")
            ||e.target.parentElement.classList.contains("edit-button")||e.target.classList.contains("edit-color-button"))
                return;
            document.body.removeEventListener("click", hidePopap);
            setActiveTextEditor({isActive:false, left:0,top:0});
        }
        if(activeTextEditor.isActive===true){
            editButtonsParentRef.current.style.left = activeTextEditor.left -
             editButtonsParentRef.current.offsetWidth / 2 + "px";
            editButtonsParentRef.current.style.top = activeTextEditor.top -
             editButtonsParentRef.current.offsetHeight + "px";
             document.body.addEventListener("click", hidePopap);
        }
    }, [activeTextEditor])

    const handleInputMessageKeyUp = ()=>setMessageInput(prev=>{return{...prev, actualKey:null}});
    const handleInputMessageKeyDown = e=>setMessageInput(prev=>{return{...prev, actualKey:e.keyCode}});

    const handleInputMessage = e=>{
        setMessageInput(prev=>{
            const newHeight = props.messageDivRef.current.clientHeight;
            if(newHeight===prev.normal||(newHeight===prev.actualHeight&&prev.actualKey !== 8))
                return {...prev}

            const dif= prev.dif===0?newHeight-prev.normal:prev.dif;
            let marginTopForAnother = prev.actualKey === 8?prev.marginTopForAnother-dif:newHeight-prev.normal;
            marginTopForAnother= marginTopForAnother>=0?marginTopForAnother:prev.marginTopForAnother;
            return {...prev, marginTopForAnother, dif, actualHeight:newHeight};
        });
    }

    const handleRightMouseClickInputText = e=>{
        e.preventDefault();

        const messageSendDivParent = props.messageDivRef.current.parentNode;
        const startX =  messageSendDivParent.getBoundingClientRect().left;
        const startY =  messageSendDivParent.getBoundingClientRect().top;

        const {left, right, top, bottom} = getPositionCursore(window.getSelection(), startX, startY);
        const {clientX, clientY} = e;

        if (!(left <= clientX && clientX <= right && top <= clientY && clientY <= bottom))
            return;
            
        const posLeft = (left + right) / 2 - startX;
        const posTop = top - startY;
        setActiveTextEditor({isActive:true, left:posLeft, top:posTop});
    }

    const handleButtonEditorClick = (elem)=>{
            const select = window.getSelection;
            const text = select();
            let parentText = text.anchorNode ? text.anchorNode.parentElement : null;
            parentText = getFivesLevelParent(parentText, elem);
            let newText = "";
    
            if (parentText.tagName === elem.toUpperCase()) {
                newText = parentText.innerHTML;
                parentText.outerHTML = newText;
            } else {
                newText = `<${elem}>${text}</${elem}>`;
                replaceSelectionWithHtml(newText, select);
            }
        };

    const handleInputColorClick = (e)=>{
            const select = window.getSelection;
            const text = select();
            let parentText = text.anchorNode ? text.anchorNode.parentElement : null;
            parentText = getFivesLevelParent(parentText, "span");
            const rgbColor = hexToRgb(e.target.value);
    
            if (parentText.tagName === "SPAN" && parentText.style.color === `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`) {
                let newText = "";
                newText = parentText.innerHTML;
                parentText.outerHTML = newText;
            } else if (parentText.tagName === "SPAN" && parentText.style.color !== e.target.value) {
                parentText.style.color = e.target.value;
            } else {
                replaceSelectionWithHtml(`<span style="color: ${e.target.value}">${text}</span>`, select);
            }
    }

    const classesNames = {
        messageSendDivParent:"flex-grow-0 py-3 px-4 " + styles.messageSendDivParent,
        changeEmoji: props.theme==="dark"?styles.emojiDark:styles.emoji,
        messageSendDiv:"form-control " + (props.theme==="dark"?styles.messageSendDivDark:styles.messageSendDiv),
        fileSender:styles.fileSender+" "+(props.theme==="dark"?styles.fileSenderDark:""),
        recordingBlock:"form-control " + (props.theme==="dark"?styles.recordingBlockDark:styles.recordingBlock),
        sendMessage:"btn btn-primary " + (props.theme==="dark"?styles.sendMessageDark:styles.sendMessage),
        editButton:"edit-buttons "+styles.editButton,
        editColorButton:"edit-color-button "+styles.editColorButton
    }

    return (<div className={classesNames.messageSendDivParent} id="messageSendDivParent">
        <div className="input-group">
            {!recording.value && <>
                <div className={classesNames.changeEmoji} onClick={changeEmojiActive} 
                style={{marginTop: messageInput.marginTopForAnother}} id="emojiButton">
                    <i className="far fa-smile"></i>
                </div>
                <div className={classesNames.messageSendDiv}
                    contentEditable="true"
                    placeholder="Type your message"
                    onContextMenu = {handleRightMouseClickInputText}
                    onKeyDown = {handleInputMessageKeyDown}
                    onKeyUp = {handleInputMessageKeyUp}
                    onInput={handleInputMessage}
                    onFocus={()=>setTyping(true)}
                    onBlur={()=>setTyping(false)}
                    id="messageSendDiv"
                    ref={props.messageDivRef}></div>
                <input onChange={handleSendFileChange}
                    ref={fileInputRef} style={{ display: "none" }}
                    type="file" accept="audio/*,image/*, video/*" name="files"/>
                    
                <div onClick={handleFileInputClick} 
                className={classesNames.fileSender}
                style={{marginTop: messageInput.marginTopForAnother}}>
                    <div className={styles.iconPaperclip} style={{ float: "left" }}>
                        <div className={styles.paperclip1} >
                            <div className={styles.paperclip2}>
                                <div className={styles.paperclip3}>
                                    <div className={styles.paperclip4}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}

            {recording.value &&
                <div className={classesNames.recordingBlock}>
                    <div ref={recordingMessageRef}></div>
                    <div></div>
                    <div ref={timerRef}>{msToHMS((timeRecording + 0.1) * 1000)}</div>
                </div>}

            < div className={(props.theme==="dark"?styles.mediaButtonDark
            :styles.mediaButton) + (recording.value ? " " + styles.stopRecording : "")}
             onClick={changeRecording} onContextMenu={handlerContextMenu}
             style={{marginTop: messageInput.marginTopForAnother}}>
                {recording.value && <i className={"fas fa-stop fa-sm"}></i>}
                {(!recording.value && typeMedia === "audio") && <i className="fas fa-microphone-alt"></i>}
                {(!recording.value && typeMedia === "video") && <i className="fas fa-video"></i>}
            </div>

            {!recording.value &&
                <button onClick={sendMessage}
                 className={classesNames.sendMessage}
                style={{marginTop: messageInput.marginTopForAnother}}>Send</button>}
                {activeTextEditor.isActive&&(<div className={styles.editButtons} ref={editButtonsParentRef}>
                    <button className={classesNames.editButton} onClick={()=>handleButtonEditorClick("i")}>
                        <i>i</i>
                    </button>
                    <button className={classesNames.editButton} onClick={()=>handleButtonEditorClick("b")}>
                        <b>b</b>
                    </button>
                    <button className={classesNames.editButton} onClick={()=>handleButtonEditorClick("u")}>
                        <u>u</u>
                        </button>
                    <button className={classesNames.editButton} onClick={()=>handleButtonEditorClick("s")}>
                        <s>s</s>
                        </button>
                    <input type="color" className={classesNames.editColorButton} onInput={handleInputColorClick}/></div>)}
        </div>
    </div >);
}

export default SenderPanel;