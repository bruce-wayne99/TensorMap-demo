import React from 'react';
import ReactDOM from 'react-dom';

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
			<button> {this.state.type} {this.state.value} </button>
		);
	}
}

class Neuron extends React.Component {

	render () {
		return (
			<div> Neuron {this.props.value} </div>
		);
	}
}

class Layer extends React.Component {

	renderNeuron(i) {
		return <Neuron value={i}/>
	}

	renderButton(type, value) {
		return <Button type={type} value={value}/>
	}

	render() {
		return (
			<div class="layer">
				<div class="layer-title"> Layer {this.props.value} </div>
				<div class="layer-buttons">
					{this.renderButton('neuron', '+')}
					{this.renderButton('neuron', '-')}
				</div>
				<div class="neuron-rows">
					{this.renderNeuron(0)}
					{this.renderNeuron(1)}
					{this.renderNeuron(2)}
				</div> 
			</div>
		);
	}
}

class Network extends React.Component {

	renderButton(type, value) {
		return <Button type={type} value={value}/>
	}

	renderLayer(i) {
		return <Layer value={i}/>
	}

	render() {
		return (
			<div class="network">
				<div class="network-title">Network Component!</div>
				<div class="network-buttons">
					{this.renderButton('layer', '+')}
					{this.renderButton('layer', '-')}
				</div>
				<div class="layer-rows">
					{this.renderLayer(0)}
					{this.renderLayer(1)}
					{this.renderLayer(2)}
				</div>
			</div>
		);
	}
}


ReactDOM.render(
	<Network/>,
	document.getElementById('root')
);