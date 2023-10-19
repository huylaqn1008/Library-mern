import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BookItem from './../components/BookItem'
import AssetBanners from '../components/AssetBanners'

export default function Home() {
    const [sellBooks, setSellBooks] = useState([])
    const [rentBooks, setRentBooks] = useState([])
    const [offerBooks, setOfferBooks] = useState([])

    useEffect(() => {
        const fetchRentBooks = async () => {
            try {
                const res = await fetch('/api/book/get?rent=true&limit=5')
                const data = await res.json()

                setRentBooks(data)
                fetchSellBooks()
            } catch (error) {
                console.log(error)
            }
        }

        const fetchSellBooks = async () => {
            try {
                const res = await fetch('/api/book/get?sell=true&limit=5')
                const data = await res.json()

                setSellBooks(data)
                fetchOfferBooks()
            } catch (error) {
                console.log(error)
            }
        }

        const fetchOfferBooks = async () => {
            try {
                const res = await fetch('/api/book/get?sell=true&offer=true&limit=5')
                const data = await res.json()

                setOfferBooks(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchRentBooks()
    }, [])

    return (
        <div>
            <AssetBanners />

            <div className='flex flex-col gap-6 p-15 px-3 max-w-6xl mx-auto mt-4'>
                <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
                    Find books that suit <span className='text-gray-500'>your interests</span>
                    <br />
                    or are necessary for you
                </h1>
                <div className='text-gray-400 text-xs sm:text-xl'>
                    TMA Library will be the best place for you to find good and hard-to-find books in Vietnam.
                    <br />
                    We will serve you as best we can.
                </div>
                <Link to='/search' className='text-xs sm:text-xl text-blue-800 font-bold hover:underline'>
                    Let's get started...
                </Link>
            </div>

            <div className='mx-auto p-3 flex flex-col gap-8'>
                {rentBooks && rentBooks.length > 0 && (
                    <div className=''>
                        <div className='my-3 ml-5'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent books for rent</h2>
                            <Link to='/search?rent=true' className='text-sm text-blue-800 hover:underline'>
                                Show more books for rent...
                            </Link>
                        </div>
                        <div className='flex justify-center flex-wrap gap-4'>
                            {rentBooks.map(book => (
                                <BookItem book={book} key={book._id} />
                            ))}
                        </div>
                    </div>
                )}


                {sellBooks && sellBooks.length > 0 && (
                    <div>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent books for sell</h2>
                            <Link to='/search?sell=true' className='text-sm text-blue-800 hover:underline'>
                                Show more books for sell...
                            </Link>
                        </div>
                        <div className='flex justify-center flex-wrap gap-4'>
                            {sellBooks.map(book => (
                                <BookItem book={book} key={book._id} />
                            ))}
                        </div>
                    </div>
                )}

                {offerBooks && offerBooks.length > 0 && (
                    <div>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent books are on sale</h2>
                            <Link to='/search?sell=true&offer=true' className='text-sm text-blue-800 hover:underline'>
                                Show more books are on sale...
                            </Link>
                        </div>
                        <div className='flex justify-center flex-wrap gap-4'>
                            {offerBooks.map(book => (
                                <BookItem book={book} key={book._id} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
