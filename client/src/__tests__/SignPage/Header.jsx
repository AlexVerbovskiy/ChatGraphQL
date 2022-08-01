import React from "react";
import { shallow } from "enzyme";
import {render, screen} from '@testing-library/react'
import {MainContext} from "../../App";
import Header from "../../components/SignPage/Header"


test("Generate sign in header", () => {
  render(
    <MainContext.Provider value={{theme:"dark"}}>
      <Header typeForm = {0}/>
    </MainContext.Provider>
  );
  expect(screen.getByText(`Sign in`)).toBeInTheDocument();
});

test("Generate sign up header", () => {
  render(
    <MainContext.Provider value={{theme:"dark"}}>
      <Header typeForm = {0}/>
    </MainContext.Provider>
  );
  expect(screen.getByText(`Sign in`)).toBeInTheDocument();
});
