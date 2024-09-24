import { createReducer, on } from '@ngrx/store';
import { currentUserUpdate } from './products.actions';

export interface AuthState {
  currentUser: string,
}

const intitialState: AuthState = {
  currentUser: '',
};

export const authReducer = createReducer(
  intitialState,
  on(currentUserUpdate, (state: AuthState, { currentUser }) => ({
    ...state,
    currentUser
  })));
