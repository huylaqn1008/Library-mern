import React, { useEffect, useState } from 'react'

export default function DashboardCustomer() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetch('/api/user/all')
            .then(response => response.json())
            .then(data => {
                setUsers(data)
            })
            .catch(error => {
                console.error(error)
            })
    }, [])

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Danh sách người dùng</h1>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-xl">User Name</th>
                        <th className="py-2 px-4 border-b text-xl">Email</th>
                        <th className="py-2 px-4 border-b text-xl">Sex</th>
                        <th className="py-2 px-4 border-b text-xl">Number Phone</th>
                        <th className="py-2 px-4 border-b text-xl">Address</th>
                        <th className="py-2 px-4 border-b text-xl">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(users) ? (
                        users.map(user => (
                            <tr key={user._id}>
                                <td className="py-4 px-6 border-b text-lg">{user.username}</td>
                                <td className="py-4 px-6 border-b text-lg">{user.email}</td>
                                <td className="py-4 px-6 border-b text-lg">{user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : ''}</td>
                                <td className="py-4 px-6 border-b text-lg">{user.phoneNumber}</td>
                                <td className="py-4 px-6 border-b text-lg">{user.address}</td>
                                <td className="py-4 px-6 border-b text-lg">{user.role === 1 ? 'User' : 'Admin'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Không có người dùng</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
