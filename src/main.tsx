import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { offlineStorage } from './services/offlineStorage';

// Oflayn Service Worker ni ro'yxatdan o'tkazish
offlineStorage.registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

