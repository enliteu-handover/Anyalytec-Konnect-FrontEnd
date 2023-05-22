import React from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import UserDashboard from "../../components/Home/UserDashboard";
import Home from "../../components/Home/Home";
import UserManagement from "../../components/UserManagement";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import RegisterUser from "../../components/RegisterUser";
import MyProfile from "../../components/MyProfile";
import ListDepartments from "../../components/ListDepartments";
import AdminPanel from "../../components/AdminPanel";
import PortalSettings from "../../components/PortalSettings/PortalSettings";
import ViewUser from "../../components/ViewUser";
import RoleManagement from "../../components/RoleManagement";
import HashTag from "../../components/HashTag";
import Tab from "../../UI/Tab";
import ModifyUser from "../../components/ModifyUser";
import Recognition from "../../components/Recognition";
import Library from "../../components/Library/Library";
import CreateAward from "../../components/Awards/CreateAward";
import Badges from "../../components/Badges/Badges";
import CreateBadge from "../../components/Badges/CreateBadge";
import CertificateCompose from "../../components/Certificates/CertificateCompose";
import Certificates from "../../components/Certificates/Certificates";
import MyCertificate from "../../components/Certificates/MyCertificate";
import Awards from "../../components/Awards/Awards";
import AwardNominations from "../../components/Awards/AwardNominations";
import NominationsApproval from "../../components/Awards/NominationsApproval";
import ManageSpotAwardView from "../../components/Awards/ManageSpotAwardView";
import ManageNominateAwardView from "../../components/Awards/ManageNominateAwardView";
import ECardIndex from "../../components/E-Cards/ECardIndex";
import BirthdayTemplateSettings from "../../components/E-Cards/BirthdayTemplateSettings";
import WorkAnniversarySettings from "../../components/E-Cards/WorkAnniversarySettings";
import AppreciationTemplateSettings from "../../components/E-Cards/AppreciationTemplateSettings";
import SeasonalTemplateSettings from "../../components/E-Cards/SeasonalTemplateSettings";
import Inbox from "../../components/E-Cards/Inbox";
import InboxDetailView from "../../components/E-Cards/InboxDetailView";
import SocialWall from "../../components/SocialWall/SocialWall";
import SurveyResult from "../../components/Survey/SurveyResult";
import CreateSurvey from "../../components/Survey/CreateSurvey";
import SurveyAnswer from "../../components/Survey/SurveyAnswer";
import MySurvey from "../../components/Survey/MySurvey";
import SurveyQuestions from "../../components/Survey/SurveyQuestions";
import SurveyResponses from "../../components/Survey/SurveyResponses";
import IdeaBox from "../../components/IdeaBox/IdeaBox";
import Forum from "../../components/Forum/Forum";
import ForumDetailView from "../../components/Forum/ForumDetailView";
import CreatePoll from "../../components/Polls/CreatePoll";
import PollAnswer from "../../components/Polls/PollAnswer";
import ClosedPolls from "../../components/Polls/ClosedPolls";
import PollResults from "../../components/Polls/PollResults";
import ActivePolls from "../../components/Polls/ActivePolls";
import Notifications from "../../components/Notifications";
import Communication from "../../components/Communication";
import Rewards from "../../components/Rewards/Rewards";
import EEPApp from "../../components/EEPApp/EEPApp";
import Help from "../Header/Help";
import Search from "../../components/Search/Search";

