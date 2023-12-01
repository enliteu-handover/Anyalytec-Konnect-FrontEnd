import React from "react";

const DownArrow = (props) => {
    return (
        <React.Fragment>
            <svg viewBox="0 0 24 24" className="sidebaricondown">
                <path fill={props?.color}
                    d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg>
        </React.Fragment>
    );
};
export default DownArrow;
