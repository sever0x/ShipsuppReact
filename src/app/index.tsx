import { Provider } from 'react-redux';
import configureStore from 'misc/redux/configureStore';
import React from 'react';

import App from './containers/App';
import rootReducer, { RootState } from './reducers';

const initialState = {} as RootState;
const store = configureStore<RootState>(rootReducer, initialState);

export default function Index() {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}