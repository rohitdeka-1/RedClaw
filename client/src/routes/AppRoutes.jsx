import { Routes, Route } from 'react-router-dom';
import NotFound from '../components/NotFound.jsx';
import Home from '../components/Home.jsx';
import Checkout from '../components/Checkout.jsx';
import Login from '../components/Login.jsx';
import Register from '../components/Register.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/checkout' element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      } />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
