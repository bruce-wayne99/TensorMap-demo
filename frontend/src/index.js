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
		if(this.state.id >= 1) {
			drawLinkBetweenLayers(this.props.pid, this.state.id-1, this.state.id);
		}
		if(this.state.id <= 3) {
			drawLinkBetweenLayers(this.props.pid, this.state.id, this.state.id + 1);
		}
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
					<div class="layer-title"> Layer {this.props.value + 1} </div>
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

	renderParams(title, values) {
		return <Params title={title} values={values} pid={this.state.id}/>
	}

	render() {
		return (
			<table class="table" id={'t' + this.state.id}>
				<tr><td class="params-col">
				<div class="jumbotron">
    				<h4>Network Parameters</h4>
					{this.renderParams("Learning rate", [0.03, 0.01, 0.02])}
					{this.renderParams("Activation", ["Tanh", "Linear", "Relu"])}
					{this.renderParams("Regularization", ["None", "L1", "L2"])}
					{this.renderParams("Regularization rate", [0.003, 0.001, 0.02])}
					{this.renderParams("Problem type", ["Regression", "Classification"])}
				</div>
				</td><td class="network-col">
				<div class="network" id={'n' + this.state.id}>
					<h5>Neural Network</h5>
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
				</td></tr>
			</table>
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
		let cx = (neuron.getBoundingClientRect().left - divEle.left);
		let cy = (neuron.getBoundingClientRect().top - divEle.top);
		group.append("rect").attr("x", cx).attr("y", cy).attr("width", 35).attr("height", 35);
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
	var divEle = $('#n' + network_id)[0].getBoundingClientRect();
	var neurons1 = svgEle.select('#g' + network_id + '_' + layer1_id).selectAll('rect').nodes();
	var neurons2 = svgEle.select('#g' + network_id + '_' + layer2_id).selectAll('rect').nodes();
	var group = svgEle.append("g").attr("id", 'g' + network_id + '_' + layer1_id + '_' + layer2_id);
	group.attr("stroke", "orange");
	console.log(neurons1, neurons2);
	for(var i = 0; i < neurons1.length; i++) {
		for(var j = 0; j < neurons2.length; j++) {
			group.append("path").attr("stroke-dasharray", "5,5").attr("stroke-width","3").attr("fill","none")
				 .attr("d", getCurvePath(neurons1[i], neurons2[j]));
		}
	}
}

function getCurvePath(ele1, ele2) {
	let width = 35;
	let cx1 = parseFloat(ele1.getAttribute("x"));
	let cy1 = parseFloat(ele1.getAttribute("y"));
	let cx2 = parseFloat(ele2.getAttribute("x"));
	let cy2 = parseFloat(ele2.getAttribute("y"));
	cx1 += width; cy1 += width/2; cy2 += width/2;

	let px1 = cx1, py1 = cy1;
	let px2 = (cx2-cx1)/2, py2 = (cy2-cy1)/2;
	let px3 = (cx2-cx1), py3 = (cy2-cy1);
	return "M " + px1 + " " + py1 + " q " + px2 + " " + py2 + " " + px3 + " " + py3;
}