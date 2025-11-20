# Product API Testing Guide

## 🚀 Server Info
- Base URL: `http://localhost:8000`
- API Base: `http://localhost:8000/api/v1/product`

## 📋 Prerequisites

### 1. Start Server
```bash
cd /home/rhd/Desktop/E-COM/server
npm run dev
```

### 2. Login as Admin (to get auth cookies)
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "your-admin@gmail.com",
    "password": "your-password"
  }'
```

**Important:** Make sure the user has `role: "admin"` in database!

---

## 🧪 Test Cases

### ✅ 1. Get All Products (Public Route)
```bash
curl -X GET http://localhost:8000/api/v1/product \
  -H "Content-Type: application/json"
```

**Expected:** Array of all products

---

### ✅ 2. Get Featured Products (Public Route)
```bash
curl -X GET http://localhost:8000/api/v1/product/featured \
  -H "Content-Type: application/json"
```

**Expected:** Cached featured products from Redis

---

### ✅ 3. Get Products by Category (Public Route)
```bash
curl -X GET http://localhost:8000/api/v1/product/category/Drones \
  -H "Content-Type: application/json"
```

**Expected:** Products filtered by category "Drones"

---

### ✅ 4. Get Recommended Products (Public Route)
```bash
curl -X GET http://localhost:8000/api/v1/product/recommendations \
  -H "Content-Type: application/json"
```

**Expected:** 4 random products

---

### ✅ 5. Create Product with Stock & Multiple Images (Admin Only)

**Note:** For images, you need base64 encoded strings. Use a small image for testing.

```bash
curl -X POST http://localhost:8000/api/v1/product \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "DJI Mavic Air 2",
    "description": "Professional drone with 48MP camera and 4K video recording",
    "price": 799,
    "category": "Drones",
    "stock": 25,
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "images": [
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    ]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "...",
    "name": "DJI Mavic Air 2",
    "price": 799,
    "stock": 25,
    "image": "https://res.cloudinary.com/...",
    "images": ["https://res.cloudinary.com/..."],
    "isAvailable": true,
    "soldCount": 0
  }
}
```

---

### ✅ 6. Update Product (Admin Only)

**Save the product ID from step 5, then:**

```bash
curl -X PATCH http://localhost:8000/api/v1/product/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "DJI Mavic Air 2 Pro",
    "price": 899,
    "description": "Updated professional drone"
  }'
```

---

### ✅ 7. Update Stock (Admin Only)

**Set Stock to 100:**
```bash
curl -X PATCH http://localhost:8000/api/v1/product/PRODUCT_ID/stock \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "stock": 100,
    "operation": "set"
  }'
```

**Add 50 units:**
```bash
curl -X PATCH http://localhost:8000/api/v1/product/PRODUCT_ID/stock \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "stock": 50,
    "operation": "add"
  }'
```

**Subtract 10 units:**
```bash
curl -X PATCH http://localhost:8000/api/v1/product/PRODUCT_ID/stock \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "stock": 10,
    "operation": "subtract"
  }'
```

---

### ✅ 8. Add More Images (Admin Only)
```bash
curl -X POST http://localhost:8000/api/v1/product/PRODUCT_ID/images \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "images": [
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    ]
  }'
```

---

### ✅ 9. Remove Image (Admin Only)

**First get product to see image URLs:**
```bash
curl -X GET http://localhost:8000/api/v1/product
```

**Then remove specific image:**
```bash
curl -X DELETE http://localhost:8000/api/v1/product/PRODUCT_ID/images \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "imageUrl": "https://res.cloudinary.com/doejdsmym/image/upload/v.../products/..."
  }'
```

---

### ✅ 10. Update Main Image (Admin Only)
```bash
curl -X PATCH http://localhost:8000/api/v1/product/PRODUCT_ID/main-image \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }'
```

---

### ✅ 11. Toggle Featured Status (Admin Only)
```bash
curl -X PATCH http://localhost:8000/api/v1/product/PRODUCT_ID/featured \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

---

### ✅ 12. Delete Product (Admin Only)
```bash
curl -X DELETE http://localhost:8000/api/v1/product/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

---

## 🎯 Postman Collection (Alternative)

If you prefer Postman, create a collection with these endpoints:

### Environment Variables:
- `baseUrl`: `http://localhost:8000`
- `productId`: (set after creating product)

### Headers (for all admin routes):
- Cookie: (auto-set from login)

---

## 📊 Testing with Real Images

To test with real images, convert them to base64:

### Using Node.js:
```javascript
const fs = require('fs');
const imageBuffer = fs.readFileSync('path/to/image.jpg');
const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
console.log(base64Image);
```

### Using Online Tool:
1. Go to: https://www.base64-image.de/
2. Upload your image
3. Copy the base64 string
4. Use in API calls

---

## ✅ Expected Behaviors

### Stock Management:
- Stock = 0 → `isAvailable` = false (automatic)
- Stock > 0 → `isAvailable` = true (automatic)
- `soldCount` increases when `decreaseStock()` is called

### Image Management:
- Max 10 additional images
- Cloudinary auto-optimization (1000x1000)
- Images deleted from Cloudinary when product deleted

### Redis Caching:
- Featured products cached
- Cache updated when featured status changes

---

## 🐛 Common Errors

### 1. "Unauthorized"
→ Make sure you logged in and saved cookies
→ Check user has `role: "admin"`

### 2. "Product not found"
→ Check product ID is correct
→ Product might be deleted

### 3. "Cannot add images"
→ Check total images < 10
→ Make sure images array is valid base64

### 4. "Insufficient stock"
→ Can't subtract more than available stock

---

## 📝 Test Checklist

- [ ] Get all products (no auth)
- [ ] Get featured products (no auth)
- [ ] Get products by category (no auth)
- [ ] Get recommendations (no auth)
- [ ] Login as admin
- [ ] Create product with stock & images
- [ ] Update product details
- [ ] Set stock to 100
- [ ] Add 50 to stock
- [ ] Subtract 10 from stock
- [ ] Add 2 more images
- [ ] Remove one image
- [ ] Update main image
- [ ] Toggle featured status
- [ ] Verify featured products cached
- [ ] Delete product
- [ ] Verify images deleted from Cloudinary

---

## 🎬 Quick Start Script

Save this as `test-products.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:8000"

echo "1. Testing public routes..."
curl -X GET $BASE_URL/api/v1/product
echo -e "\n\n2. Testing featured products..."
curl -X GET $BASE_URL/api/v1/product/featured

echo -e "\n\n3. Login as admin..."
curl -X POST $BASE_URL/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'

echo -e "\n\n4. Creating product..."
PRODUCT_RESPONSE=$(curl -X POST $BASE_URL/api/v1/product \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Test Drone",
    "description": "Test product",
    "price": 499,
    "category": "Drones",
    "stock": 50,
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }')

echo $PRODUCT_RESPONSE

# Extract product ID from response (requires jq)
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | jq -r '.product._id')

echo -e "\n\nProduct ID: $PRODUCT_ID"

echo -e "\n\n5. Updating stock..."
curl -X PATCH $BASE_URL/api/v1/product/$PRODUCT_ID/stock \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "stock": 100,
    "operation": "set"
  }'

echo -e "\n\nDone!"
```

Run it:
```bash
chmod +x test-products.sh
./test-products.sh
```

---

Need help with any specific test case? Let me know! 🚀
