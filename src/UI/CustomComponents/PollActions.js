import React from "react";
import { useSelector } from "react-redux";
import { Link} from "react-router-dom";

const PollActions = (props) => {

  const {data, deletePoll} = props;
	//console.log("PollActions props", props);
	const svgIcons = useSelector((state) => state.sharedData.svgIcons);

	const deletePollHandler = () => {
		deletePoll(data);
	}

	return (
		<React.Fragment>
			<div className="ans-type text-center c1">
				<span className="eep_kebab_btn" data-toggle="dropdown" aria-expanded="false" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.colon, }}></span>
				<div className="eep-dropdown-menu dropdown-menu dropdown-menu-right shadow pt-4 pb-4">
					{data.score <= 0 &&
					<Link 
            to={{
              pathname: "createpoll",
              state: { pollData: data },
            }} 
            className="dropdown-item"
          > Edit / Manage </Link>
					}
					<Link to="#" onClick={deletePollHandler} className="dropdown-item"> Delete </Link>
				</div>
			</div>
		</React.Fragment>
	);
};
export default PollActions;
