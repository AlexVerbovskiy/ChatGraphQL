import React, { useState, createContext, useEffect, useContext } from "react";
import ChatListParent from "./ChatListParent/index";
import ChatBlockParent from "./ChatBlockParent/index";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
/*import { Loader } from "../Loader";
import ErrorShower from "../ErrorShower";*/
import {
  CREATE_CHAT,
  CREATE_MESSAGE,
  CHANGE_ONLINE,
  CHANGE_TYPING
} from "../../mutations/chat";
import { SUBSCRIBE_TYPING_UPDATE } from "../../subscriptions/chat";
import { MainContext } from "../../App";

export const ChatContext = createContext();

const ChatPage = ({ actualUserId }) => {
  const [actualParentNumber, setActualParentNumber] = useState(1);
  const [actualChat, setActualChat] = useState({
    type: "" /*new or old */,
    id: "",
    userToSend: {},
    messages: []
  });
  const [createChat] = useMutation(CREATE_CHAT);
  const [createMessage] = useMutation(CREATE_MESSAGE);
  const [changeOnline] = useMutation(CHANGE_ONLINE);
  const [changeTyping] = useMutation(CHANGE_TYPING);
  const { setIsLoading, setError } = useContext(MainContext);

  const { data: gettedTyping } = useSubscription(SUBSCRIBE_TYPING_UPDATE, {
    variables: { idChat: actualChat.id, idUser: actualUserId }
  });

  useEffect(() => {
    changeOnline({ variables: { idUser: actualUserId, isOnline: true } });

    const unloadCallback = event => {
      event.preventDefault();
      changeOnline({ variables: { idUser: actualUserId, isOnline: false } });
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  const setTyping = value => {
    changeTyping({
      variables: {
        idChat: actualChat.id,
        idUser: actualUserId,
        isTyping: value
      }
    });
  };

  useEffect(
    () => {
      if (!gettedTyping) return;
      setActualChat(prev => ({
        ...prev,
        userToSend: {
          ...prev.userToSend,
          isTyping: gettedTyping.updateTyping.isTyping
        }
      }));
    },
    [gettedTyping]
  );

  const sendMessage = async message => {
    const blobToBase64 = (blob, onRead) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        const base64data = reader.result;
        onRead(base64data);
      };
    };

    if (!actualChat.type) {
      console.log("unselected chat");
      return;
    }
    const senderId = localStorage.getItem("userId");
    let chatId = actualChat.id;
    if (actualChat.type === "new") {
      try {
        setIsLoading(true);
        const res = await createChat({
          variables: {
            idCreater: senderId,
            usersIds: [senderId, actualChat.userToSend.id]
          }
        });
        chatId = res.data.createChat;
        setActualChat(prev => ({ ...prev, id: chatId, type: "old" }));
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (typeof message === "string") {
      const sendedMessage = {
        type: "text",
        message,
        idSender: senderId,
        idChat: chatId
      };
      try {
        setIsLoading(true);
        await createMessage({
          variables: {
            messageInput: sendedMessage
          }
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      const blob = message.value.blob;
      const type = message.type;

      const onFilConverted = async base64 => {
        const sendedMessage = {
          type,
          message: base64,
          idSender: senderId,
          idChat: chatId
        };
        try {
          setIsLoading(true);
          await createMessage({
            variables: {
              messageInput: sendedMessage
            }
          });
        } catch (e) {
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      };
      blobToBase64(blob, onFilConverted);
    }
  };

  return (
    <main className="content">
      {/*props.error&&<ErrorShower/>*/}
      {/*props.isLoading && <Loader />*/}
      <div>
        <div className="row g-0">
          <ChatContext.Provider
            value={{ actualChat, setActualChat, sendMessage, setTyping, setIsLoading, setError }}
          >
            <ChatListParent
              changeActive={() => setActualParentNumber(2)}
              actualUserId={actualUserId}
              isActive={actualParentNumber === 1}
            />
            <ChatBlockParent
              changeActive={() => setActualParentNumber(1)}
              isActive={actualParentNumber === 2}
            />
          </ChatContext.Provider>
        </div>
      </div>
    </main>
  );
};

export default ChatPage;
