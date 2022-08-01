import React, { useLayoutEffect, useRef, memo } from "react";
import styles from "./ChatList.module.scss";
import { API_URL_AVATAR } from "../../../../http/index";

const Chat = props => {
  const API_URL = "http://localhost:4000/api";

  const user = props.users?props.users[0]:{fullName: props.fullName,avatarURL: props.imgSrc, online:props.online};
  const src = user.avatarURL? API_URL_AVATAR + "/" + user.avatarURL : "/defaultUser.png";

  const parentClasses =
    "list-group-item list-group-item-action border-0 chat-name " +
    (props.active &&styles.active) + " " +
    (props.isDark ? styles.chatDark : "");

 const idChat = props.isDark ?props.active ?"checkedDark":"":"";

  const lastMessRef = useRef(null);

  useLayoutEffect(() => {
    if (!lastMessRef.current) return;
    const lastMess = lastMessRef.current.innerText;
    if (lastMess?.length > 17) {
      let tempStr = "";
      for (let i = 0; i <= 17; i++) tempStr += lastMess[i];
      tempStr += "...";
      lastMessRef.current.innerText = tempStr;
    }
  }, []);

  return (
    <a onClick={props.chatSelect} className={parentClasses} id={idChat}>
      <div className="d-flex align-items-center">
        <img
          src={src}
          className="rounded-circle mr-1"
          alt={user.fullName}
          width="40"
          height="40"
        />
        <div className="flex-grow-1 ml-3">
          <b>
            {user.fullName}
          </b>
          {props.lastMessage &&
            <div className="small">
              <span
                aria-hidden="true"
                ref={lastMessRef}
                dangerouslySetInnerHTML={{ __html: props.lastMessage.split("<div>")[0] }}
              />{" "}
            </div>}
        </div>
        <div className={user.online ? styles.online : styles.offline} />
      </div>
    </a>
  );
};

export default memo(Chat);
