import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { app } from '../firebase'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export default function UpdateBook() {
    const { currentUser } = useSelector(state => state.user)
    const params = useParams()

    const navigate = useNavigate()

    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
        category: '',
        name: '',
        author: '',
        description: '',
        sell: true,
        rent: false,
        offer: false,
        quantity: 1,
        buyPrice: 50000,
        rentPrice: 5000,
        discountPrice: 5000
    })
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const fetchBook = async () => {
            const bookId = params.bookId
            const res = await fetch(`/api/book/get/${bookId}`)
            const data = await res.json()
            if (data.success === false) {
                console.log(data.message)
                return
            }
            setFormData(data)
        }
        fetchBook()
    }, [])

    const handleImageSubmit = () => {
        if (files && files.length + formData.imageUrls.length <= 6) {
            if (files.length === 0) {
                setImageUploadError('You must upload at least one image!')
                return
            }
            setUploading(true)
            setImageUploadError(false)
            const promises = []
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData((prevData) => ({
                        ...prevData,
                        imageUrls: prevData.imageUrls.concat(urls)
                    }))
                    setImageUploadError(false)
                    setUploading(false)
                })
                .catch((error) => {
                    setImageUploadError('Image upload failed (2mb max per image)')
                    setUploading(false)
                })
        } else {
            setImageUploadError('You can only upload up to 6 images per book!')
            setUploading(false)
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on("state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    console.log(`Upload is ${progress}% done`)
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )
        })
    }

    const handleRemoveImage = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            imageUrls: prevData.imageUrls.filter((_, i) => i !== index)
        }))
    }

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target
        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                [id]: checked,
            }))
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [id]: value,
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (formData.imageUrls.length < 1) {
                setError('You must upload at least one image!')
                return
            }
            if (+formData.buyPrice < +formData.discountPrice) {
                setError('Discount price must be lower than buy price!')
                return
            }
            setLoading(true)
            setError(false)
            const res = await fetch(`/api/book/update/${params.bookId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                }),
            })
            const data = await res.json()
            setLoading(false)
            if (data.success === false) {
                setError(data.message)
            } else {
                setSuccess(true)
            }
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    const handleSuccessClose = () => {
        setSuccess(false)
        navigate('/profile')
    }

    const closeErrorCard = () => {
        setImageUploadError(false)
        setError(false)
        handleSuccessClose()
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Update a book
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        type='text'
                        placeholder='Category'
                        id='category'
                        maxLength='62'
                        minLength='10'
                        required
                        className='border p-3 rounded-lg'
                        onChange={handleChange}
                        value={formData.category}
                    />
                    <input
                        type='text'
                        placeholder='Name'
                        id='name'
                        maxLength='62'
                        minLength='10'
                        required
                        className='border p-3 rounded-lg'
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <input
                        type='text'
                        placeholder='Author'
                        id='author'
                        maxLength='62'
                        minLength='10'
                        required
                        className='border p-3 rounded-lg'
                        onChange={handleChange}
                        value={formData.author}
                    />
                    <textarea
                        type='text'
                        placeholder='Description'
                        id='description'
                        minLength='10'
                        required
                        className='border p-3 rounded-lg'
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='sell' className='w-5' onChange={handleChange} checked={formData.sell} />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={formData.rent} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='quantity'
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData.quantity}
                            />
                            <p>Quantity</p>
                        </div>
                        {formData.sell && (
                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    id='buyPrice'
                                    min='50000'
                                    max='10000000'
                                    required
                                    className='p-3 border border-gray-300 rounded-lg'
                                    onChange={handleChange}
                                    value={formData.buyPrice}
                                />
                                <div className='flex flex-col items-center'>
                                    <p>Buy price</p>
                                    <span className='text-xs'>(VNĐ / piece)</span>
                                </div>
                            </div>
                        )}
                        {formData.rent && (
                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    id='rentPrice'
                                    min='5000'
                                    max='10000000'
                                    required
                                    className='p-3 border border-gray-300 rounded-lg'
                                    onChange={handleChange}
                                    value={formData.rentPrice}
                                />
                                <div className='flex flex-col items-center'>
                                    <p>Rent price</p>
                                    <span className='text-xs'>(VNĐ / piece / days)</span>
                                </div>
                            </div>
                        )}
                        {formData.offer && (
                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    id='discountPrice'
                                    min='5000'
                                    max='10000000'
                                    required
                                    className='p-3 border border-gray-300 rounded-lg'
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                />
                                <div className='flex flex-col items-center'>
                                    <p>Discounted price</p>
                                    <span className='text-xs'>(VNĐ / piece)</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'> Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                    </p>
                    <div className='flex gap-4'>
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            type='file'
                            id='images'
                            accept='image/*'
                            multiple
                            className='p-3 border border-gray-300 rounded w-full'
                        />
                        <button
                            type='button'
                            onClick={handleImageSubmit}
                            className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => {
                            return (
                                <div key={url} className='flex justify-between p-3 borer items-center'>
                                    <img src={url} alt='listing image' className='w-32 h-36' />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className='p-3 text-red-700 rounded-lg uppercase hover:opacity-95'
                                    >
                                        Delete
                                    </button>
                                </div>
                            )
                        })
                    }
                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        {loading ? 'Updating...' : 'Update book'}
                    </button>
                    {imageUploadError && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="fixed inset-0 bg-black opacity-50"></div>
                            <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                                <p className='text-red-500'>{imageUploadError}</p>
                                <button onClick={closeErrorCard} className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">Close</button>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="fixed inset-0 bg-black opacity-50"></div>
                            <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                                <p className='text-red-500'>{error}</p>
                                <button onClick={closeErrorCard} className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">Close</button>
                            </div>
                        </div>
                    )}
                    {success && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="fixed inset-0 bg-black opacity-50"></div>
                            <div className="w-96 p-6 bg-white rounded-lg shadow-lg text-center relative z-10">
                                <p className='text-green-500'>Book updated successfully!</p>
                                <button onClick={closeErrorCard} className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">Close</button>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </main>
    )
}