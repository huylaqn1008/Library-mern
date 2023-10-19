import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { cartClear, decreaseCart, increaseCart, removeFromCart, totalQuantity } from "../../redux/Book/bookSlice"

const ShoppingCart = () => {
    const cartItems = useSelector((state) => state.book.cartItems)
    const currentUser = useSelector((state) => state.user.currentUser)

    const [errorSignin, setErrorSignin] = useState(false)
    const [emptyCart, setEmptyCart] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(totalQuantity())
    }, [dispatch])

    const handleRemoveFromCart = (itemId) => {
        dispatch(removeFromCart(itemId))
    }

    const handleDecreaseCart = (itemId) => {
        dispatch(decreaseCart(itemId))
    }

    const handleIncreaseCart = (itemId) => {
        dispatch(increaseCart(itemId))
    }

    const handleClearCart = (itemId) => {
        dispatch(cartClear())
    }

    const handleCheckout = () => {
        if (!currentUser) {
            setErrorSignin("Please sign in to proceed with the checkout")
        } else if (cartItems.length === 0) {
            setEmptyCart("Please select products before proceeding to checkout")
        }
        else {
            navigate('/payment-buy')
        }
    }

    const changeSigninPage = () => {
        setErrorSignin(false)
        navigate('/signin')
    }

    const changeHomePage = () => {
        setEmptyCart(false)
        navigate('/')
    }

    return (
        <div>
            {cartItems.length === 0 ? (
                <div className="mt-3 mx-5">
                    <p className="text-xl font-bold">Your cart is empty.</p>
                    <Link
                        to="/"
                        className="p-3 text-gray-400 rounded uppercase disabled:opacity-80 flex items-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-arrow-left"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M15 8a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708.708L2.707 7.5H14.5a.5.5 0 0 1 .5.5z"
                            />
                        </svg>
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Book</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Quantity</th>
                            <th className="px-4 py-2">Total</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item._id}>
                                <td className="flex items-center px-4 py-2">
                                    <img
                                        src={item.imageUrls[0]}
                                        alt={item.name}
                                        className="w-40 h-40 mr-4"
                                    />
                                    <div className="text-slate-700 text-xl flex-wrap">
                                        {item.name}
                                    </div>
                                </td>
                                <td className="text-center">
                                    {item.buyPrice.toLocaleString("vi-VN")} VNĐ
                                </td>
                                <td>
                                    <div className="flex text-center mx-auto" style={{ justifyContent: 'space-evenly', border: '1px solid black', padding: '10px' }}>
                                        <button onClick={() => handleDecreaseCart(item._id)}>-</button>
                                        <span className="mx-2">{item.cartQuantity}</span>
                                        <button onClick={() => handleIncreaseCart(item._id)}>+</button>
                                    </div>
                                </td>
                                <td className="text-center">
                                    {(item.cartQuantity * item.buyPrice).toLocaleString("vi-VN")} VNĐ
                                </td>
                                <td className="text-center">
                                    <button onClick={() => handleRemoveFromCart(item._id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 
                                            0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 
                                            0v6a.5.5 0 0 0 1 0V6Z"
                                            />
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 
                                            1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 
                                            1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"
                                            />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="flex justify-between">
                <div className="flex flex-wrap gap-2 mt-14 ml-10">
                    <button
                        onClick={() => handleClearCart()}
                        className="p-3 text-gray-400 border border-gray-400 rounded uppercase hover:shadow-lg disabled:opacity-80"
                        style={{ height: '40%' }}
                    >
                        Clear cart
                    </button>
                </div>
                <div className="flex flex-col gap-2 mt-14 mr-10">
                    <div className="flex gap-2">
                        <div className="text-xl font-bold">Total Amount:</div>
                        <div className="text-xl font-bold">
                            {cartItems.reduce((total, item) => total + item.cartQuantity * item.buyPrice, 0).toLocaleString("vi-VN")} VNĐ
                        </div>
                    </div>
                    <div className="flex">
                        <button
                            onClick={handleCheckout}
                            className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                            style={{ width: '100%' }}
                        >
                            Check out
                        </button>
                    </div>
                    <div className="flex">
                        <Link
                            to="/"
                            className="p-3 text-gray-400 rounded uppercase disabled:opacity-80 flex items-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-arrow-left"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M15 8a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708.708L2.707 7.5H14.5a.5.5 0 0 1 .5.5z"
                                />
                            </svg>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
            {errorSignin && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                        <p className='text-red-500'>{errorSignin}</p>
                        <button onClick={changeSigninPage} className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-green-600">Sign in</button>
                    </div>
                </div>
            )}

            {emptyCart && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                        <p className='text-red-500'>{emptyCart}</p>
                        <button onClick={changeHomePage} className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-green-600">Home</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShoppingCart
