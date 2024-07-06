import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Nav from './Component/Nav';
import ProductDetail from './Component/ProductDetail';
import AddProduct from './Component/AddProduct';
import CartItems from './Component/CartItems';
import ProductItemList from './Component/ProductItemList';
import { addproducts } from './actions/index';
import customFetch from './apiCall';

function App() {
  // Get product detail item from Redux state
  const productDetailItem = useSelector((state) => state.itemToDisplay);

  // Define the URL for fetching data
  const url = "https://my-json-server.typicode.com/gitmaurya/e-comRepo/db";

  // Get the dispatch function from Redux
  const dispatch = useDispatch();

  // Fetch data and update Redux store and localStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await customFetch(url, { method: 'GET' });
        const modifiedData = response.products.map((item) => {
          item.edit = true;
          return item;
        });
        window.localStorage.setItem('products', JSON.stringify(modifiedData));
        const products = JSON.parse(window.localStorage.getItem('products'));
        dispatch(addproducts(products));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch, url]);

  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<ProductItemList />} />
          <Route path="/addproducts" element={<AddProduct />} />
          <Route
            path={`/productdetails/${productDetailItem.id}`}
            element={<ProductDetail item={productDetailItem} />}
          />
          <Route path="/cart" element={<CartItems />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
