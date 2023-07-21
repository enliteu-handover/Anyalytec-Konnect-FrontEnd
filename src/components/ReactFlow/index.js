import dagre from "dagre";
import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    ConnectionMode,
    getConnectedEdges,
    getOutgoers,
    useEdgesState,
    useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";
import { TurboNode } from './TurboNode';
import UserDetailView from "./modal";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const position = { x: 0, y: 0 };
const edgeType = "step";
const animated = false;

const initialNodes = [
    {
        id: "1",
        data: { icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO' },
        position, type: 'cutom',
    },
    {
        id: "2",
        data: { onCollapse: 'nodeClick', title: "Admin 2" },
        position, type: 'cutom',
    },
    {
        id: "2a",
        data: { onCollapse: 'nodeClick', title: "node 2a" },
        position, type: 'cutom',
    },
    {
        id: "2b",
        data: { onCollapse: 'nodeClick', title: "node 2b" },
        position, type: 'cutom',
    },
    {
        id: "2c",
        data: { onCollapse: 'nodeClick', title: "node 2c" },
        position, type: 'cutom',
    },
    {
        id: "2d",
        data: { onCollapse: 'nodeClick', title: "node 2d" },
        position, type: 'cutom',
    },
    {
        id: "3",
        data: { onCollapse: 'nodeClick', title: "node 3" },
        position, type: 'cutom',
    },
    {
        id: "4",
        data: { onCollapse: 'nodeClick', title: "node 4" },
        position, type: 'cutom',
    },
    {
        id: "5",
        data: { onCollapse: 'nodeClick', title: "node 5" },
        position, type: 'cutom',
    },
    {
        id: "6",
        type: "output",
        data: { onCollapse: 'nodeClick', title: "output" },
        position, type: 'cutom',
    },
    { id: "7", type: "output", data: { onCollapse: 'nodeClick', title: "output" }, position, type: 'cutom', }
];

const initialEdges = [
    { id: "e12", source: "1", target: "2", type: edgeType, animated, style: { stroke: "red" } },
    { id: "e13", source: "1", target: "3", type: edgeType, animated },
    { id: "e22a", source: "2", target: "2a", type: edgeType, animated },
    { id: "e22b", source: "2", target: "2b", type: edgeType, animated },
    { id: "e22c", source: "2", target: "2c", type: edgeType, animated },
    { id: "e2c2d", source: "2c", target: "2d", type: edgeType, animated },
    { id: "e45", source: "3", target: "4", type: edgeType, animated },
    { id: "e45", source: "4", target: "5", type: edgeType, animated },
    { id: "e56", source: "5", target: "6", type: edgeType, animated },
    { id: "e57", source: "5", target: "7", type: edgeType, animated }
];

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = "TB") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? "left" : "top";
        node.sourcePosition = isHorizontal ? "right" : "bottom";

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth + ((nodeWithPosition.x) / 4),
            y: nodeWithPosition.y - nodeHeight + ((nodeWithPosition.y) / 4)
        };

        return node;
    });

    return { nodes, edges };
};

const LayoutFlow = (props) => {
    const { chartData } = props;
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        chartData?.initialNodes,
        chartData?.initialEdges
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
    const [hidden, setHidden] = useState(true);
    const [state, setState] = useState({
        view: null,
    })
    const onConnect = useCallback((params) => setEdges((eds) => setNodes(params, eds)), []);

    const hide = (hidden, childEdgeID, childNodeID) => (nodeOrEdge) => {
        if (
            childEdgeID.includes(nodeOrEdge.id) ||
            childNodeID.includes(nodeOrEdge.id)
        )
            nodeOrEdge.hidden = hidden;
        return nodeOrEdge;
    };

    const checkTarget = (edge, id) => {
        let edges = edge.filter((ed) => {
            return ed.target !== id;
        });
        return edges;
    };

    let outgoers = [];
    let connectedEdges = [];
    let stack = [];

    const nodeClick = (some, node) => {
        let currentNodeID = node.id;
        stack.push(node);
        while (stack.length > 0) {
            let lastNOde = stack.pop();
            let childnode = getOutgoers(lastNOde, nodes, edges);
            let childedge = checkTarget(
                getConnectedEdges([lastNOde], edges),
                currentNodeID
            );
            childnode.map((goer, key) => {
                stack.push(goer);
                outgoers.push(goer);
            });
            childedge.map((edge, key) => {
                connectedEdges.push(edge);
            });
        }

        let childNodeID = outgoers.map((node) => {
            return node.id;
        });
        let childEdgeID = connectedEdges.map((edge) => {
            return edge.id;
        });

        setNodes((node) => node.map(hide(hidden, childEdgeID, childNodeID)));
        setEdges((edge) => edge.map(hide(hidden, childEdgeID, childNodeID)));
        setHidden(!hidden);
    };

    const handleAction = async (data) => {
        setState({
            ...state,
            view: data,
        })
    };

    const nodeTypes = {
        cutom: (props) => <TurboNode {...props} nodeEevent={nodeClick} handleAction={handleAction} />,
    };

    useEffect(() => {
        debugger
        if (props?.selectUser) {
            focusNode(props.selectUser);
        }
    }, [props.selectUser]);


    function getSourceIds(jsonData, targetId) {
        debugger
        const sourceIds = [];

        function findSourceId(targetId) {
            for (const item of jsonData) {
                if (item.target === targetId) {
                    sourceIds.push({ source: item.source, target: item.target });
                    findSourceId(item.source); // Recursive call to find the next source ID
                }
            }
        }

        findSourceId(targetId);
        return sourceIds;
    }

    const focusNode = (selectedNodeId) => {
        debugger

        const sourceIds = getSourceIds(edges, JSON.stringify(selectedNodeId));

        const eds = edges?.map(v => {
            let obj = {};
            obj = {
                ...v,
                style: {}
            }
            if (sourceIds?.find(c => c.source === v.source && v.target === c.target)?.source) {
                obj = {
                    ...obj,
                    style: { stroke: "#1076B4" }
                }
            }
            return {
                ...obj
            }
        })
        const nds = nodes?.map(v => {
            let obj = {};
            obj = {
                ...v,
                data: {
                    ...v.data,
                    color: v?.data?.isloggedUser ? "#607d8b8a" : "",
                    background: v?.data?.isloggedUser ? "#E2EDF3" : "",
                }
            }
            if (JSON.stringify(selectedNodeId) === v?.id) {
                obj = {
                    ...obj,
                    data: {
                        ...v.data,
                        color: "#1076B4",
                        background: "#E2EDF3",
                    }

                }
            }
            return {
                ...obj,
            }
        })
        console.log('nodes', nds);
        console.log('selectedNodeId', selectedNodeId);
        setEdges([...eds])
        setNodes([...nds])
        // style: { stroke: "red" }
    };
    return (
        <React.Fragment>
            <UserDetailView data={state?.view} />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onConnect={ConnectionMode.Loose}
            // onNodesChange={onNodesChange}
            // onEdgesChange={onEdgesChange}
            // // fitView
            // nodesDraggable={false}
            // nodesConnectable={false}
            // elementsSelectable={false}
            // onNodeClick={nodeClick}
            />
        </React.Fragment>
    );
};

export default LayoutFlow;
