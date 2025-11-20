# 🚀 Product API - Postman Testing Guide

Complete guide for testing the E-COM Product API using Postman.

---

## 📋 Initial Setup

### Step 1: Start Your Server
```bash
cd /home/rhd/Desktop/E-COM/server
npm run dev
```
✅ Server should be running on `http://localhost:8000`

---

### Step 2: Create Postman Environment

1. Open Postman
2. Click **"Environments"** (left sidebar)
3. Click **"Create Environment"** or **"+"**
4. Name it: **"E-COM Local"**
5. Add these variables:

| Variable | Initial Value | Current Value |
|----------|--------------|---------------|
| `baseUrl` | `http://localhost:8000` | `http://localhost:8000` |
| `apiUrl` | `{{baseUrl}}/api/v1` | (auto-filled) |
| `productId` | (leave empty) | (auto-filled by tests) |
| `adminEmail` | `your-admin@gmail.com` | `your-admin@gmail.com` |
| `adminPassword` | `your-password` | `your-password` |

6. Click **"Save"**
7. Select **"E-COM Local"** from environment dropdown (top-right)

---

## 📁 Create Collection Structure

1. Click **"Collections"** → **"Create Collection"**
2. Name it: **"E-COM Product API"**
3. Create folders inside collection:
   - **0. Auth**
   - **1. Public Routes**
   - **2. Admin - CRUD**
   - **3. Admin - Stock Management**
   - **4. Admin - Image Management**

---

## 🔐 Folder 0: Auth

### Request: Login as Admin

**Details:**
- **Method:** `POST`
- **URL:** `{{apiUrl}}/auth/login`
- **Body Type:** JSON (raw)

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "{{adminEmail}}",
  "password": "{{adminPassword}}"
}
```

**Tests Tab** (Add this script):
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.user).to.exist;
});

pm.test("Cookies are set", function () {
    pm.expect(pm.cookies.has('accessToken')).to.be.true;
    pm.expect(pm.cookies.has('refreshToken')).to.be.true;
});

console.log("✅ Logged in successfully! Cookies saved.");
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "email": "your-admin@gmail.com",
    "name": "Admin",
    "role": "admin"
  }
}
```

**⚠️ Important:** Your user MUST have `"role": "admin"` in MongoDB!

---

## 📂 Folder 1: Public Routes

### 1.1 Get All Products

- **Method:** `GET`
- **URL:** `{{apiUrl}}/product`

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns products array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.products).to.be.an('array');
});

console.log("Total products:", pm.response.json().products.length);
```

---

### 1.2 Get Featured Products

- **Method:** `GET`
- **URL:** `{{apiUrl}}/product/featured`

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Featured products returned", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.products).to.be.an('array');
});

console.log("Featured products:", pm.response.json().products.length);
```

---

### 1.3 Get Products by Category

- **Method:** `GET`
- **URL:** `{{apiUrl}}/product/category/Drones`

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Category filter works", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.products).to.be.an('array');
    
    if (jsonData.products.length > 0) {
        jsonData.products.forEach(product => {
            pm.expect(product.category).to.eql("Drones");
        });
    }
});
```

**Categories available:** Drones, Cameras, Accessories, Batteries, etc.

---

### 1.4 Get Recommendations

- **Method:** `GET`
- **URL:** `{{apiUrl}}/product/recommendations`

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Returns max 4 products", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.products).to.be.an('array');
    pm.expect(jsonData.products.length).to.be.at.most(4);
});
```

---

## 📂 Folder 2: Admin - CRUD

**⚠️ Before testing these:** Run "Login as Admin" to get authentication cookies!

---

### 2.1 Create Product

- **Method:** `POST`
- **URL:** `{{apiUrl}}/product`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "DJI Mavic Air 2",
  "description": "Professional drone with 48MP camera and 4K video recording. Features obstacle avoidance and 34 minutes flight time.",
  "price": 799,
  "category": "Drones",
  "stock": 25,
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "images": [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  ]
}
```

**Tests:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Product created successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.product).to.have.property('_id');
    
    // 🎯 Save product ID to environment for other requests
    pm.environment.set("productId", jsonData.product._id);
    console.log("✅ Product ID saved:", jsonData.product._id);
});

pm.test("Product has correct properties", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.product.name).to.eql("DJI Mavic Air 2");
    pm.expect(jsonData.product.stock).to.eql(25);
    pm.expect(jsonData.product.isAvailable).to.eql(true);
    pm.expect(jsonData.product.soldCount).to.eql(0);
});

pm.test("Images uploaded to Cloudinary", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.product.image).to.include("cloudinary");
    pm.expect(jsonData.product.images[0]).to.include("cloudinary");
});
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "674d1234567890abcdef1234",
    "name": "DJI Mavic Air 2",
    "description": "Professional drone...",
    "price": 799,
    "category": "Drones",
    "stock": 25,
    "image": "https://res.cloudinary.com/doejdsmym/image/upload/v.../products/...",
    "images": ["https://res.cloudinary.com/..."],
    "isAvailable": true,
    "isFeatured": false,
    "soldCount": 0,
    "createdAt": "2024-12-02T10:30:00.000Z",
    "updatedAt": "2024-12-02T10:30:00.000Z"
  }
}
```

