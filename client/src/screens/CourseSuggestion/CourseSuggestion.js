import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';

import MandatoryPanel from '../../components/Tabs/MandatoryPanel';
import ComplementaryPanel from '../../components/Tabs/ComplementaryPanel';
import WithHeaderBar from '../../hocs/WithHeaderBar';
import './CourseSuggestion.css';
import './Tabs.css';

class CourseSuggestion extends Component {
  state = {};
  render() {
    return (
      <div>
        <div className="main_page_message">
          Here are your remaining mandatory courses and suggestions for your
          complementary courses. You can add them to your curriculum.
        </div>
        <Tabs
          defaultTab="Mandatory Courses"
          onChange={tabId => {
            console.log(tabId);
          }}
        >
          <TabList>
            <span className="spacer" />
            <Tab tabFor="Mandatory Courses">Mandatory Courses</Tab>
            <Tab tabFor="Complementary Courses">Complementary Courses</Tab>
            <span className="spacer" />
          </TabList>
          <Divider />
          <TabPanel tabId="Mandatory Courses">
            <MandatoryPanel />
          </TabPanel>
          <TabPanel tabId="Complementary Courses">
            <ComplementaryPanel />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default WithHeaderBar(CourseSuggestion);
