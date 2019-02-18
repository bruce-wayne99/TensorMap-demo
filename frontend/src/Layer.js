import React from 'react';
import Button from './Button.js';
import * as utils from './utils.js';

class Layer extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			neurons: props.neurons,
			id: props.value
		}
	}

	componentDidUpdate() {
		utils.drawNeuronsPerLayer(this.props.pid, this.state.id);
		if(this.state.id >= 1) {
			utils.drawLinkBetweenLayers(this.props.pid, this.state.id-1, this.state.id);
		}
		if(this.state.id <= 3) {
			utils.drawLinkBetweenLayers(this.props.pid, this.state.id, this.state.id + 1);
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

export default Layer;