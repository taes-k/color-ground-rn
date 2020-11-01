import * as React from 'react';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import RootReducer from './store/reducer';

import RootNavigator from './screen/root-navigator/RootNavigator';

const store = createStore(RootReducer);

const App: () => React$Node = () => {
  return (
    <Provider store={store}>
      <RootNavigator/>
    </Provider>
  );
}

export default App;