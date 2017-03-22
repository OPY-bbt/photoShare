import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory, hashHistory, Router, Route, IndexRoute} from 'react-router';
import {Provider} from 'react-redux';

import { AppContainer } from 'react-hot-loader';
// AppContainer is a necessary wrapper component for HMR

import App from './components/App';
import Index from './pages/index';
import Login from './pages/login';

import store from './store';

import {socket, showUploadPicMessage} from './actions';

import "../styles/antdStyleReset.css"


const handleEnter = (nextState, replace) => {
	console.log('there is user longin')
	store.getState().getIn(['pageState', 'loginSuccess'])

	let login = store.getState().getIn(['pageState', 'loginSuccess']);
	
	if(login) {
		replace({pathname: '/index'});
	}else {
		replace({pathname: '/login'});
	}
}

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
    	<Provider store={store}>
	      <div>
	      	<Router history = {hashHistory}>
	      		<Route path = '/' component = {App}>
							<IndexRoute component = {Index} onEnter = {(nextState, replace) => handleEnter(nextState, replace)} />
							<Route path = 'login' component={Login} />
							<Route path = 'index' component={Index} />	
	      		</Route>
	      	</Router>
	      </div>
	    </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

render();


// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/App', () => {
    render()
  });
}