**📝 Note:** The base64 string is a tiny 1x1 pixel test image. See "Testing with Real Images" section below.

---

### 2.2 Update Product

- **Method:** `PATCH`
- **URL:** `{{apiUrl}}/product/{{productId}}`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "DJI Mavic Air 2 Pro",
  "price": 899,
  "description": "Updated professional drone with enhanced camera and longer battery life"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Product updated successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.product.name).to.eql("DJI Mavic Air 2 Pro");
    pm.expect(jsonData.product.price).to.eql(899);
});
```

---

### 2.3 Get Single Product

- **Method:** `GET`
- **URL:** `{{apiUrl}}/product/{{productId}}`

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Product retrieved", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.product._id).to.eql(pm.environment.get("productId"));
});
```

---

### 2.4 Toggle Featured Status

- **Method:** `PATCH`
- **URL:** `{{apiUrl}}/product/{{productId}}/featured`

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Featured status toggled", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.product).to.have.property('isFeatured');
    
    console.log("Featured status:", jsonData.product.isFeatured);
});
```

**📝 Note:** Run this request twice:
- 1st time: Sets featured to `true`
- 2nd time: Sets featured to `false`

---

### 2.5 Delete Product

- **Method:** `DELETE`
- **URL:** `{{apiUrl}}/product/{{productId}}`

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Product deleted successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.message).to.include("deleted");
});

console.log("✅ Product and all images deleted from Cloudinary");
```

**⚠️ Warning:** This permanently deletes:
- Product from MongoDB
- Main image from Cloudinary
- All additional images from Cloudinary

---

## 📂 Folder 3: Admin - Stock Management

### 3.1 Set Stock (Absolute Value)

- **Method:** `PATCH`
- **URL:** `{{apiUrl}}/product/{{productId}}/stock`

**Body:**
```json
{
  "stock": 100,
  "operation": "set"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Stock set correctly", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.product.stock).to.eql(100);
    pm.expect(jsonData.product.isAvailable).to.eql(true);
});
```

---

### 3.2 Add Stock (Increment)

- **Method:** `PATCH`
- **URL:** `{{apiUrl}}/product/{{productId}}/stock`

**Body:**
```json
{
  "stock": 50,
  "operation": "add"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Stock increased", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.product.stock).to.eql(150); // 100 + 50
});
```

---

### 3.3 Subtract Stock (Decrement)

- **Method:** `PATCH`
- **URL:** `{{apiUrl}}/product/{{productId}}/stock`

**Body:**
```json
{
  "stock": 10,
  "operation": "subtract"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Stock decreased", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.product.stock).to.eql(140); // 150 - 10
});
```

---

### 3.4 Set Stock to Zero

- **Method:** `PATCH`
- **URL:** `{{apiUrl}}/product/{{productId}}/stock`

**Body:**
```json
{
  "stock": 0,
  "operation": "set"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Stock is zero and product unavailable", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.product.stock).to.eql(0);
    pm.expect(jsonData.product.isAvailable).to.eql(false); // 🎯 Auto-set!
});
```

**✨ Auto-behavior:** When stock = 0, `isAvailable` automatically becomes `false`

---

## 📂 Folder 4: Admin - Image Management

### 4.1 Add More Images

- **Method:** `POST`
- **URL:** `{{apiUrl}}/product/{{productId}}/images`

**Body:**
```json
{
  "images": [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  ]
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Images added successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.product.images.length).to.be.at.least(2);
});

pm.test("Total images within limit", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.product.images.length).to.be.at.most(10);
});

console.log("Total images now:", pm.response.json().product.images.length);
```

**⚠️ Limit:** Maximum 10 additional images per product

---

### 4.2 Remove Specific Image

- **Method:** `DELETE`
- **URL:** `{{apiUrl}}/product/{{productId}}/images`

