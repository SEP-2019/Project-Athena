import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './InterestCheckBoxList.css';
import SmallCheckbox from '../CheckBoxes/Test/SmallCheckbox';

class InterestCheckBoxList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      interests: props.interests.slice(),
    };
  }

  componentWillMount = () => {
    this.selectedCheckboxes = new Set();
  };

  handleChange(index, checked, checkbox) {
    const { interests } = this.state;
    interests[index].checked = checked;
    this.setState({ interests });

    if (this.selectedCheckboxes.has(checkbox)) {
      this.selectedCheckboxes.delete(checkbox);
      console.log(checkbox, 'is unselected');
    } else {
      this.selectedCheckboxes.add(checkbox);
      console.log(checkbox, 'is selected');
    }
  }

  uncheckAll = variant => uncheckAllEvent => {
    uncheckAllEvent.preventDefault();
    const { interests } = this.state;
    interests.forEach(interest => (interest.checked = false));
    this.setState({ interests });
    let isCleared = false;
    for (const checkbox of this.selectedCheckboxes) {
      this.selectedCheckboxes.delete(checkbox);
      console.log(checkbox, 'is Cleared');
      isCleared = true;
    }
    if (isCleared) {
      this.props.enqueueSnackbar('Your selections have been cleared', {
        variant,
      });
    }
    isCleared = false;
  };

  handleFormSubmit = variant => formSubmitEvent => {
    formSubmitEvent.preventDefault();

    for (const checkbox of this.selectedCheckboxes) {
      console.log(checkbox, 'is Applied.');
      this.props.enqueueSnackbar(checkbox + ' selection has been applied.', {
        variant,
      });
    }
  };

  // createCheckbox = (interest, index) => (
  //   <div className="checkbox_area" key={index}>
  //     <input
  //       id={interest.name}
  //       type="checkbox"
  //       name={interest.name}
  //       checked={interest.checked}
  //       onChange={e =>
  //         this.handleChange(index, e.target.checked, e.target.name)
  //       }
  //     />
  //     <label for={interest.name} className="checkbox_label">
  //       {interest.name}
  //     </label>
  //     <label for={interest.name} className="custom_checkbox" />
  //   </div>
  // );

  render() {
    return (
      <form
        className="interest_selection"
        onSubmit={this.handleFormSubmit('success')}
      >
        <h4>My Interests</h4>
        <div className="interest-list">
          {/* {this.props.interests.map(this.createCheckbox)} */}
          {this.props.interests.map((interest, index) => (
            <SmallCheckbox
              key={index}
              index={index}
              name={interest.name}
              checked={interest.checked}
              handleChange={e =>
                this.handleChange(index, e.target.checked, e.target.name)
              }
            />
          ))}
        </div>
        <div className="btn_container">
          <button className="btn" onClick={this.uncheckAll('info')}>
            CANCEL
          </button>
          <button className="btn" type="submit">
            APPLY
          </button>
        </div>
      </form>
    );
  }
}

InterestCheckBoxList.propTypes = {
  interests: PropTypes.arrayOf(PropTypes.Object).isRequired,
};

export default InterestCheckBoxList;
