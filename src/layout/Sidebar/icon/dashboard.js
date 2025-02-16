import React, { useState } from "react";

const Dashboard = (props) => {
    return (
        <React.Fragment>
            <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.649 24.5">
                <g id="Group_78" data-name="Group 78" transform="translate(-23.666 -47.334)">
                    <path id="Path_133" data-name="Path 133" d="M33.15,47.334H25.46a1.812,1.812,0,0,0-1.794,1.825v7.628a1.812,1.812,0,0,0,1.794,1.826h7.69a1.812,1.812,0,0,0,1.794-1.826V49.159A1.812,1.812,0,0,0,33.15,47.334Z" transform="translate(0 0)" fill={props?.color} />
                    <path id="Path_134" data-name="Path 134" d="M300.15,47.334h-7.69a1.812,1.812,0,0,0-1.794,1.825v7.628a1.812,1.812,0,0,0,1.794,1.826h7.69a1.812,1.812,0,0,0,1.795-1.826V49.159A1.812,1.812,0,0,0,300.15,47.334Z" transform="translate(-253.63 0)" fill={props?.color} />
                    <path id="Path_135" data-name="Path 135" d="M33.15,311.334H25.46a1.812,1.812,0,0,0-1.794,1.825v7.628a1.812,1.812,0,0,0,1.794,1.826h7.69a1.812,1.812,0,0,0,1.794-1.826v-7.628A1.812,1.812,0,0,0,33.15,311.334Z" transform="translate(0 -250.779)" fill={props?.color} />
                    <path id="Path_136" data-name="Path 136" d="M300.15,311.334h-7.69a1.812,1.812,0,0,0-1.794,1.825v7.628a1.812,1.812,0,0,0,1.794,1.826h7.69a1.812,1.812,0,0,0,1.795-1.826v-7.628A1.812,1.812,0,0,0,300.15,311.334Z" transform="translate(-253.63 -250.779)" fill={props?.color} />
                </g>
            </svg>
        </React.Fragment>
    );
};
export default Dashboard;