**Pre-request Script** (Auto-fetch image URL):
```javascript
// Get product to find an image URL to remove
const productId = pm.environment.get("productId");

pm.sendRequest({
    url: pm.environment.get("apiUrl") + "/product",
    method: 'GET',
}, function (err, response) {
    if (!err && response.code === 200) {
        const products = response.json().products;
        const product = products.find(p => p._id === productId);
        
        if (product && product.images && product.images.length > 0) {
            // Save first image URL to remove
            pm.environment.set("imageToRemove", product.images[0]);
            console.log("Image to remove:", product.images[0]);
        } else {
            console.log("No images found to remove");
        }
    }
});
```

**Body:**
```json
{
  "imageUrl": "{{imageToRemove}}"
}
```

**Manual Alternative** (if pre-request script doesn't work):
1. Run "Get All Products" first
2. Copy an image URL from `images` array
3. Paste it in body:
```json
{
  "imageUrl": "https://res.cloudinary.com/doejdsmym/image/upload/v.../products/xyz.png"
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Image removed successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    
    // Verify image not in array anymore
    const removedUrl = pm.environment.get("imageToRemove");
    pm.expect(jsonData.product.images).to.not.include(removedUrl);
});

console.log("✅ Image deleted from Cloudinary and database");
```

---

### 4.3 Update Main Image

- **Method:** `PATCH`
- **URL:** `{{apiUrl}}/product/{{productId}}/main-image`

**Body:**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}
```

**Tests:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Main image updated", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
    pm.expect(jsonData.product.image).to.include("cloudinary");
});

console.log("✅ Old main image deleted, new one uploaded");
```

**✨ Auto-behavior:** Old main image is automatically deleted from Cloudinary

---

## 📊 Testing with Real Images

### Method 1: Online Base64 Converter (Easiest)

1. Go to: **https://www.base64-image.de/**
2. Click "Choose File" and select your image
3. Click "Convert"
4. Copy the full base64 string (starts with `data:image/...`)
5. Paste it in Postman body

---

### Method 2: Using Postman Pre-request Script

**For Node.js runtime in Postman:**

```javascript
const fs = require('fs');

// Path to your image
const imagePath = '/home/rhd/Desktop/drone.jpg';

if (fs.existsSync(imagePath)) {
    const imageBuffer = fs.readFileSync(imagePath);
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const base64Image = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
    
    pm.environment.set("productImage", base64Image);
    console.log("✅ Image loaded and converted to base64");
} else {
    console.error("❌ Image file not found:", imagePath);
}
```

Then in your body, use:
```json
{
  "image": "{{productImage}}"
}
```

---

### Method 3: Node.js Script (Terminal)

Save as `convert-image.js`:
```javascript
const fs = require('fs');
const path = require('path');

const imagePath = process.argv[2] || './drone.jpg';

if (!fs.existsSync(imagePath)) {
    console.error('File not found:', imagePath);
    process.exit(1);
}

const imageBuffer = fs.readFileSync(imagePath);
const ext = path.extname(imagePath).toLowerCase();
const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
const base64Image = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;

console.log(base64Image);
```

Run:
```bash
node convert-image.js /path/to/image.jpg
```

Copy the output and paste into Postman.

---

## 🎯 Collection Runner (Automated Testing)

### Setup Sequential Test Flow:

1. Click your collection "E-COM Product API"
2. Click **"Run"** button (top-right of collection)
3. Configure:
   - **Environment:** Select "E-COM Local"
   - **Iterations:** 1
   - **Delay:** 500ms (to avoid rate limiting)
   - **Data:** None

4. **Test Order:**
   ```
   ✅ 0. Auth → Login as Admin
   ✅ 1. Public → Get All Products
   ✅ 1. Public → Get Featured Products
   ✅ 1. Public → Get Products by Category
   ✅ 1. Public → Get Recommendations
   ✅ 2. CRUD → Create Product (saves productId)
   ✅ 2. CRUD → Update Product
   ✅ 3. Stock → Set Stock (100)
   ✅ 3. Stock → Add Stock (50)
   ✅ 3. Stock → Subtract Stock (10)
   ✅ 4. Images → Add More Images
   ✅ 2. CRUD → Toggle Featured (ON)
   ✅ 1. Public → Get Featured Products (verify)
   ✅ 4. Images → Remove Specific Image
   ✅ 4. Images → Update Main Image
   ✅ 2. CRUD → Toggle Featured (OFF)
   ✅ 2. CRUD → Delete Product
   ```

5. Click **"Run E-COM Product API"**
6. View results with pass/fail for each test

---

## ✅ Expected Behaviors Reference

