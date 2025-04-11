import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header.js";
import AsideMenu from "../components/AsideMenu.js";
import Footer from "../components/Footer.js";

function numberFormat(price) {
  const currency = Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
  return currency.format(price * 15000);
}

function formatShippingCost(shippingCost) {
  const currency = Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
  return currency.format(shippingCost);
}

function Cart({ cart, shipping, setShipping, setCart, handleRemoveCartItem }) {
  const totalPrice = cart.reduce((total, { item }) => total + item.price, 0);
  const formattedTotalPrice = Number(totalPrice.toFixed(2));
  const totalPriceIDR = formattedTotalPrice * 15000;
  console.log("totalidr", totalPriceIDR);

  const [shippingCost, setShippingCost] = useState("");
  const totalCost = totalPriceIDR + shippingCost;
  console.log("totalCost", totalCost);

  // console.log("formattotal", formattedTotalPrice)
  // console.log("total", totalPrice)

  const generateOrderId = () => {
    return `ORDER-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  const isShipValid =
    shipping.name &&
    shipping.email &&
    shipping.address &&
    shipping.phone &&
    shipping.courier &&
    shipping.payment;

  const navigate = useNavigate();

  const [token, setToken] = useState("");

  async function handleCheckout(e) {
    e.preventDefault();

    // console.log("Cart sebelum navigate:", cart);
    console.log("Shipping sebelum navigate:", shipping);

    if (isShipValid) {
      // localStorage.setItem("shipping", JSON.stringify(shipping))
      const orderId = generateOrderId();
      // console.log("order Id cart:", orderId);

      const orderData = {
        order_id: orderId,
        items: cart,
        shipping: shipping,
        gross_amount: totalPriceIDR,
        shippingCost: shippingCost
      };

      // console.log("Cart Items sebelum dikirim:", JSON.stringify(orderData, null, 2));

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "http://localhost:1000/api/payment/process-transaction",
        orderData,
        config
      );
      // console.log(response.data.token);
      setToken(response.data.token);
    }
  }

  useEffect(() => {
    if (token) {
      window.snap.pay(token, {
        onSuccess: (result) => {
          localStorage.setItem("Pembayaran", JSON.stringify(result));
          setToken("");
          navigate("/success", { state: { result } });
        },
        onPending: (result) => {
          localStorage.setItem("Pembayaran", JSON.stringify(result));
          setToken("");
        },
        onError: (error) => {
          console.log(error);
          setToken("");
        },
        onClose: () => {
          console.log("Anda belum menyelesaikan pembayaran");
          setToken("");
        },
      });
      setCart([]);
      localStorage.removeItem("cart");
    }
  }, [token]);

  useEffect(() => {
    const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransUrl;

    const midtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;
    scriptTag.setAttribute("data-client-key", midtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const [citySearch, setCitySearch] = useState("");
  const [cityResults, setCityResults] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState();

  async function handleCitySearch(keyword) {
    console.log("🔍 Keyword dikirim:", keyword);
    if (!keyword || keyword.trim() === "") {
      console.log("Keyword kosong, skip fetch");
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:1000/api/payment/check-cities`,
        {
          params: {
            search: keyword,
          },
        }
      );
      console.log("Kota ditemukan:", res.data);
      setCityResults(res.data); // ini penting
    } catch (err) {
      console.error("Error ambil kota dari Komerce:", err);
      setCityResults([]);
    }
  }

  useEffect(() => {
    if (shipping.courier) {
      checkShipping(); 
    }
  }, [shipping.courier]); 

  const handleCourierClick = (courier) => {
    setShipping({ ...shipping, courier });
    console.log("Updated shipping:", { ...shipping, courier });
  };

  const checkShipping = async () => {
    console.log("Shipping Courier di FE:", shipping.courier);
    // console.log("total", totalPrice)

    try {
      const res = await axios.get(
        `http://localhost:1000/api/payment/check-shipping`,
        {
          params: {
            shipper_destination_id: "69211",
            // receiver_destination_id: "69211",
            receiver_destination_id: shipping.address.id,
            weight: 1,
            // item_value: formattedTotalPrice,
            item_value: totalPrice,
            cod: false,
            courier: shipping.courier,
          },
        }
      );

      console.log("Ongkir:", res.data);
      // Setelah data diterima, pilih ongkos kirim sesuai kurir yang dipilih
      if (res.data && res.data.data && res.data.data.calculate_reguler) {
        const selectedCourier = res.data.data.calculate_reguler.find(
          (item) =>
            item.shipping_name.toLowerCase() === shipping.courier.toLowerCase()
        );

        if (selectedCourier) {
          setShippingCost(selectedCourier.shipping_cost); // Set ongkos kirim yang sesuai
        } else {
          console.error("Kurir tidak ditemukan.");
        }
      }
    } catch (err) {
      // console.error("Gagal ambil ongkir:", err.response?.data || err.message);
    }
  };

  // useEffect(() => {
  //   if (shipping?.address?.id && shipping?.courier) {
  //     checkShipping();
  //   }
  // }, [shipping.address, shipping.courier]);
  useEffect(() => {
    checkShipping();
  }, []);

  return (
    <>
      <Header mode="dark" cart={cart} />

      {/* <!-- START: BREADCRUMB --> */}
      <section className="bg-gray-100 py-8 px-4">
        <div className="container mx-auto">
          <ul className="breadcrumb">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/cart" aria-label="current-page" className="text-[#f472b6]">
                Cart
              </Link>
            </li>
          </ul>
        </div>
      </section>
      {/* <!-- END: BREADCRUMB --> */}

      <section className="md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex -mx-4 flex-wrap">
            <div
              className="w-full px-4 mb-4 md:w-8/12 md:mb-0"
              id="shopping-cart"
            >
              <div className="flex flex-start mb-4 mt-8 pb-3 border-b border-gray-200 md:border-b-0">
                <h3 className="text-2xl text-[#f472b6]">Shopping Cart</h3>
              </div>

              <div className="border-b border-[#F9CADA]  mb-4 hidden md:block">
                <div className="flex flex-start items-center pb-2 -mx-4">
                  <div className="px-4 flex-none">
                    <div className="" style={{ width: "90px" }}>
                      <h6>Photo</h6>
                    </div>
                  </div>
                  <div className="px-4 w-5/12">
                    <div className="">
                      <h6>Product</h6>
                    </div>
                  </div>
                  <div className="px-4 w-5/12">
                    <div className="">
                      <h6>Price</h6>
                    </div>
                  </div>
                  <div className="px-4 w-2/12">
                    <div className="text-center">
                      <h6>Action</h6>
                    </div>
                  </div>
                </div>
              </div>

              {cart && cart.length === 0 && (
                <p id="cart-empty" className="text-center py-8">
                  Ooops... Cart is empty.{" "}
                  <Link to="/" className="underline text-[#F9CADA]">
                    Shop Now
                  </Link>
                </p>
              )}

              {/* <!-- START: ROW 1 --> */}
              {cart.length > 0 &&
                cart.map(function ({ id, item }, index) {
                  return (
                    <div
                      key={index}
                      className="flex flex-start flex-wrap items-center mb-4 -mx-4"
                      data-row="1"
                    >
                      <div className="px-4 flex-none">
                        <div
                          className=""
                          style={{ width: "90px", height: "90px" }}
                        >
                          <img
                            src={item.image}
                            alt="chair-1"
                            className="object-contain rounded-xl w-full h-full"
                          />
                        </div>
                      </div>
                      <div className="px-4 w-auto flex-1 md:w-5/12">
                        <div className="">
                          <h6 className="font-semibold text-lg md:text-xl leading-8">
                            {item.title}
                          </h6>
                          <span className="text-sm md:text-lg">
                            {item.category}
                            {}{" "}
                          </span>
                          <h6 className="font-semibold text-base md:text-lg block md:hidden">
                            {numberFormat(item.price)}
                          </h6>
                        </div>
                      </div>
                      <div className="px-4 w-auto flex-none md:flex-1 md:w-5/12 hidden md:block">
                        <div className="">
                          <h6 className="font-semibold text-lg">
                            {numberFormat(item.price)}
                          </h6>
                        </div>
                      </div>
                      <div className="px-4 w-2/12">
                        <div className="text-center">
                          <button
                            // data-delete-item="1"
                            onClick={(event) => handleRemoveCartItem(event, id)}
                            className="text-red-600 border-none focus:outline-none px-3 py-1"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {cart.length > 0 && (
                <div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-xl font-semibold">Total:</h4>
                  <h4 className="text-xl font-semibold">
                    {numberFormat(totalPrice)}
                  </h4>
                </div>
              )}

              {/* <!-- END: ROW 1 --> */}
            </div>
            <div className="w-full md:px-4 md:w-4/12" id="shipping-detail">
              <div className="bg-gray-100 px-4 py-6 md:p-8 md:rounded-3xl border border-[#F9CADA]">
                {/* Form Shipping */}
                <form onSubmit={handleCheckout}>
                  <div className="flex flex-start mb-6">
                    <h3 className="text-2xl text-[#f472b6]">Shipping Details</h3>
                  </div>

                  <div className="flex flex-col mb-4">
                    <label htmlFor="name" className="text-sm mb-2">
                      Complete Name
                    </label>
                    <input
                      data-input
                      type="text"
                      id="name"
                      className="border-gray-200 border rounded-lg px-4 py-2 bg-white text-sm focus:border-blue-200 focus:outline-none"
                      placeholder="Input your name"
                      value={shipping.name}
                      onChange={(e) =>
                        setShipping({ ...shipping, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col mb-4">
                    <label htmlFor="email" className="text-sm mb-2">
                      Email Address
                    </label>
                    <input
                      data-input
                      type="email"
                      id="email"
                      className="border-gray-200 border rounded-lg px-4 py-2 bg-white text-sm focus:border-blue-200 focus:outline-none"
                      placeholder="Input your email address"
                      value={shipping.email}
                      onChange={(e) =>
                        setShipping({ ...shipping, email: e.target.value })
                      }
                    />
                  </div>

                  {/* <div className="flex flex-col mb-4">
                    <label htmlFor="address" className="text-sm mb-2">
                      Address
                    </label>
                    <input
                      data-input
                      type="text"
                      id="address"
                      className="border-gray-200 border rounded-lg px-4 py-2 bg-white text-sm focus:border-blue-200 focus:outline-none"
                      placeholder="Input your address"
                      value={shipping.address}
                      onChange={(e) =>
                        setShipping({ ...shipping, address: e.target.value })
                      }
                    />
                  </div> */}

                  <div className="flex flex-col mb-4">
                    <label htmlFor="address" className="text-sm mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      id="city"
                      className="border-gray-200 border rounded-lg px-4 py-2 bg-white text-sm focus:border-blue-200 focus:outline-none"
                      placeholder="Search your city"
                      value={citySearch}
                      onChange={(e) => {
                        console.log("yang diketik:", e.target.value);
                        // setCitySearch(e.target.value);
                        // handleCitySearch(e.target.value);
                        const value = e.target.value;
                        setCitySearch(value);

                        if (typingTimeout) clearTimeout(typingTimeout);

                        const timeout = window.setTimeout(() => {
                          handleCitySearch(value);
                        }, 500); // nunggu 500ms setelah user berhenti ngetik

                        setTypingTimeout(timeout);
                      }}
                    />

                    {/* Dropdown hasil pencarian */}
                    {cityResults.length > 0 && (
                      <ul className="mt-2 border rounded bg-white max-h-40 overflow-y-auto text-sm">
                        {cityResults.map((city) => (
                          <li
                            key={city.id}
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                            onClick={() => {
                              setShipping({
                                ...shipping,
                                address: city, // <- ini ubahannya
                              });
                              setCitySearch(city.city_name);
                              setCityResults([]); // clear dropdown
                            }}
                          >
                            {city.city_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="flex flex-col mb-4">
                    <label htmlFor="phone" className="text-sm mb-2">
                      Phone Number
                    </label>
                    <input
                      data-input
                      type="tel"
                      id="phone"
                      className="border-gray-200 border rounded-lg px-4 py-2 bg-white text-sm focus:border-blue-200 focus:outline-none"
                      placeholder="Input your phone number"
                      value={shipping.phone}
                      onChange={(e) =>
                        setShipping({ ...shipping, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col mb-4">
                    <label htmlFor="complete-name" className="text-sm mb-2">
                      Choose Courier
                    </label>
                    <div className="flex -mx-2 flex-wrap">
                      <div className="px-2 w-6/12 h-24 mb-4">
                        <button
                          type="button"
                          data-value="JNE"
                          data-name="courier"
                          value={shipping.courier}
                          onClick={() => handleCourierClick("jne")}
                          //   setShipping({ ...shipping, courier: "jne" });
                          //   console.log("Updated shipping:", {
                          //     ...shipping,
                          //     courier: "jne",
                          //   });
                          //   checkShipping();

                          // }}
                          className={`border ${shipping.courier === "jne" ? "focus:border-red-200" : "border-gray-200"} flex items-center justify-center rounded-xl bg-white w-full h-full focus:outline-none`}
                        >
                          <img
                            src="./images/content/logo-jne.svg"
                            alt="Logo JNE"
                            className="object-contain max-h-12"
                          />
                        </button>
                      </div>
                      <div className="px-2 w-6/12 h-24 mb-4">
                        <button
                          type="button"
                          data-value="SICEPAT"
                          data-name="courier"
                          value={shipping.courier}
                          onClick={() => handleCourierClick("sicepat")}
                          //   setShipping({ ...shipping, courier: "sicepat" });
                          //   checkShipping();
                          //   console.log("Updated shipping:", {
                          //     ...shipping,
                          //     courier: "sicepat",
                          //   });
                          // }}
                          className={`border ${shipping.courier === "sicepat" ? "focus:border-red-200" : "border-gray-200"} flex items-center justify-center rounded-xl bg-white w-full h-full focus:outline-none`}
                        >
                          <img
                            src="./images/content/logo-sicepat.svg"
                            alt="Logo SiCepat"
                            className="object-contain max-h-9"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col mb-4">
                    <label htmlFor="complete-name" className="text-sm mb-2">
                      Choose Payment
                    </label>
                    <div className="flex -mx-2 flex-wrap">
                      <div className="px-2 w-full h-24 mb-4">
                        <button
                          type="button"
                          data-value="midtrans"
                          data-name="payment"
                          onClick={() => {
                            setShipping({ ...shipping, payment: "midtrans" });
                            // console.log("Updated shipping:", {
                            //   ...shipping,
                            //   payment: "midtrans",
                            // });
                          }}
                          className={`border ${shipping.payment === "midtrans" ? "focus:border-red-200" : "border-gray-200"} flex items-center justify-center rounded-xl bg-white w-full h-full focus:outline-none`}
                        >
                          <img
                            src="./images/content/logo-midtrans.png"
                            alt="Logo midtrans"
                            className="object-contain max-h-full"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col mb-4">
                    <div className="flex justify-end mb-4">
                      <h4 className="text-sm font-semibold">
                        Shipping Cost: {formatShippingCost(shippingCost)}
                      </h4>
                    </div>
                    <div className="flex justify-end mb-4">
                      <h4 className="text-sm font-semibold">
                        Total Cost: {formatShippingCost(totalCost)} 
                      </h4>
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={!isShipValid}
                      className={`w-full py-3 rounded-full text-lg focus:text-black transition-all duration-200 px-6 ${isShipValid ? "bg-pink-400 text-black hover:bg-black hover:text-pink-400" : "bg-gray-300 cursor-not-allowed"} focus:outline-none`}
                    >
                      Checkout Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AsideMenu />
      <Footer />
    </>
  );
}

export default Cart;
