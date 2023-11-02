import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function DashboardProduct() {
    const [products, setProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState('asc')
    const productsPerPage = 5

    useEffect(() => {
        fetch('/api/book/allbook')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const handleSort = (columnName) => {
        if (columnName === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(columnName)
            setSortDirection('asc')
        }
    }

    const sortedProducts = [...products]
    if (sortColumn) {
        sortedProducts.sort((a, b) => {
            const valueA = a[sortColumn]
            const valueB = b[sortColumn]

            if (typeof valueA !== 'string' || typeof valueB !== 'string') {
                return sortDirection === 'asc' ? valueA - valueB : valueB - valueA
            }

            if (sortDirection === 'asc') {
                return valueA.localeCompare(valueB, 'vi')
            } else {
                return valueB.localeCompare(valueA, 'vi')
            }
        })
    }

    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct)

    return (
        <div className="container mx-auto">
            <h1 className="text-4xl mt-10 font-bold mb-4 flex justify-center">Book List</h1>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-xl">Image</th>
                        <th className="py-2 px-4 border-b text-xl">
                            <button onClick={() => handleSort('name')}>
                                Book Name
                                {sortColumn === 'name' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                            </button>
                        </th>
                        <th className="py-2 px-4 border-b text-xl">
                            <button onClick={() => handleSort('category')}>
                                Category
                                {sortColumn === 'category' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                            </button>
                        </th>
                        <th className="py-2 px-4 border-b text-xl">
                            <button onClick={() => handleSort('author')}>
                                Author
                                {sortColumn === 'author' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                            </button>
                        </th>
                        <th className="py-2 px-4 border-b text-xl">
                            <button onClick={() => handleSort('quantity')}>
                                Quantity
                                {sortColumn === 'quantity' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                            </button>
                        </th>
                        <th className="py-2 px-4 border-b text-xl">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product) => (
                        <tr key={product._id}>
                            <td className="py-4 px-6 border-b text-lg">
                                <img src={product.imageUrls[0]} alt="Product" className="w-16 h-20" />
                            </td>
                            <td className="py-4 px-6 border-b text-lg">{product.name}</td>
                            <td className="py-4 px-6 border-b text-lg">{product.category}</td>
                            <td className="py-4 px-6 border-b text-lg">{product.author}</td>
                            <td className="py-4 px-6 border-b text-lg">{product.quantity}</td>
                            <td className="py-4 px-6 border-b text-lg">
                                <Link to={`/update-book/${product._id}`}>
                                    <button className='text-green-700 uppercase hover:underline hover:bg-slate-200'>Edit</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {products.length > productsPerPage && (
                <div className="pagination flex justify-center mt-4">
                    {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
