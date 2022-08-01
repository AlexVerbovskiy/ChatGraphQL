import React from "react";
import { shallow } from "enzyme";
import { render, screen } from "@testing-library/react";
import { MainContext } from "../../../../App";
import Chat from "../../../../components/ChatPage/ChatListParent/ChatList/Chat";

test("Generate chat in chat list", () => {
  render(
    <MainContext.Provider value={{ theme: "dark" }}>
      <Chat
        fullName="fullName"
        chatSelect={() => console.log("check")}
        lastMessage="mess"
        imgSrc=""
        online={true}
        active={false}
        isDark={true}
      />
    </MainContext.Provider>
  );
  expect(screen.getByText(`mess`)).toBeInTheDocument();
});