| Feature | Behavior |
|---------|----------|
| **Stock = 0** | `isAvailable` auto-set to `false` |
| **Stock > 0** | `isAvailable` auto-set to `true` |
| **Stock decrease** | `soldCount` increments |
| **Max images** | 10 additional images (+ 1 main) |
| **Image upload** | Auto-optimized to 1000x1000 |
| **Delete product** | All images deleted from Cloudinary |
| **Update main image** | Old main image deleted automatically |
| **Featured toggle** | Redis cache updated |
| **Featured products** | Served from Redis cache |

---

## 🐛 Common Errors & Solutions

### ❌ Error: "Unauthorized" (401)

**Causes:**
- Not logged in
- Cookies expired
- User not admin

**Solutions:**
1. Run "Login as Admin" request
2. Check cookies are enabled in Postman: Settings → General → "Automatically follow redirects" ON
3. Verify user has `role: "admin"` in MongoDB:
   ```javascript
   db.users.findOne({ email: "your-admin@gmail.com" })
   ```

---

### ❌ Error: "Product not found" (404)

**Causes:**
- Invalid product ID
- Product was deleted
- `{{productId}}` not set in environment

**Solutions:**
1. Run "Create Product" first to generate a product
2. Check environment variables: Click eye icon → verify `productId` exists
3. Manually set `productId` if needed

---

### ❌ Error: "Cannot add more images" (400)

**Causes:**
- Already have 10 images
- Invalid base64 format

**Solutions:**
1. Check current image count: Run "Get All Products"
2. Remove some images first
3. Verify base64 starts with `data:image/...;base64,`

---

### ❌ Error: "Insufficient stock" (400)

**Causes:**
- Trying to subtract more than available stock

**Solutions:**
1. Check current stock: Run "Get All Products"
2. Use smaller quantity
3. Use `"operation": "set"` instead

---

### ❌ Error: "Invalid image format" (400)

**Causes:**
- Malformed base64
- Unsupported image type
- Truncated base64 string

**Solutions:**
1. Ensure base64 starts with `data:image/png;base64,` or `data:image/jpeg;base64,`
2. Supported formats: PNG, JPG, JPEG, WEBP
3. Use online converter to verify base64

---

### ❌ Error: "Failed to fetch" or timeout

**Causes:**
- Server not running
- Wrong base URL
- Network issues

**Solutions:**
1. Verify server is running: `npm run dev`
2. Check environment `baseUrl` is correct
3. Test in browser: `http://localhost:8000/api/v1/product`

---

## 📝 Complete Test Checklist

### Authentication
- [ ] Login as admin user
- [ ] Verify cookies saved (check Postman cookies)
- [ ] Confirm user has admin role in database

### Public Routes (No Auth Required)
- [ ] Get all products
- [ ] Get featured products
- [ ] Get products by category (Drones)
- [ ] Get recommendations (max 4)

### Create & Read
- [ ] Create product with stock & images
- [ ] Verify `productId` saved to environment
- [ ] Verify images uploaded to Cloudinary
- [ ] Get single product by ID

### Update Operations
- [ ] Update product name and price
- [ ] Toggle featured status (ON)
- [ ] Verify product appears in featured list
- [ ] Toggle featured status (OFF)

### Stock Management
- [ ] Set stock to 100 (absolute)
- [ ] Add 50 to stock (increment)
- [ ] Verify stock = 150
- [ ] Subtract 10 from stock (decrement)
- [ ] Verify stock = 140
- [ ] Set stock to 0
- [ ] Verify `isAvailable` = false

### Image Management
- [ ] Add 2 more images
- [ ] Verify total images ≤ 10
- [ ] Remove one image
- [ ] Verify image deleted from Cloudinary
- [ ] Update main image
- [ ] Verify old main image deleted

### Delete Operations
- [ ] Delete product
- [ ] Verify all images deleted from Cloudinary
- [ ] Verify product removed from database

### Edge Cases
- [ ] Try subtract more stock than available (should fail)
- [ ] Try add 11th image (should fail)
- [ ] Try admin routes without login (should fail)
- [ ] Create product without required fields (should fail)

---

## 🚀 Quick Import JSON

Save this as `E-COM-Product-API.postman_collection.json`:

