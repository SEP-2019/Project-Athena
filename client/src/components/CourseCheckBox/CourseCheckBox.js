import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './CourseCheckBox.css';

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0,0,0,.15)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  },
  expanded: {
    margin: 'auto',
  },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0,0,0,.03)',
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
      background: 'rgba(178, 0, 7, 0.3)',
    },
  },
  content: {
    '&$expanded': {
      margin: '1rem 0',
    },
  },
  expanded: {
    marginBottom: -1,
  },
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles({
  root: {
    padding: '24px 24px 24px',
  },
})(MuiExpansionPanelDetails);

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
        <Typography>
          {/* TODO: Backend Team needs to add Description to Courses and then Add props.description */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default CourseCheckBox;
