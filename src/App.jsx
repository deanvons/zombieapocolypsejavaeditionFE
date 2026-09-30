import { Provider } from 'react-redux';
import AuthStack from './router/authStack';
import { store } from './redux/store/store.js';

function App() {

  return (
    <Provider store={store}>
      <AuthStack/>
    </Provider>

  )
}
export default App
