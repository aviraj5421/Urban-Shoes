
import React, { useState, useEffect, useRef } from 'react';
import './index.css'
// --- DATA ---
const productsData = [
    {
        id: 1,
        name: "Aero Glide Pro",
        category: "running",
        price: 189.99,
        rating: 5,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Built for speed. The Aero Glide Pro features our lightest foam yet and a carbon fiber plate for maximum energy return.",
        isNew: true
    },
    {
        id: 2,
        name: "Urban X1",
        category: "casual",
        price: 129.99,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Sleek, black, and stealthy. The Urban X1 is your daily driver for street style and all-day comfort.",
        isNew: false
    },
    {
        id: 3,
        name: "Neon Velocity",
        category: "sports",
        price: 159.99,
        rating: 5,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Stand out on the court. High top support with aggressive traction patterns for explosive movements.",
        isNew: true
    },
    {
        id: 4,
        name: "Cloud Walker",
        category: "casual",
        price: 110.00,
        rating: 4,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Classic skater silhouette modernized with premium suede and an ultra-plush memory foam insole.",
        isNew: false
    },
    {
        id: 5,
        name: "Aqua Dash",
        category: "running",
        price: 145.50,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Breathable mesh upper keeps you cool during long summer runs. Responsive cushioning adapts to your stride.",
        isNew: false
    },
    {
        id: 6,
        name: "Retro High 84",
        category: "sports",
        price: 175.00,
        rating: 5,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "A blast from the past. Vibrant colors combined with modern court technology.",
        isNew: true
    },
    {
        id: 7,
        name: "Minimalist Zero",
        category: "casual",
        price: 99.99,
        rating: 4,
        image: "https://images.unsplash.com/photo-1584735174965-48c48d4dde28?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Clean, crisp, white. The essential sneaker that goes with literally any outfit in your wardrobe.",
        isNew: false
    },
    {
        id: 8,
        name: "Shadow Runner",
        category: "running",
        price: 165.00,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "Designed for night runners. Features reflective elements integrated directly into the knit upper.",
        isNew: false
    }
];



// --- HELPER COMPONENT: STAR RATING ---
const StarRating = ({ rating }) => {
    return (
        <div className="product-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <i key={star} className={
                    star <= rating ? "fas fa-star" : 
                    star - 0.5 === rating ? "fas fa-star-half-alt" : "far fa-star"
                }></i>
            ))}
        </div>
    );
};

