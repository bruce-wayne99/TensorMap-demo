import React from 'react';
import ReactDOM from 'react-dom';
import LeaderLine from 'leader-line';
import * as d3 from 'd3';
import $ from "jquery";
import './bootswatch.min.css';
import './index.css';

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

class Layer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			neurons: props.neurons,
			id: props.value
		}
	}

	addNeuron() {
		//increase layer count
		this.setState({neurons: this.state.neurons+1});
		return;
	}

	removeNeuron() {
		//decrease layer count
		if(this.state.neurons > 1) {
			this.setState({neurons: this.state.neurons-1});
		}
		return;
	}

	renderNeuron(i) {
		return (
			<div class="neuron" id={'nr' + this.props.pid + '_' + this.state.id + '_' + i}>
				<canvas></canvas>
			</div> 
		);
	}

	renderNeurons() {
		var neurons = []
		for(var i = 0; i < this.state.neurons; i++) {
			neurons.push(this.renderNeuron(i));
		}
		return neurons;
	}

	render() {
		return (
			<td>
				<div class="layer" id={'l' + this.props.pid + '_' + this.state.id}>
					<div class="layer-title"> Layer {this.props.value} {this.state.neurons} </div>
					<div class="layer-buttons">
						<Button type={'neuron'} value={'+'} onClick={() => this.addNeuron()}/>
						&nbsp;
						<Button type={'neuron'} value={'-'} onClick={() => this.removeNeuron()}/>
					</div>
					<div class="neuron-column">
						{this.renderNeurons()}
					</div> 
				</div>
			</td>
		);
	}
}

class Network extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			layers: props.layers,
			id: props.id
		}
	}

	componentDidUpdate() {
		// for(var i = 1; i < this.state.layers; i++) {
		// 	drawLinksFromLayerToLayer(this.state.id, i-1, i);
		// }
	}

	addLayer() {
		//increase layer count
		this.setState({layers: this.state.layers+1});
		return;
	}

	removeLayer() {
		//decrease layer count
		if(this.state.layers > 1) {
			this.setState({layers: this.state.layers-1});
		}
		return;
	}

	renderLayer(i, neurons) {
		return <Layer value={i} neurons={neurons} pid={this.state.id}/>;
	}

	renderLayers() {
		var layers = []
		for(var i = 0; i < this.state.layers; i++) {
			layers.push(this.renderLayer(i, 2));
		}
		return layers;
	}

	render() {
		return (
			<div class="network" id={'n' + this.state.id}>
				<div class="network-title">Network Component!</div>
				<div class="network-buttons">
					<Button type={'layer'} value={'+'} onClick={() => this.addLayer()}/>
					&nbsp;
					<Button type={'layer'} value={'-'} onClick={() => this.removeLayer()}/>
				</div>
				<table class="layer-rows table">
					<tr>
						{this.renderLayers()}
					</tr>
				</table>
				<div class="network-links" id={'link' + this.state.id}>
				</div>
			</div>
		);
	}
}


ReactDOM.render(
	<Network layers={1} id={0}/>,
	document.getElementById('root')
);