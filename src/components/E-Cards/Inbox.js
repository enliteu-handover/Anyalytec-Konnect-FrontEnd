import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import PageHeader from "../../UI/PageHeader";
import InboxCard from "./InboxCard";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";

const Inbox = () => {

  const [inboxData, setInboxData] = useState();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "RECOGNITION",
      link: "app/recognition",
    },
    {
      label: "Inbox",
      link: "app/Inbox",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Recognition",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  });

  const fetchInboxData = () => {
    debugger
    const userData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};
    const obj = {
      url: URL_CONFIG.ECARD_INBOX,
      method: "get",
      params: { id: userData.id }
    };
    httpHandler(obj)
      .then((response) => {
        debugger
        const groupByCategory = response?.data?.reduce((group, card) => {
          const { type } = card;
          group[type] = group[type] ?? [];
          group[type].push(card);
          return group;
        }, {});
        setInboxData(groupByCategory);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    fetchInboxData();
  }, []);


  const likeECard = (arg) => {
    const obj = {
      url: URL_CONFIG.ECARD_LIKE + "?id=" + arg.id + "&like=" + !arg.liked,
      method: "put",
    };
    httpHandler(obj)
      .then(() => {
        fetchInboxData();
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
        setShowModal({
          ...showModal,
          type: "danger",
          message: errMsg,
        });
      });
  }

  return (
    <React.Fragment>
      <PageHeader title="Received Cards"></PageHeader>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Ok
            </button>
          }
          errorFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-danger"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Close
            </button>
          }
        ></EEPSubmitModal>
      )}
      <div className="row eep-content-section-data no-gutters eep-inner-inbox-div">
        <div className="col-md-12">
          <div id="inbox-accordion">
            <div className="accordion" id="accordionInbox">
              <InboxCard inboxCardSettings={{ "id": "InboxOne", "dataTarget": "collapseInboxBirthday", "title": "Birthday", "show": "show", "expand": "true", "carousel": "inboxBirthdayCarousel" }} inboxData={inboxData?.birthday || []} likeECard={likeECard} />
              <InboxCard inboxCardSettings={{ "id": "InboxTwo", "dataTarget": "collapseInboxWorkAnniversary", "title": "Work Anniversary", "show": "", "expand": "false", "carousel": "inboxWorkAnniversaryCarousel" }} inboxData={inboxData?.anniversary || []} likeECard={likeECard} />
              <InboxCard inboxCardSettings={{ "id": "InboxThree", "dataTarget": "collapseInboxAppreciation", "title": "Appreciation", "show": "", "expand": "false", "carousel": "inboxAppreciationCarousel" }} inboxData={inboxData?.appreciation || []} likeECard={likeECard} />
              <InboxCard inboxCardSettings={{ "id": "InboxFour", "dataTarget": "collapseInboxSeasonal", "title": "Seasonal Greetings", "show": "", "expand": "false", "carousel": "inboxSeasonalCarousel" }} inboxData={inboxData?.seasonal || []} likeECard={likeECard} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Inbox;
