import React, { Component } from 'react';
import './InterestCheckBoxList.css';

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

  uncheckAll = uncheckAllEvent => {
    uncheckAllEvent.preventDefault();
    const { interests } = this.state;
    interests.forEach(interest => (interest.checked = false));
    this.setState({ interests });
    for (const checkbox of this.selectedCheckboxes) {
      this.selectedCheckboxes.delete(checkbox);
      console.log(checkbox, 'is Cleared');
    }
  };

  handleFormSubmit = formSubmitEvent => {
    formSubmitEvent.preventDefault();

    for (const checkbox of this.selectedCheckboxes) {
      console.log(checkbox, 'is Applied.');
    }
  };

  createCheckbox = (interest, index) => (
    <div className="checkbox_area" key={index}>
      <input
        id={interest.name}
        type="checkbox"
        name={interest.name}
        checked={interest.checked}
        onChange={e =>
          this.handleChange(index, e.target.checked, e.target.name)
        }
      />
      <label for={interest.name} className="checkbox_label">
        {interest.name}
      </label>
      <label for={interest.name} className="custom_checkbox" />
    </div>
  );

  render() {
    return (
      <form className="interest_selection" onSubmit={this.handleFormSubmit}>
        <h4>My Interests</h4>
        <div className="interest-list">
          {this.props.interests.map(this.createCheckbox)}
        </div>
        <div className="btn_container">
          <button className="btn" type="submit">
            APPLY
          </button>
          <button className="btn" onClick={this.uncheckAll}>
            CANCEL
          </button>
        </div>
      </form>
    );
  }
}

export default InterestCheckBoxList;
