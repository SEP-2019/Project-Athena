import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import './TagList.css';
import TagCheckBox from '../TagCheckBox/TagCheckBox';

class TagList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: props.tags.slice(),
    };
  }

  componentWillMount = () => {
    this.selectedCheckboxes = this.props.checkedTags;
  };

  handleChange(index, checked, checkbox) {
    const { tags } = this.state;
    tags[index].checked = checked;
    this.setState({ tags });

    if (this.selectedCheckboxes.has(checkbox)) {
      this.selectedCheckboxes.delete(checkbox);
      console.log(checkbox, 'is unselected');
    } else {
      this.selectedCheckboxes.add(checkbox);
      console.log(checkbox, 'is selected');
    }
    this.props.updateTagsCheckedState(tags);
  }

  uncheckAll = uncheckAllEvent => {
    uncheckAllEvent.preventDefault();
    const { tags } = this.state;
    tags.forEach(interest => (interest.checked = false));
    this.setState({ tags });
    let isCleared = false;
    for (const checkbox of this.selectedCheckboxes) {
      this.selectedCheckboxes.delete(checkbox);
      console.log(checkbox, 'is Cleared');
      isCleared = true;
      this.props.updateTagsCheckedState(tags);
    }
    if (isCleared) {
      this.props.enqueueSnackbar('Your selections have been cleared', {
        variant: 'info',
        action: <Button size="small">{'Dismiss'}</Button>,
        autoHideDuration: 1500,
      });
    }
    isCleared = false;
  };

  onClearAll = e => {
    this.props.clearSelection(e);
    this.uncheckAll(e);
  };

  render() {
    return (
      <form className="interest_selection">
        <h4>My Interests</h4>
        {this.props.errorMessage(
          <div>
            <div className="interest-list">
              {this.props.tags.map((interest, index) => (
                <TagCheckBox
                  key={index}
                  index={index}
                  name={interest.name}
                  checked={
                    this.selectedCheckboxes.has(interest.name) ? true : false
                  }
                  handleChange={e =>
                    this.handleChange(index, e.target.checked, e.target.name)
                  }
                />
              ))}
            </div>
            <div className="btn_container">
              {/* TODO: Add an Apply button and Post request to store info */}
              <button className="btn" onClick={this.onClearAll}>
                CLEAR ALL
              </button>
            </div>
          </div>,
          this.props.error
        )}
      </form>
    );
  }
}

TagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.Object).isRequired,
};

export default TagList;
