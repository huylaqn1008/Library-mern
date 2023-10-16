import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    books: null,
    rentalStartDate: null,
    rentalEndDate: null,
    rentalTotalPrice: 0,
    error: null,
    loading: false,
    bookTitle: '',
    authorName: '',
    category: '',
    images: []
}

const bookSlice = createSlice({
    name: "book",
    initialState,
    reducers: {
        setRentalDetails: (state, action) => {
            state.rentalStartDate = action.payload.startDate
            state.rentalEndDate = action.payload.endDate
            state.rentalTotalPrice = action.payload.totalPrice
        },
        setBookDetails: (state, action) => {
            state.bookTitle = action.payload.bookTitle
            state.authorName = action.payload.authorName
            state.category = action.payload.category
            state.images = action.payload.images
        },
    },
})

export const {
    setRentalDetails,
    setBookDetails,
} = bookSlice.actions

export default bookSlice.reducer
