import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

export default store = createStore(
    // reducer
    //preloadedState
    //middleware
    reducers,
    {},
    applyMiddleware(thunk)
);