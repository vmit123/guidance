import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store from '../store';
import { AuthProvider } from '../services/auth';
import { useEffect } from 'react';

// Import i18n (side-effect: initializes i18next)
import '../i18n';

function MyApp({ Component, pageProps }) {
  // Load Bootstrap JS on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return (
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  );
}

export default MyApp;