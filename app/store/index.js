import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'

const finalCreactStroe = applyMiddleware(thunk)(createStore);
const store = finalCreactStroe(reducer);
let unsubscribe = store.subscribe(() => {
	console.log('store subscribe')
});

export default store;