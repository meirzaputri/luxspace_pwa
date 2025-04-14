import express from "express";
import midtransClient from "midtrans-client";
import axios from "axios";

import "dotenv/config";
// console.log("MIDTRANS_SERVER_KEY:", process.env.MIDTRANS_SERVER_KEY);

const router = express.Router();
const USD_TO_IDR = 15000;

// MIDTRANS
router.post("/process-transaction", async (req, res) => {
  // console.log("Request received:", req.body);

  // Debug isi request body
  // console.log("Items yang diterima di BE:", JSON.stringify(req.body.items, null, 2));

  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const itemDetails = req.body.items.map((cartItem) => ({
      id: cartItem.item.id,
      name: cartItem.item.title.substring(0, 50),
      price: Math.round(cartItem.item.price * USD_TO_IDR),
      quantity: cartItem.quantity ?? 1,
    }));

    itemDetails.push({
      id: "shipping",
      name: `Shipping via ${req.body.shipping.courier}`,
      price: Math.round(req.body.shippingCost),
      quantity: 1,
    });

    console.log("Item Details:", itemDetails);

    const totalCost = itemDetails.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const parameter = {
      transaction_details: {
        order_id: req.body.order_id,
        gross_amount: totalCost,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: req.body.shipping.name,
        email: req.body.shipping.email,
        phone: req.body.shipping.phone,
      },
      callbacks: {
        finish: "http://localhost:3000/success",
      },
    };

    const transaction = await snap.createTransaction(parameter);

    const dataPayment = {
      response: JSON.stringify(transaction),
    };

    const token = transaction.token;

    return res.status(200).json({ message: "Berhasil", dataPayment, token });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ message: error.message });
  }
});

// RAJAONGKIR
router.get("/check-cities", async (req, res) => {
  const search = req.query.search;

  if (!search) {
    return res.status(422).json({
      meta: {
        message: "search: cannot be blank.",
        code: 422,
        status: "error",
      },
      data: null,
    });
  }

  try {
    const response = await axios.get(
      "https://rajaongkir.komerce.id/api/v1/destination/domestic-destination",
      {
        headers: {
          accept: "application/json",
          key: process.env.RAJAONGKIR_API_KEY,
        },
        params: {
          search: search,
        },
      }
    );

    const json = response.data;
    const allCities = json.data;

    if (!Array.isArray(allCities)) {
      console.error("Data kota tidak valid:", allCities);
      return res.status(500).json({
        error: "Data kota tidak valid dari RajaOngkir",
      });
    }

    // filter lokal
    const filtered = allCities.filter((city) =>
      city.city_name.toLowerCase().includes(search.toLowerCase())
    );

    res.status(200).json(filtered);
  } catch (err) {
    console.error("Gagal ambil data kota dari RajaOngkir:", err);
    res.status(500).json({
      error: "Gagal ambil data kota dari RajaOngkir",
      details: err.message,
    });
  }
});

router.get("/check-shipping", async (req, res) => {
  const {
    shipper_destination_id,
    receiver_destination_id,
    weight,
    item_value,
    cod,
    courier,
  } = req.query;

  try {
    const response = await axios.get(
      "https://api-sandbox.collaborator.komerce.id/tariff/api/v1/calculate",
      {
        headers: {
          accept: "application/json",
          "x-api-key": process.env.RAJAONGKIRSHIP_API_KEY,
        },
        params: {
          shipper_destination_id,
          receiver_destination_id,
          weight,
          item_value: Math.round(item_value * USD_TO_IDR),
          cod,
        },
      }
    );

    const regulars = response.data?.data?.calculate_reguler || [];

    // // Kirimkan data ongkir tanpa memilih kurir
    res.status(200).json({
      data: {
        calculate_reguler: regulars,
      },
    });
  } catch (err) {
    console.error(
      "Error fetching shipping cost:",
      err.response?.data || err.message
    );
    res.status(500).json({ message: "Gagal mengambil ongkos kirim" });
  }
});

export default router;
