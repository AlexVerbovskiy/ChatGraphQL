import React, { useState } from "react";
import styles from "../../../style/Form.module.scss";
import ChangerTheme from "./ChangerTheme";
import { useContext } from "react";
import { MainContext } from "../../../App";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../../mutations/user";

const Signin = props => {
  const saveEmail = localStorage.getItem("email") || "";
  const savePassword = localStorage.getItem("password") || "";
  const [email, setEmail] = useState(saveEmail);
  const [password, setPassword] = useState(savePassword);
  const [isRemember, setIsRemember] = useState(false);
  const {
    theme,
    setActualPage: changePage,
    login,
    setIsLoading,
    setError
  } = useContext(MainContext);
  
  const [loginUser] = useMutation(LOGIN_USER);

  const onChangeEmail = e => {
    const newEmail = e.target.value;
    //props.changeEmail(newEmail);
    setEmail(newEmail);
  };
  const onChangePassword = e => {
    const newPassword = e.target.value;
    //props.changePassword(newPassword)
    setPassword(newPassword);
  };

  const onChangeRemember = e => {
    const newIsRemember = e.target.checked;
    setIsRemember(newIsRemember);
  };

  const onLoginClick = async e => {
    //props.changeLoading(true);
    if (isRemember) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
    }
    try {
      setIsLoading(true);
      const { data } = await loginUser({
        variables: { loginInput: { email, password } }
      });

      if (data.login.isActiveted) {
        localStorage.setItem("userId", data.login.id);
        localStorage.setItem("hashedPassword", data.login.password);
        login();
      } else {
        console.log("Log in by following the link in the mail!!!");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegistrationClick = () => changePage(1);

  return (
    <form className={`mx-1 mx-md-4 ${theme === "dark" ? styles.formDark : ""}`}>
      <div className="d-flex flex-row mb-4">
        <div className="form-outline flex-fill mb-0">
          <div className="invalid-feedback">Incorrect login type</div>
          <input
            type="email"
            name="login"
            id="login"
            value={email}
            onChange={onChangeEmail}
            className="form-control"
          />
          <label className="form-label" htmlFor="login">
            Login(email)
          </label>
        </div>
      </div>

      <div className="d-flex flex-row mb-2">
        <div className="form-outline flex-fill mb-0">
          <div className="invalid-feedback">
            Password must be longer than 8 characters
          </div>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChangePassword}
            className="form-control"
          />
          <label className="form-label" htmlFor="password">
            Password
          </label>
        </div>
      </div>

      <div className="d-flex flex-row mb-4">
        <div className="form-outline flex-fill  mb-0">
          <input
            type="checkbox"
            className="form-check-input"
            id="saving"
            value={isRemember}
            onChange={onChangeRemember}
          />
          <label className="form-check-label" htmlFor="saving">
            Remember me
          </label>
        </div>
      </div>

      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
        <button
          type="button"
          className={`btn btn-primary btn-lg ${theme === "dark"
            ? styles.loginButtonDark
            : ""}`}
          onClick={onLoginClick}
        >
          Sign in
        </button>
        <button
          onClick={onRegistrationClick}
          type="button"
          className={`btn btn-secondary btn-lg ${styles.changeSign} ${theme ===
          "dark"
            ? styles.changeSignDark
            : ""}`}
        >
          Sign up
        </button>
        <ChangerTheme />
      </div>
    </form>
  );
};

export default Signin;
