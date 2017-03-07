import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import createLogger from 'redux-logger';
const logger = createLogger();

const finalCreactStroe = applyMiddleware(thunk, logger)(createStore);
const store = finalCreactStroe(reducer);
let unsubscribe = store.subscribe(() => {
	console.log('store subscribe')
});

export default store;