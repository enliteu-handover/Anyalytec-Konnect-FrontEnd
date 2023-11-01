import React from "react";

const Library = (props) => {
    return (
        <React.Fragment>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30px" height="30px">
                <path fill={props.color} d="M 12 2.9824219 L 3 6.3027344 L 3 9 L 5 9 L 5 17 L 7 17 L 7 9 L 11 9 L 11 17 L 13 17 L 13 9 L 17 9 L 17 17 L 19 17 L 19 9 L 21 9 L 21 8 L 21 6.3027344 L 12 2.9824219 z M 12 5.1132812 L 17.111328 7 L 6.8886719 7 L 12 5.1132812 z M 3 19 L 3 21 L 21 21 L 21 19 L 3 19 z" /></svg>
             </React.Fragment>
    );
};
export default Library;
