import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/logo.png'

export default function Sidebar() {
    return (
        <div className='bg-[#FFC1C1] w-[240px] h-screen'>
            <div className='flex justify-center items-center shadow-md' style={{ height: '96px' }}>
                <img src={Logo} style={{ height: '50px', width: '50px' }} alt='Logo' />
                <span className='brand-name fs-4'>TMA LIBRARY</span>
            </div>
            <hr className='text-dark' />
            <div className='list-group mt-3'>
                <Link to='/admin/home' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2'>
                    <i className='bi bi-house fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Home</span>
                </Link>
                <Link to='/admin' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2'>
                    <i className='bi bi-speedometer2 fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Dashboard</span>
                </Link>
                <Link to='/admin/products' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2'>
                    <i className='bi bi-book fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Products</span>
                </Link>
                <Link to='/admin/customers' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2'>
                    <i className='bi bi-people fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Customers</span>
                </Link>
                <Link to='/admin/report' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2'>
                    <i className='bi bi-clipboard-data fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Report</span>
                </Link>
                <Link to='/admin/logout' className='hover:bg-[#CD9B9B] hover:text-white mt-3 text-slate-600 py-2'>
                    <i className='bi bi-power fs-5 me-2 px-3'></i>
                    <span className='fs-5'>Logout</span>
                </Link>
            </div>
        </div>
    )
}
