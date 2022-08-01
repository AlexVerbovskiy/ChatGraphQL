import React, { useState } from "react";
import styles from "../../../style/Form.module.scss";
import ChangerTheme from "./ChangerTheme";
import { getImgData } from "../../../utils/helper";
import { useContext } from "react";
import { MainContext } from "../../../App";
import { useMutation } from "@apollo/client";
import { REGISTRY_USER } from "../../../mutations/user";

const Signup = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const {
    theme,
    setActualPage: changePage,
    setIsLoading,
    setError
  } = useContext(MainContext);
  const [registryUser] = useMutation(REGISTRY_USER);

  const onChangeEmail = e => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };
  const onChangePassword = e => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const onChangeFullName = e => {
    const newFullName = e.target.value;
    setFullName(newFullName);
  };

  const onChangePhone = e => {
    const newPhone = e.target.value;
    setPhone(newPhone);
  };

  const onLoginClick = () => changePage(0);

  const onClickChangeAvatar = () => {
    document.querySelector("#changeAvatar").click();
  };

  const onChangeInputAvatar = e =>
    getImgData(e.target.files[0], props.onChangeAvatar);

  const onRegistrationClick = async () => {
    try {
      setIsLoading(true);
      const res = await registryUser({
        variables: {
          newUserInput: {
            email,
            password,
            fullName,
            phone,
            avatarImgData: props.actualFile.data,
            avatarImgType: props.actualFile.type
          }
        }
      });

      console.log(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={`mx-1 mx-md-4 ${theme === "dark" ? styles.formDark : ""}`}>
      <div className="d-flex flex-row align-items-center mb-2">
        <div className="form-outline flex-fill mb-0">
          <div className="invalid-feedback">Incorrect login type</div>
          <input
            type="email"
            name="login"
            id="login"
            value={email}
            onChange={onChangeEmail}
            placeholder="email@gmail.com"
            className="form-control"
          />
          <label className="form-label" htmlFor="login">
            Login(email)
          </label>
        </div>
      </div>

      <div className="d-flex flex-row align-items-center mb-2">
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

      <div className="d-flex flex-row align-items-center mb-2">
        <div className="form-outline flex-fill mb-0">
          <div className="invalid-feedback">Error</div>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={fullName}
            onChange={onChangeFullName}
            placeholder="name name"
            className="form-control"
          />
          <label className="form-label" htmlFor="lastName">
            Full name
          </label>
        </div>
      </div>

      <div className="d-flex flex-row align-items-center mb-2">
        <div className="form-outline flex-fill mb-0">
          <div className="invalid-feedback">Error</div>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={phone}
            onChange={onChangePhone}
            placeholder="0666666666"
            className="form-control"
          />
          <label className="form-label" htmlFor="lastName">
            Phone
          </label>
        </div>
      </div>

      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
        <div className="_container">
          <div className="_card">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="changeAvatar"
              onChange={onChangeInputAvatar}
            />
            <button
              type="button"
              className={`${styles.changeAvatar} ${theme === "dark"
                ? styles.changeAvatarDark
                : ""}`}
              onClick={onClickChangeAvatar}
            >
              Change avatar
            </button>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
        <button
          type="button"
          onClick={onRegistrationClick}
          id="btnRegister"
          className={`btn btn-primary btn-lg ${theme === "dark"
            ? styles.regButtonDark
            : ""}`}
        >
          Sign up
        </button>
        <button
          type="button"
          onClick={onLoginClick}
          className={`btn btn-secondary btn-lg ${styles.changeSign} ${theme ===
          "dark"
            ? styles.changeSignDark
            : ""}`}
        >
          Sign in
        </button>
        <ChangerTheme />
      </div>
    </form>
  );
};

export default Signup;

//export default Signup;
