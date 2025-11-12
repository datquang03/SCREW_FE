// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice"
import studioReducer from "../features/studio/studioSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    studio: studioReducer
  },

});

export default store; 