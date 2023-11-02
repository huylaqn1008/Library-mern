import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify'

import "react-toastify/dist/ReactToastify.css"

import Home from "./pages/Home"
import About from "./pages/About"
import Header from "./components/Header"
import PrivateRoute from "./components/PrivateRoute"
import Search from "./pages/Search"
import SignIn from "./pages/user/SignIn"
import SignUp from "./pages/user/SignUp"
import Profile from "./pages/user/Profile"
import CreateBook from './pages/book/CreateBook'
import UpdateBook from './pages/book/UpdateBook'
import ForgotPassword from './pages/user/ForgotPassword'
import Book from "./pages/book/Book"
import VerifyOtp from "./pages/user/VerifyOtp"
import ResetPassword from "./pages/user/ResetPassword"
import RentPayment from "./pages/payment/RentPayment"
import History from "./pages/user/History"
import ShoppingCart from "./pages/payment/ShoppingCart"
import BuyPayment from "./pages/payment/BuyPayment"
import Thankyou from "./components/Thankyou"
import AdminPage from "./pages/admin/AdminPage"
import { useState } from "react"
import Dashboard from "./dashboard/Dashboard"
import DashboardProduct from "./dashboard/DashboardProduct"
import DashboardCustomer from "./dashboard/DashboardCustomer"

export default function App() {
  const [showHeader, setShowHeader] = useState(true)

  return (
    <BrowserRouter>
      <ToastContainer />
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-book" element={<CreateBook />} />
          <Route path="/update-book/:bookId" element={<UpdateBook />} />
          <Route path="/admin" element={<AdminPage setShowHeader={setShowHeader} />} >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<DashboardProduct />} />
            <Route path="customers" element={<DashboardCustomer />} />
          </Route>
          <Route path="/history" element={<History />} />
        </Route>
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verifyotp" element={<VerifyOtp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/book/:bookId" element={<Book />} />
        <Route path="/search" element={<Search />} />
        <Route path="/payment-buy" element={<BuyPayment />} />
        <Route path="/payment-rent" element={<RentPayment />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/thank-you" element={<Thankyou />} />
      </Routes>
    </BrowserRouter>
  )
}
