import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import * as XLSX from 'xlsx';
import PageHeader from "../UI/PageHeader";
import CreateBulkUploadModal from "../modals/CreateBulkUserModal";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import { Link } from "react-router-dom";
import { URL_CONFIG } from "../constants/rest-config";
import { httpHandler } from "../http/http-interceptor";
import FlowDiagram from "../components/ReactFlow";

const BulkUploadOrgChart = () => {
    const dispatch = useDispatch();
    const [isUpload, setIsUpload] = useState(true);
    const [data, setData] = useState({});
    const [state, setState] = useState({
        userData: [],
        selectUser: null
    });

    const onChange = (k, event) => {
        setState({
            ...state,
            [k]: event
        });
    };

    const openBulk = () => {
        setIsUpload(true)
    }

    const onSucess = (e) => {
        

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const excelJson = JSON.parse(JSON.stringify(json, null, 2));
            const headers = excelJson[0];
            const dataArray = excelJson.slice(1);
            const payload = dataArray.map(row => {
                if (row?.length > 0) {
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    return obj;
                }
            })?.filter(v => v);

            if (payload?.length > 0) {
                const obj_ = {
                    url: URL_CONFIG.UPSERT_BULK_ORG,
                    method: "post",
                    payload: {
                        data: payload ?? []
                    }
                };
                httpHandler(obj_)
                    .then((response) => {
                        setData({ ...response?.data?.data ?? {} })
                        setIsUpload(false)
                        fetchUserData();
                    });
            }
        }
        reader.readAsArrayBuffer(file);
    }

    const breadcrumbArr = [
        {
            label: "Home",
            link: "app/dashboard",
        },
        {
            label: "ORG CHART",
            link: "app/orgChart",
        }
    ];

    useEffect(() => {
        dispatch(
            BreadCrumbActions.updateBreadCrumb({
                breadcrumbArr,
                title: "Users",
            })
        );
    }, [breadcrumbArr, dispatch]);

    const downloadExcel = (failure) => {
        
        const worksheet = XLSX.utils.json_to_sheet(failure);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "FailureUsers.xlsx");
    };

    const userBulkDataTableHeaders = [
        {
            header: "Username",
            accessorKey: "reporting",
        }, {
            header: "Reportung To",
            accessorKey: "reportingTo",
        }, {
            header: "Status",
            accessorKey: "status",
            Cell: ({ cell, column }) => (
                <span
                    style={{
                        color: cell.getValue()?.toLowerCase() === 'failure' ? 'red' : 'green',
                    }}
                >
                    {cell.getValue()}
                </span>
            ),
        }, {
            header: "Message",
            accessorKey: "message",
            Cell: ({ cell, column }) => (
                <span
                    style={{
                        color: 'red',
                    }}
                >
                    {cell.getValue()}
                </span>
            ),
        }
    ];

    const fetchUserData = (arg) => {
        const obj = {
            url: URL_CONFIG.GETALLUSERS,
            method: "get"
        };
        httpHandler(obj)
            .then((userData) => {
                setState({
                    ...state,
                    userData: userData?.data?.map(v => {
                        return {
                            //...v,
                            value: v?.role?.roleName,
                            profile_pic: v?.imageByte?.image,
                            label: v?.username
                        }
                    })
                });
            })
            .catch((error) => {
                console.log("fetchUserData error", error);
                //const errMsg = error.response?.data?.message;
            });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const CustomOption = ({ innerProps, label, value, data }) => {
        
        return <div {...innerProps} className="orgUpload_User_List">
            <div><img className="img" src={data?.profile_pic ?? `${process.env.PUBLIC_URL}/images/user_profile.png`} /></div>
            <div>
                <div className="title">{label}</div>
                <span className="dis">  {value}</span>
            </div>
        </div>
    }
    return (
        <React.Fragment>

            <CreateBulkUploadModal
                title={'Org Bulk Upload'}
                data={data?.allData}
                failureData={data?.failureData ?? []}
                userBulkDataTableHeaders={userBulkDataTableHeaders}
                // isUpload={false}
                isUpload={isUpload}
                downloadExcel={downloadExcel}
                onSucess={onSucess}
            />

            <PageHeader title="Org Chart"
                filter={
                    <div className="d-flex align-items-center align-content-center">
                        <button type="submit" className="eep-btn eep-btn-success eep-btn-xsml add_newdepartment"
                            style={{
                                marginBottom: 14,
                                marginRight: 10
                            }}
                        >
                            Your  Points : 100
                        </button>

                        <Link
                            style={{
                                marginBottom: 14,
                                marginRight: 10
                            }}
                            className="eep-btn eep-btn-success eep-btn-xsml add_bulk_upload_button"
                            data-toggle="modal"
                            data-target="#CreateBulkUploadModal"
                            to="#"
                            onClick={openBulk}
                        > <img src={'/images/Group 106594.svg'} /> Bulk Upload</Link>

                        <div className="form-group field-wbr" style={{ width: "280px" }}>
                            <Select
                                options={state?.userData ?? []} components={{ Option: CustomOption }}
                                classNamePrefix="eep_select_common select"
                                className={`a_designation basic-single`}
                                placeholder="select..."
                            // options={state?.userData ?? []}
                            // value={{
                            //     value: state.selectUser
                            // }} onChange={(e) => onChange('selectUser', e)}
                            />
                        </div>
                    </div>
                }
            ></PageHeader>
            <FlowDiagram />
        </React.Fragment>
    );
};
export default BulkUploadOrgChart;
