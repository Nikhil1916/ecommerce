import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "../pages/products/ProductList";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;