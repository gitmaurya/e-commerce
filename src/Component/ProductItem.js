import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import BasicRating from "./BasicRating";
import { ProductToview, addproducts } from "../actions";
import { useNavigate } from "react-router-dom";
import { addCart, CartItems } from "../actions";
import { useState } from "react";
import customFetch from "../apiCall";
import { ToastContainer } from "react-toastify";
import { showToastMessage } from "../Notification/notify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductItem({ item }) {
  const [addedItem, setaddedItem] = useState(true);
  const [title, settitle] = useState(item.title);
  const [price, setprice] = useState(item.price);
  // const [rating, setrating] = useState(item.rating);
  const [description, setdescription] = useState(item.description);
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dispatchCart = useDispatch();
  const dispatchTotal = useDispatch();
  const dispatchProduct = useDispatch();

  function handleClick(item) {
    dispatch(ProductToview(item));
    navigate(`/productdetails/${item.id}`);
  }
  function handleCart(item) {
    if (addedItem) {
      item.qty = 1;
      dispatchCart(addCart(item));
      dispatchTotal(CartItems());
      setaddedItem(false);
      showToastMessage("item Added to cart", "success");
    } else {
      navigate("/cart");
    }
  }
  function handleEdit(item) {
    item.edit = false;
    dispatchProduct(addproducts([...products]));
  }
  // making delete request
  function handleDelelteProduct(item) {
    let url = ` https://my-json-server.typicode.com/gitmaurya/e-comRepo/products/${item.id}`;
    let result = customFetch(url, { method: "DELETE" });

    let index = products.indexOf(item);
    products.splice(index, 1);
    dispatchProduct(addproducts([...products]));
    showToastMessage("item deleted", "warning");
  }
  // closing edit mode
  function handleCancel(item) {
    item.edit = true;
    dispatchProduct(addproducts([...products]));
  }
  // making put request after click on save button of edit
  function handleSave(item) {
    let url = `https://my-json-server.typicode.com/gitmaurya/e-comRepo/products/${item.id}`;
  
    // Constructing the updated item object with changes
    const updatedItem = {
      ...item,
      title: item.title, // Assuming title is being updated
      price: item.price, // Assuming price is being updated
      // rating: item.rating, // Uncomment if rating is being updated
      description: item.description, // Assuming description is being updated
      edit: true,
    };
  
    // Making the PUT request using customFetch
    customFetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then((data) => {
        // Update the product in the local state or Redux store
        const updatedProducts = products.map((p) =>
          p.id === data.id ? data : p
        );
        dispatchProduct(addproducts(updatedProducts));
        showToastMessage("Edit successful", "success");
      })
      .catch((error) => {
        console.error("Error editing product:", error);
        showToastMessage("Error editing product", "error");
      });
  }
  
  return (
    //   container
    <div className="d-flex container-sm bg-white px-1 py-5 mt-4 flex-column flex-lg-row gap-3">
      {/* left section  */}
      <ToastContainer />
      <div className="d-flex container-sm gap-5">
      <img
        src={item.images[0]}
        alt={item.title} // Provide meaningful alt text
        style={{ width: '200px', height: 'auto' }} // Adjust width and maintain aspect ratio
        onClick={() => handleClick(item)}
      />
        {/* right-part Content  */}
        <div className="d-flex flex-column gap-2">
          {item.edit ? (
            <span>{item.title}</span>
          ) : (
            <input
              type="text"
              value={title}
              className="w-50"
              onChange={(e) => settitle(e.target.value)}
            ></input>
          )}
          {item.edit ? (
            <span>{item.price}</span>
          ) : (
            <input
              type="text"
              value={price}
              className="w-50"
              onChange={(e) => setprice(e.target.value)}
            ></input>
          )}
          {/* {item.edit ? (
            <BasicRating value={item.rating} />
          ) : (
            <div>
              <h5>Ratings:</h5>
              <input
                type="number"
                max={"5"}
                min={"0"}
                value={rating}
                step={"0.5"}
                onChange={(e) => setrating(e.target.value)}
              />
            </div>
          )} */}
        </div>
      </div>
      {/* right section  */}
      <div className="p-2">
        {item.edit ? (
          <span>{item.description}</span>
        ) : (
          <div className="form-floating">
            <textarea
              className="form-control"
              value={description}
              id="floatingTextarea"
              style={{ width: "20rem", height: "5rem" }}
              onChange={(e) => setdescription(e.target.value)}
            ></textarea>
          </div>
        )}
      </div>
      {/* footer section  */}
      <div className="align-self-end d-flex align-items-center gap-4 flex-lg-grow-1 p-1">
        {item.edit ? (
          <button
            type="button"
            className="btn btn-primary"
            style={{
              width: "9rem",
              backgroundColor: "var(--nav)",
            }}
            onClick={() => handleCart(item)}
          >
            {addedItem ? "Add to Cart" : "Go to Cart "}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => handleCancel(item)}
          >
            Cancel
          </button>
        )}

        {item.edit ? (
          <>
            <span>
              <img
                src="https://cdn-icons-png.flaticon.com/512/3196/3196909.png"
                alt="error"
                width={"30rem"}
                style={{ cursor: "pointer" }}
                onClick={() => handleEdit(item)}
              />
            </span>
            <span>
              <img
                src="https://cdn-icons-png.flaticon.com/512/8556/8556073.png"
                alt="error"
                width={"30rem"}
                style={{ cursor: "pointer" }}
                onClick={() => handleDelelteProduct(item)}
              />
            </span>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={() => handleSave(item)}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}