import { createStore, applyMiddleware, Action, Reducer, Store } from 'redux';
import { thunk } from 'redux-thunk';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export default function configureStore<S = any, A extends Action = Action>(
    rootReducer: Reducer<S, A>,
    initialState?: S
): Store<S, A> {
    return createStoreWithMiddleware(rootReducer, initialState);
}