```json
{
  "info": {
    "name": "E-COM Product API",
    "description": "Complete test suite for E-COM Product endpoints",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8000"
    },
    {
      "key": "apiUrl",
      "value": "{{baseUrl}}/api/v1"
    }
  ],
  "item": [
    {
      "name": "0. Auth",
      "item": [
        {
          "name": "Login as Admin",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Login successful\", () => {",
                  "    pm.response.to.have.status(200);",
                  "    pm.expect(pm.response.json().success).to.eql(true);",
                  "    pm.expect(pm.cookies.has('accessToken')).to.be.true;",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"{{adminEmail}}\",\n  \"password\": \"{{adminPassword}}\"\n}"
            },
            "url": "{{apiUrl}}/auth/login"
          }
        }
      ]
    },
    {
      "name": "1. Public Routes",
      "item": [
        {
          "name": "Get All Products",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Get products\", () => {",
                  "    pm.response.to.have.status(200);",
                  "    pm.expect(pm.response.json().products).to.be.an('array');",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "GET",
            "url": "{{apiUrl}}/product"
          }
        },
        {
          "name": "Get Featured Products",
          "request": {
            "method": "GET",
            "url": "{{apiUrl}}/product/featured"
          }
        },
        {
          "name": "Get Category - Drones",
          "request": {
            "method": "GET",
            "url": "{{apiUrl}}/product/category/Drones"
          }
        },
        {
          "name": "Get Recommendations",
          "request": {
            "method": "GET",
            "url": "{{apiUrl}}/product/recommendations"
          }
        }
      ]
    },
    {
      "name": "2. Admin - CRUD",
      "item": [
        {
          "name": "Create Product",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Product created\", () => {",
                  "    pm.response.to.have.status(201);",
                  "    const product = pm.response.json().product;",
                  "    pm.environment.set('productId', product._id);",
                  "    pm.expect(product.stock).to.eql(25);",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"DJI Mavic Air 2\",\n  \"description\": \"Professional drone\",\n  \"price\": 799,\n  \"category\": \"Drones\",\n  \"stock\": 25,\n  \"image\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==\"\n}"
            },
            "url": "{{apiUrl}}/product"
          }
        },
        {
          "name": "Update Product",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"DJI Mavic Air 2 Pro\",\n  \"price\": 899\n}"
            },
            "url": "{{apiUrl}}/product/{{productId}}"
          }
        },
        {
          "name": "Toggle Featured",
          "request": {
            "method": "PATCH",
            "url": "{{apiUrl}}/product/{{productId}}/featured"
          }
        },
        {
          "name": "Delete Product",
          "request": {
            "method": "DELETE",
            "url": "{{apiUrl}}/product/{{productId}}"
          }
        }
      ]
    },
    {
      "name": "3. Admin - Stock",
      "item": [
        {
          "name": "Set Stock",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"stock\": 100,\n  \"operation\": \"set\"\n}"
            },
            "url": "{{apiUrl}}/product/{{productId}}/stock"
          }
        },
        {
          "name": "Add Stock",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"stock\": 50,\n  \"operation\": \"add\"\n}"
            },
            "url": "{{apiUrl}}/product/{{productId}}/stock"
          }
        },
        {
          "name": "Subtract Stock",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"stock\": 10,\n  \"operation\": \"subtract\"\n}"
            },
            "url": "{{apiUrl}}/product/{{productId}}/stock"
          }
        }
      ]
    },
    {
      "name": "4. Admin - Images",
      "item": [
        {
          "name": "Add Images",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"images\": [\n    \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==\"\n  ]\n}"
            },
            "url": "{{apiUrl}}/product/{{productId}}/images"
          }
        },
        {
          "name": "Update Main Image",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"image\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==\"\n}"
            },
            "url": "{{apiUrl}}/product/{{productId}}/main-image"
          }
        }
      ]
    }
  ]
}
```

**To Import:**
1. Open Postman
2. Click **"Import"** (top-left)
3. Select **"Raw text"** tab
4. Paste the JSON
5. Click **"Import"**
6. Done! 🎉

**Don't forget to:**
- Create environment "E-COM Local"
- Add `adminEmail` and `adminPassword` variables
- Select environment from dropdown

---

## 💡 Pro Tips

1. **Use Collection Runner** for full automated testing
2. **Save test responses** to compare before/after
3. **Use Console** (View → Show Postman Console) to debug
4. **Export collection** to share with teammates
5. **Use Pre-request Scripts** for dynamic data
6. **Set delays** in Collection Runner to avoid rate limits
7. **Use {{variables}}** for reusability
8. **Add folder descriptions** for documentation

---

## 📚 Additional Resources

- **Postman Documentation:** https://learning.postman.com/
- **Base64 Image Converter:** https://www.base64-image.de/
- **MongoDB Compass:** To verify data changes
- **Cloudinary Dashboard:** To verify image uploads

---

**Questions or issues?** Let me know! 🚀
