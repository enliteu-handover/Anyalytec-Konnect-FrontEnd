import React, { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";
import NodeLabel from "./TurboNode";
import UserDetailView from "./modal";
import "./style.css";

function App(props) {
    const { chartData } = props;
    const treeContainerRef = useRef(null);
    const [zoomFactor, setZoomFactor] = React.useState(1);
    // const [zoomFactor, setZoomFactor] = React.useState(0.6);
    const [translate, setTranslate] = useState({ x: 600, y: 100 });

    const [state, setState] = useState({
        view: null,
        data: chartData,
        collapsible: true
    })

    const chartDataFunctionCollapse = (allData, data) => {
        const filter = data?.map(v => {
            const child = allData?.filter(c => c?.manager === v?.user_id)
            return {
                ...v,
                children: chartDataFunction(allData, child?.length > 0 ? child : []),
                _collapsed: false
            }
        })
        return filter;
    }

    const handleAction = async (data) => {
        
        const respone_data = await chartDataFunctionCollapse(state.data, state.data)
        setState({
            ...state,
            view: data,
            data: respone_data
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
                color: id === v?.user_node_id ? "#1076B4" : "",
                background: id === v?.user_node_id ? "#E2EDF3" : "",
            }
        })
        return filter;
    }

    const handleZoomIn = () => {
        if (zoomFactor !== 1) {
            setZoomFactor(zoomFactor + 0.1);
        }
    };

    const handleZoomOut = () => {
        if (!JSON.stringify(zoomFactor)?.includes(0.2)) {
            setZoomFactor(zoomFactor - 0.1);
        }
    };

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <UserDetailView data={state?.view} />
            <div ref={treeContainerRef} style={{ width: "100%", height: "70vh" }}>
                <Tree
                    data={state?.data}
                    zoom={zoomFactor}
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
            <div className="zoomable">
                <div onClick={handleZoomOut}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={'10px'} viewBox="0 0 32 5"><path d="M0 0h32v4.2H0z"></path></svg>
                </div>
                <div onClick={handleZoomIn}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z"></path></svg> </div>
            </div>
        </div>
    );
}
export default App;