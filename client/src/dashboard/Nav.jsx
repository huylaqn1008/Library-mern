import React from 'react'
import { BiSearch } from 'react-icons/bi'
import { useSelector } from 'react-redux'

export default function Nav() {
    const { currentUser } = useSelector((state) => state.user)

    return (
        <nav className="flex items-center justify-between bg-slate-300 p-4 shadow-md">
            <div className="flex items-center">
                <div className="ml-4 relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-2 py-1 rounded-md pr-8"
                        style={{ width: '350px', height: '40px' }}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <BiSearch className="text-gray-500" />
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                <div className="text-black font-bold mr-4">{currentUser.username}</div>
                <img
                    src={currentUser.avatar}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full"
                />
            </div>
        </nav>
    )
}
