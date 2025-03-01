import { Provider, useSelector } from 'react-redux';
import { KanbanBoard } from './components/KanbanBoard';
import './index.css';
import { persistor, RootState, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { LoadingScreen } from './components/LoadingScreen';
import { useState } from 'react';

function App() {

  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
       {!isLoaded ? (
          <LoadingScreen onComplete={() => setIsLoaded(true)} />
        ) : (
          <KanbanBoard />
        )}
      </PersistGate>
    </Provider>
  )
}

export default App
