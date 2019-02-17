import * as React from "react"
import HeaderBar from "../../components/HeaderBar"

export default (Component) => {
  class WithHeaderBar extends React.PureComponent {
    render() {
      return (
          <>
            <HeaderBar/>
            <Component {...this.props} />
          </>
      )
    }
  }

  return WithHeaderBar
}