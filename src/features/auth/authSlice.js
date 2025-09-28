import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem("role") || null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state,action)=> {
            state.token = action.payload
            localStorage.setItem('token', action.payload)
            localStorage.setItem("role", action.payload.role)
        },
        clearToken: (state)=> {
            state.token=null
            state.role=null
            localStorage.removeItem('token')
            localStorage.removeItem("role")

        }
    }

})

export const {setToken, clearToken}= authSlice.actions

export const selectToken = (state) => state.auth.token
export const selectRole = (state)=> state.auth.role
export default authSlice.reducer