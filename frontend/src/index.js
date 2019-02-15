import React from 'react';
import ReactDOM from 'react-dom';
import LeaderLine from 'leader-line';
import * as d3 from 'd3';
import './bootswatch.min.css';
import $ from 'jquery';
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

	componentDidUpdate() {
		drawNeuronsPerLayer(this.props.pid, this.state.id);
	}

	addNeuron() {
		//increase layer count
		if(this.state.neurons < 5) {
			this.setState({neurons: this.state.neurons+1});
		}
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
		drawSVG(this.state.id);
		drawNeurons(this.state.id, this.state.layers);
		drawLinks(this.state.id, this.state.layers);
	}

	addLayer() {
		//increase layer count
		if (this.state.layers < 5) {
			this.setState({layers: this.state.layers+1});
		}
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
				<svg id={'svg' + this.state.id}></svg>
			</div>
		);
	}
}


ReactDOM.render(
	<Network layers={1} id={0}/>,
	document.getElementById('root')
);

function drawSVG(network_id) {
	var divEle = $('#n' + network_id)[0].getBoundingClientRect();
	d3.select('#svg' + network_id).selectAll("*").remove();
	var svgEle = d3.select('#svg' + network_id);
	svgEle.style("left", 0 + "px");
	svgEle.style("top", 0 + "px");
	svgEle.style("width", 100 + "%");
	svgEle.style("height", 100 + "%");
}	

function drawNeurons(network_id, layers) {
	for(var i = 0; i < layers; i++) {
		drawNeuronsPerLayer(network_id, i);
	}
}

function drawNeuronsPerLayer(network_id, layer_id) {
	d3.select('#svg' + network_id).selectAll("#g" + network_id + '_' + layer_id).remove();
	var svgEle = d3.select('#svg' + network_id);
	var divEle = $('#n' + network_id)[0].getBoundingClientRect();
	var neurons = d3.select('#l' + network_id + '_' + layer_id).selectAll('canvas').nodes();
	var group = svgEle.append("g").attr("id", 'g' + network_id + '_' + layer_id);
	neurons.forEach(function(neuron) {
		let cx = (neuron.getBoundingClientRect().left - divEle.left)/divEle.width;
		let cy = (neuron.getBoundingClientRect().top - divEle.top)/divEle.height;
		group.append("rect").attr("x", cx*100 + '%').attr("y", cy*100 + '%').attr("width", 35).attr("height", 35);
	});
}

function drawLinks(network_id, layers) {
	for(var i = 1; i < layers; i++) {
		drawLinkBetweenLayers(network_id, i - 1, i);
	}
}

function drawLinkBetweenLayers(network_id, layer1_id, layer2_id) {
	d3.select('#svg' + network_id).selectAll("#g" + network_id + '_' + layer1_id + '_' + layer2_id).remove();
	var svgEle = d3.select('#svg' + network_id);
}