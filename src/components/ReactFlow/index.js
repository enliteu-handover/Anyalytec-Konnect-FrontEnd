import React, { useCallback } from 'react';
import ReactFlow, { Controls, addEdge, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/base.css';
// import TurboEdge from './TurboEdge';
import TurboNode from './TurboNode';
import './style.css';

const ps = {
    sourcePosition: "bottom",
    targetPosition: "top"
}

const initialNodes = [
    {
        id: '1',
        position: { x: 0, y: 0 },
        data: { icon: <img src={'/images/Group 106594.svg'} />, title: 'readFile', subline: 'api.ts' },
        type: 'turbo',
    },
    {
        id: '2',
        position: { x: 250, y: 0 },
        data: { icon: <img src={'/images/Group 106594.svg'} />, title: 'bundle', subline: 'apiContents' },
        type: 'turbo',
    },
    {
        id: '3',
        position: { x: 0, y: 250 },
        data: { icon: <img src={'/images/Group 106594.svg'} />, title: 'readFile', subline: 'sdk.ts' },
        type: 'turbo',
    },
    {
        id: '4',
        position: { x: 250, y: 250 },
        data: { icon: <img src={'/images/Group 106594.svg'} />, title: 'bundle', subline: 'sdkContents' },
        type: 'turbo',
    },
    {
        id: '5',
        position: { x: 500, y: 125 },
        data: { icon: <img src={'/images/Group 106594.svg'} />, title: 'concat', subline: 'api, sdk' },
        type: 'turbo',
    },
    {
        id: '6',
        position: { x: 750, y: 125 },
        data: { icon: <img src={'/images/Group 106594.svg'} />, title: 'fullBundle' },
        type: 'turbo',
    },
];

const initialEdges = [
    {
        id: 'e1-2',
        source: '1',
        target: '2',
    },
    {
        id: 'e3-4',
        source: '3',
        target: '4',
    },
    {
        id: 'e2-5',
        source: '2',
        target: '5',
    },
    {
        id: 'e4-5',
        source: '4',
        target: '5',
    },
    {
        id: 'e5-6',
        source: '5',
        target: '6',
    },
];

const nodeTypes = {
    turbo: TurboNode,
};

const defaultEdgeOptions = {
    type: 'turbo',
    markerEnd: 'edge-circle',
};

const Flow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);
    const defaultViewport = { x: 0, y: 0, zoom: 0.5 };
    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            // onConnect={onConnect}
            fitView
            // minZoom={0.2}
            // maxZoom={4}
            defaultViewport={defaultViewport}
            nodeTypes={nodeTypes}
        //  edgeTypes={edgeTypes}
        //  defaultEdgeOptions={defaultEdgeOptions}
        >
            <Controls showInteractive={false} />
        </ReactFlow>
    );
};

export default Flow;
