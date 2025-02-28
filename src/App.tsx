import { Provider, useSelector } from 'react-redux';
import { KanbanBoard } from './components/KanbanBoard';
import './index.css';
import { RootState, store } from './redux/store';

function App() {

  return (
    <Provider store={store}>
      <KanbanBoard/>
    </Provider>
  )
}

export default App
