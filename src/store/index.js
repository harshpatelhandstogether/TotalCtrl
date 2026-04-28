import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import inventoryIdReducer from "../slices/InventorySlice.js";
import storage from "redux-persist/lib/storage";
import analyticReducer from "../slices/AnalyticSlice.js"; 

const rootReducer = combineReducers({
  inventoryId: inventoryIdReducer,
  analytic: analyticReducer,
  // add other reducers here
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["inventoryId", "analytic"], // specify which parts of the state to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
