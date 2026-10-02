import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user/userSlice";
import survivorReducer from "../slices/survivor/survivorSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        survivor: survivorReducer,
    },
});
