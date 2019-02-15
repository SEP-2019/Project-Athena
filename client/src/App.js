import React, { Component } from "react";
import HeaderBar from "./components/HeaderBar/HeaderBar";

class App extends Component {
  render() {
    return (
      <div className="App">
        <HeaderBar />
        <main style={{ marginTop: "70px" }}>
          <p>Hello World!</p>
        </main>
      </div>
    );
  }
}

export default App;
