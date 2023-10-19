import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

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
    images: [],
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
    cartTotalQuantity: 0,
    cartTotalAmount: 0
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
            state.quantity = action.payload.quantity
        },
        setAddCart: (state, action) => {
            if (Array.isArray(state.cartItems)) {
                const existingBook = state.cartItems.find((item) => item._id === action.payload._id)

                if (existingBook) {
                    existingBook.cartQuantity += 1
                    toast.info(`Increased ${action.payload.name} product quantity`, {
                        position: "bottom-left",
                    })
                } else {
                    const newBook = { ...action.payload, cartQuantity: 1 }
                    state.cartItems.push(newBook)
                    toast.success(`Added a new ${action.payload.name} product to cart`, {
                        position: "bottom-left",
                    })
                }
            } else {
                state.cartItems = []
                const newBook = { ...action.payload, cartQuantity: 1 }
                state.cartItems.push(newBook)
                toast.success(`Added a new ${action.payload.name} product to cart`, {
                    position: "bottom-left",
                })
            }

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
        },
        removeFromCart(state, action) {
            const itemId = action.payload
            const removedItem = state.cartItems.find((item) => item._id === itemId)
            state.cartItems = state.cartItems.filter((item) => item._id !== itemId)
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems))

            if (removedItem) {
                toast.error(`${removedItem.name} removed from cart`, {
                    position: 'bottom-left'
                })
            }
        },
        increaseCart(state, action) {
            const itemId = action.payload
            const decreaseItem = state.cartItems.find((item) => item._id === itemId)
            const itemIndex = state.cartItems.findIndex((item) => item._id === itemId)

            if (state.cartItems[itemIndex].cartQuantity >= 1) {
                state.cartItems[itemIndex].cartQuantity += 1

                toast.info(`Increased ${decreaseItem.name} cart quantity`, {
                    position: 'bottom-left'
                })
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
        },
        decreaseCart(state, action) {
            const itemId = action.payload
            const decreaseItem = state.cartItems.find((item) => item._id === itemId)
            const itemIndex = state.cartItems.findIndex((item) => item._id === itemId)

            if (state.cartItems[itemIndex].cartQuantity > 1) {
                state.cartItems[itemIndex].cartQuantity -= 1

                toast.info(`Decreased ${decreaseItem.name} cart quantity`, {
                    position: 'bottom-left'
                })
            } else if (state.cartItems[itemIndex].cartQuantity === 1) {
                const itemId = action.payload
                const removedItem = state.cartItems.find((item) => item._id === itemId)
                state.cartItems = state.cartItems.filter((item) => item._id !== itemId)

                if (removedItem) {
                    toast.error(`${removedItem.name} removed from cart`, {
                        position: 'bottom-left'
                    })
                }
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
        },
        cartClear(state) {
            state.cartItems = []
            toast.success('Cart cleared', {
                position: 'bottom-left'
            })

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
        },
        totalQuantity: (state) => {
            state.cartTotalQuantity = state.cartItems.reduce((total, item) => total + item.cartQuantity, 0);
        }
    },
})

export const {
    setRentalDetails,
    setBookDetails,
    setAddCart,
    removeFromCart,
    increaseCart,
    decreaseCart,
    cartClear,
    totalQuantity
} = bookSlice.actions

export default bookSlice.reducer
