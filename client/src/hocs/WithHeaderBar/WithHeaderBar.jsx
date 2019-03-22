import * as React from 'react';
import HeaderBar from '../../components/HeaderBar';

export default Component => {
  class WithHeaderBar extends React.PureComponent {
    componentWillReceiveProps(nextProps) {
      console.log(this.props);
      console.log(nextProps);
    }

    render() {
      return (
        <>
          <HeaderBar email={this.props.responseEmail} />
          <Component {...this.props} />
        </>
      );
    }
  }

  return WithHeaderBar;
};
