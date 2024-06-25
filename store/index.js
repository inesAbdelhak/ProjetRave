// store/index.js
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
//Importation du stockage par défaut de redux-persist
import rootReducer from './Reducers';

// Configuration de la persistance

const persistConfig = {
  key: 'root', // Clé à laquelle le state sera persisté
  storage,
};

// Création du reducer persisté

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Création du store avec le reducer persisté
export const store = createStore(persistedReducer);
// Création du persistor qui permettra de persister et de réhydrater le store
export const persistor = persistStore(store);
