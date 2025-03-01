import { Provider, useSelector } from 'react-redux';
import { KanbanBoard } from './components/KanbanBoard';
import './index.css';
import { persistor, RootState, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

function App() {

  return (
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
        <KanbanBoard/>
      </PersistGate>
    </Provider>
  )
}

export default App
