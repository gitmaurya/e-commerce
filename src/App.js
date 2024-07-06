
import Nav from "./Component/Nav";
import ProductDetail from "./Component/ProductDetail";
import AddProduct from "./Component/AddProduct";
import CartItems from "./Component/CartItems";
import ProductItemList from "./Component/ProductItemList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addproducts } from "./actions/index";

import { useEffect, useState } from "react";

function App() {
  let productDetailItem = useSelector((state) => state.itemToDisplay);

  const url = " https://my-json-server.typicode.com/gitmaurya/e-commerce";

  // const dispatch = useDispatch();

  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
 
  // useEffect(() => {
  //   // Define the async function inside useEffect
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  //       const result = await response.json();
  //       setData(result);
  //       console.log(data)
  //     } catch (error) {
  //       setError(error);
  //     } finally {
  //       setLoading(false);
  //     }
      
  //   };
    
  //   // Call the async function
  //   fetchData();
  // }, []);
   
    let response = customFetch(url, {
      method: "GET",
    });
    response.then((data) => {
      let modifiedData = data.products.map((item) => {
        item.edit = true;
        return item;
      });
      window.localStorage.setItem("products", JSON.stringify(modifiedData));
      let products = JSON.parse(window.localStorage.getItem("products"));
      dispatch(addproducts(products));
    });
 

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