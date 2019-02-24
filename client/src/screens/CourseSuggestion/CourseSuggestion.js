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
    // for all items in state
    for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);

        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage();

    // add event listener to save state to localStorage
    // when user leaves/refreshes the page
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

    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  saveStateToLocalStorage() {
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  render() {
    return (
      <div>
        <div className="main_page_message">
          Here are your remaining mandatory courses and suggestions for your
          complementary courses. You can add them to your curriculum.{' '}
          {this.state.currentTab}
        </div>
        <Tabs
          defaultTab={this.state.currentTab}
          onChange={tabId => {
            console.log(tabId);
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
