import React, { useEffect, useState } from 'react'
import Switch from 'react-switch'

export default function DashboardRent() {
    const [rentPayments, setRentPayments] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    useEffect(() => {
        fetchRentPayments()
    }, [currentPage])

    const fetchRentPayments = async () => {
        try {
            const startIndex = (currentPage - 1) * itemsPerPage
            const endIndex = startIndex + itemsPerPage

            const response = await fetch('/api/rent/rentpayment')
            const data = await response.json()

            const currentPageData = data.rentPayments.slice(startIndex, endIndex)
            setRentPayments(currentPageData)
        } catch (error) {
            console.error('Error fetching rent payments:', error)
        }
    }

    const updateRentalStatus = async (rentPaymentId) => {
        const confirmed = window.confirm('Has this tenant returned the books?')
        if (!confirmed) {
            return
        }

        try {
            const response = await fetch(`/api/rent/rentpayment/${rentPaymentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rentalStatus: 'Pending' })
            })

            if (response.ok) {
                fetchRentPayments()
            } else {
                console.error('Failed to update rental status')
            }
        } catch (error) {
            console.error('Error updating rental status:', error)
        }
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }

    return (
        <div className="px-5 flex flex-col justify-center">
            <h1 className="text-4xl mt-10 font-bold mb-4 flex justify-center">Rental Invoices</h1>
            <table className="w-full border-collapse bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border">Username</th>
                        <th className="py-2 px-4 border">Email</th>
                        <th className="py-2 px-4 border">Book Title</th>
                        <th className="py-2 px-4 border">Rental Start Date</th>
                        <th className="py-2 px-4 border">Rental End Date</th>
                        <th className="py-2 px-4 border">Rental Total Price</th>
                        <th className="py-2 px-4 border">Rental Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rentPayments.map((rentPayment) => (
                        <tr key={rentPayment._id}>
                            <td className="py-2 px-4 border">{rentPayment.userName}</td>
                            <td className="py-2 px-4 border">{rentPayment.email}</td>
                            <td className="py-2 px-4 border">{rentPayment.bookTitle}</td>
                            <td className="py-2 px-4 border">{new Date(rentPayment.rentalStartDate).toLocaleDateString('vi-VN')}</td>
                            <td className="py-2 px-4 border">{new Date(rentPayment.rentalEndDate).toLocaleDateString('vi-VN')}</td>
                            <td className="py-2 px-4 border">{rentPayment.rentalTotalPrice.toLocaleString()}</td>
                            <td className="py-2 px-4 border flex items-center justify-between">
                                <Switch
                                    onChange={() => updateRentalStatus(rentPayment._id)}
                                    checked={rentPayment.rentalStatus === 'Active'}
                                />
                                {rentPayment.rentalStatus === 'Active' ? 'Renting' && (new Date(rentPayment.rentalEndDate) < new Date() ? 'Out of date' : 'Reting') : 'Returned'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination flex justify-center items-center mt-6">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span
                    className="flex items-center justify-center mx-3"
                    style={{
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        backgroundColor: '#689870'
                    }}>{currentPage}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={rentPayments.length < itemsPerPage}
                >
                    Next
                </button>
            </div >
        </div >
    )
}
