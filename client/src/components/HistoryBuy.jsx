import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'

export default function HistoryBuy() {
    const [buyPayments, setBuyPayments] = useState([])
    const { currentUser } = useSelector((state) => state.user)

    useEffect(() => {
        const fetchBuyPayments = async () => {
            try {
                const response = await fetch('/api/buy/buypayment')
                const data = await response.json()

                const filteredBuyPayments = data.buyPayments.filter(
                    (payment) => payment.email === currentUser.email
                )

                setBuyPayments(filteredBuyPayments)
            } catch (error) {
                console.error(error)
            }
        }

        fetchBuyPayments()
    }, [])

    const columns = [
        {
            field: 'bookTitle',
            headerName: <strong>Book Title</strong>,
            width: 400,
        },
        {
            field: 'quantity',
            headerName: <strong>Quantity</strong>,
            width: 160,
        },
        {
            field: 'price',
            headerName: <strong>Price</strong>,
            width: 160,
            valueFormatter: (params) => {
                const priceValue = params.value.toLocaleString('vi-VN')
                return priceValue
            },
        },
        {
            field: 'totalPrice',
            headerName: <strong>Total Price</strong>,
            width: 160,
            valueFormatter: (params) => {
                const priceValue = params.value.toLocaleString('vi-VN')
                return priceValue
            },
        },
    ]

    const rows = []
    const bookTitles = new Set()

    buyPayments.forEach((buyPayment) => {
        buyPayment.cartItems.forEach((item) => {
            const bookTitle = item.name
            if (!bookTitles.has(bookTitle)) {
                bookTitles.add(bookTitle)

                rows.push({
                    id: bookTitle,
                    bookTitle: bookTitle,
                    quantity: item.quantity,
                    price: item.price,
                    totalPrice: item.quantity * item.price,
                })
            } else {
                const existingRow = rows.find((row) => row.bookTitle === bookTitle)
                existingRow.quantity += item.quantity
                existingRow.totalPrice += item.quantity * item.price
            }
        })
    })

    const totalPrice = rows.reduce((total, row) => total + row.totalPrice, 0).toLocaleString('vi-VN')

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
