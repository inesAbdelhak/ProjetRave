// store/reducers.js
import { combineReducers } from 'redux';

const exampleReducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  example: exampleReducer,
});

export default rootReducer;
