const tf = require('@tensorflow/tfjs');
const irisTraining = require('../datasets/iris_training.json');
const irisTesting = require('../datasets/iris_testing.json');

// Mapping the training data 130 samples
const trainingData = tf.tensor2d(irisTraining.map(item=> [
    item.sepal_length, item.sepal_width, item.petal_length, item.petal_width
]), [130,4]);

const outputData = tf.tensor2d(irisTraining.map(item => [
    item.species === 'setosa' ? 1 : 0,
    item.species === 'virginica' ? 1 : 0,
    item.species === 'versicolor' ? 1 : 0
]), [130,3]);

// Mapping the testing data 14 samples
const testingData = tf.tensor2d(irisTesting.map(item=> [
    item.sepal_length, item.sepal_width, item.petal_length, item.petal_width
]), [14,4]);

const outTestData = tf.tensor2d(irisTesting.map(item => [
    item.species === 'setosa' ? 1 : 0,
    item.species === 'virginica' ? 1 : 0,
    item.species === 'versicolor' ? 1 : 0
]), [14,3]);

const buildNetwork = (layers, activ_func, regul_func, regul_rate, lr) => {
	
	const model = tf.sequential();

	//Choosing regularizer function
	let regularizer = tf.regularizers.l1({
		l1: regul_rate
	});
	if(regul_func == 'l2') {
		regularizer = tf.regularizers.l2({
			l2: regul_rate
		});
	}
	else if(regul_func == null) {
		regularizer = null;
	}

	//First layer
	model.add(tf.layers.dense({
		inputShape: 4,
		activation: activ_func,
		units: layers[0],
		kernelRegularizer: regularizer
	}));

	//Adding middle layers
	for(let i = 1; i < layers.length; i++) {
		model.add(tf.layers.dense({
			inputShape: layers[i-1],
			activation: activ_func,
			units: layers[i],
			kernelRegularizer: regularizer
		}));
	}

	//Final layer
	model.add(tf.layers.dense({
		inputShape: layers[layers.length - 1],
		activation: 'softmax',
		units: 3,
		kernelRegularizer: regularizer
	}));

	model.summary();

	// Compiling model
	model.compile({
		loss: 'categoricalCrossentropy',
		optimizer: tf.train.adam(lr)
	});
	return model;
};

async function trainModel(trainingData, outputData, model) {
	console.log('......Loss History.......');
	for(let i = 0; i < 40; i++){
		let res = await model.fit(trainingData, outputData, {epochs: 3});
		console.log(`Iteration ${i}: ${res.history.loss[0]}`);
	}
};

function testModel(testingData, model) {
	console.log('....Testing Output....');
	model.predict(testingData).print();
	outTestData.print();
};

async function runNetwork(req, res) {
	const layers = [10];
	const activ_func = 'sigmoid';
	const regul_func = 'l1';
	const regul_rate = 0.01;
	const lr = 0.01;
	const model = buildNetwork(layers, activ_func, regul_func, regul_rate, lr);
	await trainModel(trainingData, outputData, model);
	await testModel(testingData, model);
	return res.status(200).json('Model training completed');
};

exports.runNetwork = runNetwork;