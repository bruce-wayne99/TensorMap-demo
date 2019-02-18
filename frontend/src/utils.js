import * as d3 from 'd3';
import $ from 'jquery';

export function drawSVG(network_id) {
	var divEle = $('#n' + network_id)[0].getBoundingClientRect();
	d3.select('#svg' + network_id).selectAll("*").remove();
	var svgEle = d3.select('#svg' + network_id);
	svgEle.style("left", 0 + "px");
	svgEle.style("top", 0 + "px");
	svgEle.style("width", 100 + "%");
	svgEle.style("height", 100 + "%");
}	

export function drawNeurons(network_id, layers) {
	for(var i = 0; i < layers; i++) {
		drawNeuronsPerLayer(network_id, i);
	}
}

export function drawNeuronsPerLayer(network_id, layer_id) {
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

export function drawLinks(network_id, layers) {
	for(var i = 1; i < layers; i++) {
		drawLinkBetweenLayers(network_id, i - 1, i);
	}
}

export function drawLinkBetweenLayers(network_id, layer1_id, layer2_id) {
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

export function getCurvePath(ele1, ele2) {
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