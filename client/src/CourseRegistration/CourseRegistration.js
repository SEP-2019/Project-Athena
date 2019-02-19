import React, { Component } from "react";
import CourseRegistrationItem from './CourseRegistrationItem';
import "./CourseRegistration.css";

class CourseRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            searchResults: [],
            semester: "Fall 2017",
            // temp data
            selectedCourses: [
                { 'course_code': 'COMP 202', 'title': 'Foundations of Programming', 'semester': 'Fall 2017' },
                { 'course_code': 'MATH 262', 'title': 'Intermediate Calculus', 'semester': 'Winter 2017' },
                { 'course_code': 'MATH 263', 'title': 'ODEs for Engineers', 'semester': 'Fall 2020' },
                { 'course_code': 'COMP 250', 'title': 'Intro to Computer Science', 'semester': 'Winter 2020' },
            ]
        }
    }

    render() {
        return (
        <div className="course-registration">
            <div className="instruction">Select the courses that you have already taken.</div>
            <div className="content">
                <div className="selection-side">
                    <div className="selection-semester">
                        <div>Choose the semester: </div>
                        <div className="selection-dropdown">Fall 2017</div>
                    </div>
                    <div className="selection-course">
                        <input type="text" className="selection-search"/>
                        <button className="selection-button">Select</button>
                    </div>
                </div>
                <ul className="selected-side">
                    {
                        this.state.selectedCourses.map((el, index) => (
                            <CourseRegistrationItem 
                                key={ index }
                                number={ el.course_code } 
                                title={ el.title }
                                semester={ el.semester }
                            />                            
                        ))
                    }
                </ul>
            </div>
        </div>
        );
    }
}

export default CourseRegistration;