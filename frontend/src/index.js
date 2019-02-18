import React from 'react';
import ReactDOM from 'react-dom';
import './bootswatch.min.css';
import './index.css';
import Network from './Network.js';

ReactDOM.render(
	<Network layers={1} id={0}/>,
	document.getElementById('root')
);