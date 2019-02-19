import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import CourseSuggestionPanel from '../../components/Tabs/CourseSuggestionPanel';
import WithHeaderBar from '../../hocs/WithHeaderBar';
import './CourseSuggestion.css';
import './Tabs.css';

class CourseSuggestion extends Component {
  state = {};
  render() {
    return (
      <div>
        <div className="main_page_message">
          Here are your remaining courses and suggestions for your complementary
          courses. You can add them to your curriculum.
        </div>
        <Tabs
          defaultTab="one"
          onChange={tabId => {
            console.log(tabId);
          }}
        >
          <TabList>
            <span className="spacer" />
            <Tab tabFor="one">Mandatory Courses</Tab>
            <Tab tabFor="two">Complementary Courses</Tab>
            <span className="spacer" />
          </TabList>
          <Divider />
          <TabPanel tabId="one">
            <CourseSuggestionPanel />
          </TabPanel>
          <TabPanel tabId="two">
            <CourseSuggestionPanel />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default WithHeaderBar(CourseSuggestion);
