import React from 'react';
import { Link } from 'react-router-dom';

export default function BookItem({ book }) {
    return (
        <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px]'>
            <Link to={`/book/${book._id}`}>
                <img
                    src={book.imageUrls[0]}
                    alt='book cover'
                    className='sm:h-[300px] w-[250px] object-cover hover:scale-105 transition-scale duration-300'
                />
            </Link>
            <div className='p-3 text-justify flex flex-col gap-2 w-full'>
                <p className='text-lg font-semibold text-slate-700 truncate'>
                    {book.name}
                </p>
                <div>
                    <p className='text-slate-600 text-sm line-clamp-2 overflow-hidden h-[3em]'>
                        {book.description}
                    </p>
                    {book.sell ? (
                        <p className='text-slate-500 mt-2 font-semibold items-center'>
                            {book.offer ? (
                                <div className='text-green-600'>
                                    {(book.buyPrice - book.discountPrice).toLocaleString('vi-VN')} VNĐ / per
                                    <p className='text-gray-500 italic'>
                                        ({((book.discountPrice / book.buyPrice) * 100).toFixed(0)}% off)
                                    </p>
                                </div>
                            ) : (
                                <div>Chỉ cho thuê</div>
                            )}
                        </p>
                    ) : (
                        <p className='text-slate-500 mt-2 font-semibold items-center'>
                            Chỉ cho thuê
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
