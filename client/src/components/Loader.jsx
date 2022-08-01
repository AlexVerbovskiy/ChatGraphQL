import React from "react";
import styles from "./Loader.module.scss";

export default props => {
  console.log("generated")
  return (
    <div className={styles.loader} id="smallLoader">
      <div className={styles.ldsDefault}>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};
