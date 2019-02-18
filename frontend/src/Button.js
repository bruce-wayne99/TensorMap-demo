import React from 'react';

class Button extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			type: this.props.type,
			value: this.props.value
		};
	}

	render() {
		return (
			<button type="button" class="btn btn-success" onClick={() => this.props.onClick()}> {this.props.value} </button>
		);
	}
}

export default Button;