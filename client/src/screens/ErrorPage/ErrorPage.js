import React, { Component } from 'react';

import WithHeaderBar from '../../hocs/WithHeaderBar';
import './ErrorPage.css';

class ErrorPage extends Component {
  state = {};
  render() {
    const code = this.props.location.state.error_code;
    const message = this.props.location.state.error_message;
    return (
      <div className="error_div">
        <p className="error_message">{message}</p>
        <img
          className="error_cat"
          alt={code + ' Error Page'}
          src={'https://http.cat/' + code}
        />
      </div>
    );
  }
}

export default WithHeaderBar(ErrorPage);
