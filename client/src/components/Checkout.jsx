import { useState, useEffect } from "react"
import { ShoppingCart, Plus, Check, ArrowLeft, Lock, Minus, X } from "lucide-react"
import { isAuthenticated } from "../utils/auth"
import { getCartItems, updateCartQuantity, removeFromCart } from "../utils/cart"
import { getAddresses, addAddress, deleteAddress, setDefaultAddress } from "../utils/address"

// Product IDs for mapping UI data
const productIds = {
    viper: "69217d1d207a876c86407fd0",
    phantom: "69217d1d207a876c86407fd1",
    inferno: "69217d1d207a876c86407fd2",
};

// UI-only product data (for quick rendering)
const productUIData = {
    [productIds.viper]: {
        bgColor: "#0f172a",
        midColor: "#9ca3af",
        logo: "/temp.png",
        colors: ["black", "white", "gray"],
        image: "/mouse.png",
    },
    [productIds.phantom]: {
        bgColor: "#7c3aed",
        midColor: "#c4b5fd",
        logo: "/white-temp.png",
        colors: ["black", "white", "gray"],
        image: "/mouse2.png",
    },
    [productIds.inferno]: {
        bgColor: "#ea580c",
        midColor: "#fed7aa",
        logo: "/temp2.png",
        colors: ["Black", "white", "gray"],
        image: "/mouse.png",
    },
};

