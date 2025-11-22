import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ChevronRight, Calendar, CreditCard, Truck } from "lucide-react";
import { getUserOrders } from "../utils/order";
import { toast } from "react-toastify";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const ordersData = await getUserOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View your recent orders from the last 15 days</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders in the last 15 days</p>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-semibold text-gray-900">#{getOrderIdShort(order._id)}</p>
                      </div>
                      <div className="h-8 w-px bg-gray-200"></div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-gray-200"></div>
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                          <CreditCard size={14} />
                          ₹{order.totalAmount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                      <ChevronRight className="text-gray-400" size={20} />
                    </div>
                  </div>

                  {/* Products */}
                  <div className="space-y-3">
                    {order.products.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={item.product?.coverImage || "/mouse.png"}
                          alt={item.product?.name || "Product"}
                          className="w-16 h-16 object-contain bg-gray-50 rounded-lg p-2"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.product?.name || "Product"}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">₹{item.price}</p>
                      </div>
                    ))}
                    {order.products.length > 2 && (
                      <p className="text-sm text-gray-500 text-center pt-2">
                        +{order.products.length - 2} more item(s)
                      </p>
                    )}
                  </div>

                  {/* Shipping Address Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-start gap-2">
                    <Truck size={16} className="text-gray-400 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
