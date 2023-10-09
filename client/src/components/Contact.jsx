import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact({ book }) {
    const [admin, setAdmin] = useState(null)
    const [message, setMessage] = useState('')

    const onChange = (e) => {
        setMessage(e.target.value)
    }

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await fetch(`/api/user/${book.userRef}`)

                const data = await res.json()
                setAdmin(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchAdmin()
    }, [book.userRef])

    return (
        <>
            {admin && (
                <div className='flex flex-col gap-2'>
                    <p>
                        Contact <span className='font-semibold'>
                            {admin.username}
                        </span> for <span className='font-semibold'>
                            {book.name}
                        </span>
                    </p>
                    <textarea
                        name='message'
                        id='message'
                        rows="2"
                        value={message}
                        onChange={onChange}
                        placeholder='Enter your message here...'
                        className='w-full border p-3 rounded-lg'
                    ></textarea>

                    <Link
                        to={`mailto:${admin.email}?subject=Regarding ${book.name}&body=${message}`}
                        className='bg-yellow-500 text-black p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 text-center'
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    )
}
