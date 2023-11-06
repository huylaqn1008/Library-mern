import React from 'react'
import { Outlet } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Nav from '../../dashboard/Nav'
import Sidebar from './../../dashboard/SideBar'

export default function AdminPage({ setShowHeader }) {
    setShowHeader(false)

    return (
        <div className='bg-slate-200 flex flex-row  h-screen overflow-hidden'>
            <div><Sidebar /></div>

            <div className='w-screen'>
                <Nav />
                <div>{<Outlet />}</div>
            </div>

        </div>
    )
}
