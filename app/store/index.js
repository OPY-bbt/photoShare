import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import createLogger from 'redux-logger';

//console.log(process.env.NODE_ENV);
let finalCreactStore = null;
if(process.env.NODE_ENV === 'production') {
	finalCreactStore = applyMiddleware(thunk)(createStore);
	//console.log(finalCreactStore);
}else {
	const logger = createLogger();
	finalCreactStore = applyMiddleware(thunk, logger)(createStore);
}

const store = finalCreactStore(reducer);
let unsubscribe = store.subscribe(() => {
	console.log('store subscribe')
});

export default store;