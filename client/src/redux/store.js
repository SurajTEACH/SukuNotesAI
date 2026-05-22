//  client/src/redux/store.js
import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";

export default configureStore({
    reducer:{
       user:userSlice
    },
})