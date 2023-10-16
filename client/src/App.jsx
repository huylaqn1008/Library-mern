import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Header from "./components/Header"
import PrivateRoute from "./components/PrivateRoute"
import Search from "./pages/Search"
import SignIn from "./pages/user/SignIn"
import SignUp from "./pages/user/SignUp"
import Profile from "./pages/user/Profile"
import CreateBook from './pages/book/CreateBook';
import UpdateBook from './pages/book/UpdateBook';
import ForgotPassword from './pages/user/ForgotPassword';
import Book from "./pages/book/Book"
import VerifyOtp from "./pages/user/VerifyOtp"
import ResetPassword from "./pages/user/ResetPassword"
import Dashboard from "./pages/admin/Dashboard"
import RentPayment from "./pages/payment/RentPayment"
import BuyPayment from "./pages/payment/BuyPayment"

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-book" element={<CreateBook />} />
          <Route path="/update-book/:bookId" element={<UpdateBook />} />
        </Route>
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verifyotp" element={<VerifyOtp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/book/:bookId" element={<Book />} />
        <Route path="/search" element={<Search />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payment-rent" element={<RentPayment />} />
        <Route path="/payment-buy" element={<BuyPayment />} />
      </Routes>
    </BrowserRouter>
  )
}
