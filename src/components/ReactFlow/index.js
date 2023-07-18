import React, { useState } from "react";
import Tree from "react-d3-tree";
import NodeLabel from "./TurboNode";
import UserDetailView from "./modal";
import "./style.css";

const myTreeData = [
    {
        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`,
        title: 'Admin01',
        subline: 'Admin . CEO',
        email: 'test@email.com',
        country_name: "c-name",
        country_logo: "",
        branch: "b-branch",
        children: [
            {
                icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
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
                children: [
                    {
                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                        children: [
                            {
                                icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                                children: [
                                    {
                                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',

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
                        children: [
                            {
                                icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO',
                                children: [
                                    {
                                        focus: true,
                                        icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin---', subline: 'Admin CEO',
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

function App(props) {
    const { chartData } = props;
    const [state, setState] = useState({
        view: null,
        data: myTreeData,
        collapsible: false
    })
    const handleAction = (data) => {
        setState({
            ...state,
            view: data,
            collapsible: false
        })
    }
    const handleMore = (data) => {

    }
    // useEffect(() => {
    //     const nodeNameToFocus = "Admin---"

    //     const focusedNode = findNode(state.data, nodeNameToFocus);
    //     if (focusedNode) {
    //         focusedNode.focused = true;
    //         setState({
    //             ...state,
    //         })
    //     }
    // }, [])

    // function findNode(treeDatas, nodeName) {
    //     for (const treeData of treeDatas.treeData) {
    //         if (treeData.title === nodeName) {
    //             treeData.focused = true;
    //         } else if (treeData?.children) {
    //             for (const child of treeData.children) {
    //                 findNode(child, nodeName);
    //             }
    //         }
    //         arr.pus
    //     }

    //     return treeDatas;
    // }

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <UserDetailView data={state?.view} />
            <Tree
                data={state?.data}
                // nodeSvgShape={svgSquare}
                // nodeSvgShape={test}
                zoom={1}
                // zoomable={true}
                pathFunc="step"
                separation={{ siblings: 2, nonSiblings: 2 }}
                orientation="vertical"
                translate={{ x: 600, y: 100 }}
                allowForeignObjects={true}
                styles={{
                    links: {
                        stroke: '#9e9e9e57',
                        strokeWidth: "1px",
                    },
                }}
                nodeLabelComponent={{
                    render: <NodeLabel
                        handleAction={handleAction}
                        handleMore={handleMore}
                    />,
                    foreignObjectWrapper: {
                        width: 220,
                        height: 200,
                        y: -50,
                        x: -100
                    }
                }}
                collapsible={state?.collapsible}
                initialDepth={0.01}
            />
        </div>
    );
}
export default App;