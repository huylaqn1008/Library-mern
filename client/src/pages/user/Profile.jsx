import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'
import { app } from '../../firebase'
import { signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../../redux/User/userSlice'

export default function Profile() {
    const fileRef = useRef(null)
    const { currentUser } = useSelector((state) => state.user)

    const [file, setFile] = useState(undefined)
    const [filePerc, setFilePerc] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({
        username: currentUser.username || '', // Initialize with the user's username or an empty string
        email: currentUser.email,
    })
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [updateError, setUpdateError] = useState("")
    const [inputError, setInputError] = useState("")
    const [initialUsername, setInitialUsername] = useState(currentUser.username)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [showBooks, setShowBooks] = useState(false)
    const [showBooksError, setShowBooksError] = useState(false)
    const [userBooks, setUserBooks] = useState([])
    const [showDeleteBookModal, setShowDeleteBookModal] = useState(false)
    const [bookToDelete, setBookToDelete] = useState(null)
    const [deleteSuccess, setDeleteSuccess] = useState(false)
    const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const vietnamMobileRegex = /^(03[2-9]|05[6-9]|07[06-9]|08[1-9]|09[0-9])[0-9]{7}$/

    const dispatch = useDispatch()

    const handleFileUpload = (file) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setFilePerc(Math.round(progress))
            },
            (error) => {
                setFileUploadError(true)
                console.error('Upload Error:', error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, avatar: downloadURL })
                )
            }
        )
    }

    useEffect(() => {
        if (file) {
            handleFileUpload(file)
        }
    }, [file])

    useEffect(() => {
        setFormData({
            username: currentUser.username,
            email: currentUser.email,
        })
    }, [currentUser])

    //Firebase store
    //allow read
    //allow write: if
    //request.resource.size < 2 * 1024 * 1024 &&
    //request.resource.contentType.matches('image/.*')

    const handlChange = (e) => {
        if (e.target.id === "username") {
            setFormData({ ...formData, [e.target.id]: e.target.value })
        } else {
            setFormData({ ...formData, [e.target.id]: e.target.value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.username || !formData.email) {
            setInputError("Please fill in all fields.")
            setFormData({ ...formData, username: initialUsername })
            return
        }

        if (
            formData.username === currentUser.username &&
            formData.email === currentUser.email &&
            formData.phoneNumber === currentUser.phoneNumber &&
            formData.gender === currentUser.gender &&
            formData.address === currentUser.address
        ) {
            setUpdateError("No changes to update.")
            return
        }

        if (formData.phoneNumber && !vietnamMobileRegex.test(formData.phoneNumber)) {
            setInputError("Invalid phone number. Please enter a valid Vietnamese mobile number.")
            return
        }

        try {
            setUpdateLoading(true)
            dispatch(updateUserStart())

            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()
            if (data.success === false) {
                dispatch(updateUserFailure(data.message))
                setUpdateError(data.message)
                setUpdateLoading(false)
                return
            }

            dispatch(updateUserSuccess(data))
            setUpdateSuccess(true)
            setUpdateLoading(false)
        } catch (error) {
            dispatch(updateUserFailure(error.message))
            setUpdateError(error.message)
            setUpdateLoading(false)
        }
    }


    const openLogoutModal = () => {
        setShowLogoutModal(true)
    }

    const closeLogoutModal = () => {
        setShowLogoutModal(false)
    }

    const handleSignOut = async () => {
        if (showLogoutModal) {
            try {
                dispatch(signOutUserStart())
                const res = await fetch('/api/auth/signout')
                const data = await res.json()
                if (data.success === false) {
                    dispatch(signOutUserFailure(data.message))
                } else {
                    dispatch(signOutUserSuccess())
                }
            } catch (error) {
                dispatch(signOutUserFailure(error.message))
            }
        } else {
            openLogoutModal()
        }
    }

    const handleShowBooks = async () => {
        try {
            setShowBooksError(false)
            setShowBooks(!showBooks)

            const res = await fetch(`/api/user/books/${currentUser._id}`)
            const data = await res.json()

            if (data.success === false) {
                setShowBooksError(true)
                return
            }

            setUserBooks(data)
        } catch (error) {
            setShowBooksError(true)
        }
    }

    const handleDeleteBook = async (bookId) => {
        try {
            const res = await fetch(`api/book/delete/${bookId}`, {
                method: 'DELETE'
            })

            const data = await res.json()
            if (data.success === false) {
                console.log(data.message)
                return
            }

            setDeleteSuccess(true)
            setDeleteSuccessMessage("Book deleted successfully")

            closeDeleteBookModal()

            setUserBooks(
                (prev) => prev.filter(
                    (book) => book._id !== bookId
                )
            )
        } catch (error) {
            console.log(error.message)
        }
    }

    const openDeleteBookModal = (book) => {
        setBookToDelete(book)
        setShowDeleteBookModal(true)
    }

    const closeDeleteBookModal = () => {
        setShowDeleteBookModal(false)
    }

    const itemsPerPage = 5
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = userBooks.slice(indexOfFirstItem, indexOfLastItem)

    const totalPages = Math.ceil(userBooks.length / itemsPerPage)
    const displayedPages = Math.min(totalPages, 5)
    let startPage = currentPage - Math.floor(displayedPages / 2)
    let endPage = currentPage + Math.floor(displayedPages / 2)

    if (startPage <= 0) {
        endPage += Math.abs(startPage) + 1
        startPage = 1
    }

    if (endPage > totalPages) {
        startPage -= endPage - totalPages
        endPage = totalPages
    }

    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index)

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber)
    }


    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Profile
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
                <img
                    onClick={() => fileRef.current.click()}
                    src={formData.avatar || currentUser.avatar}
                    alt='profile'
                    className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
                />
                <p className='text-sm self-center'>
                    {fileUploadError ? (
                        <span className='text-red-700'>Error Image Upload</span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                        <span className='text-green-700'>Image Uploaded Successfully</span>
                    ) : (
                        ''
                    )}
                </p>
                <input
                    type='text'
                    placeholder='username'
                    id='username'
                    value={formData.username}
                    className='boder p-3 rounded-lg'
                    onChange={handlChange}
                />
                <input
                    type='email'
                    placeholder='email'
                    id='email'
                    defaultValue={currentUser.email}
                    className='boder p-3 rounded-lg'
                    onChange={handlChange}
                    readOnly
                />
                <input
                    type='text'
                    placeholder='phone number'
                    id='phoneNumber'
                    value={formData.phoneNumber || currentUser.phoneNumber}
                    className={`border p-3 rounded-lg ${vietnamMobileRegex.test(formData.phoneNumber)}`}
                    onChange={handlChange}
                />
                <select id='gender' value={formData.gender || currentUser.gender} className='border p-3 rounded-lg' onChange={handlChange}>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='other'>Other</option>
                </select>
                <input
                    type='text'
                    placeholder='address'
                    id='address'
                    value={formData.address || currentUser.address}
                    className='border p-3 rounded-lg'
                    onChange={handlChange}
                />
                <button disabled={updateLoading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                    {updateLoading ? (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="fixed inset-0 bg-black opacity-50"></div>
                            <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                                <p className="text-slate-700">Updating...</p>
                            </div>
                        </div>
                    ) : 'Update'}
                </button>
                <Link to={'/create-book'} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
                    Create book
                </Link>
            </form>

            <div className='flex justify-between mt-5'>
                <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
            </div>

            <button onClick={handleShowBooks} className='text-green-700 w-full'>
                {showBooks ? 'Hide Your Books Create' : 'Show Your Books Create'}
            </button>
            <p className='text-red-700 mt-5'>
                {showBooksError ? 'Error showing listings' : ''}
            </p>
            {showBooks && userBooks && userBooks.length > 0 &&
                <div className='flex flex-col gap-4'>
                    <h1 className='text-center mt-7 text-2xl font-semibold'>Your list books</h1>
                    {currentItems.map((book, index) => {
                        return (
                            <div key={index} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
                                <Link to={`/book/${book._id}`}>
                                    <img
                                        src={book.imageUrls[0]}
                                        alt='Book cover'
                                        className='h-20 w-20 object-contain'
                                    />
                                </Link>
                                <Link className='text-slate-700 font-semibold flex-1 hover:underline truncate' to={`/book/${book._id}`}>
                                    {book.name.length > 38 ? (
                                        <marquee>{book.name}</marquee>
                                    ) : (
                                        <p>{book.name}</p>
                                    )}
                                </Link>

                                <div className='flex flex-col items-center'>
                                    <button onClick={() => openDeleteBookModal(book)} className='text-red-700 uppercase'>Delete</button>
                                    <Link to={`/update-book/${book._id}`}>
                                        <button className='text-green-700 uppercase'>Edit</button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                    <div className="pagination flex justify-between items-center">
                        <button
                            className="prev-btn"
                            onClick={() => handlePageClick(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {pageNumbers.map((pageNumber, page) => (
                            <button
                                className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
                                key={pageNumber}
                                onClick={() => handlePageClick(pageNumber)}
                                disabled={currentPage === pageNumber}
                                style={{
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    backgroundColor: currentPage === pageNumber ? '#4caf50' : '#e0e0e0',
                                    color: currentPage === pageNumber ? '#fff' : '#000',
                                }}
                            >
                                {page + startPage}
                            </button>
                        ))}
                        <button
                            className="next-btn"
                            onClick={() => handlePageClick(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            }

            {
                inputError && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                            <p className="text-red-500">{inputError}</p>
                            <button onClick={() => setInputError("")} className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">Close</button>
                        </div>
                    </div>
                )
            }

            {
                updateError && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                            <p className="text-red-500">{updateError}</p>
                            <button onClick={() => setUpdateError("")} className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">Close</button>
                        </div>
                    </div>
                )
            }

            {
                updateSuccess && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                            <p className="text-green-700">User is updated successfully!</p>
                            <button onClick={() => setUpdateSuccess(false)} className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">Close</button>
                        </div>
                    </div>
                )
            }

            {
                showLogoutModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                            <p className="text-red-500">Are you sure you want to sign out?</p>
                            <button onClick={handleSignOut} className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 mr-2">Yes</button>
                            <button onClick={closeLogoutModal} className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">No</button>
                        </div>
                    </div>
                )
            }

            {
                showDeleteBookModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                            <p className="text-red-500">Are you sure you want to delete this book?</p>
                            <p className="text-slate-700 font-semibold">{bookToDelete ? bookToDelete.name : ''}</p>
                            <button onClick={() => handleDeleteBook(bookToDelete._id)} className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 mr-2">Yes</button>
                            <button onClick={closeDeleteBookModal} className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">No</button>
                        </div>
                    </div>
                )
            }

            {
                deleteSuccess && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                            <p className="text-green-700">{deleteSuccessMessage}</p>
                            <button onClick={() => setDeleteSuccess(false)} className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">Close</button>
                        </div>
                    </div>
                )
            }
        </div >
    )
}
