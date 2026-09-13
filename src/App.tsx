import React from 'react';
import { AppProvider } from './core/context/AppContext';
import { RootNavigator } from './navigation/RootNavigator';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
};

export default App;
