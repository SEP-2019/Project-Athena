import * as React from 'react';
import HeaderBar from '../../components/HeaderBar';
import Cookies from 'universal-cookie';
import history from '../../history';

export default Component => {
  class WithHeaderBar extends React.PureComponent {
    constructor(props) {
      super(props);
      this.cookies = new Cookies();
      this.state = {
        studentId: this.cookies.get('studentId'),
        email: this.cookies.get('email'),
      };
      if (
        typeof this.state.studentId === 'undefined' ||
        typeof this.state.email === 'undefined'
      )
        history.push('/login');

      console.log(this.state.email);
      console.log(this.state.studentId);
    }

    render() {
      return (
        <>
          <HeaderBar email={this.state.email} />
          <Component studentId={this.state.studentId} {...this.props} />
        </>
      );
    }
  }

  return WithHeaderBar;
};
