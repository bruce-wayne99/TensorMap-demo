const tf = require('@tensorflow/tfjs');

const buildNetwork = (layers, activ_func, regul_func, regul_rate, lr) => {
	
	const model = tf.sequential();

	//Choosing regularizer
	var regularizer = tf.regularizers.l1({
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
	for(var i = 1; i < layers.length; i++) {
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
		units: 2,
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

exports.runNetwork = (req, res) => {
	const layers = [1, 2, 3, 4];
	const activ_func = 'relu';
	const regul_func = 'l1';
	const regul_rate = 0.01;
	const lr = 0.01;
	const model = buildNetwork(layers, activ_func, regul_func, regul_rate, lr);
	// trainModel(req, model);
	// testModel(req, model);
	return res.status(200).json('test-response');
};