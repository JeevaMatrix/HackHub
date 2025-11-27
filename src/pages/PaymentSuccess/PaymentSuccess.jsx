import React from "react";
import { useSearchParams } from "react-router-dom";
import "./paymentSuccess.css";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  return (
    <div className="ps-container">
      <div className="ps-card">
        <h1 className="ps-title">🎉 Payment Successful!</h1>

        <p className="ps-subtitle">
          Your payment has been received. We are verifying your registration.
        </p>

        <div className="ps-info-box">
          <p className="ps-label">Order ID</p>
          <p className="ps-value">{orderId}</p>
        </div>

        <p className="ps-note">
          You can now check your registration status on the dashboard.
        </p>

        <a className="ps-btn" href="/my-registrations">
          Go to My Registrations
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