const MainContainer = () => {
  const getTabs = useSelector((state) => state.tabs.config);
  const getToggleSidebarState = useSelector((state) => state.toggleState.isToggle);

  return (
    <main>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content" className="content">
            <Header />
            <Breadcrumb />
            {getTabs.length !== 0 && <Tab />}
            <div className={`container-fluid eep-container-fluid eep-has-title-content px-0 eep_scroll_y ${getTabs.length ? "eep-has-tab-menu" : "" }`}>
              <div className={`eep-container ${getToggleSidebarState ? "eep-container-with-sidebar" : ""}`}>
                <div className="container-sm eep-container-sm">
                  <div className="row no-gutters">
                    <div className="col-md-12 px-0">
                      <div className="eep-content-section-div">
                        <div className="eep-content-section eep_scroll_y">
                          <Switch>
                            <Route path="/app/dashboard" exact>
                              <Home />
                            </Route>
                            <Route path="/app/userdashboard">
                              <UserDashboard />
                            </Route>
                            <Route path="/app/usermanagement" exact>
                              <UserManagement />
                            </Route>
                            <Route path="/app/newUser">
                              <RegisterUser />
                            </Route>
                            <Route path="/app/myprofile">
                              <MyProfile />
                            </Route>
                            <Route path="/app/listdepartments">
                              <ListDepartments />
                            </Route>
                            <Route path="/app/adminpanel" exact>
                              <AdminPanel />
                            </Route>
                            <Route path="/app/help">
                              <Help />
                            </Route>
                            <Route path="/app/users/view/:id" exact>
                              <ViewUser />
                            </Route>
                            <Route path="/app/users/update/:id" exact>
                              <ModifyUser />
                            </Route>
                            <Route path="/app/portalsettings" exact>
                              <PortalSettings />
                            </Route>
                            <Route path="/app/rolemanagement" exact>
                              <RoleManagement />
                            </Route>
                            <Route path="/app/hashtag" exact>
                              <HashTag />
                            </Route>
                            <Route path="/app/recognition" exact>
                              <Recognition />
                            </Route>
                            <Route path="/app/library" exact>
                              <Library />
                            </Route>
                            <Route path="/app/createaward">
                              <CreateAward />
                            </Route>
                            <Route path="/app/badges">
                              <Badges />
                            </Route>
                            <Route path="/app/createbadge">
                              <CreateBadge />
                            </Route>
                            <Route path="/app/certificates">
                              <Certificates />
                            </Route>
                            <Route path="/app/mycertificates">
                              <MyCertificate />
                            </Route>
                            <Route path="/app/composecertificate">
                              <CertificateCompose />
                            </Route>
                            <Route path="/app/awards">
                              <Awards />
                            </Route>
                            <Route path="/app/awardnominations">
                              <AwardNominations />
                            </Route>
                            <Route path="/app/nominationsapproval">
                              <NominationsApproval />
                            </Route>
                            <Route path="/app/managespotawardview">
                              <ManageSpotAwardView />
                            </Route>
                            <Route path="/app/managenominateawardview">
                              <ManageNominateAwardView />
                            </Route>  
                            <Route path="/app/ecardIndex">
                              <ECardIndex />
                            </Route>
                            <Route path="/app/birthdaytemplatesettings">
                              <BirthdayTemplateSettings />
                            </Route>
                            <Route path="/app/workanniversarysettings">
                              <WorkAnniversarySettings />
                            </Route>
                            <Route path="/app/appreciationtemplatesettings">
                              <AppreciationTemplateSettings />
                            </Route>
                            <Route path="/app/seasonaltemplatesettings">
                              <SeasonalTemplateSettings />
                            </Route>
                            <Route path="/app/inbox">
                              <Inbox />
                            </Route>
                            <Route path="/app/inboxdetailview">
                              <InboxDetailView />
                            </Route>
                            <Route path="/app/socialwall">
                              <SocialWall />
                            </Route>
                            <Route path="/app/communication">
                              <Communication />
                            </Route>
                            <Route path="/app/survey">
                              <SurveyResult />
                            </Route>
                            <Route path="/app/createsurvey">
                              <CreateSurvey />
                            </Route>
                            <Route path="/app/surveyanswer">
                              <SurveyAnswer />
                            </Route>
                            <Route path="/app/mysurvey">
                              <MySurvey />
                            </Route>
                            <Route path="/app/surveyquestions">
                              <SurveyQuestions />
                            </Route>
                            <Route path="/app/surveyresponses">
                              <SurveyResponses />
                            </Route>
                            <Route path="/app/ideabox">
                              <IdeaBox />
                            </Route>
                            <Route path="/app/forum">
                              <Forum />
                            </Route>
                            <Route path="/app/forumdetailview">
                              <ForumDetailView />
                            </Route>
                            <Route path="/app/pollanswer">
                              <PollAnswer />
                            </Route>
                            <Route path="/app/createpoll">
                              <CreatePoll />
                            </Route>
                            <Route path="/app/closedpolls">
                              <ClosedPolls />
                            </Route>
                            <Route path="/app/polls">
                              <PollResults />
                            </Route>
                            <Route path="/app/activepolls">
                              <ActivePolls />
                            </Route>
                            <Route path="/app/notifications">
                              <Notifications />
                            </Route>
                            <Route path="/app/points">
                              <Rewards />
                            </Route>
                            <Route path="/app/eepapp">
                              <EEPApp />
                            </Route>
                            <Route path="/app/search">
                              <Search />
                            </Route>
                          </Switch>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
};

export default MainContainer;
