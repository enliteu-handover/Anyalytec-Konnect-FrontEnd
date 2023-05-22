import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeaderSearch = () => {

  const [searchText, setSearchText] = useState("");

  const searchTextHandler = (e) => {
    setSearchText(e.target.value)
  }

  return (
    <div className="eep-search-md ml-auto mx-2">
      <div className={`eep_searchbar`}>
        <input type="text" id="navsearch"
          name="navsearch"
          className={`eep_search_input`}
          placeholder="Search..."
          aria-label="Search"
          aria-describedby="basic-addon2"
          autoComplete="off"
          onChange={(e) => searchTextHandler(e)}
        />
        <div className={`eep_search_icon`}>
          <Link to={{ pathname: "search", state: { searchData: searchText } }}>
            <img src={process.env.PUBLIC_URL + `/images/icons/static/search.svg`} alt="Search" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;
