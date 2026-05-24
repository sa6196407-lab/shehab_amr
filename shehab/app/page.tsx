"use client";

import { useEffect, useState } from "react";

// تعريف أنواع البيانات
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  colors: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export default function Home() {
  const heroImages = [
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop",
  ];

  const initialProducts: Product[] = [
    {
      id: "1",
      name: "Street Hoodie",
      price: 180,
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
      description: "Premium luxury fashion crafted with modern heavyweight cotton and heavy drop-shoulder streetwear vibes.",
      colors: ["#000000", "#d2ab83", "#9ca3af"]
    },
    {
      id: "2",
      name: "Premium Jacket",
      price: 240,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
      description: "Insulated luxury utility jacket designed for cold seasons with a waterproof outer shell and sleek fit.",
      colors: ["#000000", "#1e3a8a"]
    },
    {
      id: "3",
      name: "Luxury Tee",
      price: 120,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
      description: "Minimalist aesthetic premium tee with high-density fabric weave and an oversized contemporary cut.",
      colors: ["#ffffff", "#000000", "#d2ab83"]
    },
    {
      id: "4",
      name: "Classic Pants",
      price: 150,
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
      description: "Tailored fit cargo streetwear trousers featuring multi-utility geometric pockets and custom ankle straps.",
      colors: ["#000000", "#14532d"]
    },
  ];

  // States الأساسية
  const [current, setCurrent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  
  // نظام حماية الأدمن 🔐
  const [isAdmin, setIsAdmin] = useState(false);
  const ADMIN_PASSWORD = "admin123"; // تقدر تغير الباسورد ده لأي حاجة تحبها

  // ميزة البحث
  const [searchQuery, setSearchQuery] = useState("");

  // ميزات الـ Quick View
  const [activeQuickView, setActiveQuickView] = useState<Product | null>(null);
  const [modalSize, setModalSize] = useState("M");
  const [modalColor, setModalColor] = useState("");

  // ميزة الخصم والـ Promo Code
  const [promoInput, setPromoInput] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  // ميزة العداد التنازلي للعروض
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 59, seconds: 59 });

  // Dashboard States
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);

  const EXCHANGE_RATE = 50;

  // تحميل البيانات وحالة الأدمن عند الفتح
  useEffect(() => {
    const savedCart = localStorage.getItem("shehab_cart");
    const savedProducts = localStorage.getItem("shehab_products");
    const savedCurrency = localStorage.getItem("shehab_currency");
    const savedAdminStatus = localStorage.getItem("shehab_is_admin");

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedProducts) setAllProducts(JSON.parse(savedProducts));
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedAdminStatus === "true") setIsAdmin(true);

    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // حفظ البيانات في الـ localStorage تلقائياً
  useEffect(() => {
    if (!loading) localStorage.setItem("shehab_cart", JSON.stringify(cart));
  }, [cart, loading]);

  useEffect(() => {
    if (!loading) localStorage.setItem("shehab_products", JSON.stringify(allProducts));
  }, [allProducts, loading]);

  useEffect(() => {
    if (!loading) localStorage.setItem("shehab_currency", currency);
  }, [currency, loading]);

  // دالة تسجيل دخول الأدمن
  const handleAdminLogin = () => {
    if (isAdmin) {
      // لو مسجل دخول وضغطت تاني، يعمل تسجيل خروج
      setIsAdmin(false);
      localStorage.removeItem("shehab_is_admin");
      alert("Admin logged out successfully.");
    } else {
      const password = prompt("🔒 Enter Admin Password to access Dashboard:");
      if (password === ADMIN_PASSWORD) {
        setIsAdmin(true);
        localStorage.setItem("shehab_is_admin", "true");
        alert("🔓 Access Granted! Welcome back, Boss.");
      } else if (password !== null) {
        alert("❌ Wrong password! Access Denied.");
      }
    }
  };

  // تايمر العداد التنازلي
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // سلايدر صور الهيرو
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // إضافة منتج للسلة
  const addToCart = (product: Product, size = "M", color = "") => {
    const chosenColor = color || product.colors[0] || "#000";
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor === chosenColor
      );

      if (existingIndex > -1) {
        return prevCart.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1, selectedSize: size, selectedColor: chosenColor }];
    });
    setCartOpen(true);
    setActiveQuickView(null);
  };

  const updateQuantity = (idx: number, amount: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item, i) => (i === idx ? { ...item, quantity: item.quantity + amount } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const getCartSubtotal = () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const getCartTotal = () => {
    let subtotal = getCartSubtotal();
    if (discountApplied) subtotal = subtotal * 0.9;
    return currency === "USD" ? `$${subtotal.toFixed(2)}` : `EGP ${(subtotal * EXCHANGE_RATE).toLocaleString()}`;
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;
    const priceNum = parseFloat(newProductPrice);
    if (isNaN(priceNum)) return;

    const defaultImg = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop";
    const newProd: Product = {
      id: Date.now().toString(),
      name: newProductName,
      price: priceNum,
      image: newProductImage.trim() !== "" ? newProductImage : defaultImg,
      description: "Exclusive new design piece released dynamically from the dashboard.",
      colors: ["#000000", "#d2ab83"]
    };

    setAllProducts([...allProducts, newProd]);
    setNewProductName("");
    setNewProductPrice("");
    setNewProductImage("");
  };

  const formatPrice = (priceInUSD: number) => {
    return currency === "USD" ? `$${priceInUSD}` : `EGP ${(priceInUSD * EXCHANGE_RATE).toLocaleString()}`;
  };

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
        <div className="text-center">
          <h1 className="text-white text-6xl md:text-8xl font-black tracking-[12px] animate-pulse">SHEHAB</h1>
          <div className="w-[220px] h-[4px] bg-white/20 rounded-full mt-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-[#d2ab83] custom-progress-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[#f5f1eb] min-h-screen text-[#111] relative scroll-smooth">
      <div className="pointer-events-none fixed w-[500px] h-[500px] bg-[#d2ab83]/10 blur-[120px] rounded-full top-[-100px] left-[-100px] animate-pulse"></div>

      {/* TOP BAR */}
      <div className="hidden md:flex bg-black text-[#f1dfcc] text-xs font-semibold px-10 py-3 justify-between tracking-wider">
        <p>FREE SHIPPING ON ORDERS OVER $100</p>
        <p>NEW COLLECTION IS OUT NOW ✨</p>
        <p>USE CODE <span className="text-white bg-white/20 px-1.5 py-0.5 rounded font-black">SHEHAB10</span> FOR 10% OFF</p>
      </div>

      {/* NAVBAR */}
      <header className="bg-[#fcfaf7]/90 backdrop-blur-2xl shadow-sm px-6 md:px-14 py-4 md:py-5 flex justify-between items-center border-b border-[#e7ddd1] sticky top-0 z-50">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">SHEHAB</h1>
          <p className="tracking-[6px] md:tracking-[8px] text-[9px] md:text-xs mt-0.5 text-[#8b7765] font-bold">STORE</p>
        </div>

        <nav className="hidden lg:flex gap-10 text-sm font-bold tracking-widest">
          <a href="#" className="hover:text-[#c69b74] transition-all duration-300">HOME</a>
          <a href="#shop" className="hover:text-[#c69b74] transition-all duration-300">SHOP</a>
          {/* لن يظهر رابط الداشبورد في القائمة إلا لو كنت أدمن */}
          {isAdmin && (
            <a href="#dashboard" className="text-[#d2ab83] hover:underline transition-all duration-300">DASHBOARD 🛠️</a>
          )}
          <a href="#newsletter" className="hover:text-[#c69b74] transition-all duration-300">OFFERS</a>
        </nav>

        <div className="flex items-center gap-4 md:gap-6 text-xl md:text-2xl">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="text-xs font-bold border border-[#e7ddd1] rounded-xl px-3 py-2 bg-white cursor-pointer outline-none focus:border-[#d2ab83]"
          >
            <option value="USD">USD $</option>
            <option value="EGP">EGP £</option>
          </select>

          <button className="lg:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          
          {/* زر السكيورتي السري للأدمن 🔒 */}
          <button 
            onClick={handleAdminLogin} 
            className="hover:scale-110 transition-all text-lg cursor-pointer bg-gray-100 p-2 rounded-xl border border-gray-200"
            title={isAdmin ? "Click to Logout Admin" : "Click to Login Admin"}
          >
            {isAdmin ? "🔓" : "🔒"}
          </button>

          <span className="hover:scale-110 transition-all cursor-pointer text-xl">👤</span>
          <button onClick={() => setCartOpen(!cartOpen)} className="relative hover:scale-110 transition-all">
            🛒
            <div className="absolute -top-2 -right-2 bg-[#d2ab83] text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-md">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </div>
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e7ddd1] px-6 py-6 flex flex-col gap-4 text-sm font-bold tracking-widest shadow-lg animate-fadeIn">
          <a href="#" onClick={() => setMenuOpen(false)}>HOME</a>
          <a href="#shop" onClick={() => setMenuOpen(false)}>SHOP</a>
          {isAdmin && <a href="#dashboard" onClick={() => setMenuOpen(false)}>DASHBOARD 🛠️</a>}
          <a href="#newsletter" onClick={() => setMenuOpen(false)}>OFFERS</a>
        </div>
      )}

      {/* SIDE CART */}
      {cartOpen && (
        <div className="fixed right-4 top-24 z-[999] bg-white w-[360px] rounded-3xl shadow-2xl p-6 border border-[#e7ddd1] max-h-[580px] flex flex-col animate-fadeIn">
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            <h2 className="text-xl font-black">Shopping Cart</h2>
            <button onClick={() => setCartOpen(false)} className="text-xl font-bold hover:text-red-500 transition-colors">✕</button>
          </div>

          <div className="overflow-y-auto flex-1 flex flex-col gap-3 pr-1">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8 font-medium">Your cart is empty.</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="bg-[#f8f4ef] rounded-2xl p-3 flex gap-3 items-center justify-between shadow-sm relative">
                  <img src={item.product.image} className="w-14 h-14 object-cover rounded-xl shadow-inner" alt="" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate text-black">{item.product.name}</h3>
                    <div className="flex gap-2 text-[10px] text-gray-500 font-bold my-0.5">
                      <span>Size: {item.selectedSize}</span>
                      <span className="flex items-center gap-1">
                        Color: <span className="w-2.5 h-2.5 rounded-full inline-block border" style={{ backgroundColor: item.selectedColor }}></span>
                      </span>
                    </div>
                    <p className="text-xs text-[#8b7765] font-black">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-gray-200">
                    <button onClick={() => updateQuantity(index, -1)} className="font-bold text-xs px-1">-</button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, 1)} className="font-bold text-xs px-1">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t pt-4 mt-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Promo Code (SHEHAB10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border rounded-xl outline-none font-bold"
                />
                <button
                  onClick={() => {
                    if (promoInput.trim().toUpperCase() === "SHEHAB10") {
                      setDiscountApplied(true);
                    } else {
                      alert("Invalid Code");
                    }
                  }}
                  className="bg-black text-white px-3 py-2 text-xs font-black rounded-xl hover:bg-[#d2ab83] transition-colors"
                >
                  APPLY
                </button>
              </div>

              {discountApplied && (
                <div className="text-xs text-green-600 font-bold mb-2 flex justify-between">
                  <span>✨ Code Applied!</span>
                  <span>-10%</span>
                </div>
              )}

              <div className="flex justify-between items-center mb-4 pt-2 border-t border-dashed">
                <span className="font-bold text-xs text-gray-600">Total Bill:</span>
                <span className="text-xl font-black text-black">{getCartTotal()}</span>
              </div>
              <button className="w-full bg-black text-white py-3 rounded-xl font-bold text-xs tracking-widest hover:bg-[#d2ab83] hover:text-black transition-all duration-300">
                PROCEED TO CHECKOUT
              </button>
            </div>
          )}
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      {activeQuickView && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] max-w-2xl w-full p-6 relative grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveQuickView(null)}
              className="absolute top-4 right-4 text-xl font-black w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all flex items-center justify-center z-10"
            >
              ✕
            </button>
            
            <div className="h-[300px] md:h-full rounded-2xl overflow-hidden bg-gray-50">
              <img src={activeQuickView.image} className="w-full h-full object-cover" alt="" />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black text-black mb-1">{activeQuickView.name}</h3>
                <p className="text-xl font-bold text-[#b48b66] mb-3">{formatPrice(activeQuickView.price)}</p>
                <p className="text-gray-500 text-xs leading-relaxed mb-5">{activeQuickView.description}</p>
                
                <div className="mb-4">
                  <span className="text-xs font-black block mb-2 tracking-wider text-gray-400">SELECT SIZE</span>
                  <div className="flex gap-2">
                    {["S", "M", "L", "XL"].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setModalSize(sz)}
                        className={`w-9 h-9 text-xs font-bold rounded-xl border transition-all ${
                          modalSize === sz ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-xs font-black block mb-2 tracking-wider text-gray-400">AVAILABLE COLORS</span>
                  <div className="flex gap-3">
                    {activeQuickView.colors.map((col) => (
                      <button
                        key={col}
                        onClick={() => setModalColor(col)}
                        className={`w-6 h-6 rounded-full border shadow-sm relative transition-transform ${
                          modalColor === col ? "scale-125 ring-2 ring-[#d2ab83] ring-offset-2" : ""
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => addToCart(activeQuickView, modalSize, modalColor)}
                className="w-full bg-black text-white py-3.5 rounded-xl font-black tracking-widest text-xs hover:bg-[#d2ab83] hover:text-black transition-all"
              >
                ADD PIECE TO CART
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative h-[700px] md:h-[850px] overflow-hidden">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
              current === index ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
            }`}
          >
            <img src={img} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80"></div>
          </div>
        ))}

        <div className="absolute left-[6%] top-1/2 -translate-y-1/2 z-20 text-white max-w-[650px]">
          <p className="tracking-[8px] md:tracking-[12px] text-[#e8cdb1] mb-4 text-xs md:text-sm font-black">
            LUXURY COLLECTION 2026
          </p>
          <h1 className="text-[45px] sm:text-[60px] md:text-[90px] leading-[0.95] font-black mb-6 tracking-tight">
            Modern<br />Fashion<br />Store
          </h1>
          <p className="text-sm md:text-lg text-[#ece0d3] leading-relaxed mb-8 max-w-[90%] font-medium">
            Premium clothing crafted for people who love luxury streetwear aesthetics and uncompromising quality.
          </p>
          <div className="flex flex-row gap-4">
            <a href="#shop">
              <button className="bg-[#d2ab83] hover:bg-white text-black px-8 md:px-10 py-3.5 md:py-4 rounded-xl text-sm font-bold tracking-widest shadow-xl transition-all duration-300">
                SHOP NOW
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* SHOP SECTION */}
      <section id="shop" className="px-6 md:px-14 py-20 bg-[#f8f4ef]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <p className="tracking-[6px] text-[#b48b66] mb-2 text-xs font-bold">PREMIUM COLLECTION</p>
            <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight">Trending Products</h2>
          </div>

          <div className="w-full md:w-[320px] relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#ede6dc] px-10 py-3 rounded-2xl text-xs font-bold outline-none shadow-sm focus:border-[#d2ab83] transition-colors text-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-[24px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 group hover:-translate-y-2 relative border border-[#ede6dc]"
            >
              <div className="overflow-hidden relative h-[340px] bg-gray-100">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => setActiveQuickView(product)}
                    className="bg-white text-black font-black text-xs tracking-widest px-5 py-3 rounded-xl shadow-xl hover:bg-[#d2ab83]"
                  >
                    QUICK VIEW
                  </button>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-black text-black truncate">{product.name}</h3>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2 min-h-[32px]">{product.description}</p>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-2xl font-black text-black">{formatPrice(product.price)}</span>
                </div>
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-black text-white px-4 py-3 rounded-xl hover:bg-[#d2ab83] hover:text-black transition-all font-bold text-xs tracking-wider"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OFFERS SECTION */}
      <section id="newsletter" className="px-6 md:px-14 py-20 bg-black text-white text-center relative overflow-hidden">
        <p className="tracking-[8px] text-[#d7b898] mb-3 text-xs font-bold">LIMITED TIME DROPS</p>
        <h2 className="text-3xl md:text-6xl font-black mb-6 tracking-tight">Flash Sale Offers</h2>
        <div className="flex justify-center gap-4 my-8 text-center">
          {[{ label: "HRS", val: timeLeft.hours }, { label: "MIN", val: timeLeft.minutes }, { label: "SEC", val: timeLeft.seconds }].map((t, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 w-20">
              <span className="block text-3xl font-black text-[#d2ab83] font-mono">{t.val.toString().padStart(2, '0')}</span>
              <span className="text-[10px] text-gray-400 tracking-wider font-bold">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 🔐 DASHBOARD SECTION (مش هيظهر غير لو الـ isAdmin بـ true) */}
      {isAdmin && (
        <section id="dashboard" className="px-6 md:px-14 py-20 bg-[#111] text-white animate-fadeIn">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tight text-red-500">Admin Dashboard 🛠️</h2>
            <p className="text-gray-400 mb-8 text-sm">Welcome, Shehab. This area is hidden from public clients.</p>

            <form onSubmit={handleAddProduct} className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-xl mb-10">
              <h3 className="text-lg font-bold mb-4 text-[#d2ab83]">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="px-4 py-3.5 rounded-xl bg-white text-black text-sm outline-none font-medium w-full"
                  required
                />
                <input
                  type="number"
                  placeholder="Price in USD ($)"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="px-4 py-3.5 rounded-xl bg-white text-black text-sm outline-none font-medium w-full"
                  required
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={newProductImage}
                  onChange={(e) => setNewProductImage(e.target.value)}
                  className="px-4 py-3.5 rounded-xl bg-white text-black text-sm outline-none font-medium w-full"
                />
              </div>
              <button type="submit" className="w-full bg-[#d2ab83] text-black py-3.5 rounded-xl font-black tracking-widest text-xs hover:bg-white transition-all">
                PUBLISH PRODUCT
              </button>
            </form>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 max-h-[350px] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4 text-gray-300">Current Catalog ({allProducts.length})</h3>
              <div className="flex flex-col gap-3">
                {allProducts.map((item) => (
                  <div key={item.id} className="bg-white/5 rounded-2xl p-3 flex justify-between items-center border border-white/5">
                    <div className="flex items-center gap-3">
                      <img src={item.image} className="w-10 h-10 object-cover rounded-xl" alt="" />
                      <div>
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <p className="text-xs text-[#d2ab83] font-semibold">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setAllProducts(allProducts.filter((p) => p.id !== item.id))}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-black text-white px-6 md:px-14 py-12 text-center border-t border-white/5">
        <h2 className="text-3xl font-black tracking-tight mb-2">SHEHAB</h2>
        <p className="text-xs text-gray-500 tracking-[4px] font-bold mb-8">LUXURY FASHION BRAND</p>
        <div className="text-[11px] text-gray-600 tracking-wider font-medium">
          © 2026 SHEHAB STORE — ALL RIGHTS RESERVED
        </div>
      </footer>

      <style jsx global>{`
        html { scroll-behavior: smooth; }
        .custom-progress-bar { width: 0%; animation: loadProgress 2.2s linear forwards; }
        @keyframes loadProgress { 0% { width: 0%; } 100% { width: 100%; } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out forwards; }
      `}</style>
    </main>
  );
}