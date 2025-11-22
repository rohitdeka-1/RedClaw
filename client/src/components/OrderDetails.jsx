import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Truck, CheckCircle } from "lucide-react";
import { getOrderById } from "../utils/order";
import { toast } from "react-toastify";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error("Error loading order:", error);
      toast.error("Failed to load order details");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusSteps = (currentStatus) => {
    const steps = [
      { status: "pending", label: "Order Placed", icon: Package },
      { status: "processing", label: "Processing", icon: CheckCircle },
      { status: "shipped", label: "Shipped", icon: Truck },
      { status: "delivered", label: "Delivered", icon: CheckCircle },
    ];

    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderIdShort = (orderId) => {
    return orderId.slice(-8).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const statusSteps = getStatusSteps(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Orders</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
              <p className="text-gray-600">Order ID: #{getOrderIdShort(order._id)}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase border-2 ${getStatusColor(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Order Status Timeline */}
        {order.orderStatus !== "cancelled" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
            <div className="relative">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.status} className="flex flex-col items-center flex-1 relative">
                      {/* Line */}
                      {index !== statusSteps.length - 1 && (
                        <div
                          className={`absolute top-5 left-1/2 h-0.5 w-full ${
                            step.completed ? "bg-green-500" : "bg-gray-200"
                          }`}
                          style={{ zIndex: 0 }}
                        ></div>
                      )}
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 ${
                          step.completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      {/* Label */}
                      <p
                        className={`mt-2 text-sm font-medium text-center ${
                          step.active ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Products & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.products.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={item.product?.coverImage || "/mouse.png"}
                      alt={item.product?.name || "Product"}
                      className="w-20 h-20 object-contain bg-gray-50 rounded-lg p-2"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product?.name || "Product"}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.product?.description || ""}</p>
                      <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                      <p className="text-sm text-gray-500">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Billing Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={18} className="text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-gray-600 mt-1">{order.shippingAddress.phone}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard size={18} className="text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Billing Address</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">{order.billingAddress.fullName}</p>
                    <p className="text-sm text-gray-600 mt-1">{order.billingAddress.phone}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {order.billingAddress.addressLine1}
                      {order.billingAddress.addressLine2 && `, ${order.billingAddress.addressLine2}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.billingAddress.city}, {order.billingAddress.state} - {order.billingAddress.pincode}
                    </p>
                    <p className="text-sm text-gray-600">{order.billingAddress.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Order Info */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>Ordered on {formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard size={16} />
                  <span>Payment ID: {order.razorpayPaymentId.slice(-10)}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">
                    ₹{order.products.reduce((sum, p) => sum + p.price * p.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="text-gray-900 font-medium">
                    ₹{Math.round(order.products.reduce((sum, p) => sum + p.price * p.quantity, 0) * 0.18)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-900 font-bold">Total Paid</span>
                <span className="text-2xl font-bold text-gray-900">₹{order.totalAmount}</span>
              </div>

              {/* Need Help */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Need Help?</p>
                <p className="text-xs text-gray-600 mb-3">Contact our support team for any queries</p>
                <a
                  href="mailto:support@redclaw.com"
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  support@redclaw.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
