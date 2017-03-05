import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory, hashHistory, Router, Route, IndexRoute} from 'react-router';
import {Provider} from 'react-redux';

import { AppContainer } from 'react-hot-loader';
// AppContainer is a necessary wrapper component for HMR

import App from './components/App';
import Index from './pages/index';
import Login from './pages/login';
import SignUp from './pages/signUp';

import store from './store';

//import "../../node_modules/antd/dist/antd.min.css"

const handleEnter = (nextState, replace) => {
	console.log('there is user longin')

	let login = false;
	if(login) {
		replace({pathname: '/signup'});
	}else {
		replace({pathname: '/login'});
	}
}

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
    	<Provider store={store}>
	      <div>
	      	<Router history = {browserHistory}>
	      		<Route path = '/' component = {App}>
							<IndexRoute component = {Index} onEnter = {(nextState, replace)=>handleEnter(nextState, replace)} />
							<Route path = 'login' component={Login} />		
							<Route path = 'signup' component={SignUp} />
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