// --- MAIN APP COMPONENT ---
export default function App() {
    // --- STATE HOOKS ---
    const [cart, setCart] = useState(() => {
        try { return JSON.parse(localStorage.getItem('urbanstep_cart')) || []; }
        catch { return []; }
    });
    const [currentFilter, setCurrentFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    // UI State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [selectedSize, setSelectedSize] = useState('9');

    // Refs
    const sliderRef = useRef(null);

    // --- EFFECTS ---
    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('urbanstep_cart', JSON.stringify(cart));
    }, [cart]);

    // Handle Navbar scrolling effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scrolling when modals are open
    useEffect(() => {
        if (isCartOpen || quickViewProduct) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isCartOpen, quickViewProduct]);

    // --- CART LOGIC ---
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item => 
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
        setQuickViewProduct(null); // Close modal if open
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));
    
    const changeQty = (id, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null; // nulls will be filtered out
            }
            return item;
        }).filter(Boolean));
    };

    // --- CALCULATIONS ---
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const filteredProducts = productsData.filter(p => {
        const matchCategory = currentFilter === 'all' || 
                             (currentFilter === 'new' && p.isNew) || 
                             p.category === currentFilter;
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    // --- EVENT HANDLERS ---
    const scrollSlider = (direction) => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: direction * 320, behavior: 'smooth' });
        }
    };

    // --- RENDER ---
    return (
        <>
           

            {/* Overlays */}
            <div 
                className={`overlay ${(isCartOpen || quickViewProduct) ? 'active' : ''}`} 
                onClick={() => { setIsCartOpen(false); setQuickViewProduct(null); }}
            ></div>

            {/* ================= NAVBAR ================= */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container nav-container">
                    <a href="#home" className="logo">Urban<span>Step</span></a>
                    
                    <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                        <li><a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a></li>
                        <li><a href="#featured" onClick={() => setIsMobileMenuOpen(false)}>Products</a></li>
                        <li><a href="#trending" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</a></li>
                        <li><a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a></li>
                        <li><a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a></li>
                    </ul>

                    <div className="nav-actions">
                        <div className="search-container">
                            <i className="fas fa-search search-icon"></i>
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Search shoes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="cart-icon-wrapper" onClick={() => setIsCartOpen(true)}>
                            <i className="fas fa-shopping-bag"></i>
                            <span className="cart-badge">{cartItemCount}</span>
                        </div>

                        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                        </button>
                    </div>
                </div>
            </nav>

            <main>
                {/* ================= HERO ================= */}
                <section className="hero" id="home">
                    <div className="container">
                        <div className="hero-content">
                            <span className="hero-tagline">New Collection 2026</span>
                            <h1 className="hero-title">Step Into The Future</h1>
                            <p className="hero-desc">Experience premium comfort and unmatched style. Engineered for performance, designed for the streets.</p>
                            <div className="hero-btns">
                                <a href="#featured" className="btn btn-accent">Shop Now</a>
                                <a href="#trending" className="btn btn-outline">Explore Collection</a>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="brands-banner">
                    <div className="container brands-track">
                        <div className="brand-item">Nike</div>
                        <div className="brand-item">Adidas</div>
                        <div className="brand-item">Puma</div>
                        <div className="brand-item">Reebok</div>
                        <div className="brand-item">New Balance</div>
                    </div>
                </div>

                {/* ================= PRODUCTS ================= */}
                <section id="featured">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Our Collection</h2>
                            <p className="section-subtitle">Discover our latest drops and all-time classics. Filter to find your perfect fit.</p>
                        </div>

                        <div className="filters">
                            {['all', 'running', 'casual', 'sports', 'new'].map(f => (
                                <button 
                                    key={f}
                                    className={`filter-btn ${currentFilter === f ? 'active' : ''}`}
                                    onClick={() => setCurrentFilter(f)}
                                >
                                    {f === 'new' ? 'New Arrivals' : f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="product-grid">
                            {filteredProducts.length === 0 ? (
                                <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem', padding: '3rem 0' }}>
                                    No products found matching your criteria.
                                </p>
                            ) : (
                                filteredProducts.map(p => (
                                    <div className="product-card" key={p.id}>
                                        {p.isNew && <span className="product-badge">NEW</span>}
                                        <div className="product-img-wrapper">
                                            <img src={p.image} alt={p.name} className="product-img" />
                                            <div className="product-actions-overlay">
                                                <button className="action-btn" onClick={() => setQuickViewProduct(p)} title="Quick View"><i className="fas fa-eye"></i></button>
                                                <button className="action-btn" onClick={() => addToCart(p)} title="Add to Cart"><i className="fas fa-shopping-cart"></i></button>
                                            </div>
                                        </div>
                                        <div className="product-info">
                                            <span className="product-category">{p.category}</span>
                                            <h3 className="product-title">{p.name}</h3>
                                            <div className="product-meta">
                                                <span className="product-price">${p.price.toFixed(2)}</span>
                                                <StarRating rating={p.rating} />
                                            </div>
                                            <button className="add-to-cart-btn" onClick={() => addToCart(p)}>Add To Cart</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* ================= TRENDING SLIDER ================= */}
                <section className="trending-section" id="trending">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Trending Now</h2>
                            <p className="section-subtitle">The styles everyone is talking about. Don't miss out on these hottest drops.</p>
                        </div>

                        <div className="slider-controls">
                            <button className="slider-btn" onClick={() => scrollSlider(-1)}><i className="fas fa-chevron-left"></i></button>
                            <button className="slider-btn" onClick={() => scrollSlider(1)}><i className="fas fa-chevron-right"></i></button>
                        </div>

                        <div className="slider-container">
                            <div className="slider" ref={sliderRef}>
                                {productsData.slice(0, 4).map(p => (
                                    <div className="slider-item" key={`trending-${p.id}`}>
                                        <div className="product-card">
                                            <div className="product-img-wrapper">
                                                <img src={p.image} alt={p.name} className="product-img" />
                                            </div>
                                            <div className="product-info">
                                                <h3 className="product-title">{p.name}</h3>
                                                <div className="product-meta">
                                                    <span className="product-price">${p.price.toFixed(2)}</span>
                                                </div>
                                                <button className="add-to-cart-btn" onClick={() => addToCart(p)}>Add To Cart</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= ABOUT ================= */}
                <section className="about-section" id="about">
                    <div className="container">
                        <div className="about-grid">
                            <div className="about-img">
                                <img src="https://images.unsplash.com/photo-1618365908648-e71bd5716cba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Brand Story" />
                            </div>
                            <div className="about-content">
                                <h2>Innovation in every step.</h2>
                                <p>Founded with a rebellious spirit and a lofty objective: to offer designer, premium footwear at revolutionary prices, while leading the way for socially conscious businesses.</p>
                                <p>We believe that comfort shouldn't compromise style. Our engineers and designers work tirelessly to craft silhouettes that push boundaries.</p>
                                
                                <div className="features-list">
                                    <div className="feature-item">
                                        <div className="feature-icon"><i className="fas fa-leaf"></i></div>
                                        <div className="feature-text">
                                            <h4>Sustainable Materials</h4>
                                            <p>Crafted using recycled plastics and ethically sourced rubber.</p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon"><i className="fas fa-wind"></i></div>
                                        <div className="feature-text">
                                            <h4>AeroTech Cushioning</h4>
                                            <p>Cloud-like comfort that absorbs impact and returns energy.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= TESTIMONIALS ================= */}
                <section className="testimonials">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">What They Say</h2>
                        </div>
                        <div className="testimonial-slider">
                            <div className="testimonial-card">
                                <StarRating rating={5} />
                                <p className="review-text">"The most comfortable sneakers I've ever owned. The Urban Runner completely changed my morning jogs."</p>
                                <div className="user-info">
                                    <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="User" className="user-img" />
                                    <div className="user-details"><h5>James Wilson</h5><span>Marathon Runner</span></div>
                                </div>
                            </div>
                            <div className="testimonial-card">
                                <StarRating rating={4.5} />
                                <p className="review-text">"I get compliments every time I wear my Neon V2s. The design is so sleek and futuristic. Shipping was fast."</p>
                                <div className="user-info">
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="User" className="user-img" />
                                    <div className="user-details"><h5>Sarah Jenkins</h5><span>Fashion Blogger</span></div>
                                </div>
                            </div>
                            <div className="testimonial-card">
                                <StarRating rating={5} />
                                <p className="review-text">"Finally a brand that gets it. The materials feel expensive but the price point is fair. 10/10."</p>
                                <div className="user-info">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="User" className="user-img" />
                                    <div className="user-details"><h5>Marcus Cole</h5><span>Sneakerhead</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= CONTACT & NEWSLETTER ================= */}
                <section id="contact">
                    <div className="container">
                        <div className="newsletter">
                            <h2>Get 10% Off Your First Order</h2>
                            <p>Subscribe to our newsletter for exclusive drops, early access, and style news.</p>
                            <form className="subscribe-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }}>
                                <input type="email" className="subscribe-input" placeholder="Enter your email address" required />
                                <button type="submit" className="subscribe-btn">Subscribe</button>
                            </form>
                        </div>

                        <div className="section-header" style={{ marginTop: '6rem' }}>
                            <h2 className="section-title">Get In Touch</h2>
                            <p className="section-subtitle">Have a question about an order or need sizing advice? Our team is here to help.</p>
                        </div>

                        <div className="contact-grid">
                            <div className="contact-info">
                                <div className="contact-info-item">
                                    <h3><i className="fas fa-map-marker-alt"></i> Flagship Store</h3>
                                    <p>123 Innovation Drive<br/>Sneaker District, NY 10001</p>
                                </div>
                                <div className="contact-info-item">
                                    <h3><i className="fas fa-phone"></i> Call Us</h3>
                                    <p>+1 (800) 123-STEP<br/>Mon-Fri: 9am - 6pm EST</p>
                                </div>
                                <div className="contact-info-item">
                                    <h3><i className="fas fa-envelope"></i> Email</h3>
                                    <p>support@urbanstep.com<br/>press@urbanstep.com</p>
                                </div>
                            </div>

                            <div className="contact-form">
                                <form onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Your Name" required />
                                    </div>
                                    <div className="form-group">
                                        <input type="email" className="form-control" placeholder="Your Email" required />
                                    </div>
                                    <div className="form-group">
                                        <textarea className="form-control" placeholder="Your Message" required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-accent" style={{ width: '100%' }}>Send Message</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-about">
                            <a href="#home" className="logo" style={{ color: 'white' }}>Urban<span style={{ color: 'var(--accent)' }}>Step</span></a>
                            <p>Premium footwear engineered for performance and designed for the streets. Step into the future with us.</p>
                            <div className="social-links">
                                <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                                <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="social-link"><i className="fab fa-tiktok"></i></a>
                            </div>
                        </div>
                        
                        <div className="footer-links">
                            <h4>Shop</h4>
                            <ul>
                                <li><a href="#">New Arrivals</a></li>
                                <li><a href="#">Running</a></li>
                                <li><a href="#">Casual</a></li>
                                <li><a href="#">Sale</a></li>
                            </ul>
                        </div>
                        
                        <div className="footer-links">
                            <h4>Support</h4>
                            <ul>
                                <li><a href="#">FAQ</a></li>
                                <li><a href="#">Shipping & Returns</a></li>
                                <li><a href="#">Size Guide</a></li>
                                <li><a href="#">Contact Us</a></li>
                            </ul>
                        </div>
                        
                        <div className="footer-links">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Sustainability</a></li>
                                <li><a href="#">Terms & Conditions</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 UrbanStep. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* ================= CART SIDEBAR ================= */}
            <aside className={`cart-sidebar ${isCartOpen ? 'active' : ''}`}>
                <div className="cart-header">
                    <h3>Your Cart</h3>
                    <button className="close-cart" onClick={() => setIsCartOpen(false)}><i className="fas fa-times"></i></button>
                </div>
                
                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="cart-empty">
                            <i className="fas fa-shopping-cart"></i>
                            <p>Your cart is empty.</p>
                            <button className="btn btn-accent" style={{ marginTop: '1rem' }} onClick={() => setIsCartOpen(false)}>Continue Shopping</button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div className="cart-item" key={`cart-${item.id}`}>
                                <img src={item.image} alt={item.name} className="cart-item-img" />
                                <div className="cart-item-info">
                                    <h4 className="cart-item-title">{item.name}</h4>
                                    <div className="cart-item-price">${item.price.toFixed(2)} x {item.quantity}</div>
                                    <div className="cart-qty-controls">
                                        <button className="qty-btn" onClick={() => changeQty(item.id, -1)}><i className="fas fa-minus"></i></button>
                                        <span>{item.quantity}</span>
                                        <button className="qty-btn" onClick={() => changeQty(item.id, 1)}><i className="fas fa-plus"></i></button>
                                    </div>
                                </div>
                                <button className="remove-item" onClick={() => removeFromCart(item.id)}><i className="fas fa-trash-alt"></i></button>
                            </div>
                        ))
                    )}
                </div>
                
                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button 
                        className="btn btn-accent checkout-btn" 
                        onClick={() => alert('Proceeding to checkout...')}
                        disabled={cart.length === 0}
                    >
                        Checkout Now
                    </button>
                </div>
            </aside>

            {/* ================= QUICK VIEW MODAL ================= */}
            <div className={`modal ${quickViewProduct ? 'active' : ''}`}>
                {quickViewProduct && (
                    <>
                        <button className="close-modal" onClick={() => setQuickViewProduct(null)}><i className="fas fa-times"></i></button>
                        <div className="modal-img-col">
                            <img src={quickViewProduct.image} alt={quickViewProduct.name} />
                        </div>
                        <div className="modal-info-col">
                            <span className="modal-category">{quickViewProduct.category}</span>
                            <h2 className="modal-title">{quickViewProduct.name}</h2>
                            <div style={{ marginBottom: '1rem' }}>
                                <StarRating rating={quickViewProduct.rating} />
                            </div>
                            <div className="modal-price">${quickViewProduct.price.toFixed(2)}</div>
                            <p className="modal-desc">{quickViewProduct.description}</p>
                            
                            <div className="size-selector">
                                <h4>Select Size (US)</h4>
                                <div className="sizes" style={{ display: 'flex' }}>
                                    {['7', '8', '9', '10', '11', '12'].map(size => (
                                        <button 
                                            key={size}
                                            className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <button className="btn btn-accent" style={{ width: '100%' }} onClick={() => addToCart(quickViewProduct)}>
                                Add to Cart - ${quickViewProduct.price.toFixed(2)}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}