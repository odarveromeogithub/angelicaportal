import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './app/core/state/store'
import { AuthProvider } from './app/core/context/AuthContext'
import './index.css'
import Root from './app'

const LoadingFallback = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fbff 0%, #ffffff 50%, #eef4ff 100%)' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', height: '40px', width: '40px', alignItems: 'center', justifyContent: 'center', border: '4px solid #bfdbfe', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
      <p style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>Loading...</p>
    </div>
  </div>
);

const root = document.getElementById('root');
if (!root) {
  console.error('Root element not found');
} else {
  createRoot(root).render(
    <Provider store={store}>
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        <AuthProvider>
          <Root />
        </AuthProvider>
      </PersistGate>
    </Provider>,
  );
}
