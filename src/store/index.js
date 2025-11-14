// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice"
import studioReducer from "../features/studio/studioSlice"
import equipmentReducer from "../features/equipment/equipmentSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    studio: studioReducer,
    equipment:equipmentReducer
  },

});

export default store; 