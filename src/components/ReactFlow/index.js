import dagre from "dagre";
import React, { useCallback } from 'react';
import ReactFlow, {
    useEdgesState,
    useNodesState,
    getOutgoers,
    getConnectedEdges,
} from "reactflow";

import "reactflow/dist/style.css";
import TurboNode from './TurboNode';
import { useState } from "react";

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
        data: { title: "node 2" },
        position, type: 'cutom',
    },
    {
        id: "2a",
        data: { title: "node 2a" },
        position, type: 'cutom',
    },
    {
        id: "2b",
        data: { title: "node 2b" },
        position, type: 'cutom',
    },
    {
        id: "2c",
        data: { title: "node 2c" },
        position, type: 'cutom',
    },
    {
        id: "2d",
        data: { title: "node 2d" },
        position, type: 'cutom',
    },
    {
        id: "3",
        data: { title: "node 3" },
        position, type: 'cutom',
    },
    {
        id: "4",
        data: { title: "node 4" },
        position, type: 'cutom',
    },
    {
        id: "5",
        data: { title: "node 5" },
        position, type: 'cutom',
    },
    {
        id: "6",
        type: "output",
        data: { title: "output" },
        position, type: 'cutom',
    },
    { id: "7", type: "output", data: { title: "output" }, position, type: 'cutom', }
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
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2
        };

        return node;
    });

    return { nodes, edges };
};


const LayoutFlow = (props) => {
    const { chartData } = props;
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges
    );
    
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
    const [hidden, setHidden] = useState(true);
    const nodeTypes = {
        cutom: TurboNode,
    };
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
        debugger
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

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            onNodeClick={nodeClick}
        />
    );
};

export default LayoutFlow;
