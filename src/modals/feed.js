import React, { useState } from "react";
import ReactQuill, { Quill } from 'react-quill';
import quillEmoji from "react-quill-emoji";
import "react-quill-emoji/dist/quill-emoji.css";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import Select from "react-select";
import { URL_CONFIG } from "../constants/rest-config";
import { httpHandler } from "../http/http-interceptor";
import { base64ToFile } from "../helpers";

const CreateEditCommunicationModal = (props) => {
    const { deptOptions, hideModal, communicationType } = props;
    Quill.register(
        {
            "formats/emoji": quillEmoji.EmojiBlot,
            "modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
            "modules/emoji-textarea": quillEmoji.TextAreaEmoji,
            "modules/emoji-shortname": quillEmoji.ShortNameEmoji
        },
        true
    );

    const [allcategory, setallcategory] = useState([]);
    const [assignUser, setAssignUser] = useState(null);
    const [usersOptions, setUsersOptions] = useState([]);
    const [state, setState] = useState({
        deptValue: null, userValue: null, message: '',
        shareTo: '',
        modalTitle: '',
        category: '',
        logo: '',
        show_as: ''
    });

    //const initCreateModalShow = createModalShow ? createModalShow : false;
    const svgIcons = useSelector((state) => state.sharedData.svgIcons);
    const initDeptOptions = deptOptions ? deptOptions : {};

    const [modalAttachements, setModalAttachements] = useState([]);
    const [modalErrorAttachements, setModalErrorAttachements] = useState({ errCount: [], errLengthCount: [] });
    const [errorAtthState, setErrorAtthState] = useState(false);
    const [errorLengthAtthState, setErrorLengthAtthState] = useState(false);
    const [attachementFiles, setAttachementFiles] = useState([]);
    var titleMaxLength = 150;
    const fileTypeAndImgSrcArray = {
        "application/pdf": process.env.PUBLIC_URL + "/images/icons/special/pdf.svg",
        "application/mspowerpoint": process.env.PUBLIC_URL + "/images/icons/special/ppt.svg",
        "application/powerpoint": process.env.PUBLIC_URL + "/images/icons/special/ppt.svg",
        "application/vnd.ms-powerpoint": process.env.PUBLIC_URL + "/images/icons/special/ppt.svg",
        "application/x-mspowerpoint": process.env.PUBLIC_URL + "/images/icons/special/ppt.svg",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": process.env.PUBLIC_URL + "/images/icons/special/ppt.svg",
        "application/vnd.ms-excel": process.env.PUBLIC_URL + "/images/icons/special/xlsx.svg",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": process.env.PUBLIC_URL + "/images/icons/special/xlsx.svg",
        "application/zip": process.env.PUBLIC_URL + "/images/icons/special/zip.svg",
        "application/x-zip-compressed": process.env.PUBLIC_URL + "/images/icons/special/zip.svg",
        "application/msword": process.env.PUBLIC_URL + "/images/icons/special/word.svg",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": process.env.PUBLIC_URL + "/images/icons/special/word.svg",
        "image/jpeg": process.env.PUBLIC_URL + "/images/icons/special/jpeg.svg",
        "image/jpg": process.env.PUBLIC_URL + "/images/icons/special/jpeg.svg",
        "image/png": process.env.PUBLIC_URL + "/images/icons/special/jpeg.svg",
        "image/gif": process.env.PUBLIC_URL + "/images/icons/special/gif.svg",
        "image/svg+xml": process.env.PUBLIC_URL + "/images/icons/special/jpeg.svg",
        "application/octet-stream": process.env.PUBLIC_URL + "/images/icons/special/doc.svg",
        "default": process.env.PUBLIC_URL + "/images/icons/special/default-doc.svg",
    };
    const validAttachmentTypes = [
        "application/pdf", "application/mspowerpoint", "application/powerpoint", "application/x-mspowerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-powerpoint", "application/vnd.ms-excel",
        "application/zip", "application/x-zip-compressed",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml",
    ];

    const onChangeValues = (bool, eve) => {
        let key = bool ? 'deptValue' : 'userValue';
        let keyvalid = bool ? 'userValue' : 'deptValue';
        setState({ ...state, [key]: eve, [keyvalid]: null });
    };

    const addIconClickHandler = (arg) => {
        document.getElementById("attachmentFileLoaderNew").value = null;
        document.getElementById("attachmentFileLoaderExist").value = null;
        if (arg === "new") {
            document.getElementById("attachmentFileLoaderNew").click();
        }
        if (arg === "exist") {
            document.getElementById("attachmentFileLoaderExist").click();
        }
    };

    let validFiles = [];
    let errFiles = [];
    let errLengthFiles = [];
    const maxFileSize = 1024000;
    var atthFiles = [];
    const onChangeHandler = (event, cType) => {
        var file = [];
        file = event.target.files;
        for (let k = 0; k < file.length; k++) {
            if (validAttachmentTypes.includes(file[k]['type'])) {
                if (file[k]['size'] <= maxFileSize) {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        validFiles.push(file[k]);
                        atthFiles.push({ imgSrcIcon: (fileTypeAndImgSrcArray[file[k]['type']] ? fileTypeAndImgSrcArray[file[k]['type']] : fileTypeAndImgSrcArray['default']), atthmentDataURI: e.target.result, attachmentName: file[k]['name'] });
                        updateAttachementFilesData(atthFiles, cType, validFiles);
                    };
                    reader.readAsDataURL(file[k]);
                } else {
                    errLengthFiles.push(file[k]);
                    setErrorLengthAtthState(true);
                }
            } else {
                errFiles.push(file[k]);
                setErrorAtthState(true);
            }
        }
        setModalErrorAttachements({ errCount: errFiles, errLengthCount: errLengthFiles });
    };

    const updateAttachementFilesData = (fData, fType, vFiles) => {
        if (fType === "new") {
            setAttachementFiles([...fData]);
            setModalAttachements([...vFiles]);
        }
        if (fType === "exist") {
            const all = [...fData, ...attachementFiles];
            setAttachementFiles(all);
            const allValid = [...vFiles, ...modalAttachements];
            setModalAttachements(allValid);
        }
    }

    const clearAllAtthments = () => {
        setAttachementFiles([]);
        setModalAttachements([]);
        setModalErrorAttachements({ errCount: [], errLengthCount: [] });
    }

    const CreateFunction = async () => {
        let users = [];
        state?.userValue?.length && state?.userValue.map((item) => {
            return users.push(item.value);
        });

        let depts = [];
        state?.deptValue?.length && state?.deptValue.map((item) => {
            return depts.push(item.value);
        });

        let payload = {
            title: state?.modalTitle || null,
            is_public: state?.shareTo?.value === 'public' ? true : false,
            users,
            depts,
            description: state?.message || null,
            active: true,
            logo: state?.logo.icon ?? null,
            attachments: [],
            category_id: state?.category?.id ?? null,
            show_as: state?.show_as ?? null
        };

        if (attachementFiles?.length > 0) {
            for (const item of attachementFiles) {
                const file = base64ToFile(item?.atthmentDataURI?.replace(/^data:image\/\w+;base64,/, ''))
                const formData = new FormData();
                formData.append("image", file);
                const obj = {
                    url: URL_CONFIG.UPLOAD_FILES,
                    method: "post",
                    payload: formData,
                };
                await httpHandler(obj)
                    .then((res) => {
                        payload['attachments'].push(res?.data?.data?.[0]?.url)
                    }).catch((error) => console.log(error));
            }
        };

        const obj = {
            url: URL_CONFIG.ADD_FEEDBACK,
            method: "post",
            payload
        };
        httpHandler(obj).then((response) => {
            debugger
        }).catch((error) => {
            console.log("add feedback error", error);
        });
    }

    const onShareChangeHandler = (event) => {
        setState({ ...state, shareTo: event, deptValue: null, userValue: null });
        setAssignUser(event);
    };

    const fetchUserData = () => {
        const category = {
            url: URL_CONFIG.GET_FEED_CATEGORY,
            method: "get",
        };
        httpHandler(category).then((categoryData) => {
            setallcategory(categoryData?.data?.data)
        });

        const obj = {
            url: URL_CONFIG.GETALLUSERS + "?active=true",
            method: "get",
        };
        httpHandler(obj).then((userData) => {
            const uOptions = [];
            userData && userData.data.map((res) => {
                uOptions.push({ label: res.firstname + " - " + res.department.name, value: res.id });
                return res;
            });
            setUsersOptions([...uOptions]);
        }).catch((error) => {
            console.log("fetchUserData error", error);
            //const errMsg = error.response?.data?.message;
        });

    };

    const handleMessage = (value) => {
        setState({ ...state, message: value });
    };

    React.useEffect(() => {
        fetchUserData();
    }, []);

    const onChange = (k, v) => {
        setState({ ...state, [k]: v });
    };

    const emojiOptions = [
        {
            icon: "😣",
            title: 'Feel Bad'
        }, {
            icon: "😑",
            title: 'Little Okay'
        }, {
            icon: "🙂",
            title: 'Okay'
        }, {
            icon: "😊",
            title: 'Little Happy'
        }, {
            icon: "😍",
            title: 'Happy'
        }
    ];

    return (
        <div className="eepModalDiv">
            <div className="modal fade tc_design show" id="CreateEditCommunicationModal" aria-modal="true" style={{ display: "block" }}>
                <div className="modal-dialog w-75">
                    <div className="modal-content p-4 eep_scroll_y">
                        <div className="modal-body py-0 px-0 eep_scroll_y">
                            <div className="row justify-content-md-center mb-1">

                                <div className="col-md-12 d-flex justify-content-between eep_popupLabelMargin">
                                    <label className="font-helvetica-m  mb-0 c-404040 eep_required_label">How do you feel today?</label>
                                </div>
                                <div className="col-md-12" style={{ display: "flex" }}>
                                    {emojiOptions?.map(v => {
                                        return <div
                                            style={{
                                                opacity: state?.logo?.title === v?.title ? '1' : '0.4',
                                                fontSize: '40px',
                                                cursor: "pointer"
                                            }}
                                            onClick={() => onChange('logo', v)}
                                        >
                                            {v?.icon}<br />
                                            <span style={{ fontSize: 12, position: 'absolute' }}>{state?.logo?.title === v?.title && v?.title}</span>
                                        </div>
                                    })}
                                </div>
                                <div className="col-md-12 d-flex" />
                                <br />

                                <div className="col-md-12 d-flex justify-content-between eep_popupLabelMargin">
                                    <label className="font-helvetica-m  mb-0 c-404040 eep_required_label">Select your category</label>
                                </div>

                                <div className="col-md-12 mb-3">
                                    {allcategory?.map(v => {
                                        return <button
                                            style={{
                                                background: state?.category?.name === v?.name ? '#244AC4' : '#eee',
                                                color: state?.category?.name === v?.name ? '#fff' : '#0000008a',
                                                borderRadius: '6px',
                                                padding: '8px',
                                                border: 'none',
                                                margin: '4px',
                                                fontSize: '13px'
                                            }}
                                            onClick={() => onChange('category', v)}
                                        >{v?.name}</button>
                                    })}
                                </div>

                                <div className="col-md-12 d-flex justify-content-between eep_popupLabelMargin">
                                    <label className="font-helvetica-m  mb-0 c-404040 eep_required_label">Show Me As</label>
                                </div>

                                <div className="col-md-12 mb-3">
                                    {[{ name: "Mike Oliver" }, { name: "Anonymous" }]?.map(v => {
                                        return <button
                                            style={{
                                                background: state?.show_as?.name === v?.name ? '#244AC4' : '#eee',
                                                color: state?.show_as?.name === v?.name ? '#fff' : '#0000008a',
                                                borderRadius: '6px',
                                                padding: '8px',
                                                border: 'none',
                                                margin: '4px',
                                                fontSize: '13px'
                                            }}
                                            onClick={() => onChange('show_as', v)}
                                        >{v?.name}</button>
                                    })}
                                </div>
                                
                                <div className="col-md-12 d-flex justify-content-between eep_popupLabelMargin">
                                    <label className="font-helvetica-m  mb-0 c-404040 eep_required_label">Share to</label>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <Select
                                        options={[
                                            { label: "Send Users", value: "users" },
                                            { label: "Send Departments", value: "departments" },
                                            { label: "Public", value: "public" }
                                        ]}
                                        placeholder="Select..."
                                        classNamePrefix="eep_select_common select"
                                        className="border_none select-with-bg"
                                        onChange={(event) => onShareChangeHandler(event)}
                                        value={state.shareTo}
                                    />
                                </div>

                                {assignUser && assignUser?.value !== 'public' && <>
                                    <div className="col-md-12 d-flex justify-content-between eep_popupLabelMargin">
                                        <label className="font-helvetica-m  mb-0 c-404040 eep_required_label">{assignUser?.label}</label>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <Select
                                            options={[...(assignUser?.value === 'users' ? usersOptions : initDeptOptions)]}
                                            placeholder="Select..."
                                            classNamePrefix="eep_select_common select"
                                            className="border_none select-with-bg"
                                            onChange={(event) => onChangeValues(assignUser?.value !== 'users', event)}
                                            isMulti={true}
                                            maxMenuHeight={233}
                                            value={assignUser?.value !== 'users' ? state.deptValue : state.userValue}
                                        />
                                    </div></>}
                                <div className="col-md-12 mb-3">
                                    <div className="d-flex justify-content-between">
                                        <label className="font-helvetica-m c-404040 eep_popupLabelMargin eep_required_label">Title</label>
                                        <label><span>{state?.modalTitle.length}</span>/<span>{titleMaxLength}</span></label>
                                    </div>
                                    <textarea className="communication-title border_none eep_scroll_y w-100" name="title" id="title" rows="1" placeholder="Enter the title..." value={state.modalTitle} maxLength={titleMaxLength} onChange={(event) => onChange('modalTitle', event.target.value)}></textarea>
                                </div>
                                <div className={`col-md-12`}>
                                    <div className="d-flex justify-content-between">
                                        <label className="font-helvetica-m c-404040 eep_popupLabelMargin eep_required_label">Message</label>
                                    </div>
                                    <ReactQuill
                                        modules={{
                                            toolbar: {
                                                container: [
                                                    ["bold", "italic", "underline", "strike", "blockquote"],
                                                    [{ align: [] }],
                                                    [{ list: "ordered" }, { list: "bullet" }],
                                                    ["link", "image"
                                                        //  "video"
                                                    ],
                                                    ["emoji"],
                                                    // ["clean"],
                                                    // ["code-block"]
                                                ]
                                            },
                                            "emoji-toolbar": true,
                                            // "emoji-textarea": true,
                                            // "emoji-shortname": true
                                        }}
                                        theme="snow"
                                        placeholder="Add message" value={state.message} onChange={handleMessage} />
                                    {/* <textarea rows="4" cols="50" placeholder="Enter the description..." name="description" id="description" className="communication-modal-textarea eep_scroll_y" maxLength={descMaxLength} value={modalDescription} onChange={(event) => setModalDescription(event.target.value)}></textarea> */}
                                </div>
                                {modalErrorAttachements?.errCount.length > 0 && errorAtthState &&
                                    <div className="col-md-12">
                                        <div className="alert alert-danger my-2" role="alert">
                                            <span>{modalErrorAttachements.errCount.length}</span><span>{modalErrorAttachements.errCount.length > 1 ? " - Invalid files!" : " - Invalid file!"}</span>
                                            <button type="button" className="close eep-error-close" onClick={() => setErrorAtthState(false)}><span aria-hidden="true">×</span></button>
                                        </div>
                                    </div>
                                }
                                {modalErrorAttachements?.errLengthCount.length > 0 && errorLengthAtthState &&
                                    <div className="col-md-12">
                                        <div className="alert alert-danger my-2" role="alert">
                                            <span>{modalErrorAttachements.errLengthCount.length}</span><span> - File Size exceeds, File Size should be less than 1mb.</span>
                                            <button type="button" className="close eep-error-close" onClick={() => setErrorLengthAtthState(false)}><span aria-hidden="true">×</span></button>
                                        </div>
                                    </div>
                                }

                                {attachementFiles?.length > 0 &&
                                    <div className="col-md-12">
                                        <div className="d-flex justify-content-end my-1" onClick={clearAllAtthments}>
                                            <span className="c1"> Clear all</span>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="row">
                                <div className="col-md-12 my-2">
                                    <div className="attachments_list_whole_div text-right communication_modal_attachement_dflex ">
                                        {attachementFiles?.length <= 0 &&
                                            <div
                                                className="attachments_adds i_pin_icon eep_attachment_icon c1"
                                                dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.attachment_icon }}
                                                title="jpge, png, gif, jpg, svg, pdf, ppt, excel, word, zip"
                                                onClick={() => addIconClickHandler("new")}
                                            ></div>
                                        }
                                        {attachementFiles?.length > 0 &&
                                            <React.Fragment>
                                                <img src={process.env.PUBLIC_URL + "/images/icons/special/attachment-add.svg"} className="c1 attachments_adds attachments_add" title="jpge, png, gif, jpg, svg, pdf, ppt, excel, word, zip" alt="attachment-add-icon" onClick={() => addIconClickHandler("exist")} />
                                                {attachementFiles?.map((item, index) => {
                                                    return (
                                                        <div className="attachments_list" key={"attachments_list_" + index}>
                                                            <div className="attachments_list_a">
                                                                <a href={item.atthmentDataURI} target="_thapa" download={item.attachmentName} title={item.attachmentName}>
                                                                    <img src={item.imgSrcIcon} className="image-circle c1 ideabox_popup_attachement_dflex_image" alt="icon" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                )}
                                            </React.Fragment>
                                        }
                                    </div>
                                    <input type="file" className="d-none attachmentFileLoaders text-right" id="attachmentFileLoaderNew" name="file-input" multiple="multiple" title="Load File" onChange={(event) => onChangeHandler(event, "new")} />
                                    <input type="file" className="d-none attachmentFileLoaders text-right" id="attachmentFileLoaderExist" name="file-input" multiple="multiple" title="Load File" onChange={(event) => onChangeHandler(event, "exist")} />
                                </div>
                            </div>
                            <div className="communication_add_action_div d-flex justify-content-center">
                                <button type="button" className="eep-btn eep-btn-cancel eep-btn-nofocus eep-btn-xsml mr-2" data-dismiss="modal" onClick={hideModal}>Cancel</button>
                                <button type="button" className="eep-btn eep-btn-success eep-btn-xsml ml-3" onClick={CreateFunction}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CreateEditCommunicationModal;