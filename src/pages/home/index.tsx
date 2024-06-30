import React from 'react';
import {configureStore} from "@reduxjs/toolkit";
import {Provider} from "react-redux";
// import Home from "./containers/Home";
import rootReducer from './reducers';

// const store = configureStore(rootReducer);

function Index(props: any) {
    return (
        <div/>
        // <Provider store={store}>
        //     <Home {...props} />
        // </Provider>
    );
}

export default Index;