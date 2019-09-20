import React from 'react';
import Navigation from './Components/Navigation/Navigation';
import user from './Components/Reducers/user.reducer';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
const store = createStore(combineReducers({user}));

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>

        <Navigation/>

      </Provider>

    );
  }
}