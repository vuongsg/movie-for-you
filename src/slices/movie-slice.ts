import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../models/Movie";
import { BriefMovie } from "../models/Search";

export interface MovieState {
    briefMovies: BriefMovie[],
    currentMovie: Movie | null,
    selectedIndex: number,
    keyword: string,    //text in search box
    currentPage: number
    totalItems: number
}

const initialState: MovieState = {
    briefMovies: [],
    currentMovie: null,
    selectedIndex: -1,
    keyword: '',
    currentPage: 0,
    totalItems: 0
}

const slice = createSlice({
    name: 'movie',
    initialState: initialState,
    reducers: {
        setBriefMovies: (state: MovieState, action: PayloadAction<[BriefMovie[], string, number, number]>) => {
            return {
                ...state,
                briefMovies: action.payload[0],
                keyword: action.payload[1],
                currentPage: action.payload[2],
                totalItems: action.payload[3]
            }
        },
        setCurrentMovie: (state: MovieState, action: PayloadAction<[number, Movie]>) => {
            return {
                ...state,
                selectedIndex: action.payload[0],
                currentMovie: action.payload[1]
            }
        }
    }
});

export const { setBriefMovies, setCurrentMovie } = slice.actions;
export default slice.reducer;