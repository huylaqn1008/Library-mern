import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'

const History = () => {
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
      editable: true,
    },
    {
      field: 'authorName',
      headerName: <strong>Author Name</strong>,
      width: 200,
      editable: true,
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
      editable: true,
    },
    {
      field: 'rentalStatus',
      headerName: <strong>Rental Status</strong>,
      width: 145,
      editable: true,
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

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: '60%' }}>
        <h1 className='text-3xl font-semibold text-center my-7'>Rental Payment History</h1>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pagination
            pageSize={5}
            disableSelectionOnClick
          />
        </Box>
      </div>
    </div>
  )
}

export default History
