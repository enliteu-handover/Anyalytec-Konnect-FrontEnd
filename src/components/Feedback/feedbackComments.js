import React, { useState } from "react";
import ReactQuill, { Quill } from 'react-quill';
import quillEmoji from "react-quill-emoji";
import "react-quill-emoji/dist/quill-emoji.css";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";

const FeedbackComments = (props) => {
  const { commentSubmitHandler, childReplay } = props;
  Quill.register(
    {
      "formats/emoji": quillEmoji.EmojiBlot,
      "modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
      "modules/emoji-textarea": quillEmoji.TextAreaEmoji,
      "modules/emoji-shortname": quillEmoji.ShortNameEmoji
    },
    true
  );

  const commentMaxLength = 120;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [ideaComment, setIdeaComment] = useState('');
  const [cmtAttachements, setCmtAttachements] = useState([]);
  const [cmtErrorAttachements, setCmtErrorAttachements] = useState({ errCount: [], errLengthCount: [] });
  const [errorAtthState, setErrorAtthState] = useState(false);
  const [errorLengthAtthState, setErrorLengthAtthState] = useState(false);
  const [attachementFiles, setAttachementFiles] = useState([]);

  const addIconClickHandler = (arg) => {
    document.getElementById("cmt_attachmentFileLoaderNew").value = null;
    document.getElementById("cmt_attachmentFileLoaderExist").value = null;
    if (arg === "new") {
      document.getElementById("cmt_attachmentFileLoaderNew").click();
    }
    if (arg === "exist") {
      document.getElementById("cmt_attachmentFileLoaderExist").click();
    }
  };

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
    "image/svg+xmll": process.env.PUBLIC_URL + "/images/icons/special/jpeg.svg",
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
    setCmtErrorAttachements({ errCount: errFiles, errLengthCount: errLengthFiles });
  };

  const updateAttachementFilesData = (fData, fType, vFiles) => {
    if (fType === "new") {
      setAttachementFiles([...fData]);
      setCmtAttachements([...vFiles]);
    }
    if (fType === "exist") {
      const all = [...fData, ...attachementFiles];
      setAttachementFiles(all);
      const allValid = [...vFiles, ...cmtAttachements];
      setCmtAttachements(allValid);
    }
  }

  const clearAllAtthments = () => {
    setAttachementFiles([]);
    setCmtAttachements([]);
    setCmtErrorAttachements({ errCount: [], errLengthCount: [] });
  }

  const commentHandler = () => {
    if (ideaComment.length > 0) {
      const cmtDatas = {
        files: cmtAttachements,
        commentValue: ideaComment
      }
      commentSubmitHandler(cmtDatas);
    }
  }

  console.log('ideaComment', ideaComment);

  const onchangeText = (v) => {
    setIdeaComment(v)
  }

  return (
    <div className="ideabox_mesgbutton_container">
      <div className="reply-textarea-inner reply-textarea-inner-f">
        <div className="reply-textarea-div position-relative">
          {childReplay?.message && <span style={{
            borderBottom: '1px solid #9E9E9E',
            fontStyle: 'italic'
          }}>Replay To: 
            <div className="eep_command_posts" dangerouslySetInnerHTML={{ __html: childReplay?.message }} /></span>}


          <div className="editor-container-replay">
            <ReactQuill
              className="editor"
              modules={{
                toolbar: {
                  container: [
                    ["bold", "italic", "underline", "strike"],
                    // ["emoji"]
                  ]
                },
                // "emoji-toolbar": true,
                "emoji-textarea": true,
                "emoji-shortname": true
              }}
              theme="snow"
              placeholder="Add a comment"
              value={ideaComment}
              onChange={(e) => setIdeaComment(e)} />

          </div>
          {/* <textarea
            className="form-control ideabox-message-textarea ideabox-message-textarea-f ideabox_contentt_size eep_scroll_y"
            name="comment" id="ideaCommentTextarea"
            maxLength={commentMaxLength} placeholder="Add a comment"
            value={ideaComment} onChange={(e) => setIdeaComment(e.target.value)}></textarea> */}

          {/* <div className="text-right" style={{ color: "#858796", paddingRight: "5px", fontSize: "10px" }}><span>{ideaComment.length}</span>/<span>{commentMaxLength}</span></div> */}

          {cmtErrorAttachements?.errCount?.length > 0 && errorAtthState &&
            <div className="col-md-12" style={{ fontSize: "10px" }}>
              <div className="alert alert-danger my-1" role="alert">
                <span>{cmtErrorAttachements.errCount.length}</span><span>{cmtErrorAttachements.errCount.length > 1 ? " - Invalid files!" : " - Invalid file!"}</span>
                <button type="button" className="close eep-error-close" style={{ fontSize: "18px" }} onClick={() => setErrorAtthState(false)}><span aria-hidden="true">×</span></button>
              </div>
            </div>
          }

          {cmtErrorAttachements?.errLengthCount?.length > 0 && errorLengthAtthState &&
            <div className="col-md-12" style={{ fontSize: "10px" }}>
              <div className="alert alert-danger my-1" role="alert">
                <span>{cmtErrorAttachements.errLengthCount.length}</span><span> - File Size exceeds, File Size should be less than 1mb.</span>
                <button type="button" className="close eep-error-close" style={{ fontSize: "18px" }} onClick={() => setErrorLengthAtthState(false)}><span aria-hidden="true">×</span></button>
              </div>
            </div>
          }

          <div className="ideabox_mesgbutton text-right">
            <div className="attahement_on_command d-inline-flex flex-wrap-reverse align-items-center flex-row-reverse">
              <div
                className={`${ideaComment.length > 0 ? "eep_post_icon c1" : ""}`}
                onClick={commentHandler}
              >
                <span dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.send_icon }}></span>
              </div>

              {attachementFiles?.length > 0 &&
                <div className="idea_attachement_clear_comments c1 d-flex" style={{ order: "1" }} onClick={clearAllAtthments}>
                  <span className="idea_atth_clear">Clear</span>
                </div>
              }
              {attachementFiles?.length > 0 &&
                <React.Fragment>
                  <img src={`${process.env.PUBLIC_URL}/images/icons/special/attachment-add.svg`} className="ideabox-attach-img-size_2 image-circle c1 command_attachement right_side_commandadd_icon mr-2" id="command_attachement_plus" alt="attachment-add-icon" onClick={() => addIconClickHandler("exist")} />
                  {attachementFiles?.map((item, index) => {
                    return (
                      <div className="attachments_list mb-0" key={"attachments_list_" + index}>
                        <div className="attachments_list_a">
                          <a href={item.atthmentDataURI} target="_thapa" download={item.attachmentName} title={item.attachmentName}>
                            <img src={item.imgSrcIcon} className="image-circle c1 command-attachement-img-size" alt="icon" />
                          </a>
                        </div>
                      </div>
                    )
                  }
                  )}
                </React.Fragment>
              }
              {attachementFiles?.length <= 0 &&
                <div
                  id="command_attachement_icon"
                  className="c1 command_attachement eep_attachment_icon mr-2"
                  dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.attachment_icon_sm }}
                  onClick={() => addIconClickHandler("new")}
                ></div>
              }
              <input type="file" className="d-none attachmentFileLoaders text-right" id="cmt_attachmentFileLoaderNew" name="file-input" multiple="multiple" title="Load File" onChange={(event) => onChangeHandler(event, "new")} />
              <input type="file" className="d-none attachmentFileLoaders text-right" id="cmt_attachmentFileLoaderExist" name="file-input" multiple="multiple" title="Load File" onChange={(event) => onChangeHandler(event, "exist")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackComments;