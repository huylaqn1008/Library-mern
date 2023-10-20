import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { format, differenceInSeconds } from 'date-fns'
import { useNavigate } from 'react-router-dom'

export default function RentPayment() {
  const navigate = useNavigate()

  const rentalStartDate = useSelector((state) => state.book.rentalStartDate)
  const rentalEndDate = useSelector((state) => state.book.rentalEndDate)
  const rentalTotalPrice = useSelector((state) => state.book.rentalTotalPrice)
  const bookTitle = useSelector((state) => state.book.bookTitle)
  const authorName = useSelector((state) => state.book.authorName)
  const category = useSelector((state) => state.book.category)
  const images = useSelector((state) => state.book.images)

  const currentUser = useSelector((state) => state.user.currentUser)

  const formattedRentalStartDate = format(new Date(rentalStartDate), 'dd/MM/yyyy')
  const formattedRentalEndDate = format(new Date(rentalEndDate), 'dd/MM/yyyy')

  const [paymentStatus, setPaymentStatus] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(600)
  const [timeExpert, setTimeExpert] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1)
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (timeRemaining === 0) {
      setTimeExpert(true)
    }
  }, [timeRemaining])

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/rent/rentpayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: currentUser.username,
          email: currentUser.email,
          bookTitle,
          authorName,
          category,
          rentalStartDate,
          rentalEndDate,
          rentalTotalPrice
        })
      })

      const data = await response.json()

      setPaymentStatus(data.message)

      if (data.message === 'Payment successful') {
        setTimeout(() => {
          setPaymentStatus('')
          navigate('/')
        }, 3000)
      }
    } catch (error) {
      console.error(error)
      setPaymentStatus('Payment failed')
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-semibold text-center my-7">Rent Payment</h1>
      <div className="flex flex-wrap gap-10">
        <div className="flex">
          <img src={images[0]} alt="Book Cover" style={{ height: "510px" }} />
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col bg-pink-200 p-5 gap-3">
            <div className="flex text-lg gap-3">
              <p className="font-semibold">User Name: </p>
              <span>{currentUser.username}</span>
            </div>
            <div className="flex text-lg gap-3">
              <p className="font-semibold">Email: </p>
              <span>{currentUser.email}</span>
            </div>
            <div className="flex text-lg gap-3">
              <p className="font-semibold">Book Title: </p>
              <span>{bookTitle}</span>
            </div>
            <div className="flex text-lg gap-3">
              <p className="font-semibold">Author Name: </p>
              <span>{authorName}</span>
            </div>
            <div className="flex text-lg gap-3">
              <p className="font-semibold">Category: </p>
              <span>{category}</span>
            </div>
            <div className="flex text-lg gap-3">
              <p className="font-semibold">Rental Start Date: </p>
              <span>{formattedRentalStartDate}</span>
            </div>
            <div className="flex text-lg gap-3">
              <p className="font-semibold">Rental End Date: </p>
              <span>{formattedRentalEndDate}</span>
            </div>
            <div className="flex text-lg gap-3">
              <p className="font-semibold">Total Rental Price: </p>
              <span>{rentalTotalPrice && rentalTotalPrice.toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>
          {timeRemaining > 0 && (
            <div className="text-2xl font-semibold">
              Time for you to pay: {formatTime(timeRemaining)}
            </div>
          )}
          {timeExpert && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                <p className="text-red-500">Time has expired. You will be redirected to the home page and please try again.</p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  OK
                </button>
              </div>
            </div>
          )}
          <button
            className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            onClick={handlePayment}
            disabled={paymentStatus === 'Payment successful'}
          >
            {paymentStatus === 'Payment successful' ? 'Payment Successful' : 'Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}
