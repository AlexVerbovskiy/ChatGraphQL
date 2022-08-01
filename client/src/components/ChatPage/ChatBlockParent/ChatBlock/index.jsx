import React, { useRef, useState ,useLayoutEffect, useEffect} from 'react';
import styles from './ChatBlock.module.scss'
import EmojiBlock from './Emoji';
import Message from './Message';

const ChatBlock = props => {

    const popabRef = useRef(null);
    const elemRef = useRef(null);
    const elemChildRef = useRef(null);
    const {startMaxHeight, setStartMaxHeight, startMinHeight, setStartMinHeight}= props.blockHeights;

    const handlerClick = e => {
        const parentElem = e.target?.parentNode;
        if (parentElem === popabRef.current) {
            return;
        }
        props.setActiveEmojiBlock(false);
    }

    useEffect(()=>{
        const {marginTopForAnother:marginChat} = props.messageInputState;
        const maxHeight = window.getComputedStyle(elemRef.current).getPropertyValue("max-height");
        const minHeight = window.getComputedStyle(elemRef.current).getPropertyValue("min-height");
        const maxHeightNumber = Number(maxHeight.split("px")[0]);
        const minHeightNumber = Number(minHeight.split("px")[0]);
        if(startMaxHeight===0&&startMinHeight===0){
            setStartMaxHeight(maxHeightNumber);
            setStartMinHeight(minHeightNumber);
            elemRef.current.style.maxHeight = maxHeightNumber-marginChat+"px";
            elemRef.current.style.minHeight =minHeightNumber-marginChat+"px";
        }else{
            elemRef.current.style.maxHeight = startMaxHeight-marginChat+"px";
            elemRef.current.style.minHeight =startMinHeight-marginChat+"px";
        }
    }, [props.messageInputState])

    useLayoutEffect(() => {
        elemChildRef.current?.scrollIntoView({block: "nearest", behavior: "smooth"});
    }, [props.chat])

    const classesNames = {
        parentMainChatBlock:("position-relative " + (props.isDark?styles.parentMainChatBlockDark:styles.parentMainChatBlock)),
        defaultMessage:styles.defaultMessage,
        containerMessagesList:styles.containerMessagesList,
        messagesList:styles.messagesList
    }

    return (
        <div className={classesNames.parentMainChatBlock} id="parentMainChatBlock" ref={elemRef}>
            {(!props.chat||(!props.chat.id&&!props.chat.userToSend))?
            <div className={classesNames.defaultMessage}>
                <label>Chat is not selected!</label>
            </div>
            :
            <div className={"chat-messages p-4 "} id="mainChatBlock">
                <div className={classesNames.containerMessagesList}>
                    <div className={classesNames.messagesList}>
                        {props.chat.messages.map(message => <Message isDark={props.isDark} key={message.id} {...message}/>)}
                    </div>
                </div>
                <span  ref ={ elemChildRef}></span>
            </div>
            }

            {props.activeEmojiBlock &&
                <div onClick={handlerClick} style={{ position: "fixed", width: "100%", height: "100vh" }}>
                    <div ref={popabRef} className={styles.emojiBlock} id="emojiBlock">
                        <EmojiBlock MessageInputRef={props.messageDivRef} />
                    </div>
                </div>}

        </div>)
}

export default ChatBlock