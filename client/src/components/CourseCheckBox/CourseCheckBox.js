import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './CourseCheckBox.css';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '../MuiStyle/commonStyle';

function CourseCheckBox(props) {
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <div htmlFor={props.index} className="course_checkbox">
          <label className="checkbox_label">{props.course_code}</label>
          <input
            id={props.index}
            type="checkbox"
            name={props.course_code}
            checked={props.checked}
            onChange={props.handleChange}
          />
          <label htmlFor={props.index} className="custom_large_checkbox" />
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>{props.description || 'N/A'}</Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default CourseCheckBox;
