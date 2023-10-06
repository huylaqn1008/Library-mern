import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import { FaShare } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import Contact from '../components/Contact'

SwiperCore.use([Navigation, Autoplay])

export default function Book() {
    SwiperCore.use([Navigation])

    const params = useParams()

    const currentUser = useSelector((state) => state.user.currentUser)

    const [book, setBook] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [showRentPrice, setShowRentPrice] = useState(false)
    const [rentalDuration, setRentalDuration] = useState(1)
    const [showTotalPrice, setShowTotalPrice] = useState(false)
    const [copied, setCopied] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const [contact, setContact] = useState(false)

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

    const handleRentalDurationChange = (e) => {
        setRentalDuration(parseInt(e.target.value))
    }

    const handleRentConfirm = () => {
        setShowTotalPrice(true)
    }

    const calculateTotalPrice = () => {
        return book.rentPrice * rentalDuration
    }

    const handleShareClick = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
    }

    const toggleShowMore = () => {
        setShowMore(!showMore)
    }

    const closeErrorCard = () => {
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
                    <div className='flex flex-col md:flex-row md:min-h-screen'>
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
                                                <button
                                                    className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                                                    style={{ width: '100%' }}
                                                >
                                                    Buy
                                                </button>
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
                                                                <input
                                                                    type='number'
                                                                    min='1'
                                                                    max='30'
                                                                    value={rentalDuration}
                                                                    onChange={handleRentalDurationChange}
                                                                />
                                                                <div className='flex justify-between gap-5'>
                                                                    <button
                                                                        className='mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600'
                                                                        onClick={handleRentConfirm}
                                                                        style={{ width: '50%' }}
                                                                    >
                                                                        Confirm Rental
                                                                    </button>
                                                                    <button
                                                                        onClick={closeErrorCard}
                                                                        className='mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-green-600'
                                                                        style={{ width: '50%' }}
                                                                    >
                                                                        Close
                                                                    </button>
                                                                </div>
                                                                {showTotalPrice && (
                                                                    <p className='text-lg font-semibold'>
                                                                        Total Price: {calculateTotalPrice().toLocaleString('vi-VN')} VNĐ
                                                                    </p>
                                                                )}
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
