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
import { createMigrate } from "redux-persist";

const rootReducer = combineReducers({
  inventoryId: inventoryIdReducer,
  analytic: analyticReducer,
  // add other reducers here
});

// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["inventoryId", "analytic"], // specify which parts of the state to persist
// };
// const migrations = {
//   1: (state) => {
//     // Add default foodRange if missing
//     return {
//       ...state,
//       analytic: {
//         ...state.analytic,
//         foodRange: state.analytic?.foodRange ?? [
//           {
//             startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
//             endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
//             key: "selection",
//           },
//         ],
//       },
//     };
//   },
// };

const persistConfig = {
  key: "root",
  storage,
  // version: 1,           // ✅ bump this when state shape changes
  // migrate: createMigrate(migrations, { debug: false }),
  whitelist: ["inventoryId", "analytic"],
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
