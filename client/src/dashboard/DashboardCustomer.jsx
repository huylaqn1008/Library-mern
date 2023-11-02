import React, { useEffect, useState } from 'react'
import Switch from 'react-switch'

export default function DashboardCustomer() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetch('/api/user/all')
            .then((response) => response.json())
            .then((data) => {
                setUsers(data)
            })
            .catch((error) => {
                console.error(error)
            })
    })

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`/api/user/update-role/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            })

            console.log('Response status:', response.status)
            const responseText = await response.text()
            console.log('Response text:', responseText)

            if (response.status === 200) {
                console.log('Role updated successfully.')
            } else {
                console.error('Role update failed.')
            }
        } catch (error) {
            console.error('Role update failed.', error)
        }
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-4xl mt-10 font-bold mb-4 flex justify-center">User list</h1>
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
                        users.map((user) => (
                            <tr key={user._id}>
                                <td className="py-4 px-6 border-b text-lg">{user.username}</td>
                                <td className="py-4 px-6 border-b text-lg">{user.email}</td>
                                <td className="py-4 px-6 border-b text-lg">
                                    {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : ''}
                                </td>
                                <td className="py-4 px-6 border-b text-lg">{user.phoneNumber}</td>
                                <td className="py-4 px-6 border-b text-lg">{user.address}</td>
                                <td className="py-4 px-6 border-b text-lg">
                                    <label>
                                        <Switch
                                            onChange={() => {
                                                const newRole = user.role === 1 ? 0 : 1
                                                if (
                                                    window.confirm(
                                                        `Bạn muốn cho tài khoản ${newRole === 0 ? 'user' : 'admin'
                                                        } thành ${newRole === 0 ? 'admin' : 'user'
                                                        }?`
                                                    )
                                                ) {
                                                    handleRoleChange(user._id, newRole)
                                                }
                                            }}
                                            checked={user.role === 0}
                                        />
                                    </label>
                                </td>
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
