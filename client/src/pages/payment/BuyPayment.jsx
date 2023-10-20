import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { cartClearWhenBuy } from '../../redux/Book/bookSlice'

export default function BuyPayment() {
    const cartItems = useSelector((state) => state.book.cartItems)
    const currentUser = useSelector((state) => state.user.currentUser)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [phone, setPhone] = useState(currentUser.phoneNumber)
    const [address, setAddress] = useState(currentUser.address)
    const [errorFill, setErrorFill] = useState(false)

    const [timeRemaining, setTimeRemaining] = useState(600)
    const [timeExpert, setTimeExpert] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prevTime) => prevTime - 1)
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    useEffect(() => {
        if (timeRemaining === 0) {
            setTimeExpert(true)
        }
    }, [timeRemaining])

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = timeInSeconds % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    const handlePhoneChange = (e) => {
        setPhone(e.target.value)
    }

    const handleAddressChange = (e) => {
        setAddress(e.target.value)
    }

    const handlePayment = () => {
        if (!phone || !address) {
            setErrorFill("Please fill in all the required information.")
        } else {
            setIsLoading(true)

            const paymentData = {
                username: currentUser.username,
                email: currentUser.email,
                phone: phone,
                address: address,
                cartItems: cartItems.map(item => ({
                    bookId: item._id,
                    name: item.name,
                    quantity: item.cartQuantity
                })),
                totalPrice: totalPrice
            }

            fetch('/api/buy/buyPayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            })
                .then(response => {
                    if (response.ok) {
                        dispatch(cartClearWhenBuy())

                        setTimeout(() => {
                            setIsLoading(false)
                            setShowSuccess('Payment successful')
                        }, 3000)
                    } else {
                        setShowError('Payment failed. Please try again.')
                    }
                })
                .catch(error => {
                    console.error(error)
                    setIsLoading(false)
                    setErrorFill('Please fill in all requirements')
                })
        }
    }

    const closeCard = () => {
        setShowError(false)
        setErrorFill(false)
    }

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.cartQuantity * (item.buyPrice - item.discountPrice),
        0
    )

    return (
        <div className="flex justify-between">
            <div className="w-1/2 p-4">
                <h2 className="text-2xl font-bold mb-4">User Information</h2>
                <div className="mb-4">
                    <label className="block mb-2">Name</label>
                    <input
                        type="text"
                        value={currentUser.username}
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input
                        type="email"
                        value={currentUser.email}
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Address</label>
                    <textarea
                        value={address}
                        onChange={handleAddressChange}
                        className="border border-gray-300 rounded p-2 w-full"
                    ></textarea>
                </div>
            </div>
            <div className="w-1/2 p-4 ml-20">
                <h2 className="text-2xl font-bold mb-4">Product Information</h2>
                {cartItems.map((item) => (
                    <div key={item._id} className="flex mb-4">
                        <img
                            src={item.imageUrls[0]}
                            alt={item.name}
                            className="w-20 h-20 mr-4"
                        />
                        <div>
                            <h3 className="text-lg font-bold">{item.name}</h3>
                            <p>Quantity: {item.cartQuantity}</p>
                            <p>Total Price: {item.discountPrice
                                ? (item.cartQuantity * (item.buyPrice - item.discountPrice)).toLocaleString("vi-VN")
                                : (item.cartQuantity * item.buyPrice).toLocaleString("vi-VN")} VNĐ
                            </p>
                        </div>
                    </div>
                ))}
                <p className="text-xl font-bold mt-4">
                    Total Price: {totalPrice.toLocaleString("vi-VN")} VNĐ
                </p>

                {timeRemaining > 0 && (
                    <div className="text-2xl font-semibold mt-5 mb-3">
                        Time for you to pay: {formatTime(timeRemaining)}
                    </div>
                )}
                {timeExpert && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                            <p className="text-red-500">Time has expired. You will be redirected to the home page and please try again.</p>
                            <button
                                onClick={() => navigate('/')}
                                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                            >
                                Home
                            </button>
                        </div>
                    </div>
                )}
                <button
                    onClick={handlePayment}
                    className="bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                    disabled={isLoading} // Disable the button while loading
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <span className="mr-2">Processing...</span>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        'Pay Now'
                    )}
                </button>
            </div>

            {errorFill && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                        <p className='text-red-500'>{errorFill}</p>
                        <button onClick={closeCard} className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">Close</button>
                    </div>
                </div>
            )}

            {showError && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                        <p className="text-red-500">{showError}</p>
                        <button
                            onClick={closeCard}
                            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                        <p className="text-green-500">{showSuccess}</p>
                        <button
                            onClick={() => {
                                setShowSuccess(false);
                                navigate('/thank-you');
                            }}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}
