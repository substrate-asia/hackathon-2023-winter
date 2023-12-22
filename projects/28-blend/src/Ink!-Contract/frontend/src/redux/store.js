import { configureStore } from "@reduxjs/toolkit"
import imageReducer from "./slices/imageSlice"
import { useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        imageReducer
    }
})


export const useAppSelector = useSelector;