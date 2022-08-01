import React, {memo} from 'react';
import Chat from "./Chat";
import styles from "./ChatList.module.scss";

const ChatListCandidate = props => {
    console.log(props.chat);
    return (
        <><div className={"pb-2 "} id="findedList">
            {props.chatListCandidate.map((chat) => {
                return <Chat /*chatSelect = {()=>props.checkChat(chat)}*/
                chatSelect={props.checkChat.bind(null, chat)}
                 imgSrc={chat.avatarURL} online={chat.online}
                 active={chat.id===props.chat.userToSend.id}
                 isDark={props.isDark}
                  fullName={chat.fullName} key={chat.id} />
            })}
        </div>
            <hr style={{marginLeft: "0.5rem", paddingBottom: "0.3rem"}} id={"underFinderList"} className={props.isDark?styles.lineDark:""} size="5" />
        </>
    )
}
export default memo(ChatListCandidate);