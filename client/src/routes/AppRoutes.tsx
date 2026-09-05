import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "../pages/products/ProductList";
import  Register  from "../pages/auth/Register";
import Login from "../pages/auth/Login";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;