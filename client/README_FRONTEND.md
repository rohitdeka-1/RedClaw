# RedClaw E-Commerce Frontend

## 📁 Project Structure

```
src/
├── assets/              # Static assets (images, fonts, etc.)
├── components/          # Reusable components
│   ├── layout/         # Layout components (Navbar, Footer, etc.)
│   ├── ui/             # UI components (buttons, cards, etc.)
│   └── NotFound.jsx    # 404 page component
├── context/            # React Context providers
│   └── CartContext.jsx # Shopping cart state management
├── data/               # Static data and constants
│   └── products.js     # Product catalog data
├── hooks/              # Custom React hooks
│   └── useProductScroll.js # Product scrolling functionality
├── pages/              # Page components
│   └── Home.jsx        # Home page
├── routes/             # Routing configuration
│   └── AppRoutes.jsx   # Main router setup
├── utils/              # Utility functions
│   └── cn.js          # Class name utility
├── App.jsx             # Root component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🎨 Features

- **Modular Architecture**: Clean separation of concerns
- **Context API**: Global state management for cart
- **Custom Hooks**: Reusable logic for product scrolling
- **Component Library**: Organized UI and layout components
- **Responsive Design**: Tailwind CSS for styling
- **Router**: React Router for navigation

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📦 Components

### Layout Components
- **Navbar**: Navigation bar with cart counter

### UI Components
- **ProductInfo**: Product details and description
- **ProductImage**: Product image display
- **ProductActions**: Size selection and cart actions
- **ProductNavigation**: Product carousel navigation
- **ScrollIndicator**: Scroll hint indicator

### Pages
- **Home**: Main landing page with product showcase

## 🔧 State Management

- **CartContext**: Manages shopping cart state across the app
  - `addToCart(product, size)`: Add item to cart
  - `removeFromCart(index)`: Remove item from cart
  - `clearCart()`: Clear all items

## 🎣 Custom Hooks

- **useProductScroll**: Handles mouse wheel scrolling for product navigation

## 📝 Data Management

Product data is stored in `src/data/products.js` and can be easily modified or connected to an API.

## 🎯 Next Steps

- Connect to backend API
- Add authentication
- Implement checkout flow
- Add product detail pages
- Create cart page
- Add order history
