import React, { useContext, useEffect, memo } from "react";
import styles from "./ChatList.module.scss";
import ChatListNormal from "./ChatListNormal";
import ChatListCandidate from "./ChatListCandidate";
import { useLazyQuery } from "@apollo/client";
import { MainContext } from "../../../../App";
import { ChatContext } from "../../index";
import { GET_MESSAGES_CHAT } from "../../../../queries/chat";

const ChatList = props => {
  const { theme } = useContext(MainContext);
  const { actualChat, setActualChat, setIsLoading, setError } = useContext(
    ChatContext
  );
  const [
    getChatMessages,
    { data: chatMessagesData, error: chatMessagesError }
  ] = useLazyQuery(GET_MESSAGES_CHAT);

  const selectNewChat = elem => {
    const userToSend = {
      fullName: elem.fullName,
      id: elem.id,
      photoUrl: elem.avatarURL,
      online: elem.online
    };
    setActualChat({ id: "", type: "new", userToSend, messages: [] });
    props.changeActive();
  };

  const selectChat = async elem => {
    const userToSend = {
      fullName: elem.users[0].fullName,
      id: elem.users[0].id,
      photoUrl: elem.users[0].avatarURL,
      online: elem.users[0].online
    };
    setActualChat({ id: elem.id, type: "old", userToSend, messages: [] });
    try {
      setIsLoading(true);
      await getChatMessages({ variables: { chatMessagesId: elem.id } });
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }

    props.resetSearch();
    props.changeActive();
  };

  useEffect(
    () => {
      if (chatMessagesData) {
        const messages = chatMessagesData.chatMessages;
        setActualChat(prev => ({ ...prev, messages }));
      }
    },
    [chatMessagesData]
  );

  const classesNames = {
    chatsNames:
      (props.actualTheme === "dark"
        ? styles.chatsNamesDark
        : styles.chatsNames) + " px-2 pb-2"
  };

  if (chatMessagesError) setError(chatMessagesError);

  return (
    <div className={classesNames.chatsNames} alt="chatList" id="chatList">
      {props.chatListCandidate.length > 0 &&
        <ChatListCandidate
          checkChat={selectNewChat}
          chatListCandidate={props.chatListCandidate}
          chat={actualChat}
          isDark={theme === "dark"}
        />}
      <ChatListNormal
        actualChatId={actualChat.id}
        selectChat={selectChat}
        chatList={props.chatList}
        isDark={theme === "dark"}
      />
    </div>
  );
};

export default memo(ChatList);
