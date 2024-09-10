import {Action, configureStore, Reducer, ThunkAction} from '@reduxjs/toolkit';
import {thunk} from "redux-thunk";

export function setupStore<S = any>(
    rootReducer: Reducer<S>,
    initialState?: S
) {
    return configureStore({
        reducer: rootReducer,
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
    });
}

export type AppStore = ReturnType<typeof setupStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
>;