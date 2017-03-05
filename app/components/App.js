import React, { Component } from 'react';
//import styles from './App.css';

class App extends Component{
	render() {
		const { children } = this.props;
		return children;
	}
}

export default App;