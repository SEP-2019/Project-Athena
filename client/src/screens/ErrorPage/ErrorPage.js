import React, { Component } from 'react';

import WithHeaderBar from '../../hocs/WithHeaderBar';
import './ErrorPage.css';

class ErrorPage extends Component {
  state = {};
  render() {
    const code = this.props.location.state.error_code;
    return (
      <div className="error_div">
        <img className="error_cat" src={'https://http.cat/' + code} />
      </div>
    );
  }
}

export default WithHeaderBar(ErrorPage);
