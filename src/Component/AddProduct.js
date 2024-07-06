import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToastMessage } from "../Notification/notify";
import { addproducts } from "../actions";
import customFetch from "../apiCall";

const Container = styled.div`
  width: 50%;
  margin: auto;
  @media only screen and (max-width: 976px) {
    width: 90%;
  }
  @media only screen and (max-width: 576px) {
    width: 100%;
    margin: 0;
  }
`;

export default function AddProduct() {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State variables for form inputs
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState("");

  // URL for API endpoint
  const url = "https://my-json-server.typicode.com/gitmaurya/e-comRepo/products";

  function handleSubmit(e) {
    e.preventDefault();

    // Constructing the body object to send in the POST request
    const requestData = {
      id: Date.now(),
      title: name,
      price: parseFloat(price), // Assuming price is numeric
      category,
      images: [images], // Assuming images is a single URL for now
      description,
      edit: true,
    };

    // Making the POST request using customFetch
    customFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((data) => {
        // Dispatch action to update Redux store with new product
        dispatch(addproducts([data, ...products]));
        // Navigate to home page or success page
        navigate("/");
        // Show toast message for success
        showToastMessage("Product Added Successfully", "success");
        // Clear form inputs
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setImages("");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        // Show toast message for error
        showToastMessage("Error Adding Product", "error");
      });
  }

  return (
    <Container className="bg-light border border-1 border-dark mt-4 p-3">
      <ToastContainer />
      <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          className="p-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          className="p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          className="p-2"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          className="p-2"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="text"
          className="p-2"
          placeholder="Thumbnail Image URL"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          required
        />
        <button
          type="submit"
          className="btn btn-primary align-self-end mt-4"
          style={{
            width: "9rem",
            backgroundColor: "var(--nav)",
          }}
        >
          Add Product
        </button>
      </form>
    </Container>
  );
}
