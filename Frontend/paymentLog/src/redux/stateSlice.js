import { createSlice } from "@reduxjs/toolkit";

export const stateSlice = createSlice({
    name: "state",
    initialState:{
        allPayment: [],
        totalAmount: 0
    },
    reducers:{
        setAllPayment : (state,action)=>{
            state.allPayment = action.payload;
        },
        setTotalAmount : (state,action)=>{
            state.totalAmount = action.payload;
        }
    }
})
export const {setAllPayment, setdate, setTotalAmount } = stateSlice.actions
export default stateSlice.reducer;