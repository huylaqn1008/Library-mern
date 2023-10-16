import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import { FaShare } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Contact from './../../components/Contact'
import { setBookDetails, setRentalDetails } from '../../redux/Book/bookSlice'

SwiperCore.use([Navigation, Autoplay])

export default function Book() {
    SwiperCore.use([Navigation])

    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const currentUser = useSelector((state) => state.user.currentUser)

    const [book, setBook] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const [quantity, setQuantity] = useState(1)
    const [totalPrice, setTotalPrice] = useState(0)
    const [showBuyPrice, setShowBuyPrice] = useState(false)
    const [paymentBuyConfirmed, setPaymentBuyConfirmed] = useState(false)

    const [rentStartDate, setRentStartDate] = useState(new Date())
    const [rentEndDate, setRentEndDate] = useState(new Date())
    const [showRentPrice, setShowRentPrice] = useState(false)
    const [rentalDurationError, setRentalDurationError] = useState(false)
    const [paymentRentConfirmed, setPaymentRentConfirmed] = useState(false)
    const [rentalPrice, setRentalPrice] = useState(0)
    const [errorDayToday, setErrorDayToday] = useState(false)
    const [errorDayRentLimit, setErrorDayRentLimit] = useState(false)

    const [copied, setCopied] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const [contact, setContact] = useState(false)

    const rentalDuration = Math.ceil((rentEndDate - rentStartDate) / (1000 * 60 * 60 * 24))

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/book/get/${params.bookId}`)

                const data = await res.json()
                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                    return
                }

                setBook(data)
                setLoading(false)
                setError(false)
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchBook()
    }, [params.bookId])

    const handleRentClick = () => {
        setShowRentPrice(true)
    }

    const handleRentStartDateChange = (e) => {
        const startDate = new Date(e.target.value)

        const selectedDate = new Date(e.target.value)
        const today = new Date()

        if (selectedDate < today) {
            setErrorDayToday("The rental start date cannot be a past date. Please select today or a future date.")
            setPaymentRentConfirmed(false)
            return
        } else {
            setErrorDayToday(false)
        }

        const maxAllowedDate = new Date()
        maxAllowedDate.setDate(today.getDate() + 7)

        if (selectedDate < today || selectedDate > maxAllowedDate) {
            setErrorDayRentLimit("The rental start date should be within 7 days from today.")
            setPaymentRentConfirmed(false)
            return
        } else {
            setErrorDayRentLimit(false)
        }

        setRentStartDate(startDate)
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 5)
        setRentEndDate(endDate)
    }

    const handleRentEndDateChange = (e) => {
        const endDate = new Date(e.target.value)
        setRentEndDate(endDate)
    }

    const handleRentConfirm = () => {
        const rentalDuration = Math.ceil((rentEndDate - rentStartDate) / (1000 * 60 * 60 * 24))

        if (rentalDuration < 5) {
            setRentalDurationError(true)
            setPaymentRentConfirmed(false)
            return
        } else {
            setRentalDurationError(false)
            setPaymentRentConfirmed(true)
        }

        const totalPrice = book.rentPrice * rentalDuration
        setRentalPrice(totalPrice)

        dispatch(setRentalDetails({
            startDate: rentStartDate,
            endDate: rentEndDate,
            totalPrice: totalPrice
        }))

        dispatch(setBookDetails({
            bookTitle: book.name,
            authorName: book.author,
            category: book.category,
            images: book.imageUrls
        }))
    }

    const handlePaymentRent = () => {
        setPaymentRentConfirmed(false)
        navigate('/payment-rent')
    }

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value)
        if (newQuantity > 0 && newQuantity <= 10) {
            setQuantity(newQuantity)
        }
    }

    const handleConfirmBuy = () => {
        if (book.offer == true) {
            const totalPrice = (book.buyPrice - book.discountPrice) * quantity
            setTotalPrice(totalPrice)
            setPaymentBuyConfirmed(true)
        } else {
            const totalPrice = book.buyPrice * quantity
            setTotalPrice(totalPrice)
            setPaymentBuyConfirmed(true)
        }

    }

    const handleBuyClick = () => {
        setShowBuyPrice(true)
    }

    const handlePaymentBuy = () => {
        setPaymentBuyConfirmed(false)
        navigate('/payment-buy')
    }

    const handleShareClick = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
    }

    const toggleShowMore = () => {
        setShowMore(!showMore)
    }

    const closeErrorCard = () => {
        setShowBuyPrice(false)
        setShowRentPrice(false)
    }

    return (
        <main className='mx-auto'>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && (
                <p className='text-center my-7 text-2xl'>Something went wrong!!!</p>
            )}
            {book && !loading && !error && (
                <div className='flex md:justify-center items-center'>
                    <div className='md:flex-row md:min-h-screen'>
                        <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                            <div className='flex flex-col md:flex-row'>
                                <div className='w-1/2'>
                                    <Swiper navigation loop autoplay={{ delay: 5000 }}>
                                        {book.imageUrls.map((url) => (
                                            <SwiperSlide key={url}>
                                                <div className='h-[600px] flex justify-center items-center'>
                                                    <img
                                                        src={url}
                                                        alt='listing image'
                                                        className='max-h-full max-w-full'
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <button className='text-blue-500' onClick={handleShareClick}>
                                        <FaShare />
                                    </button>
                                    {copied && (
                                        <p className='text-green-500'>
                                            URL copied to clipboard!
                                        </p>
                                    )}
                                </div>
                                <div className='flex md:justify-center items-center'>
                                    <div className='flex flex-col gap-4 ml-10'>
                                        <div className='flex flex-col gap-6'>
                                            <div className='flex flex-col gap-2'>
                                                <p className='text-4xl font-semibold'>{book.name}</p>
                                                {book.sell ? (
                                                    <div className='flex flex-col'>
                                                        {book.discountPrice && book.offer ? (
                                                            <div>
                                                                <div className='flex gap-4 items-center relative'>
                                                                    <p className='text-red-500 font-semibold italic text-2xl line-through'>
                                                                        {book.buyPrice.toLocaleString('vi-VN')} VNĐ
                                                                    </p>
                                                                    <p className='text-gray-500 text-xl italic'>
                                                                        {((book.discountPrice / book.buyPrice) * 100).toFixed(0)}% off
                                                                    </p>
                                                                </div>
                                                                {book.rent && !showRentPrice ? (
                                                                    <p className='text-green-500 font-semibold italic text-2xl'>
                                                                        {(
                                                                            book.buyPrice - book.discountPrice
                                                                        ).toLocaleString('vi-VN')} VNĐ (Có cho thuê)
                                                                    </p>
                                                                ) : (
                                                                    <p className='text-green-500 font-semibold italic text-2xl'>
                                                                        {(
                                                                            book.buyPrice - book.discountPrice
                                                                        ).toLocaleString('vi-VN')} VNĐ (Không cho thuê)
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className='text-red-500 font-semibold italic text-2xl'>
                                                                {book.buyPrice.toLocaleString('vi-VN')} VNĐ (Không cho thuê)
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className='text-red-500 font-semibold italic text-2xl'>Chỉ cho thuê</p>
                                                )}
                                            </div>
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex gap-1'>
                                                    <p className='italic font-semibold'>Category:</p>
                                                    <p>{book.category}</p>
                                                </div>
                                                <div className='flex gap-1'>
                                                    <p className='italic font-semibold'>Author:</p>
                                                    <p>{book.author}</p>
                                                </div>
                                                <div className='flex flex-wrap gap-1'>
                                                    <p className='italic font-semibold'>Description:</p>
                                                    <p className={showMore ? 'text-justify' : 'text-justify line-clamp-3'}>
                                                        {book.description}
                                                    </p>
                                                    <button onClick={toggleShowMore} className='text-blue-500'>
                                                        {showMore ? 'Hide' : 'Show More'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            {book.sell && (
                                                <div>
                                                    <button
                                                        className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                                                        style={{ width: '100%' }}
                                                        onClick={handleBuyClick}
                                                    >
                                                        Buy
                                                    </button>
                                                </div>
                                            )}
                                            {showBuyPrice && (
                                                <div className='fixed inset-0 flex items-center justify-center z-50'>
                                                    <div className='fixed inset-0 bg-black opacity-50'></div>
                                                    <div className='w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10'>
                                                        <div className='flex flex-col'>
                                                            <label htmlFor='quantity' className='text-2xl italic font-bold mb-2'>
                                                                Quantity:
                                                            </label>
                                                            <input
                                                                onChange={handleQuantityChange}
                                                                type='number'
                                                                id='quantity'
                                                                min='1'
                                                                max='10'
                                                                value={quantity}
                                                                style={{ border: '1px solid black', borderRadius: '10px', textAlign: 'center' }}
                                                            />
                                                            {!paymentBuyConfirmed ? (
                                                                <button
                                                                    className='mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700'
                                                                    onClick={handleConfirmBuy}
                                                                >
                                                                    Confirm buy
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className='mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700'
                                                                    onClick={handlePaymentBuy}
                                                                >
                                                                    Payment
                                                                </button>
                                                            )}
                                                            <button
                                                                className='mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600'
                                                                onClick={closeErrorCard}
                                                            >
                                                                Close
                                                            </button>
                                                            {totalPrice > 0 && (
                                                                <p className='text-lg mt-5 font-semibold'>
                                                                    Total Price: {totalPrice.toLocaleString('vi-VN')} VNĐ
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {book.rent && !showRentPrice && (
                                                <button
                                                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                                                    style={{ width: '100%' }}
                                                    onClick={handleRentClick}
                                                >
                                                    Rent
                                                </button>
                                            )}
                                            {book.rent && showRentPrice && (
                                                <div className='flex'>
                                                    <div className='fixed inset-0 flex items-center justify-center z-50'>
                                                        <div className='fixed inset-0 bg-black opacity-50'></div>
                                                        <div className='w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10'>
                                                            <div className='flex flex-col'>
                                                                <p className='text-lg font-semibold'>
                                                                    Rental Price: {book.rentPrice.toLocaleString('vi-VN')} VNĐ (VNĐ/per/day)
                                                                </p>
                                                                <div className='flex flex-col gap-4'>
                                                                    <label htmlFor='startDate'>Start Date:</label>
                                                                    <input
                                                                        type='date'
                                                                        id='startDate'
                                                                        value={rentStartDate.toISOString().split('T')[0]}
                                                                        onChange={handleRentStartDateChange}
                                                                    />
                                                                    <label htmlFor='endDate'>End Date:</label>
                                                                    <input
                                                                        type='date'
                                                                        id='endDate'
                                                                        value={rentEndDate.toISOString().split('T')[0]}
                                                                        onChange={handleRentEndDateChange}
                                                                    />
                                                                </div>
                                                                {!paymentRentConfirmed ? (
                                                                    <button
                                                                        className='mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700'
                                                                        onClick={handleRentConfirm}
                                                                    >
                                                                        Confirm Rental
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className='mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700'
                                                                        onClick={handlePaymentRent}
                                                                    >
                                                                        Payment
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className='mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600'
                                                                    onClick={closeErrorCard}
                                                                >
                                                                    Close
                                                                </button>

                                                                <div className='mt-5'>
                                                                    {rentalPrice > 0 && (
                                                                        <div>
                                                                            <p className='text-lg font-semibold'>
                                                                                Total Price: {rentalPrice.toLocaleString('vi-VN')} VNĐ
                                                                            </p>
                                                                            <p className='text-lg'>
                                                                                Want to rent this book for {rentalDuration} days?
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {rentalDurationError && (
                                                                        <p className='text-red-500 text-lg font-semibold'>
                                                                            The rental duration should be at least 5 days.
                                                                        </p>
                                                                    )}

                                                                    {errorDayToday && (
                                                                        <p className='text-red-500 text-lg font-semibold'>
                                                                            {errorDayToday}
                                                                        </p>
                                                                    )}

                                                                    {errorDayRentLimit && (
                                                                        <p className='text-red-500 text-lg font-semibold'>
                                                                            {errorDayRentLimit}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {currentUser && book.userRef !== currentUser._id && !contact && (
                            <button
                                onClick={() => setContact(true)}
                                className='bg-yellow-500 text-black p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                                style={{ width: '100%' }}
                            >
                                Contact
                            </button>
                        )}
                        {contact && <Contact book={book} />}
                    </div>
                </div>
            )}
        </main>
    )
}