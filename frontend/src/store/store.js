import { configureStore } from '@reduxjs/toolkit';
import { urlReducer } from './urlSlice.js';

export const store = configureStore({
  reducer: {
    url: urlReducer,
  },
});

