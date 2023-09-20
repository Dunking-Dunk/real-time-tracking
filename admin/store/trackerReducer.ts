'use client'
import api from '@/api/axios'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



export const createTracker = createAsyncThunk('tracker/createTracker', async (body: {
    gpsId: string
},thunkAPI) => {
    try {
        const res = await api.post('/gps-tracking', body)
        const data = await res.data;
        return data;
    } catch (err) {
        return thunkAPI.rejectWithValue({error: err})
    }
})


interface trackerState {
    trackers: any[]
    loading: boolean
    error: {message: string} | null
}

const initialState:trackerState= {
    trackers: [],
    loading: false,
    error: null
  }
  

const trackerReducer = createSlice({
    name: 'tracker',
    initialState,
    reducers: {
        setTrackers: (state, action) => {
            state.trackers = action.payload
        },
        changeCoords: (state, action) => {
            const idx = state.trackers.findIndex((track) =>track.id === action.payload.id)
            state.trackers[idx] = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createTracker.pending, (state, action) => { 
            state.loading = true
        })
        builder.addCase(createTracker.fulfilled, (state, action) => { 
            state.trackers.push(action.payload)
            state.loading = false
        })
    }
})
 
export const {setTrackers, changeCoords} = trackerReducer.actions
export default trackerReducer.reducer