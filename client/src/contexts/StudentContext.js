import React from 'react';

export const StudentContext = React.createContext();

class StudentProvider extends React.Component {
  
  constructor(props) {
    super(props);
    this.updateId = this.updateId.bind(this);
    this.state = {
      studentId: 123321123,
      update: this.updateId,
    };
  }

  updateId(newId) {
    this.setState({
        studentId : newId,
    });
  }

  render() {
    return (
      <StudentContext.Provider value={this.state}>
        {this.props.children}
      </StudentContext.Provider>
    )
  }
}

const StudentConsumer = StudentContext.Consumer
export { StudentProvider, StudentConsumer }