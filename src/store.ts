import { configureStore } from "@reduxjs/toolkit";
import movieSlice from "./slices/movie-slice";

const store = configureStore({
    reducer: {
        Movie: movieSlice
    }
});

export type RootType = ReturnType<typeof store.getState>;
export default store;