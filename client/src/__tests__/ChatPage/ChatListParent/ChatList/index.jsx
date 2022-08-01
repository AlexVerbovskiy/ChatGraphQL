import React from "react";
import { shallow, configure } from "enzyme";
import { render, screen } from "@testing-library/react";
import { ChatContext } from "../../../../components/ChatPage/index";
import { MainContext } from "../../../../App";
import ChatList from "../../../../components/ChatPage/ChatListParent/ChatList/index";
import { GET_MESSAGES_CHAT } from "../../../../queries/chat";
import { MockedProvider } from "@apollo/client/testing";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import wait from "waait";
import Adapter from "enzyme-adapter-react-15";
import TestRenderer from "react-test-renderer";

configure({ adapter: new Adapter() });

const mockSigninData = {
  request: {
    query: GET_MESSAGES_CHAT,
    variables: { id: "Jo" }
  },
  result: {
    data: {
      chatMessages: {
        id: "wqe",
        id: "wqe",
        idSender: "wqe",
        idChat: "wqe",
        type: "wqe",
        value: "wqe",
        sendedAt: "23 23 23 23:23"
      }
    }
  }
};

test("Generate chat in chat list", async () => {
  const component = TestRenderer
    .create
    /* <MockedProvider addTypename={false} mocks={mockSigninData}>
      <MainContext.Provider value={{ theme: "dark" }}>
        <ChatContext.Provider
          value={{
            actualChat: { id: null },
            setActualChat: elem => console.log(elem),
            setIsLoading: elem => console.log(elem),
            setError: elem => console.log(elem)
          }}
        >
          <ChatList
            chatListCandidate={[]}
            chatList={[]}
            actualTheme="dark"
            changeActive={elem => console.log(elem)}
            resetSearch={elem => console.log(elem)}
          />
        </ChatContext.Provider>
      </MainContext.Provider>
    </MockedProvider>
  );
  const tree = component.toJSON();
  console.log(tree)
  expect(tree.children);*/
    ();
});
