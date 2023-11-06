import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Dashboard() {
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalRentalPrice, setTotalRentalPrice] = useState(0)
    const [recentOrders, setRecentOrders] = useState([])
    const [topRatedBooks, setTopRatedBooks] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await fetch('/api/user/all')
                const users = await userResponse.json()
                setTotalUsers(users.length)

                const bookResponse = await fetch('/api/book/allbook')
                const books = await bookResponse.json()
                setTotalProducts(books.length)

                const totalPriceResponse = await fetch('/api/buy/totalprice')
                const totalPriceData = await totalPriceResponse.json()
                setTotalPrice(totalPriceData.totalPriceSum)

                const rentalPriceResponse = await fetch('/api/rent/rentaltotal')
                const rentalPriceData = await rentalPriceResponse.json()
                setTotalRentalPrice(rentalPriceData.rentalTotalPriceSum)

                const recentOrdersResponse = await fetch('/api/buy/newbuypayment')
                const recentOrdersData = await recentOrdersResponse.json()
                setRecentOrders(recentOrdersData.buyPayments.slice(0, 3))

                try {
                    const topRatedResponse = await fetch('/api/book/top-rating')
                    const topRatedData = await topRatedResponse.json()

                    if (Array.isArray(topRatedData)) {
                        setTopRatedBooks(topRatedData.slice(0, 3))
                    } else {
                        console.error('Invalid top rated data format:', topRatedData)
                    }
                } catch (error) {
                    console.error('Error fetching top rated books:', error)
                }

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const handleChangeClick = (bookId) => {
        navigate(`/book/${bookId}`)
        window.location.reload()
    }

    return (
        <div className='px-3'>
            <div className='container-fluid'>
                <div className='row g-3 my-2'>
                    <Link to='/admin/customers' className='col-md-3 text-[#778899] hover:no-underline'>
                        <div className='p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded hover:scale-90 hover:z-10 transition-all duration-300'>
                            <div>
                                <h3 className='fs-2'>{totalUsers}</h3>
                                <p className='fs-5'>Users</p>
                            </div>
                            <i className='bi bi-people-fill p-3 fs-1'></i>
                        </div>
                    </Link>
                    <Link to='/admin/products' className='col-md-3 text-[#EE7942] hover:no-underline'>
                        <div className='p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded hover:scale-90 hover:z-10 transition-all duration-300'>
                            <div>
                                <h3 className='fs-2'>{totalProducts}</h3>
                                <p className='fs-5'>Products</p>
                            </div>
                            <i className='bi bi-cart-plus p-3 fs-1'></i>
                        </div>
                    </Link>
                    <Link to='/admin/buys' className='col-md-3 text-[#E066FF] hover:no-underline'>
                        <div className='p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded hover:scale-90 hover:z-10 transition-all duration-300'>
                            <div>
                                <h3 className='fs-2'>{totalPrice.toLocaleString()} VNĐ</h3>
                                <p className='fs-5'>Sales</p>
                            </div>
                            <i className='bi bi-credit-card p-3 fs-1'></i>
                        </div>
                    </Link>
                    <div className='col-md-3 text-[#009ACD] hover:no-underline'>
                        <div className='p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded hover:scale-90 hover:z-10 transition-all duration-300'>
                            <div>
                                <h3 className='fs-2'>{totalRentalPrice.toLocaleString()} VNĐ</h3>
                                <p className='fs-5'>Rental</p>
                            </div>
                            <i className='bi bi-cash-coin p-3 fs-1'></i>
                        </div>
                    </div>
                </div>
            </div>
            <table className='table caption-top bg-white shadow-lg border-r-4'>
                <caption className='text-[#00CD00] font-semibold mt-3 fs-4'>Recent Orders</caption>
                <thead>
                    <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Username</th>
                        <th scope='col'>Email</th>
                        <th scope='col'>Books</th>
                        <th scope='col'>Total Price</th>
                        <th scope='col'>Purchase Date</th>
                    </tr>
                </thead>
                <tbody>
                    {recentOrders.map((order, index) => (
                        <tr key={index}>
                            <th scope='row'>{index + 1}</th>
                            <td>{order.username}</td>
                            <td>{order.email}</td>
                            <td>
                                {order.cartItems.map((item) => (
                                    <p key={item.bookId}>{item.name} x {item.quantity}</p>
                                ))}
                            </td>
                            <td>{order.totalPrice.toLocaleString()} VNĐ</td>
                            <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='row g-3 my-2'>
                <div className='text-[#00CD00] font-semibold mt-3 fs-4'>Current Top Rating</div>
                {topRatedBooks.map((book, index) => (
                    <div className='col-md-4    ' key={index}>
                        <div
                            className='p-3 hover:no-underline bg-white shadow-sm cursor-pointer d-flex justify-content-around rounded hover:scale-90 hover:z-10 transition-all duration-300'
                            style={{ height: '200px' }}
                            onClick={() => handleChangeClick(book._id)}
                        >
                            <div>
                                <div className='text-2xl font-semibold text-slate-700 truncate'>Top {index + 1}</div>
                                <div className='fs-2 text-[#ECAB53]'>{book.name}</div>
                                <p className='fs-5 text-black'>Rating: {book.averageRating.toFixed(1)}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 2 20 20"
                                        fill="#ffc107"
                                        className="h-5 w-5 inline-block"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 1l2.928 6.856 6.072.552-4.64 4.024 1.392 6.816-5.752-3.032-5.752 3.032 1.392-6.816-4.64-4.024 6.072-.552z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </p>
                            </div>
                            <img src={book.firstImage} alt={book.name} width='100' height='100' />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
