import React, { useState, useEffect, useRef, useContext } from "react";
import SenderPanel from "./SenderPanel";
import Header from "./Header";
import ChatBlock from "./ChatBlock/index";
import MediaSenderAccept from "./MediaSenderAccept";
import { getFileData } from "../../../utils/helper";
import useWindowState from "../../../hooks/useWindowState";
import { MainContext } from "../../../App";
import { ChatContext } from "../index";

const ChatBlockParent = props => {
  const { theme } = useContext(MainContext);
  const { actualChat, sendMessage, setTyping , setError, setIsLoading} = useContext(ChatContext);
  const [activeEmojiBlock, setActiveEmojiBlock] = useState(false);
  const messageDivRef = useRef("");

  const [actualFile, setActualFile] = useState(null);
  const [actualFileData, setActualFileData] = useState(null);
  const [messageInput, setMessageInput] = useState({
    normal: 0,
    actualKey: null,
    marginTopForAnother: 0,
    dif: 0,
    actualHeight: 0
  });
  const [startMaxHeight, setStartMaxHeight] = useState(0);
  const [startMinHeight, setStartMinHeight] = useState(0);

  useEffect(
    () => {
      const afterReadFile = async (src, type, name) => {
        try {
          const base64Response = await fetch(src);
          let blob = await base64Response.blob();
          const typeMedia = blob.type.split("/")[0];
          blob = blob.slice(0, blob.size, typeMedia + "/" + type);
          setActualFileData(prev => {
            return { src, type, name, blob };
          });
        } catch (e) {
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      };
      getFileData(actualFile, afterReadFile);
    },
    [actualFile]
  );

  const setActualRecordedData = (src, type, name, blob) =>
    setActualFileData(prev => {
      return { src, type, name, blob };
    });

  const sendActualFile = () => {
    if (["mp3", "ogg", "wav"].includes(actualFileData.type)) {
      sendMessage({ type: "audio", value: actualFileData });
      return;
    }
    if (["mp4", "webm"].includes(actualFileData.type)) {
      sendMessage({ type: "video", value: actualFileData });
      return;
    }
    sendMessage({ type: "image", value: actualFileData });
    return;
    //sendMessage(actualFileData)
  };

  useWindowState(() => {
    setStartMaxHeight(0);
    setStartMinHeight(0);
  });

  const classesNames = {
    leftSection:
      "col-12 col-lg-7 col-xl-9 " +
      (props.isActive ? "active-parent-block" : "")
  };

  return (
    <div className={classesNames.leftSection} id="leftSection">
      <Header
        userToSend={actualChat.userToSend}
        changeActive={props.changeActive}
        theme={theme}
      />
      <ChatBlock
        messageDivRef={messageDivRef}
        messageInputState={messageInput}
        isDark={theme === "dark"}
        blockHeights={{
          startMaxHeight,
          setStartMaxHeight,
          startMinHeight,
          setStartMinHeight
        }}
        activeEmojiBlock={activeEmojiBlock}
        setActiveEmojiBlock={setActiveEmojiBlock}
        chat={actualChat}
      />
      <SenderPanel
        setActualFile={setActualFile}
        messageDivRef={messageDivRef}
        setActiveEmojiBlock={setActiveEmojiBlock}
        setActualRecordedData={setActualRecordedData}
        setMessageInput={setMessageInput}
        messageInput={messageInput}
        setError={mess => console.log(mess)}
        theme={theme}
        sendMessage={sendMessage}
        setTyping={setTyping}
      />
      {actualFileData &&
        <MediaSenderAccept
          setActualFile={setActualFile}
          setActualFileData={setActualFileData}
          actualFileData={actualFileData}
          sendActualFile={sendActualFile}
          isDark={theme === "dark"}
        />}
    </div>
  );
};

export default ChatBlockParent;
