import React from 'react';
import ReactFlow, { Controls, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/base.css';
// import TurboEdge from './TurboEdge';
import { useState } from 'react';
import TurboNode from './TurboNode';
import UserDetailView from './modal';
import './style.css';

const ps = {
    sourcePosition: "bottom",
    targetPosition: "top"
}

const initialNodes = [
    {
        id: '1',
        position: { x: 0, y: 0 },
        data: { icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Admin', subline: 'Admin CEO' },
        type: 'turbo',
    },
    {
        id: '2',
        position: { x: 250, y: 0 },
        data: { icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Test user01', subline: 'Admin Manager' },
        type: 'turbo',
    },
    {
        id: '3',
        position: { x: 0, y: 250 },
        data: { icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Test user02', subline: 'Admin HR' },
        type: 'turbo',
    },
    {
        id: '4',
        position: { x: 250, y: 250 },
        data: { icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Test user03', subline: 'Admin Design' },
        type: 'turbo',
    },
    {
        id: '5',
        position: { x: 500, y: 125 },
        data: { icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Test user04', subline: 'Admin Design' },
        type: 'turbo',
    },
    {
        id: '6',
        position: { x: 750, y: 125 },
        data: { icon: `${process.env.PUBLIC_URL}/images/user_profile.png`, title: 'Test user05' },
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

const Flow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const defaultViewport = { x: 0, y: 0, zoom: 0.7
        // style: { strokeWidth: 3, stroke: 'black' },
        // type: 'floating',
        // markerEnd: {
        //   color: 'black',
        // },
     };
    return (
        <div style={{ height: "88%" }}>
            <UserDetailView />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onElementClick={(event, element) => {
                    debugger
                    if (element && element.id) {
                        // onNodeClick(event, element);
                    }
                }}
                // fitView
                // minZoom={0.2}
                // maxZoom={4}
                defaultViewport={defaultViewport}
                nodeTypes={nodeTypes}
            //  edgeTypes={edgeTypes}
            //  defaultEdgeOptions={defaultEdgeOptions}
            >
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    );
};

export default Flow;
