import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';

import MandatoryPanel from '../../components/MandatoryPanel/MandatoryPanel';
import ComplementaryPanel from '../../components/ComplementaryPanel/ComplementaryPanel';
import WithHeaderBar from '../../hocs/WithHeaderBar';
import './CourseSuggestion.css';

class CourseSuggestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'Mandatory Courses',
    };
  }

  hydrateStateWithLocalStorage() {
    for (let key in this.state) {
      if (localStorage.hasOwnProperty(key)) {
        let value = localStorage.getItem(key);

        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          this.setState({ [key]: value });
        }
      }
    }
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();

    window.addEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      'beforeunload',
      this.saveStateToLocalStorage.bind(this)
    );
    this.saveStateToLocalStorage();
  }

  saveStateToLocalStorage() {
    for (let key in this.state) {
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  render() {
    return (
      <div>
        <div className="main_page_message">
          Here are your remaining mandatory courses and suggested complementary
          courses that can be filtered by tags. You can select the desired
          courses and apply them.
        </div>
        <Tabs
          defaultTab={this.state.currentTab}
          onChange={tabId => {
            this.setState({ currentTab: tabId });
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
            <MandatoryPanel sid={this.props.studentId} />
          </TabPanel>
          <TabPanel tabId="Complementary Courses">
            <ComplementaryPanel sid={this.props.studentId} />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default WithHeaderBar(CourseSuggestion);
