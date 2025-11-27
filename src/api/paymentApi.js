import axiosClient from "./axiosClient";

const paymentApi = {
  createOrder: (data) => axiosClient.post("/payment/order", data),
};

export default paymentApi;
