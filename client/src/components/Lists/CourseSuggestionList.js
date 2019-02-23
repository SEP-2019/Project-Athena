import React, { Component } from 'react';

class CourseSuggestionList extends Component {
  state = {};

  createInterestTitle = (interest_list, index) => (
    <div className="interest-list" key={index}>
      <h4>{interest_list.label}</h4>
      {interest_list.map(this.createSuggestionList)}
    </div>
  );

  createSuggestionList = (course_label, index) => (
    <div className="suggestion-course" key={index}>
      {course_label}
    </div>
  );

  render() {
    return (
      <div className="suggestion-selection">
        Henlo World
        {/* Something with LISTOFCOURSES.map(this.createInterestTitle) */}
      </div>
    );
  }
}

export default CourseSuggestionList;
