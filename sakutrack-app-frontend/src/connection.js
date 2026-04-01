import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const connection = axios.create({
  baseURL: '/api',
});

const getValidToken = () => {
  return new Promise((resolve) => {
    const auth = getAuth();
    if (auth.currentUser) {
      auth.currentUser.getIdToken().then(resolve);
    } else {
      // Refresh
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          const token = await user.getIdToken();
          resolve(token);
        } else {
          resolve(null);
        }
      });
    }
  });
};

connection.interceptors.request.use(async (config) => {
  const token = await getValidToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default connection;