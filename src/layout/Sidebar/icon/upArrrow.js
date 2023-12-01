import React from "react";

const UpArrow = (props) => {
    return (
        <React.Fragment>
            <svg viewBox="0 0 24 24" className="sidebaricondownup">
                <path fill={props?.color} d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>
        </React.Fragment>
    );
};
export default UpArrow;
