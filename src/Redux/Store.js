import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { opportunities, investors, orders, myHoldings } from './Actions';

//all individual collections like opportunities ...etc
export const reducers = combineReducers({
    opportunities,
    investors,
    orders,
    myHoldings
});

// store provider
export function configureStore() {

    const store = createStore(reducers, (applyMiddleware(thunk)));
    return store;
}

export const store = configureStore();