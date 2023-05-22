import React,  { useEffect }  from "react";
import { useDispatch, useSelector } from "react-redux";
import { TabsActions } from "../../store/tabs-slice";
import AwardLibrary from "./AwardLibrary";
import BadgeLibrary from "./BadgeLibrary"
import CertificateLibrary from "./CertificateLibrary"
import ResponseInfo from "../../UI/ResponseInfo";

const Library = () => {

	const activeTab = useSelector((state) => state.tabs.activeTab);
	const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);
	const dispatch = useDispatch();
	  
	  useEffect(() => {
			let tabConfig = [];
			if(userRolePermission.awardCreate) {
				tabConfig.push({title: "Awards", id: "Awards"});
			}
			if(userRolePermission.badgeCreate) {
				tabConfig.push({title: "Badges", id: "Badges"});
			}
			if(userRolePermission.certificateCreate) {
				tabConfig.push({title: "Certificates", id: "Certificates"});
			}
			
			dispatch(
				TabsActions.updateTabsconfig({
				config: tabConfig,
				})
			);

			return () => {
				dispatch(
				TabsActions.updateTabsconfig({
					config: [],
				})
				);
			};
	  }, [userRolePermission]);

	return (
		<React.Fragment>
			{(userRolePermission.awardCreate || userRolePermission.badgeCreate || userRolePermission.certificateCreate) &&
				<div className="tab-content">
						<div id="Awards" className="tab-pane active">
							{/* <AwardLibrary /> */}
							{activeTab && activeTab.id === 'Awards' && <AwardLibrary /> }
						</div>
						<div id="Badges" className="tab-pane">
							{activeTab && activeTab.id === 'Badges' && <BadgeLibrary /> }
						</div>
						<div id="Certificates" className="tab-pane">
							{activeTab && activeTab.id === 'Certificates' && <CertificateLibrary /> }
						</div>
				</div>
			}
			{!userRolePermission.awardCreate && !userRolePermission.badgeCreate && !userRolePermission.certificateCreate &&
				<div className="row eep-content-section-data no-gutters">
					<ResponseInfo
						title="Oops! Looks illigal way."
						responseImg="accessDenied"
						responseClass="response-info"
						messageInfo="Contact Administrator."
					/>
				</div>
			}
		</React.Fragment>
  );
}
export default Library;