export default function Checkout() {
  const [cart, setCart] = useState([])
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  })

  useEffect(() => {
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      loadCartFromServer();
      loadAddressesFromServer();
    } else {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      
      // Filter out old invalid cart items (numeric IDs)
      const validCart = savedCart.filter(item => {
        const id = item.productId || item.id || item._id;
        return id && typeof id === 'string' && id.length === 24 && /^[a-f\d]{24}$/i.test(id);
      });
      
      if (validCart.length !== savedCart.length) {
        localStorage.setItem("cart", JSON.stringify(validCart));
      }
      
      setCart(validCart);
    }
  }, []);

  const loadCartFromServer = async () => {
    try {
      const cartData = await getCartItems();
      // Merge with UI data
      const enrichedCart = cartData.map(item => ({
        ...item,
        ...(productUIData[item._id] || {}),
      }));
      setCart(enrichedCart);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const loadAddressesFromServer = async () => {
    try {
      const addressData = await getAddresses();
      setAddresses(addressData);
      // Set the first default address as selected
      const defaultAddr = addressData.find(addr => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr._id);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    if (isLoggedIn) {
      try {
        await updateCartQuantity(itemId, newQuantity);
        await loadCartFromServer();
      } catch (error) {
        console.error("Error updating quantity:", error);
        alert("Failed to update quantity");
      }
    } else {
      const updatedCart = cart.map(item =>
        item._id === itemId || item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (isLoggedIn) {
      try {
        await removeFromCart(itemId);
        await loadCartFromServer();
      } catch (error) {
        console.error("Error removing item:", error);
        alert("Failed to remove item");
      }
    } else {
      const updatedCart = cart.filter(item => item._id !== itemId && item.id !== itemId);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert("Please login to save addresses");
      return;
    }

    try {
      const result = await addAddress(addressForm);
      setAddresses(result.addresses);
      
      // Select the newly added address
      const newAddr = result.addresses[result.addresses.length - 1];
      setSelectedAddress(newAddr._id);
      
      setShowAddressForm(false);
      setAddressForm({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        isDefault: false,
      });
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address. Please try again.");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!isLoggedIn) return;
    
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        const result = await deleteAddress(addressId);
        setAddresses(result.addresses);
        
        // Clear selection if deleted address was selected
        if (selectedAddress === addressId) {
          setSelectedAddress(null);
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("Failed to delete address. Please try again.");
      }
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    if (!isLoggedIn) return;
    
    try {
      const result = await setDefaultAddress(addressId);
      setAddresses(result.addresses);
    } catch (error) {
      console.error("Error setting default address:", error);
      alert("Failed to set default address. Please try again.");
    }
  };

  const handleCheckout = async () => {
    

    setLoading(true)

    try {
      const products = cart.map((item) => ({
        _id: item.id,
        quantity: item.quantity || 1,
        price: item.price || 0,
      }))

      console.log("Processing payment with:", {
        products,
        addressId: selectedAddress,
        couponCode,
      })

      setTimeout(() => {
        setLoading(false)
        
      }, 2000)
    } catch (error) {
      console.error("Checkout error:", error)
       
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full px-4 md:px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-gray-900 text-xl font-bold">Checkout</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {cart.length === 0 ? (
          <div className="min-h-96 flex flex-col items-center justify-center">
            <ShoppingCart size={64} className="text-gray-300 mb-6" />
            <h2 className="text-gray-900 text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add items to your cart to proceed with checkout</p>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-gray-900 text-lg font-bold mb-6">Order Items</h2>
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div
                      key={item._id || item.id || index}
                      className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                    >
                      <img
                        src={item.image || item.coverImage || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-contain rounded bg-gray-50 p-2"
                      />
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-semibold">{item.name}</h3>
                        <p className="text-gray-500 text-sm">Color: {item.selectedColor || item.colors?.[0] || "Black"}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                            <button
                              onClick={() => handleUpdateQuantity(item._id || item.id, item.quantity - 1)}
                              className="text-gray-600 hover:text-gray-900 transition p-1"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-gray-900 font-medium text-sm min-w-[20px] text-center">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id || item.id, item.quantity + 1)}
                              className="text-gray-600 hover:text-gray-900 transition p-1"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item._id || item.id)}
                            className="text-red-500 hover:text-red-700 transition text-xs flex items-center gap-1"
                          >
                            <X size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 font-semibold">₹{(item.price || 0) * (item.quantity || 1)}</p>
                        <p className="text-gray-500 text-sm">₹{item.price || 0} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-gray-900 text-lg font-bold">Shipping Address</h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                  >
                    <Plus size={16} />
                    Add Address
                  </button>
                </div>

                {/* Address Form */}
                {showAddressForm && (
                  <form
                    onSubmit={handleAddressSubmit}
                    className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4 border border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        required
                        className="bg-white text-gray-900 px-4 py-2 rounded border border-gray-300 focus:border-gray-900 focus:outline-none transition placeholder-gray-400"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        required
                        className="bg-white text-gray-900 px-4 py-2 rounded border border-gray-300 focus:border-gray-900 focus:outline-none transition placeholder-gray-400"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      value={addressForm.addressLine1}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                      required
                      className="w-full bg-white text-gray-900 px-4 py-2 rounded border border-gray-300 focus:border-gray-900 focus:outline-none transition placeholder-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2 (Optional)"
                      value={addressForm.addressLine2}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                      className="w-full bg-white text-gray-900 px-4 py-2 rounded border border-gray-300 focus:border-gray-900 focus:outline-none transition placeholder-gray-400"
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                        className="bg-white text-gray-900 px-4 py-2 rounded border border-gray-300 focus:border-gray-900 focus:outline-none transition placeholder-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        required
                        className="bg-white text-gray-900 px-4 py-2 rounded border border-gray-300 focus:border-gray-900 focus:outline-none transition placeholder-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        required
                        className="bg-white text-gray-900 px-4 py-2 rounded border border-gray-300 focus:border-gray-900 focus:outline-none transition placeholder-gray-400"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 transition border border-gray-300 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Address List */}
                {addresses.length === 0 && !showAddressForm ? (
                  <p className="text-gray-500 text-center py-8">No saved addresses yet. Add one to continue.</p>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`p-4 rounded-lg transition border-2 ${
                          selectedAddress === address._id
                            ? "bg-blue-50 border-blue-300 shadow-sm"
                            : "bg-gray-50 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => setSelectedAddress(address._id)}
                          >
                            <div className="flex items-center gap-3">
                              <h3 className="text-gray-900 font-semibold">{address.fullName}</h3>
                              {address.isDefault && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium">
                                  Default
                                </span>
                              )}
                              {selectedAddress === address._id && <Check size={18} className="text-blue-600" />}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{address.phone}</p>
                            <p className="text-gray-600 text-sm mt-2">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                          </div>
                          
                          {isLoggedIn && (
                            <div className="flex flex-col gap-2 ml-3">
                              {!address.isDefault && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSetDefaultAddress(address._id);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-xs font-medium transition"
                                >
                                  Set Default
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAddress(address._id);
                                }}
                                className="text-red-500 hover:text-red-700 text-xs font-medium transition"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm sticky top-20">
                <h2 className="text-gray-900 text-lg font-bold mb-6">Order Summary</h2>

                {/* Promo Code */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="text-gray-700 text-sm mb-2 block font-medium">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-gray-50 text-gray-900 px-3 py-2 rounded border border-gray-300 focus:border-gray-900 focus:outline-none transition placeholder-gray-400 text-sm"
                    />
                    <button className="bg-gray-900 text-white px-4 py-2 rounded font-medium hover:bg-gray-800 transition text-sm">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Tax (18%)</span>
                    <span className="font-medium text-gray-900">₹{Math.round(calculateTotal() * 0.18)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                  <span className="text-gray-900 font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{calculateTotal() + Math.round(calculateTotal() * 0.18)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0 || !selectedAddress}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mb-6">
                  <Lock size={14} />
                  <span>Secure & Encrypted</span>
                </div>

                {/* Trust Information */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-3">Why shop with us</p>
                  <ul className="space-y-2 text-gray-600 text-xs">
                    <li className="flex gap-2">
                      <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>2-Year Warranty</span>
                    </li>
                    <li className="flex gap-2">
                      <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Free Returns (30 Days)</span>
                    </li>
                    <li className="flex gap-2">
                      <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>SSL Secure Payment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
