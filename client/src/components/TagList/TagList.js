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
    this.selectedTags = this.props.checkedTags;
  };

  handleChange = (index, checked, checkbox) => {
    const { tags } = this.state;
    tags[index].checked = checked;
    this.setState({ tags });

    if (this.selectedTags.has(checkbox)) {
      this.selectedTags.delete(checkbox);
      console.log(checkbox, 'is unselected');
    } else {
      this.selectedTags.add(checkbox);
      console.log(checkbox, 'is selected');
    }
    this.props.updateTagsCheckedState(tags);
  };

  uncheckAll = () => {
    const { tags } = this.state;
    tags.forEach(interest => (interest.checked = false));
    this.setState({ tags });
    let isCleared = false;
    for (const checkbox of this.selectedTags) {
      this.selectedTags.delete(checkbox);
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
    e.preventDefault();
    this.uncheckAll();
  };

  onApply = e => {
    e.preventDefault();
    if (this.props.applySelection()) {
      this.props.enqueueSnackbar('Your selections have been applied', {
        variant: 'success',
        action: <Button size="small">{'Dismiss'}</Button>,
        autoHideDuration: 1500,
      });
    }
  };

  render() {
    return (
      <form className="interest_selection">
        <h4>Filters:</h4>
        <div>
          <div className="interest-list">
            {this.props.tags.map((interest, index) => (
              <TagCheckBox
                key={index}
                index={index}
                name={interest.name}
                checked={this.selectedTags.has(interest.name) ? true : false}
                handleChange={e =>
                  this.handleChange(index, e.target.checked, e.target.name)
                }
              />
            ))}
          </div>
          <div className="btn_container">
            <button className="btn" onClick={this.onClearAll}>
              CLEAR ALL
            </button>
            <button className="btn" onClick={this.onApply}>
              APPLY
            </button>
          </div>
        </div>
      </form>
    );
  }
}

TagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.Object).isRequired,
};

export default TagList;
