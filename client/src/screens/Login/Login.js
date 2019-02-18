import React, { Component } from "react";
import "./Login.css"
import Section from "../../components/Section";

class Login extends Component {
	state = {
		text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
	}
	render() {
		return (
			<Section flexDirection="column" justifyContent="space-between" style={{ height: "100vh" }}>
				<Section className="header">
					<Section className="title">Project Athena</Section>
				</Section>
				<Section className="content" justifyContent="space-around" flexDirection="row" alignItems="center">
					<Section className="description">
						{this.state.text}
					</Section>
					<Section className="form">

					</Section>
				</Section>
				<Section className="footer" />
			</Section>
		);
	}
}

export default Login;