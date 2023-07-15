import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default memo(({ data }) => {
    return (
        <>
            <div className="cloud gradient">
                <Link
                    className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                    data-toggle="modal"
                    data-target="#UserDetailView"
                    to="#"
                    onClick={data?.getDetails && data?.getDetails(data)}
                    dangerouslySetInnerHTML={{ __html: "<img src='/images/icons8-info-50.svg'/>" }}
                ></Link>
            </div>
            <div className="wrapper gradient">
                <div className="inner">
                    <div className="body">
                        <div className="icon">
                            <img
                                className='img'
                                src={data?.icon ?? `${process.env.PUBLIC_URL}/images/user_profile.png`} /></div>
                        <div>
                            <div className="title">{data?.title}</div>
                            {data?.subline && <div className="subline">{data.subline}</div>}
                        </div>
                    </div>

                    <Handle type="target" position={Position.Left} />
                    <Handle type="source" position={Position.Right} />
                    <div className="footer">
                        <img
                            className='img'
                            src={`${process.env.PUBLIC_URL}/images/icons8-broadcasting-50.svg`} /> 75 Users
                    </div>
                </div>
            </div>
        </>
    );
});
