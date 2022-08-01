import React from "react";
import styles from "./Searcher.module.scss";


const Searcher = props => {
  const value = props.searcherValue;
  const setValue = props.setSearchInput;

  const classesNames = {
    searchBox: "d-flex " + (props.theme === "dark"?styles.searchBoxDark:styles.searchBox),
    findUser: styles.findUser+" "+ (props.theme === "dark"?styles.findUserDark:""),
    searchChat:
      "form-control my-3 " +styles.searchChat+" "+ (props.theme === "dark" ? styles.searchChatDark: "")
  };

  const handleSearchClick = async () => console.log(value);
  const handleSearchChange = e => {
    if (props.isLoading) return;
    setValue(e.target.value);
    if (!e.target.value) return;
    console.log(e.target.value);
  };

  return (
    <div className={classesNames.searchBox}>
      <button
        className={classesNames.findUser}
        onClick={handleSearchClick}
      >
        <i className="fas fa-search" />
      </button>
      <input
        type="text"
        value={value}
        onChange={handleSearchChange}
        className={"form-control my-3 " + classesNames.searchChat}
        placeholder="Search..."
      />
    </div>
  );
};

export default Searcher;
