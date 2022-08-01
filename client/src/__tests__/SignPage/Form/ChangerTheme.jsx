import React from "react";
import { shallow } from "enzyme";
import { render, screen } from "@testing-library/react";
import { MainContext } from "../../../App";
import ChangerTheme from "../../../components/SignPage/Form/ChangerTheme";

test("Changer theme", () => {
  render(
    <MainContext.Provider
      value={{ theme: "dark", changeTheme: () => console.log("ok") }}
    >
      <ChangerTheme typeForm={0} />
    </MainContext.Provider>
  );
  expect(screen.getByAltText("theme checkbox")).toBeInTheDocument();
});
