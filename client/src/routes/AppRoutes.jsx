import { Routes, Route } from 'react-router-dom';
import NotFound from  '../components/NotFound.jsx';
import Home from '../components/Home/Home.jsx';
import ProductPage from '../components/Home/Product/ProductPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route>
        {/* <Route index element={<Home />} /> */}

        <Route path='/' element={<Home/>} />
        <Route path='/product/:id' element={<ProductPage/>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}