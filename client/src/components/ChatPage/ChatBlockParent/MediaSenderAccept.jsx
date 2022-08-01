import React, { useRef } from 'react';
import styles from './MediaSenderAccept.module.scss'

const MediaSenderAccept = props => {

    const selectRef = useRef(null)

    const handlePopabClick = e => {
        if (e.target?.parentNode === selectRef) {
            return;
        }
        props.setActualFile(null);
        props.setActualFileData(null);
    }

    const handleSendClick = () => props.sendActualFile();

    const imgArray = ["gif", "jpeg", "jpg", "png"];
    const videoArray = ["mp4"];
    const audioArray = ["mp3", "mpeg"];

    let contentDiv = <></>;

    const fileType = props.actualFileData.type;

    if (imgArray.includes(fileType)) {
        contentDiv = <img className={styles.acceptSendImageBlock} src={props.actualFileData.src} />
    } else if (audioArray.includes(fileType)) {
        contentDiv =
            <audio className={styles.acceptSendAudioBlock} controls>
                <source src={props.actualFileData.src} type={"audio/" + fileType}></source>
            </audio>
    } else if (videoArray.includes(fileType)) {
        contentDiv = <video className={styles.acceptSendVideoBlock} controls>
            <source src={props.actualFileData.src} type={"video/" + fileType}></source>
        </video>
    } else {
        contentDiv = <div>{props.actualFileData.name}</div>
    }

    const classesNames = {
        sendButton:"btn btn-primary " + (props.isDark?styles.sendButtonDark:styles.sendButton),
        parent:props.isDark?styles.popabParentDark:styles.popabParent,
        mediaAccept:styles.mediaAcceptSend
    }

    return (
        <div className={classesNames.parent} onClick={handlePopabClick}>
            <section ref={selectRef} className={classesNames.mediaAccept}>
                <div className="card text-black bor-rad">
                    <div className="card-body p-md-5">
                        <div className="row justify-content-center">
                            {contentDiv}
                            <button type="button" className={classesNames.sendButton}
                                onClick={handleSendClick}>Send</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default MediaSenderAccept;