import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'

export default function HistoryRent() {
    const [rentPayments, setRentPayments] = useState([])
    const { currentUser } = useSelector((state) => state.user)

    useEffect(() => {
        const fetchRentPayments = async () => {
            try {
                const response = await fetch('/api/rent/rentpayment')
                const data = await response.json()
                const filteredRentPayments = data.rentPayments.filter(payment => payment.email === currentUser.email)
                setRentPayments(filteredRentPayments)
            } catch (error) {
                console.error(error)
            }
        }

        fetchRentPayments()
    }, [])

    const columns = [
        {
            field: 'bookTitle',
            headerName: <strong>Book Title</strong>,
            width: 300,
        },
        {
            field: 'authorName',
            headerName: <strong>Author Name</strong>,
            width: 200
        },
        {
            field: 'rentalStartDate',
            headerName: <strong>Rental Start Date</strong>,
            type: 'date',
            width: 160,
            valueGetter: (params) => {
                const dateValue = new Date(params.value)
                return isNaN(dateValue) ? null : dateValue
            },
            valueFormatter: (params) => {
                const dateValue = new Date(params.value)
                return isNaN(dateValue) ? '' : dateValue.toLocaleDateString()
            }
        },
        {
            field: 'rentalEndDate',
            headerName: <strong>Rental End Date</strong>,
            type: 'date',
            width: 160,
            valueGetter: (params) => {
                const dateValue = new Date(params.value)
                return isNaN(dateValue) ? null : dateValue
            },
            valueFormatter: (params) => {
                const dateValue = new Date(params.value)
                return isNaN(dateValue) ? '' : dateValue.toLocaleDateString()
            }
        },
        {
            field: 'rentalTotalPrice',
            headerName: <strong>Total Price</strong>,
            width: 145,
            valueFormatter: (params) => {
                const priceValue = params.value.toLocaleString('vi-VN')
                return priceValue
            }
        },
        {
            field: 'rentalStatus',
            headerName: <strong>Rental Status</strong>,
            width: 145,
            valueFormatter: (params) => {
                if (params.value === 'Active') {
                    return 'Renting'
                } else if (params.value === 'Pending') {
                    return 'Refunded'
                } else {
                    return params.value
                }
            }
        }
    ]

    const rows = rentPayments.map(rentPayment => ({
        id: rentPayment._id,
        bookTitle: rentPayment.bookTitle,
        authorName: rentPayment.authorName,
        rentalStartDate: rentPayment.rentalStartDate,
        rentalEndDate: rentPayment.rentalEndDate,
        rentalTotalPrice: rentPayment.rentalTotalPrice,
        rentalStatus: rentPayment.rentalStatus,
    }))

    const totalPrice = rentPayments.reduce((total, rentPayment) => total + rentPayment.rentalTotalPrice, 0).toLocaleString('vi-VN')

    return (
        <div style={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
            <div style={{ width: 'auto' }}>
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pagination
                        pageSize={5}
                        disableSelectionOnClick
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <div>Total Price: {totalPrice} VNĐ</div>
                    </Box>
                </Box>
            </div>
        </div>
    )
}
