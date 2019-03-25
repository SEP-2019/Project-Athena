import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core/styles';

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

export { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails };
