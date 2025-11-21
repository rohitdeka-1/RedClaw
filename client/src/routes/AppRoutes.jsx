import { Routes, Route } from 'react-router-dom';
import NotFound from '../components/NotFound.jsx';
import Home from '../components/Home.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
