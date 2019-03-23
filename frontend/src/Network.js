import React from 'react';
import Button from './Button.js';
import Layer from './Layer.js';
import Params from './Params.js';
import * as utils from './utils.js';

class Network extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			layers: props.layers,
			id: props.id
		}
	}

	componentDidUpdate() {
		utils.drawSVG(this.state.id);
		utils.drawNeurons(this.state.id, this.state.layers);
		utils.drawLinks(this.state.id, this.state.layers);
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

	renderParams(title, values, tag) {
		return <Params title={title} values={values} pid={this.state.id} tag={tag}/>
	}

	sendNetwork() {
		utils.sendNetwork(this.state.id);
	}

	render() {
		return (
			<table class="table" id={'t' + this.state.id}>
				<tr><td class="params-col">
				<div class="jumbotron">
    				<h4>Network Parameters</h4>
					{this.renderParams("Learning rate", [0.03, 0.01, 0.02], "lr")}
					{this.renderParams("Activation", ["tanh", "linear", "relu"], "afunc")}
					{this.renderParams("Regularization", ["None", "l1", "l2"], "rfunc")}
					{this.renderParams("Regularization rate", [0.003, 0.001, 0.02], "rr")}
					{this.renderParams("Problem type", ["Classification"], "ptype")}
					<button class="btn btn-primary" onClick={() => this.sendNetwork()}>Submit</button>
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

export default Network;