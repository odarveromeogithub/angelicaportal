import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './app/core/state/store'
import { AuthProvider } from './app/core/context/AuthContext'
import './index.css'
import Root from './app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <Root />
        </AuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
