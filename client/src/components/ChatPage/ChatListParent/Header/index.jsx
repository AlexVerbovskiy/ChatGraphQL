import React, { useContext } from "react";
import Burger from "./Burger";
import Searcher from "./Searcher";
import { MainContext } from "../../../../App";

export const Header = props => {
  const context = useContext(MainContext);
  return (
    <div className="px-3 d-block">
      <div className="d-flex align-items-center py-1">
        <Burger {...context} />
        <Searcher
          theme={context.theme}
          searcherValue={props.searcherValue}
          setSearchInput={props.setSearchInput}
        />
      </div>
    </div>
  );
};
