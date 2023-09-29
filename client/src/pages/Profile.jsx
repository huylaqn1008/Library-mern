import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase'
import { updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/User/userSlice'

export default function Profile() {
    const fileRef = useRef(null)
    const { currentUser } = useSelector((state) => state.user)

    const [file, setFile] = useState(undefined)
    const [filePerc, setFilePerc] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [updateError, setUpdateError] = useState("")
    const [inputError, setInputError] = useState("")
    const [initialUsername, setInitialUsername] = useState(currentUser.username)

    const vietnamMobileRegex = /^(03[2-9]|05[6-9]|07[06-9]|08[1-9]|09[0-9])[0-9]{7}$/;

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
            setFormData({ ...formData, username: initialUsername }) // Khôi phục giá trị "username"
            return
        }

        if (!vietnamMobileRegex.test(formData.phoneNumber)) {
            setInputError("Invalid phone number. Please enter a valid Vietnamese mobile number.");
            return;
        }

        try {
            setUpdateLoading(true) // Bắt đầu quá trình cập nhật
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
                    className={`border p-3 rounded-lg ${vietnamMobileRegex.test(formData.phoneNumber) ? '' : 'border-red-500'
                        }`}
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
            </form>

            <div className='flex justify-between mt-5'>
                <span className='text-red-700 cursor-pointer'>Delete account</span>
                <span className='text-red-700 cursor-pointer'>Sign out</span>
            </div>

            {inputError && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                        <p className="text-red-500">{inputError}</p>
                        <button onClick={() => setInputError("")} className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">Close</button>
                    </div>
                </div>
            )}

            {updateError && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                        <p className="text-red-500">{updateError}</p>
                        <button onClick={() => setUpdateError("")} className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">Close</button>
                    </div>
                </div>
            )}

            {updateSuccess && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                        <p className="text-green-700">User is updated successfully!</p>
                        <button onClick={() => setUpdateSuccess(false)} className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">Close</button>
                    </div>
                </div>
            )}
        </div>
    )
}
