import React, { useEffect, useState, useContext, memo } from "react";
import { Header } from "./Header";
import ChatList from "./ChatList/index";
import { useLazyQuery, useQuery, useSubscription } from "@apollo/client";
import { USERS_FOR_CHAT } from "../../../queries/user";
import { GET_CHATS_USER } from "../../../queries/chat";
import {
  SUBSCRIBE_CHAT_CREATED,
  SUBSCRIBE_MESSAGE_CREATED,
  SUBSCRIBE_ONLINE_UPDATE
} from "../../../subscriptions/chat";
import { ChatContext } from "../index";

const ChatListParent = props => {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [chatListCandidate, setChatListCandidate] = useState([]);
  const [chatList, setChatList] = useState([]);
  const { actualChat, setActualChat, setError, setIsLoading } = useContext(ChatContext);
  const {
    data: dataChatsUser,
    error: errorChatsUser
  } = useQuery(GET_CHATS_USER, {
    variables: { userChatsId: props.actualUserId }
  });

  const [
    findUsers,
    { data: findedUsersData, error: findedError }
  ] = useLazyQuery(USERS_FOR_CHAT);

  const {
    data: newChatCreated,
    error: newChatError
  } = useSubscription(SUBSCRIBE_CHAT_CREATED, {
    variables: { idUser: props.actualUserId }
  });

  const {
    data: dataUpdatedOnline,
    error: errorUpdatedOnline
  } = useSubscription(SUBSCRIBE_ONLINE_UPDATE, {
    variables: { idUser: props.actualUserId }
  });

  const {
    data: newMessageCreated,
    error: newMessageError
  } = useSubscription(SUBSCRIBE_MESSAGE_CREATED, {
    variables: { idUser: props.actualUserId }
  });

  useEffect(
    () => {
      if (!newChatCreated) return;
      const createdChat = newChatCreated.chatCreated.shortChatInfo;
      setChatList(prev => [...prev, createdChat]);
      const createrId = newChatCreated.chatCreated.idCreater;
      if (createrId === props.actualUserId) setSearchInputValue("");
    },
    [newChatCreated]
  );

  useEffect(
    () => {
      if (dataUpdatedOnline) {
        const online = dataUpdatedOnline.updateOnline.isOnline;
        const idUserOnline = dataUpdatedOnline.updateOnline.idUser;
        setChatList(prev =>
          prev.map(chat => {
            const users = chat.users.map(user => {
              if (user.id === idUserOnline) {
                return { ...user, online };
              }
              return user;
            });
            return { ...chat, users };
          })
        );
      }
    },
    [dataUpdatedOnline]
  );

  useEffect(
    () => {
      if (searchInputValue === "") setChatListCandidate([]);
      else findUsers({ variables: { mess: searchInputValue } });
    },
    [searchInputValue]
  );

  useEffect(
    () => {
      if (findedUsersData) {
        const userIgnore = [props.actualUserId];
        chatList.forEach(chat => {
          const { users } = chat;
          const ids = users.map(user => user.id);
          userIgnore.push(...ids);
        });

        const filterUsers = findedUsersData.usersForChat.filter(user=>!userIgnore.includes(user.id));
        //const filterUsers = findedUsersData.usersForChat;
        setChatListCandidate(filterUsers);
      }
    },
    [findedUsersData]
  );

  useEffect(
    () => {
      if (dataChatsUser) {
        setIsLoading(false);
        setChatList(dataChatsUser.userChats);
      }
    },
    [dataChatsUser]
  );

  useEffect(
    () => {
      if (newMessageCreated) {
        const newMessage = newMessageCreated.messageCreated;
        console.log(newMessageCreated)
        if (newMessage.idChat === actualChat.id)
          setActualChat(prev => ({
            ...prev,
            messages: [...prev.messages, newMessage]
          }));
        setChatList(prev =>
          prev.map(chat => {
            if (chat.id === newMessage.idChat)
              return {
                ...chat,
                lastMessage:
                  newMessage.type === "text"
                    ? newMessage.value
                    : newMessage.type,
                lastMessageTime: newMessage.sendedAt
              };
            return chat;
          })
        );
      }
    },
    [newMessageCreated]
  );

  useEffect(()=>setIsLoading(true), [])

  if (newMessageError) setError(newMessageError);
  if (findedError) setError(findedError);
  if (errorChatsUser) setError(errorChatsUser);
  if (newChatError) setError(newChatError);
  if (errorUpdatedOnline) setError(errorUpdatedOnline);
  
  return (
    <div
      className={
        "col-12 col-lg-5 col-xl-3 border-right " +
        (props.isActive ? "active-parent-block" : "")
      }
      id="rightSection"
    >
      <Header
        searcherValue={searchInputValue}
        setSearchInput={setSearchInputValue}
      />
      <ChatList
        chatList={chatList}
        changeActive={props.changeActive}
        chatListCandidate={chatListCandidate}
        resetSearch={() => setSearchInputValue("")}
      />
    </div>
  );
};

export default memo(ChatListParent);
