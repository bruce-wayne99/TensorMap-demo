import React from 'react';

class Params extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			pid: this.props.pid,
			title: this.props.title,
			values: this.props.values
		};
	}

	renderSelect(options) {
		var options_arr = [];
		for(var i = 0; i < options.length; i++) {
			options_arr.push(<option>{options[i]}</option>)
		}
		return (
			<select class="form-control">
				{options_arr}
			</select>
		);
	}

	render() {
		return (
			<div class="form-group">
      			<label>{this.state.title}</label>
				{this.renderSelect(this.state.values)}
    		</div>
		);
	}
}

export default Params;