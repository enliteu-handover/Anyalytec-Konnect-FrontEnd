import React from "react";
import Tree from "react-d3-tree";
import NodeLabel from "./TurboNode";
import "./style.css";

const myTreeData = [
    {
        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
        attributes: {
            keyA: "val A",
            keyB: "val B",
            keyC: "val C"
        },
        children: [
            {
                icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                attributes: {
                    keyA: "val A",
                    keyB: "val B",
                    keyC: "val C"
                },
                children: [
                    {
                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                    },
                    {
                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                        children: [
                            {
                                icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                            }
                        ]
                    },
                    {
                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                    }
                ]
            },
            {
                icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
            },
            {
                icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                attributes: {
                    keyA: "val A",
                    keyB: "val B",
                    keyC: "val C"
                },
                children: [
                    {
                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                        attributes: {
                            keyA: "val A",
                            keyB: "val B",
                            keyC: "val C"
                        },
                        children: [
                            {
                                icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                                attributes: {
                                    keyA: "val A",
                                    keyB: "val B",
                                    keyC: "val C"
                                },
                                children: [
                                    {
                                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                                        attributes: {
                                            keyA: "val A",
                                            keyB: "val B",
                                            keyC: "val C"
                                        }
                                    },
                                    {
                                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                                    }
                                ]
                            },
                            {
                                icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                            }
                        ]
                    },
                    {
                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                    }
                ]
            },
            {
                icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                children: [
                    {
                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                        attributes: {
                            keyA: "val A",
                            keyB: "val B",
                            keyC: "val C"
                        },
                        children: [
                            {
                                icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                                attributes: {
                                    keyA: "val A",
                                    keyB: "val B",
                                    keyC: "val C"
                                },
                                children: [
                                    {
                                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                                        attributes: {
                                            keyA: "val A",
                                            keyB: "val B",
                                            keyC: "val C"
                                        }
                                    },
                                    {
                                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                    }
                ]
            }
        ]
    }
];

const test = {
    shape: "rect",
    shapeProps: {
        width: 10,
        height: 10,
        x: -20,
        y: 20,
        stroke: "#2F80ED"
    }
};

function App() {
    return (
        <div className="App">
            <h1>ORG Chart POC</h1>
            <div id="treeWrapper" style={{ width: "100%", height: "100vh" }}>
                <Tree
                    data={myTreeData}
                    // nodeSvgShape={svgSquare}
                    // nodeSvgShape={test}
                    pathFunc="step"
                    separation={{ siblings: 2, nonSiblings: 2 }}
                    orientation="vertical"
                    translate={{ x: 900, y: 100 }}
                    allowForeignObjects={true}
                    zoom={5}
                    styles={{
                        links: {

                            stroke: 'red',
                            strokeWidth: "2px",
                        },
                    }}
                    onClick={e => alert('good')}
                    nodeLabelComponent={{
                        render: <NodeLabel className="myLabelComponentInSvg" />,
                        foreignObjectWrapper: {
                            width: 220,
                            height: 200,
                            y: -50,
                            x: -100
                        }
                    }}
                    initialDepth={0.01}
                />
            </div>
        </div>
    );
}
export default App;