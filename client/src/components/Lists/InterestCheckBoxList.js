import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import './InterestCheckBoxList.css';
import SmallCheckbox from '../CheckBoxes/SmallCheckbox';

let isApplied = false;
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
    isApplied = false;
  }

  uncheckAll = uncheckAllEvent => {
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
        variant: 'info',
        action: <Button size="small">{'Dismiss'}</Button>,
        autoHideDuration: 1500,
      });
    }
    isCleared = false;
    isApplied = false;
  };

  handleFormSubmit = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    for (const checkbox of this.selectedCheckboxes) {
      console.log(checkbox, 'is Applied.');
    }
    if (!isApplied && this.selectedCheckboxes.size !== 0) {
      this.props.enqueueSnackbar('Your selections have been applied.', {
        variant: 'success',
        action: <Button size="small">{'dismiss'}</Button>,
        autoHideDuration: 1500,
      });
    }
    isApplied = true;
  };

  render() {
    return (
      <form className="interest_selection" onSubmit={this.handleFormSubmit}>
        <h4>My Interests</h4>
        <div className="interest-list">
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
          <button className="btn" onClick={this.uncheckAll}>
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
