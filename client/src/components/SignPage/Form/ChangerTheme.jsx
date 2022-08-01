import styles from "../../../style/ChangerTheme.module.scss";
import { useContext } from "react";
import { MainContext } from "../../../App";

const ChangerTheme = props => {
  const { theme, changeTheme } = useContext(MainContext);

  const onCheckBoxChange = e => changeTheme();

  return (
    <label
      className={`${styles.switch} ${theme === "dark"
        ? styles.switchDark
        : ""}`}
    >
      <input
        type="checkbox"
        className={theme === "dark" ? styles.checkboxForSign : ""}
        checked={theme === "dark"}
        onChange={onCheckBoxChange}
        alt="theme checkbox"
      />
      <span
        className={`${styles.slider} ${theme === "dark"
          ? styles.sliderDark
          : ""}`}
      />
    </label>
  );
};

export default ChangerTheme;
