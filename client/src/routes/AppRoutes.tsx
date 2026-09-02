import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "../pages/products/ProductList";
import  Register  from "../pages/auth/Register";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;