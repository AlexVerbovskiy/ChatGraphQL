import React from "react";
import styles from "./Message.module.scss";
import { API_URL_MEDIA } from "../../../../http/index";
import { formatedDate } from "../../../../utils/helper";

const Message = props => {
  const messageVideoContent = (
    <video height="400" controls="controls" src={API_URL_MEDIA.video + "/" + props.value} />
  );

  const messageAudioContent = (
    <audio height="40"  src={API_URL_MEDIA.audio + "/" + props.value} controls="controls" />
  );

  const messageImageContent = (
    <img height="400" src={API_URL_MEDIA.image + "/" + props.value} alt="image message" />
  );

  const messageTextContent = props.value;

  const messageContent = (() => {
    switch (props.type) {
      case "text":
        return messageTextContent;
        break;
      case "audio":
        return messageAudioContent;
        break;
      case "video":
        return messageVideoContent;
        break;
      case "image":
        return messageImageContent;
        break;
      default:
        return "unusual type message";
    }
  })();
  const isMyMessage = localStorage.getItem("userId") === props.idSender;

  const resTime = props.sendedAt ? formatedDate(props.sendedAt) : "";

  const parentClass = isMyMessage
    ? styles.myDivElement
    : styles.enemyDivElement;
  const messageClass = isMyMessage
    ? !props.isDark ? styles.myMessage : styles.myMessageDark
    : !props.isDark ? styles.enemyMessage : styles.enemyMessageDark;

  const classesNames = {
    messageClass:(props.isDark?styles.messageDark:styles.message) + " " + messageClass,
    date:props.isDark?styles.dateDark:styles.date
  }

  return (
    <div className={parentClass}>
      <div className={classesNames.messageClass}>
        {props.type === "text" &&
          <div dangerouslySetInnerHTML={{__html: messageContent }} />}
        {props.type !== "text" && messageContent}
        <p className={classesNames.date}>
          {resTime}
        </p>
      </div>
    </div>
  );
};

export default Message;
