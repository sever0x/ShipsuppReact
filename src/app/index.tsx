import {Provider} from 'react-redux';
import {setupStore} from 'misc/redux/configureStore';
import React from 'react';

import App from './containers/App';
import rootReducer, {RootState} from './reducers';

const initialState = {} as RootState;
const store = setupStore<RootState>(rootReducer, initialState);

export default function Index() {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}