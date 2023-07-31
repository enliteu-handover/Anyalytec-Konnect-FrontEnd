import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { TabsActions } from "../../store/tabs-slice";

const Breadcrumb = () => {
  const dispatch = useDispatch();
  const getBreadCrumb = useSelector((state) => state.breadcrumb.breadCrumbArr);
  const history = useHistory();
  const getTabs = useSelector((state) => state.tabs.config);

  const action = (activeTab) => {
    if (getTabs?.length && !activeTab?.length) {
      dispatch(TabsActions.tabOnChange({ tabInfo: getTabs[0] }))
    } else if (activeTab.length) {

      const elements = document.getElementsByClassName('tab-pane');
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('active');
      }

      document.getElementById(activeTab[0].id).classList.add('active');

      dispatch(TabsActions.tabOnChange({ tabInfo: activeTab[0] }));

    }
  };

  const onclick = (val) => {
    if (val?.id) {
      action([{ title: val?.label, id: val?.id }])
    } else {
      return history.push(`/${val.link}`)
    }
  }
  return (
    <div className="row eep_tab_menus eep_breadcrumb_whole_div no-gutters">
      <div className="eep_breadcrumb_div">
        <nav
          className="eep-breadcrumb content-lr-padding"
          aria-label="breadcrumb"
        >
          <ol className="breadcrumb">
            {getBreadCrumb.map((val, i) => {
              const classValue = `breadcrumb-item ${i === getBreadCrumb.length - 1 ? "active" : ""
                }`;
              return (
                <li className={classValue} key={`list_${i}`}>
                  {i !== getBreadCrumb.length - 1 && (
                    <div onClick={() => onclick(val)} className="break_back">{val.label}</div>
                  )}
                  {i === getBreadCrumb.length - 1 && <span className="break_back_active">{val.label}</span>}
                </li>
              );
            })}
            {/* <li className="breadcrumb-item">
              <a href="dashboard.php">Home</a>
            </li>
            <li className="breadcrumb-item active">Dashboard</li> */}
          </ol>
        </nav>
      </div>
    </div>
  );
};
export default Breadcrumb;
