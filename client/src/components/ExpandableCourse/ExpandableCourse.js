import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '../MuiStyle/commonStyle';

function ExpandableCourse(props) {
  return (
    <div className={props.index}>
      <ExpansionPanel onChange={props.handleChange}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={props.course_code}>
            {props.course_code}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>{props.description || 'N/A'}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

export default ExpandableCourse;
