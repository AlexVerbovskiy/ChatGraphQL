import React from "react";
import { shallow, configure } from "enzyme";
import { render, screen } from "@testing-library/react";
import { MainContext } from "../../../App";
import Signin from "../../../components/SignPage/Form/Signin";
import { LOGIN_USER } from "../../../mutations/user";
import { MockedProvider } from "@apollo/client/testing";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import wait from "waait";
import Adapter from "enzyme-adapter-react-15";

configure({ adapter: new Adapter() });

/*
const mockSigninData = {
  request: {
    query: { LOGIN_USER },
    variables: { email: 'Jo', password: 'Jo'}
  },
  data: {
    login: {
      id: "wqe",
      email: "wqe",
      phone: "wqe",
      fullName: "wqe",
      avatarURL: "wqe",
      online: true,
      isActiveted: true,
      password: "wqe"
    }
  }
};

it("Generate sign in", async () => {
  const context = {
    theme: "dark",
    setActualPage: value => console.log(value),
    login: (email, password) => console.log(email, password),
    setIsLoading: value => console.log(value),
    setError: value => console.log(value)
  };

  let wrapper;
  await act(async () => {
    wrapper = mount(
      <MainContext.Provider value={{ theme: "dark" }}>
        <MockedProvider addTypename={false} mocks={mockSigninData}>
          <Signin typeForm={0} />
        </MockedProvider>
      </MainContext.Provider>
    );
  });
  await act(()=>wait(0));
  wrapper.update()
  expect(wrapper).toBeTruthy();
  expect(wrapper.find(".d-flex")).toBeInTheDocument()
});
*/

it("Generate sign in", () => {
  expect(screen.getByAltText(".d-flex")).toBeInTheDocument();
});
