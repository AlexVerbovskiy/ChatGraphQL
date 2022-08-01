import React, {memo} from "react";
import Chat from "./Chat";
import styles from "./ChatList.module.scss";

const ChatListNormal = props => {
  return (
    <div className={"pb-2 "} id="normalList">
      {props.chatList.map(chat => {
          return (
            <Chat
              {...chat}
              active={props.actualChatId === chat.id}
              chatSelect={props.selectChat.bind(null, chat)}
              isDark={props.isDark}
              key={chat.id}
            />
          );
        })
        }
    </div>
  );
};

export default memo(ChatListNormal);
