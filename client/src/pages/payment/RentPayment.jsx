import React from 'react'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'

export default function RentPayment() {
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

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-semibold text-center my-7">Rent Payment</h1>
      <div className="flex flex-row gap-10">
        <div className="sm:w-[300px]">
          <img src={images[0]} alt="Book Cover" />
        </div>
        <div className='flex flex-col gap-10'>
          <div className="flex flex-col bg-pink-200 p-5 gap-3">
            <div className='flex text-lg gap-3'>
              <p className="font-semibold">User Name: </p>
              <span>{currentUser.username}</span></div>
            <div className='flex text-lg gap-3'>
              <p className="font-semibold">Email: </p>
              <span>{currentUser.email}</span></div>
            <div className='flex text-lg gap-3'>
              <p className="font-semibold">Book Title: </p>
              <span>{bookTitle}</span></div>
            <div className='flex text-lg gap-3'>
              <p className="font-semibold">Author Name: </p>
              <span>{authorName}</span></div>
            <div className='flex text-lg gap-3'>
              <p className="font-semibold">Category: </p>
              <span>{category}</span></div>
            <div className='flex text-lg gap-3'>
              <p className="font-semibold">Rental Start Date: </p>
              <span>{formattedRentalStartDate}</span></div>
            <div className='flex text-lg gap-3'>
              <p className="font-semibold">Rental End Date: </p>
              <span>{formattedRentalEndDate}</span></div>
            <div className='flex text-lg gap-3'>
              <p className="font-semibold">Total Rental Price: </p>
              <span>{rentalTotalPrice && rentalTotalPrice.toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>
          <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            Payment
          </button>
        </div>
      </div>
    </div>
  )
}
