import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookItem from '../components/BookItem'

export default function Search() {
    const navigate = useNavigate()

    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sell: false,
        rent: false,
        offer: false,
        sort: 'created_at',
        order: 'desc'
    })
    const [loading, setLoading] = useState(false)
    const [books, setBooks] = useState([])
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const sellFromUrl = urlParams.get('sell')
        const rentFromUrl = urlParams.get('rent')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')

        if (searchTermFromUrl || sellFromUrl || rentFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                sell: sellFromUrl === 'true' ? true : false,
                rent: rentFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: offerFromUrl || 'desc'
            })
        }

        const fetchBooks = async () => {
            setLoading(true)
            setShowMore(false)

            const searchQuery = urlParams.toString()
            const res = await fetch(`/api/book/get?${searchQuery}`)

            const data = await res.json()

            if (data.length > 8) {
                setShowMore(true)
            } else {
                setShowMore(false)
            }

            setBooks(data)
            setLoading(false)
        }

        fetchBooks()
    }, [location.search])

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value
            })
        } else if (e.target.id === 'sell' || e.target.id === 'rent' || e.target.id === 'offer') {
            setSidebarData({
                ...sidebarData,
                [e.target.id]: e.target.checked
            })
        } else if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at'

            const order = e.target.value.split('_')[1] || 'desc'

            setSidebarData({
                ...sidebarData,
                sort,
                order
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const urlParams = new URLSearchParams()

        urlParams.set('searchTerm', sidebarData.searchTerm)
        urlParams.set('sell', sidebarData.sell)
        urlParams.set('rent', sidebarData.rent)
        urlParams.set('offer', sidebarData.offer)
        urlParams.set('sort', sidebarData.sort)
        urlParams.set('order', sidebarData.order)

        const searchQuery = urlParams.toString()

        navigate(`/search?${searchQuery}`)
    }

    const onShowMoreClick = async () => {
        const numberOfBooks = books.length
        const startIndex = numberOfBooks
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('startIndex', startIndex)

        const searchQuery = urlParams.toString()
        const res = await fetch(`/api/book/get?${searchQuery}`)
        const data = await res.json()

        if (data.length < 9) {
            setShowMore(false)
        }

        setBooks([...books, ...data])
    }

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                        <input
                            type='text'
                            id='searchTerm'
                            placeholder='Search...'
                            className='border rounded-lg p-3 w-full'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex gap-6 flex-wrap items-center'>
                        <label className='font-semibold'>Type:</label>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sell' className='w-5' onChange={handleChange} checked={sidebarData.sell} />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={sidebarData.rent} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={sidebarData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <select
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                            id='sort_order'
                            className='border rounded-lg p-3'
                        >
                            <option value='buyPrice_desc'>Price high to low</option>
                            <option value='buyPrice_asc'>Price low to low</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                        Search
                    </button>
                </form>
            </div>
            <div className='flex-1'>
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Book results:</h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && books.length === 0 && (
                        <p className='text-xl text-slate-700'>No book found!</p>
                    )}

                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                    )}

                    {!loading && books && books.map((book) => {
                        return <BookItem key={book._id} book={book} />
                    })}

                    {showMore && (
                        <button onClick={onShowMoreClick} className='text-green-700 hover:underline p-7 text-center w-full'>
                            Show more
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
