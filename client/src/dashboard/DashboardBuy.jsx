import React, { useEffect, useState } from 'react'

export default function DashboardBuy() {
    const [recentOrders, setRecentOrders] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage] = useState(5)

    const [selectedOrder, setSelectedOrder] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const recentOrdersResponse = await fetch('/api/buy/newbuypayment')
                const recentOrdersData = await recentOrdersResponse.json()
                setRecentOrders(recentOrdersData.buyPayments)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const currentRows = recentOrders.slice(indexOfFirstRow, indexOfLastRow)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    const handleDetailClick = (order) => {
        setSelectedOrder(order)
    }

    return (
        <div className='px-3 mx-auto'>
            <h1 className="text-4xl mt-10 font-bold mb-4 flex justify-center">Reciept List</h1>
            <table className='table caption-top bg-white shadow-lg border-r-4'>
                <thead>
                    <tr>
                        <th className='text-[22px]' scope='col'>#</th>
                        <th className='text-[22px]' scope='col'>Username</th>
                        <th className='text-[22px]' scope='col'>Email</th>
                        <th className='text-[22px]' scope='col'>Books</th>
                        <th className='text-[22px]' scope='col'>Total Price</th>
                        <th className='text-[22px]' scope='col'>Purchase Date</th>
                        <th className='text-[22px]' scope='col'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((order, index) => (
                        <tr key={order._id}>
                            <th scope='row' className='text-[15px]'>{index + 1}</th>
                            <td className='text-[15px]'>{order.username}</td>
                            <td className='text-[15px]'>{order.email}</td>
                            <td className='text-[15px]'>
                                {order.cartItems.map((item) => (
                                    <p key={item.bookId}>{item.name} x {item.quantity}</p>
                                ))}
                            </td>
                            <td className='text-[15px]'>{order.totalPrice.toLocaleString()} VNĐ</td>
                            <td className='text-[15px]'>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td className='text-slate-500 text-[15px] hover:underline cursor-pointer' onClick={() => handleDetailClick(order)}>
                                Detail
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(recentOrders.length / rowsPerPage) }, (_, index) => (
                    <button
                        key={index}
                        className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {selectedOrder && (
                <div className='fixed inset-0 flex items-center justify-center z-50'>
                    <div className='absolute inset-0 bg-black opacity-50'></div>
                    <div className='bg-white p-8 rounded-lg z-10'>
                        <h2 className='text-2xl font-bold mb-4'>Order Details</h2>
                        <p>Username: {selectedOrder.username}</p>
                        <p>Email: {selectedOrder.email}</p>
                        <p>Number Phone: {selectedOrder.phone}</p>
                        <p>Address: {selectedOrder.address}</p>
                        <p>Books:</p>
                        <ul>
                            {selectedOrder.cartItems.map((item) => {
                                const totalPrice = item.quantity * item.price
                                const formattedTotalPrice = isNaN(totalPrice) ? "N/A" : totalPrice.toLocaleString()

                                return (
                                    <li key={item.bookId} className='px-4 p-2 italic'>
                                        <p>
                                            + {item.name} x {item.quantity} x {item.price.toLocaleString()} VNĐ = {formattedTotalPrice} VNĐ
                                        </p>
                                    </li>
                                )
                            })}
                        </ul>

                        <p>Total Price: {selectedOrder.totalPrice.toLocaleString()} VNĐ</p>
                        <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}</p>
                        <button
                            className='bg-blue-500 text-white px-4 py-2 rounded mt-4'
                            onClick={() => setSelectedOrder(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
