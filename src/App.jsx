import { Provider } from 'react-redux';
import AuthStack from './router/authStack'

function App() {

  return (
    <Provider store={store}>
      <AuthStack />
    </Provider>
    
  )
}
export default App
