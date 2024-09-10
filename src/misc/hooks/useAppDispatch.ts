import {useDispatch} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';
import {UnknownAction} from 'redux';
import {RootState} from 'app/reducers';

export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;

export const useAppDispatch = () => useDispatch<AppDispatch>();