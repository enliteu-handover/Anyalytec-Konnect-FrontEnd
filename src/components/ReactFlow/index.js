import React, { useEffect, useRef, useState } from "react";
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
    const treeContainerRef = useRef(null); // Reference to the tree container element
    const [translate, setTranslate] = useState({ x: 600, y: 100 });

    const { chartData } = props;
    const [state, setState] = useState({
        view: null,
        data: chartData,
        collapsible: true
    })

    const handleAction = (data) => {
        setState({
            ...state,
            view: data,
        })
    };

    useEffect(() => {
        if (props.selectUser) { focusNode(props.selectUser); }
    }, [props.selectUser]);

    const focusNode = (selectedNodeId) => {
        const container = treeContainerRef.current;
        const a = chartDataFunction(state.data, state.data, props.selectUser)
        setState({ ...state, data: a })
        setTimeout(() => {
            const nodeElement = document.getElementById(selectedNodeId);
            const dimensions = nodeElement.getBoundingClientRect();
            const containerDimensions = container.getBoundingClientRect();
            const offsetX = dimensions.x - containerDimensions.x - containerDimensions.width / 2 + dimensions.width / 2;
            const offsetY = dimensions.y - containerDimensions.y - containerDimensions.height / 2 + dimensions.height / 2;
            setTranslate((prevTranslate) => ({
                x: (prevTranslate.x - offsetX),
                y: (prevTranslate.y - offsetY),
            }));
        }, 1);
    };

    const chartDataFunction = (allData, data, id) => {
        const filter = data?.map(v => {
            const child = allData?.filter(c => c?.manager === v?.user_id)
            return {
                ...v,
                children: chartDataFunction(allData, child?.length > 0 ? child : [], id),
                color: id === v?.user_node_id ? "red" : "",
            }
        })
        return filter;
    }

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <UserDetailView data={state?.view} />
            <div ref={treeContainerRef} style={{ width: "100%", height: "100vh" }}>
                <Tree
                    data={state?.data}
                    zoom={1}
                    // zoomable={true}
                    pathFunc="step"
                    separation={{ siblings: 2, nonSiblings: 2 }}
                    orientation="vertical"
                    translate={translate}
                    allowForeignObjects={true}
                    styles={{
                        links: {
                            stroke: '#9e9e9e57',
                            strokeWidth: "1px",
                        },
                    }}
                    nodeSvgShape={{ shape: "none" }}
                    nodeLabelComponent={{
                        render: <NodeLabel
                            handleAction={handleAction}
                        />,
                        foreignObjectWrapper: {
                            width: 220,
                            height: 200,
                            y: -50,
                            x: -100
                        }
                    }}
                // collapsible={state?.collapsible}
                // initialDepth={0.01}
                />
            </div>
        </div>
    );
}
export default App;