import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <h1>E-Commerce Store</h1>
          <div>
            <Link to="/">Home</Link>
            <Link to="/cart">Cart ({cart.length})</Link>
            {user ? (
              <>
                <span>Welcome, {user.email}</span>
                <button onClick={() => auth.signOut()}>Logout</button>
                {user.email === 'admin@example.com' && <Link to="/admin">Admin</Link>}
              </>
            ) : (
              <Link to="/auth">Login</Link>
            )}
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<ProductList onAddToCart={addToCart} />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cart" element={<Cart cart={cart} onRemoveFromCart={removeFromCart} onUpdateQuantity={updateQuantity} />} />
          <Route path="/checkout" element={<Checkout cart={cart} />} />
          <Route path="/admin" element={user && user.email === 'admin@example.com' ? <AdminPanel /> : <Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
