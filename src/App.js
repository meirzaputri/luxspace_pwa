import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/Header.js";
import Hero from "./components/Hero.js";
import Browse from "./components/Browse.js";
import Arrived from "./components/Arrived.js";
import Clients from "./components/Clients.js";
import AsideMenu from "./components/AsideMenu.js";
import Footer from "./components/Footer.js";
import Offline from "./components/Offline.js";
import Splash from "./pages/Splash.js";
import Profile from "./pages/Profile.js";
import Details from "./pages/Details.js";
import Cart from "./pages/Cart.js";
import Success from "./pages/Success.js";
import FAQ from "./pages/FAQ.js";

function App({ cart }) {
  const [items, setItems] = React.useState([]);
  const [offlineStatus, setOfflineStatus] = React.useState(!navigator.onLine);
  const [isLoading, setIsLoading] = React.useState(true);

  function handleOfflineStatus() {
    setOfflineStatus(!navigator.onLine);
  }

  React.useEffect(
    function () {
      (async function () {
        const response = await fetch("https://fakestoreapi.com/products");

        // konvert respon menjadi json, yang diambil hanya nodes/data dalam bentuk array
        const data = await response.json();
        // console.log("Data fetched:", data);
        setItems(data);
      })();
      handleOfflineStatus();
      window.addEventListener("online", handleOfflineStatus);
      window.addEventListener("offline", handleOfflineStatus);

      setTimeout(function () {
        setIsLoading(false);
      }, 1500);

      return function () {
        window.removeEventListener("online", handleOfflineStatus);
        window.removeEventListener("offline", handleOfflineStatus);
      };
    },
    [offlineStatus]
  );

  return (
    <>
      {isLoading === true ? (
        <Splash />
      ) : (
        <>
          {offlineStatus && <Offline />}
          <Header mode="light" cart={cart} />
          <Hero />
          <Browse />
          <Arrived items={items} />
          <Clients />
          <AsideMenu />
          <Footer />
        </>
      )}
    </>
  );
}

export default function AppRoutes() {
  const cachedCart = window.localStorage.getItem("cart");
  const [cart, setCart] = React.useState([]);

  const [shipping, setShipping] = React.useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    courier: "",
    payment: "",
  });

  function handleAddToCart(item) {
    const currentIndex = cart.length;
    const newCart = [...cart, { id: currentIndex + 1, item }];
    setCart(newCart);
    window.localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function handleRemoveCartItem(event, id) {
    console.log("handleRemoveCartItem dipanggil dengan id:", id);
    const revisedCart = cart.filter(function (item) {
      return item.id !== id;
    });
    setCart(revisedCart);
    window.localStorage.setItem("cart", JSON.stringify(revisedCart));
  }

  React.useEffect(
    function () {
      console.info("useEffect for localStorage");
      if (cachedCart !== null) {
        setCart(JSON.parse(cachedCart));
      }
    },
    [cachedCart]
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App cart={cart} />} />
        <Route path="/profile" element={<Profile cart={cart} />} />
        <Route
          path="/details/:id"
          element={<Details handleAddToCart={handleAddToCart} cart={cart} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
              shipping={shipping}
              setShipping={setShipping}
              handleRemoveCartItem={handleRemoveCartItem}
            />
          }
        />
        <Route path="/success" element={<Success />} />
        <Route path="/faq" element={<FAQ cart={cart} />} />
      </Routes>
    </Router>
  );
}
