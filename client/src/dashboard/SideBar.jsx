import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import { BiBook, BiShoppingBag } from 'react-icons/bi'

export default function Sidebar() {
    const [showDropdown, setShowDropdown] = useState(false)

    const navigate = useNavigate()

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    const handleHomeClick = () => {
        navigate('/')
        window.location.reload()
    }

    return (
        <div className='bg-[#FFC1C1] w-[240px] h-screen'>
            <div className='flex justify-center items-center shadow-md' style={{ height: '96px' }}>
                <img src={Logo} style={{ height: '50px', width: '50px' }} alt='Logo' />
                <span className='brand-name fs-4'>TMA LIBRARY</span>
            </div>
            <hr className='text-dark' />
            <div className='list-group mt-3'>
                <div className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 cursor-pointer' onClick={handleHomeClick}>
                    <i className='bi bi-house fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Home</span>
                </div>
                <Link to='/admin' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 hover:no-underline'>
                    <i className='bi bi-speedometer2 fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Dashboard</span>
                </Link>
                <Link to='/admin/products' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 hover:no-underline'>
                    <i className='bi bi-book fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Products</span>
                </Link>
                <Link to='/admin/customers' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 hover:no-underline'>
                    <i className='bi bi-people fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Customers</span>
                </Link>
                <div className='mt-3'>
                    <div
                        className='hover:bg-[#CD9B9B] hover:text-white text-slate-600 py-2 cursor-pointer'
                        onClick={toggleDropdown}
                    >
                        <i className='bi bi-clipboard-data fs-5 me-2 px-3'></i>
                        <span className='fs-5'>Report</span>
                        <i className={`bi bi-chevron-${showDropdown ? 'up' : 'down'} ms-2`}></i>
                    </div>
                    {showDropdown && (
                        <div className='flex flex-col pl-8'>
                            <Link to='/admin/rents' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 flex items-center hover:no-underline'>
                                <BiBook className='inline-block align-middle mr-5' size={20} />
                                <span className='fs-5'>Rent</span>
                            </Link>
                            <Link to='/admin/buys' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 flex items-center hover:no-underline'>
                                <BiShoppingBag className='inline-block align-middle mr-5' size={20} />
                                <span className='fs-5'>Buy</span>
                            </Link>
                        </div>
                    )}
                </div>
                <Link to='/admin/logout' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2 hover:no-underline'>
                    <i className='bi bi-power fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Logout</span>
                </Link>
            </div>
        </div>
    )
}
