

import React, { useState, useEffect, useContext, createContext, useMemo, useCallback, useRef } from 'react';
import { Product, CartItem, CartContextType, User, AuthContextType } from './types';
import { PRODUCTS, HERO_SLIDES, FAQS } from './constants';
import { SHILAJIT_IMAGE_URL } from './assets';
import { ShoppingCartIcon, UserIcon, TruckIcon, LeafIcon, SavingsIcon, ReturnIcon, StarIcon, SendIcon, SearchIcon, XIcon, PlusIcon, MinusIcon, ChevronLeftIcon, ChevronRightIcon, FacebookIcon, InstagramIcon, TwitterIcon, MailIcon, PhoneIcon, MapPinIcon } from './components/Icons';

// --- CART CONTEXT ---
const CartContext = createContext<CartContextType | null>(null);

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                )
            );
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = useMemo(() => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    }, [cartItems]);

    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const value = { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = () => useContext(CartContext) as CartContextType;

// --- AUTH CONTEXT ---
const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        try {
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            }
            const storedCurrentUser = localStorage.getItem('currentUser');
            if (storedCurrentUser) {
                setCurrentUser(JSON.parse(storedCurrentUser));
            }
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const login = (email: string, password?: string): boolean => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            const userToStore = { name: user.name, email: user.email };
            setCurrentUser(userToStore);
            localStorage.setItem('currentUser', JSON.stringify(userToStore));
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const register = (name: string, email: string, password?: string): boolean => {
        if (users.some(u => u.email === email)) {
            return false; // User already exists
        }
        const newUser: User = { name, email, password };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        login(email, password);
        return true;
    };
    
    const value = { currentUser, login, logout, register };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext) as AuthContextType;

// --- REUSABLE COMPONENTS ---
const Logo: React.FC<{ isFooter?: boolean }> = ({ isFooter = false }) => {
    return (
        <div className="flex items-center gap-2">
             <svg
                aria-hidden="true"
                width="50"
                height="40"
                viewBox="0 0 100 50"
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-auto"
                fill={isFooter ? "#FFFFFF" : "#000000"}
            >
                <path d="M0,50 L25,20 L40,35 L50,10 L60,35 L75,20 L100,50 Z" />
            </svg>
            <h1 className={`text-2xl font-bold ${isFooter ? 'text-white' : 'text-gray-800'}`}>
                Skardu Organic
            </h1>
        </div>
    );
};

const Header = ({ setRoute, route, onCartClick, searchQuery, setSearchQuery }: { setRoute: (route: string) => void; route: string; onCartClick: () => void; searchQuery: string; setSearchQuery: (query: string) => void; }) => {
    const { cartCount } = useCart();
    const { currentUser, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const navLinks = [
        { name: 'Shop', path: '#/shop' },
        { name: 'About', path: '#/about' },
        { name: 'Contact', path: '#/contact' },
    ];

    const handleLogout = () => {
        logout();
        setRoute('#/');
    };

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <a href="#/" onClick={(e) => {e.preventDefault(); setRoute('#/');}} className="flex-shrink-0">
                        <Logo />
                    </a>
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <a 
                                key={link.name} 
                                href={link.path} 
                                onClick={(e) => {e.preventDefault(); setRoute(link.path);}} 
                                className={`font-medium transition-colors duration-200 hover:text-green-600 ${route === link.path ? 'text-green-600' : 'text-gray-600'}`}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="relative">
                            <input
                                type="search"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setRoute('#/shop')}
                                className="pl-10 pr-4 py-2 border rounded-full w-48 focus:w-64 transition-all duration-300"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </nav>
                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 hidden sm:inline">Hi, {currentUser.name}</span>
                                <button onClick={handleLogout} className="text-gray-600 hover:text-green-600 text-sm font-medium">Logout</button>
                            </div>
                        ) : (
                             <a href="#/auth" onClick={(e) => {e.preventDefault(); setRoute('#/auth');}} className="text-gray-600 hover:text-green-600"><UserIcon className="w-6 h-6" /></a>
                        )}
                        <button onClick={onCartClick} className="relative text-gray-600 hover:text-green-600">
                            <ShoppingCartIcon className="w-6 h-6" />
                            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>}
                        </button>
                        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                 <div className="md:hidden bg-white py-4">
                    <nav className="flex flex-col items-center space-y-4">
                        {navLinks.map(link => (
                            <a 
                                key={link.name} 
                                href={link.path} 
                                onClick={(e) => {e.preventDefault(); setRoute(link.path); setIsMenuOpen(false);}} 
                                className={`font-medium transition-colors duration-200 hover:text-green-600 ${route === link.path ? 'text-green-600' : 'text-gray-600'}`}
                            >
                                {link.name}
                            </a>
                        ))}
                         <div className="relative mt-4">
                            <input
                                type="search"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setRoute('#/shop')}
                                className="pl-10 pr-4 py-2 border rounded-full w-full"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

const Footer = ({ setRoute }: { setRoute: (route: string) => void }) => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <Logo isFooter={true} />
                        <p className="mt-4 text-gray-400 text-sm">Skardu Naturals brings you the pure essence of nature from the heart of Gilgit-Baltistan. Our products are carefully sourced from the pristine valleys of Skardu, ensuring 100% natural goodness without any harmful chemicals.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Site Links</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li><a href="#/about" onClick={(e) => {e.preventDefault(); setRoute('#/about');}} className="text-gray-400 hover:text-white">About Us</a></li>
                            <li><a href="#/shop" onClick={(e) => {e.preventDefault(); setRoute('#/shop');}} className="text-gray-400 hover:text-white">Shop</a></li>
                            <li><a href="#/faq" onClick={(e) => {e.preventDefault(); setRoute('#/faq');}} className="text-gray-400 hover:text-white">FAQ</a></li>
                            <li><a href="#/refund-policy" onClick={(e) => {e.preventDefault(); setRoute('#/refund-policy');}} className="text-gray-400 hover:text-white">Refund Policy</a></li>
                            <li><a href="#/privacy-policy" onClick={(e) => {e.preventDefault(); setRoute('#/privacy-policy');}} className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                            <li><a href="#/terms" onClick={(e) => {e.preventDefault(); setRoute('#/terms');}} className="text-gray-400 hover:text-white">Terms & Conditions</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Contact Us</h3>
                        <ul className="mt-4 space-y-2 text-sm text-gray-400">
                            <li>Email: <a href="mailto:support@skarduorganic.com" className="hover:text-white transition-colors">support@skarduorganic.com</a></li>
                            <li>Phone: <a href="tel:+923488875456" className="hover:text-white transition-colors">+923488875456</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Our Store Location</h3>
                        <div className="mt-4 rounded-lg overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.137021727768!2d75.59600931002018!3d35.31688715112198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e39665796c5685%3A0x8613264b3c37517c!2sSkardu%20Naturals!5e0!3m2!1sen!2sus!4v1719266986506!5m2!1sen!2sus"
                                className="w-full h-48 border-0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Skardu Naturals Store Location"
                            ></iframe>
                        </div>
                         <div className="mt-6">
                            <h3 className="text-lg font-semibold">Follow Us</h3>
                            <div className="flex space-x-4 mt-4">
                                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                                    <FacebookIcon className="w-6 h-6" />
                                </a>
                                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                                    <InstagramIcon className="w-6 h-6" />
                                </a>
                                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                                    <TwitterIcon className="w-6 h-6" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Skardu Naturals. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

const ProductCard: React.FC<{ product: Product, onProductSelect: (product: Product) => void; onAddToCart: () => void; }> = ({ product, onProductSelect, onAddToCart }) => {
    const { addToCart } = useCart();

    const handleAddToCartClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart(product);
        onAddToCart();
    };

    return (
        <div onClick={() => onProductSelect(product)} className="bg-white rounded-lg shadow-md overflow-hidden group transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
            <div className="relative overflow-hidden">
                <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110" />
                {product.originalPrice && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">SALE</span>}
            </div>
            <div className="p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <h3 className="text-lg font-semibold text-gray-800 h-16">{product.name}</h3>
                <div className="flex justify-center items-center my-2">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                </div>
                <div className="my-3">
                    {product.originalPrice && <span className="text-gray-400 line-through mr-2">Rs {product.originalPrice}</span>}
                    <span className="text-xl font-bold text-green-600">Rs {product.price}</span>
                </div>
                <button onClick={handleAddToCartClick} className="w-full bg-gray-800 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-colors duration-300">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
    const calculateTimeLeft = useCallback(() => {
        const difference = +targetDate - +new Date();
        let timeLeft: { [key: string]: number } = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    }, [targetDate]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = Object.keys(timeLeft).map(interval => {
        if (!timeLeft[interval] && timeLeft[interval] !== 0) {
            return null;
        }
        return (
            <div key={interval} className="text-center">
                <div className="text-4xl md:text-6xl font-bold bg-white/20 backdrop-blur-sm p-4 rounded-lg text-yellow-400 transition-all duration-300 hover:bg-white/30 hover:scale-105">{String(timeLeft[interval]).padStart(2, '0')}</div>
                <div className="text-sm uppercase mt-2">{interval}</div>
            </div>
        );
    });

    return (
        <div className="flex space-x-2 md:space-x-4">
            {timerComponents.length ? timerComponents : <span>Time's up!</span>}
        </div>
    );
};

const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void; setRoute: (route: string) => void; }> = ({ isOpen, onClose, setRoute }) => {
    const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
    
    const handleCheckout = () => {
        onClose();
        setRoute('#/checkout');
    }

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[110] transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-xl font-semibold">Shopping Cart</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XIcon className="w-6 h-6" /></button>
                    </div>
                    {cartItems.length > 0 ? (
                        <>
                            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                                        <div className="flex-grow">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-600">Rs {item.price}</p>
                                            <div className="flex items-center mt-2">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 border rounded-md"><MinusIcon className="w-4 h-4" /></button>
                                                <span className="px-3">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 border rounded-md"><PlusIcon className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">Rs {item.price * item.quantity}</p>
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs hover:underline mt-1">Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t">
                                <div className="flex justify-between font-semibold text-lg mb-4">
                                    <span>Subtotal</span>
                                    <span>Rs {cartTotal}</span>
                                </div>
                                <button onClick={handleCheckout} className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-green-700 transition-colors">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                            <ShoppingCartIcon className="w-24 h-24 text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold">Your cart is empty</h3>
                            <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const HeroSlider = ({ setRoute }: { setRoute: (route: string) => void; }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<number | null>(null);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = window.setTimeout(
            () => setCurrentIndex((prevIndex) => (prevIndex === HERO_SLIDES.length - 1 ? 0 : prevIndex + 1)),
            5000 // Change slide every 5 seconds
        );

        return () => {
            resetTimeout();
        };
    }, [currentIndex, resetTimeout]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? HERO_SLIDES.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = useCallback(() => {
        const isLastSlide = currentIndex === HERO_SLIDES.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
            {/* Slide Images */}
            <div>
                {HERO_SLIDES.map((slide, index) => (
                    <div
                        key={slide.imageUrl}
                        className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url('${slide.imageUrl}')` }}
                    ></div>
                ))}
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
            
            {/* Content */}
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-start text-white">
                <div className="relative w-full">
                    {HERO_SLIDES.map((slide, index) => (
                        <div key={index} className={`transition-all duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none absolute'}`}>
                            <h1 className="text-5xl md:text-7xl font-bold max-w-2xl">{slide.title}</h1>
                            <p className="mt-6 max-w-md text-lg">{slide.subtitle}</p>
                            <button
                                onClick={() => setRoute('#/shop')}
                                className="mt-8 bg-gray-900 text-white py-3 px-8 rounded-md font-semibold text-lg hover:bg-white hover:text-black border-2 border-transparent hover:border-white transition-all duration-300 flex items-center space-x-2"
                            >
                                <ShoppingCartIcon className="w-5 h-5" />
                                <span>{slide.buttonText}</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button onClick={goToPrevious} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-20">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button onClick={goToNext} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-20">
                <ChevronRightIcon className="w-6 h-6" />
            </button>
            
            {/* Dot Indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {HERO_SLIDES.map((_, slideIndex) => (
                    <button
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        aria-label={`Go to slide ${slideIndex + 1}`}
                        className={`w-3 h-3 rounded-full transition-colors ${currentIndex === slideIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                    ></button>
                ))}
            </div>
        </section>
    );
};


// --- FAQ COMPONENT ---
const FAQItem: React.FC<{
    faq: { question: string; answer: string };
    isOpen: boolean;
    onClick: () => void;
}> = ({ faq, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200 py-4">
            <button
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 focus:outline-none"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className="pr-2">{faq.question}</span>
                {isOpen ? <MinusIcon className="w-6 h-6 text-green-600 flex-shrink-0" /> : <PlusIcon className="w-6 h-6 text-gray-500 flex-shrink-0" />}
            </button>
            <div
                className={`grid overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}
            >
                <div className="overflow-hidden">
                     <p className="text-gray-600 prose">
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    );
};


// --- RECENTLY VIEWED COMPONENT ---
const RecentlyViewedProducts: React.FC<{ onProductSelect: (product: Product) => void; onAddToCart: () => void; }> = ({ onProductSelect, onAddToCart }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [carouselIndex, setCarouselIndex] = useState(0);

    useEffect(() => {
        try {
            const storedValue = localStorage.getItem('recentlyViewedProducts');
            if (storedValue) {
                const ids: number[] = JSON.parse(storedValue);
                const viewedProducts = ids
                    .map(id => PRODUCTS.find(p => p.id === id))
                    .filter((p): p is Product => p !== undefined);
                setProducts(viewedProducts);
            }
        } catch (error) {
            console.error("Failed to read recently viewed products from localStorage", error);
        }
    }, []);

    const itemsToShow = useMemo(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1024) return 4;
            if (window.innerWidth >= 640) return 2;
        }
        return 1;
    }, []);

    const maxIndex = Math.max(0, products.length - itemsToShow);

    const handlePrev = () => {
        setCarouselIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCarouselIndex(prev => Math.min(maxIndex, prev + 1));
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Recently Viewed Products</h2>
                <div className="relative">
                    <div className="overflow-hidden">
                        <div
                            className="flex -mx-4 transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${carouselIndex * (100 / itemsToShow)}%)` }}
                        >
                            {products.map(product => (
                                <div key={product.id} className="px-4 flex-shrink-0" style={{ flexBasis: `${100 / itemsToShow}%` }}>
                                    <ProductCard product={product} onProductSelect={onProductSelect} onAddToCart={onAddToCart} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {carouselIndex > 0 && (
                         <button onClick={handlePrev} aria-label="Previous viewed products" className="absolute top-1/2 -left-4 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors z-10">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                    )}
                    {carouselIndex < maxIndex && (
                        <button onClick={handleNext} aria-label="Next viewed products" className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors z-10">
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};


// --- PAGE COMPONENTS ---

const HomePage = ({ setRoute, onProductSelect, onAddToCart }: { setRoute: (route: string) => void; onProductSelect: (product: Product) => void; onAddToCart: () => void; }) => {
    const bestSellingSectionRef = useRef<HTMLElement>(null);
    const [offerEndDate] = useState(() => new Date(Date.now() + 3 * 60 * 60 * 1000));
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);

    const handleToggleFaq = (id: number) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    useEffect(() => {
        const section = bestSellingSectionRef.current;
        if (!section) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = section.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            section.style.setProperty('--x', `${x}px`);
            section.style.setProperty('--y', `${y}px`);
        };

        section.addEventListener('mousemove', handleMouseMove);

        return () => {
            section.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <HeroSlider setRoute={setRoute} />

            {/* Features Bar */}
            <section className="bg-gray-800 text-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="flex items-center justify-center space-x-3"><TruckIcon className="w-8 h-8"/><div><h4 className="font-bold">Free Shipping</h4><p className="text-sm text-gray-400">Above 2K Only</p></div></div>
                        <div className="flex items-center justify-center space-x-3"><LeafIcon className="w-8 h-8"/><div><h4 className="font-bold">Certified Organic</h4><p className="text-sm text-gray-400">100% Guarantee</p></div></div>
                        <div className="flex items-center justify-center space-x-3"><SavingsIcon className="w-8 h-8"/><div><h4 className="font-bold">Huge Savings</h4><p className="text-sm text-gray-400">At Lowest Price</p></div></div>
                        <div className="flex items-center justify-center space-x-3"><ReturnIcon className="w-8 h-8"/><div><h4 className="font-bold">Easy Returns</h4><p className="text-sm text-gray-400">14 Day Money Back</p></div></div>
                    </div>
                </div>
            </section>
            
            {/* Best Selling Products */}
            <section
                ref={bestSellingSectionRef}
                className="py-16 bg-[#3d8a8b] interactive-glow-section"
            >
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-8">Best Selling Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} product={p} onProductSelect={onProductSelect} onAddToCart={onAddToCart} />)}
                    </div>
                </div>
            </section>

            {/* Promotion Section */}
            <section className="relative py-20 overflow-hidden text-white group">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                    style={{ backgroundImage: "url('https://picsum.photos/id/20/1800/800')" }}
                ></div>
                <div className="absolute inset-0 bg-slate-800/70"></div>
                <div className="relative container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <p className="text-lg font-medium">New In Town</p>
                            <h2 className="text-4xl md:text-5xl font-bold mt-2 leading-tight">
                                <strong 
                                    className="block text-5xl md:text-6xl font-extrabold text-yellow-400" 
                                    style={{ textShadow: '0 0 8px rgba(250, 204, 21, 0.6)' }}
                                >
                                    Buy 1 Get 1 Free
                                </strong> 
                                on SHILAJIT Organic!
                            </h2>
                            <div className="mt-8"><CountdownTimer targetDate={offerEndDate} /></div>
                            <button onClick={() => setRoute('#/shop')} className="mt-8 bg-gray-900 text-white py-3 px-8 rounded-md font-semibold text-lg hover:bg-white hover:text-black border-2 border-transparent hover:border-white transition-all duration-300 flex items-center space-x-2">
                                <ShoppingCartIcon className="w-5 h-5" />
                                <span>Shop Now</span>
                            </button>
                        </div>
                        <div className="hidden md:block">
                            <img src={SHILAJIT_IMAGE_URL} alt="Shilajit" className="rounded-lg shadow-2xl object-cover w-full h-full max-h-[400px]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Products */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8">Trending Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                         {PRODUCTS.slice(4, 8).map(p => <ProductCard key={p.id} product={p} onProductSelect={onProductSelect} onAddToCart={onAddToCart} />)}
                    </div>
                </div>
            </section>

            {/* Recently Viewed Products */}
            <RecentlyViewedProducts onProductSelect={onProductSelect} onAddToCart={onAddToCart} />

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-8">Common Questions</h2>
                    <div className="max-w-3xl mx-auto text-left">
                        {FAQS.slice(0, 4).map(faq => (
                            <FAQItem
                                key={faq.id}
                                faq={faq}
                                isOpen={openFaqId === faq.id}
                                onClick={() => handleToggleFaq(faq.id)}
                            />
                        ))}
                    </div>
                    <button onClick={() => setRoute('#/faq')} className="mt-8 bg-gray-800 text-white py-3 px-8 rounded-md font-semibold text-lg hover:bg-green-700 transition-colors duration-300">
                        View All FAQs
                    </button>
                </div>
            </section>
        </div>
    );
};

const ShopPage = ({ products, onProductSelect, onAddToCart }: { products: Product[]; onProductSelect: (product: Product) => void; onAddToCart: () => void; }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
            <h1 className="text-4xl font-bold text-center mb-10">Our Products</h1>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} onAddToCart={onAddToCart} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <SearchIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
                    <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
                </div>
            )}
        </div>
    );
};

const AboutPage = () => {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-cover bg-center h-80" style={{ backgroundImage: "url('https://picsum.photos/id/1015/1800/600')" }}>
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="text-5xl font-bold text-white text-center tracking-tight">About Skardu Organic</h1>
                 </div>
            </div>

            {/* Our Story */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Story</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Our journey began in the breathtaking landscapes of Skardu, Gilgit-Baltistan, a place where the air is pure, the water is crystal clear, and nature's bounty is at its most potent. We were inspired by the traditional wisdom of the local communities who have for centuries harnessed the power of natural ingredients like Shilajit. Skardu Organic was born from a desire to share these treasures with the world, preserving their purity and potency from the Himalayan peaks to your home.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            We started as a small, family-run initiative, driven by a passion for wellness and a deep respect for the environment. Our commitment is to authenticity, ensuring that every product we offer is a true reflection of its pristine origins.
                        </p>
                    </div>
                     <div className="order-1 md:order-2">
                        <img src="https://picsum.photos/id/10/600/500" alt="Himalayan Mountains" className="rounded-lg shadow-xl w-full h-full object-cover"/>
                    </div>
                </div>
            </section>

            {/* Our Mission */}
            <section className="bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                     <div className="max-w-3xl mx-auto text-center">
                         <h2 className="text-4xl font-bold text-gray-800">Our Mission</h2>
                         <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                            Our mission is to provide you with the highest quality organic products that nourish your body and soul. We are dedicated to promoting a lifestyle of health and wellness by making pure, natural, and ethically sourced goods accessible to everyone. We strive to operate with integrity, transparency, and a commitment to sustainability in everything we do.
                         </p>
                     </div>
                </div>
            </section>

            {/* Our Impact */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800">Our Impact</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        By choosing Skardu Organic, you're not just investing in your health—you're contributing to a larger positive impact.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-8 bg-white rounded-lg shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                        <LeafIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">Ethical Sourcing</h3>
                        <p className="text-gray-600">We partner directly with local farmers and harvesters in Skardu, ensuring fair wages and supporting traditional practices that have sustained their communities for generations.</p>
                    </div>
                     <div className="p-8 bg-white rounded-lg shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
                        </svg>
                        <h3 className="text-2xl font-semibold mb-2">Sustainability</h3>
                        <p className="text-gray-600">We are committed to sustainable harvesting and eco-friendly packaging to minimize our environmental footprint and preserve the natural beauty of the Himalayas for the future.</p>
                    </div>
                    <div className="p-8 bg-white rounded-lg shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-2xl font-semibold mb-2">Community Empowerment</h3>
                        <p className="text-gray-600">A portion of our profits is reinvested into community development projects in Skardu, focusing on education, healthcare, and infrastructure to uplift the region that gives us so much.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FAQPage = () => {
    const [openFaqId, setOpenFaqId] = useState<number | null>(1); // Default first FAQ open

    const handleToggle = (id: number) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                 <div className="text-center mb-12">
                     <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Frequently Asked Questions</h1>
                     <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">Have a question? We're here to help. Find answers to common queries below.</p>
                 </div>
                 <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6">
                    {FAQS.map(faq => (
                        <FAQItem
                            key={faq.id}
                            faq={faq}
                            isOpen={openFaqId === faq.id}
                            onClick={() => handleToggle(faq.id)}
                        />
                    ))}
                 </div>
            </div>
        </div>
    );
};

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setError('All fields are required.');
            return;
        }
        setError('');
        console.log('Form Submitted:', formData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <div className="w-full max-w-lg text-center bg-white shadow-2xl rounded-xl p-8">
                    <h1 className="text-3xl font-bold text-[#3d8a8b]">Thank You!</h1>
                    <p className="mt-4 text-lg text-gray-700">Your message has been received. We will get back to you shortly.</p>
                    <button 
                        onClick={() => {
                            setSubmitted(false);
                            setFormData({ name: '', email: '', message: '' });
                        }}
                        className="mt-8 bg-[#3d8a8b] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#357a7b] transition-colors"
                    >
                        Send Another Message
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                 <div className="text-center mb-12">
                     <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Contact Us</h1>
                     <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">We'd love to hear from you! Please fill out the form below.</p>
                 </div>

                 <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
                    <div className="p-8 sm:p-10">
                         <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#3d8a8b] focus:border-[#3d8a8b] transition-colors" placeholder="Your Full Name" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#3d8a8b] focus:border-[#3d8a8b] transition-colors" placeholder="your.email@example.com" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea name="message" id="message" value={formData.message} onChange={handleInputChange} rows={5} className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#3d8a8b] focus:border-[#3d8a8b] transition-colors" placeholder="Your message..."></textarea>
                            </div>
                             {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                             <button type="submit" className="w-full bg-[#3d8a8b] text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-[#357a7b] transition-colors duration-300">
                                 Submit
                             </button>
                         </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AuthPage = ({ setRoute }: { setRoute: (route: string) => void }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let success = false;
        if (isLogin) {
            success = login(email, password);
            if (!success) setError('Invalid email or password.');
        } else {
            success = register(name, email, password);
            if (!success) setError('An account with this email already exists.');
        }
        if (success) {
            setRoute('#/');
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 flex justify-center">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-md rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-center mb-6">{isLogin ? 'Login' : 'Create Account'}</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                             <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-md" required />
                        )}
                        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-md" required />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-md" required />
                        
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        
                        <button type="submit" className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-green-700 transition-colors">
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                    <p className="text-center mt-6 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => setIsLogin(!isLogin)} className="text-green-600 font-semibold hover:underline">
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};


const CheckoutPage = ({ setRoute }: { setRoute: (route: string) => void }) => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [placedOrder, setPlacedOrder] = useState<{ details: any; items: CartItem[]; total: number } | null>(null);
    const [billingDetails, setBillingDetails] = useState({
        firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBillingDetails(prev => ({ ...prev, [name]: value }));
    };

    const constructStoreOrderMessage = () => {
        let message = `*New Order from Skardu Organic*\n\n`;
        message += `*Customer Details:*\n`;
        message += `Name: ${billingDetails.firstName} ${billingDetails.lastName}\n`;
        message += `Email: ${billingDetails.email}\n`;
        message += `Phone: ${billingDetails.phone}\n`;
        message += `Address: ${billingDetails.address}, ${billingDetails.city}, ${billingDetails.state} ${billingDetails.zip}\n\n`;
        message += `*Order Summary:*\n`;
        cartItems.forEach(item => {
            message += `- ${item.name} (x${item.quantity}) - Rs ${item.price * item.quantity}\n`;
        });
        message += `\n*Total: Rs ${cartTotal}*`;
        return message;
    };

    const processOrder = () => {
        setPlacedOrder({
            details: billingDetails,
            items: [...cartItems],
            total: cartTotal
        });
        clearCart();
    };

    const handleWhatsAppOrder = (e: React.FormEvent) => {
        e.preventDefault();
        const message = encodeURIComponent(constructStoreOrderMessage());
        const whatsappUrl = `https://wa.me/923488875456?text=${message}`;
        window.open(whatsappUrl, '_blank');
        processOrder();
    };

    const handleEmailOrder = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = encodeURIComponent('New Order from Skardu Organic');
        const body = encodeURIComponent(constructStoreOrderMessage().replace(/\*/g, '')); // remove markdown for email
        const mailtoUrl = `mailto:support@skarduorganic.com?subject=${subject}&body=${body}`;
        window.open(mailtoUrl);
        processOrder();
    };
    
    if (placedOrder) {
        const constructUserConfirmationMessage = () => {
            let message = `Hello ${placedOrder.details.firstName},\n\n`;
            message += `Thank you for your purchase from Skardu Organic! We have received your order and will contact you shortly to confirm the details.\n\n`;
            message += `*Order Summary:*\n`;
            placedOrder.items.forEach(item => {
                message += `- ${item.name} (x${item.quantity}) - Rs ${item.price * item.quantity}\n`;
            });
            message += `\n*Total: Rs ${placedOrder.total}*\n\n`;
            message += `*Shipping to:*\n`;
            message += `${placedOrder.details.address}, ${placedOrder.details.city}, ${placedOrder.details.state} ${placedOrder.details.zip}\n\n`;
            message += `We appreciate your business!`;
            return message;
        };

        const handleSendConfirmationToWhatsApp = () => {
             const message = encodeURIComponent(constructUserConfirmationMessage());
             // Basic phone number cleaning, assuming national format might be used.
             // This may need to be more robust for international numbers.
             const phone = placedOrder.details.phone.replace(/[^0-9+]/g, '');
             const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
             window.open(whatsappUrl, '_blank');
        };

        const handleSendConfirmationToEmail = () => {
            const subject = encodeURIComponent(`Your Skardu Organic Order Confirmation`);
            const body = encodeURIComponent(constructUserConfirmationMessage().replace(/\*/g, ''));
            const mailtoUrl = `mailto:${placedOrder.details.email}?subject=${subject}&body=${body}`;
            window.open(mailtoUrl);
        };

        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-green-600 text-center">Thank you for your purchase!</h1>
                    <p className="mt-4 text-center text-gray-700">Your order has been submitted successfully. We will contact you shortly to confirm the details.</p>
                    <div className="mt-8 border-t pt-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2">
                            {placedOrder.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <p>{item.name} x{item.quantity}</p>
                                    <p className="font-medium">Rs {item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-4 mt-4 border-t">
                            <p>Total</p>
                            <p>Rs {placedOrder.total}</p>
                        </div>
                    </div>
                     <div className="mt-8 border-t pt-6">
                        <h3 className="text-lg font-semibold mb-2">Get a copy of your receipt:</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={handleSendConfirmationToWhatsApp} className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600 transition-colors">Send to my WhatsApp</button>
                            <button onClick={handleSendConfirmationToEmail} className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 transition-colors">Send to my Email</button>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                         <button onClick={() => setRoute('#/shop')} className="text-green-600 font-semibold hover:underline">
                            &larr; Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
             <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl font-bold text-gray-800">Your Cart is Empty</h1>
                <p className="mt-4 text-lg text-gray-700">Looks like you haven't added anything to your cart yet.</p>
                <button onClick={() => setRoute('#/shop')} className="mt-8 bg-green-600 text-white py-3 px-8 rounded-md font-semibold text-lg hover:bg-green-700 transition-colors">
                    Start Shopping
                </button>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-center mb-10">Checkout</h1>
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-semibold mb-6">Billing Details</h2>
                    <form className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <input type="text" name="firstName" placeholder="First Name" className="w-full p-3 border rounded-md" onChange={handleInputChange} required />
                            <input type="text" name="lastName" placeholder="Last Name" className="w-full p-3 border rounded-md" onChange={handleInputChange} required />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                           <input type="email" name="email" placeholder="Email Address" className="w-full p-3 border rounded-md" onChange={handleInputChange} required />
                           <input type="tel" name="phone" placeholder="Phone Number (e.g., +923...)" className="w-full p-3 border rounded-md" onChange={handleInputChange} required />
                        </div>
                        <input type="text" name="address" placeholder="Address" className="w-full p-3 border rounded-md" onChange={handleInputChange} required />
                        <div className="grid sm:grid-cols-3 gap-6">
                             <input type="text" name="city" placeholder="City" className="w-full p-3 border rounded-md" onChange={handleInputChange} required />
                             <input type="text" name="state" placeholder="State" className="w-full p-3 border rounded-md" onChange={handleInputChange} required />
                             <input type="text" name="zip" placeholder="ZIP Code" className="w-full p-3 border rounded-md" onChange={handleInputChange} required />
                        </div>
                        <div className="pt-4 space-y-4">
                            <button onClick={handleWhatsAppOrder} className="w-full bg-green-500 text-white py-4 px-6 rounded-md font-semibold text-lg hover:bg-green-600 transition-colors">Order via WhatsApp</button>
                            <button onClick={handleEmailOrder} className="w-full bg-blue-500 text-white py-4 px-6 rounded-md font-semibold text-lg hover:bg-blue-600 transition-colors">Order via Email</button>
                        </div>
                    </form>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg self-start">
                    <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">Rs {item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t space-y-2">
                        <div className="flex justify-between">
                            <p>Subtotal</p>
                            <p>Rs {cartTotal}</p>
                        </div>
                         <div className="flex justify-between">
                            <p>Shipping</p>
                            <p>Free</p>
                        </div>
                        <div className="flex justify-between text-xl font-bold pt-2">
                            <p>Total</p>
                            <p>Rs {cartTotal}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RefundPolicyPage = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto prose lg:prose-xl">
            <h1>Refund Policy</h1>
            <p>We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.</p>

            <p>To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.</p>

            <p>To start a return, you can contact us at <a href="mailto:support@skarduorganic.com">support@skarduorganic.com</a>. Please note that returns will need to be sent to the following address: [Office 403, 4th floor, Building Park Lane, E 11/2 Islamabad]</p>

            <p>If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.</p>

            <p>You can always contact us for any return question at <a href="mailto:support@skarduorganic.com">support@skarduorganic.com</a>.</p>

            <h2>Damages and issues</h2>
            <p>Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.</p>

            <h2>Exceptions / non-returnable items</h2>
            <p>Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.</p>
            <p>Unfortunately, we cannot accept returns on sale items or gift cards.</p>

            <h2>Exchanges</h2>
            <p>The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p>

            <h2>European Union 14 day cooling off period</h2>
            <p>Notwithstanding the above, if the merchandise is being shipped into the European Union, you have the right to cancel or return your order within 14 days, for any reason and without a justification. As above, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.</p>

            <h2>Refunds</h2>
            <p>We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.</p>
            <p>If more than 15 business days have passed since we’ve approved your return, please contact us at <a href="mailto:support@skarduorganic.com">support@skarduorganic.com</a>.</p>
        </div>
    </div>
);

const PrivacyPolicyPage = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto prose lg:prose-xl">
            <h1>Privacy Policy</h1>
            <p>Your privacy is important to us. It is Skardu Organic's policy to respect your privacy regarding any information we may collect from you across our website.</p>
            
            <h2>1. Information we collect</h2>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used. The types of personal information we may collect include:</p>
            <ul>
                <li><strong>Contact Information:</strong> such as your name, email address, and phone number, which you provide through our contact form or during checkout.</li>
                <li><strong>Shipping Information:</strong> such as your shipping address, city, state, and ZIP code for order fulfillment.</li>
                <li><strong>Transaction Information:</strong> Details about products you purchase from us.</li>
            </ul>

            <h2>2. How we use your information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul>
                <li>Process and manage your orders, including shipping and handling, and returns.</li>
                <li>Communicate with you, including responding to your inquiries submitted through our contact form.</li>
                <li>Provide you with customer support.</li>
                <li>Comply with legal obligations.</li>
            </ul>

            <h2>3. Security of your information</h2>
            <p>We take the security of your data seriously and use appropriate measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet or method of electronic storage is 100% secure.</p>
            
            <h2>4. Third-Party Services</h2>
            <p>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>

            <h2>5. Your Rights</h2>
            <p>You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services. Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information.</p>

            <h2>Contact Us</h2>
            <p>If you have any questions about how we handle user data and personal information, feel free to contact us through the methods provided on our Contact page.</p>
        </div>
    </div>
);

const TermsAndConditionsPage = () => (
     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto prose lg:prose-xl">
            <h1>Terms and Conditions</h1>
            <p>Welcome to Skardu Organic. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Skardu Organic's relationship with you in relation to this website.</p>

            <h2>1. General</h2>
            <p>The content of the pages of this website is for your general information and use only. It is subject to change without notice. Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.</p>

            <h2>2. Products and Pricing</h2>
            <p>All products listed on the website are subject to availability, and we reserve the right to impose quantity limits on any order, to reject all or part of an order, and to discontinue products without notice, even if you have already placed your order. All prices are subject to change without notice.</p>
            
            <h2>3. Orders and Payment</h2>
            <p>By completing a purchase with us, you agree to provide current, complete, and accurate purchase and account information. Our checkout process utilizes third-party services like WhatsApp and Email for order placement. We are not responsible for any issues arising from the use of these third-party services.</p>

            <h2>4. Shipping and Delivery</h2>
            <p>Shipping and delivery times are estimates only and cannot be guaranteed. We are not responsible for any delays in delivery.</p>

            <h2>5. Returns and Refunds</h2>
            <p>Our policy on returns, exchanges, and refunds is detailed in our <a href="#/refund-policy">Refund Policy</a> page. Please review it for full information on the process and eligibility.</p>
            
            <h2>6. Limitation of Liability</h2>
            <p>In no event shall Skardu Organic, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>

            <h2>7. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions.</p>
        </div>
    </div>
);

interface Review {
    name: string;
    rating: number;
    comment: string;
    date: string;
}

const ProductDetailPage = ({ productId, setRoute, onAddToCart }: { productId: number; setRoute: (route: string) => void; onAddToCart: () => void; }) => {
    const product = PRODUCTS.find(p => p.id === productId);
    const [activeImage, setActiveImage] = useState(product?.imageUrls[0] || '');
    const [activeTab, setActiveTab] = useState('description');
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewerName, setReviewerName] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');


    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePosition({ x, y });
    };

    useEffect(() => {
        if (product) {
            setActiveImage(product.imageUrls[0]);
        }
        try {
            const storedReviews = localStorage.getItem(`reviews_${productId}`);
            if (storedReviews) {
                setReviews(JSON.parse(storedReviews));
            }
        } catch (error) {
            console.error("Failed to load reviews from localStorage", error);
            setReviews([]);
        }
    }, [product, productId]);
    
    useEffect(() => {
        if (!productId) return;
        try {
            const MAX_RECENTLY_VIEWED = 8;
            const storedValue = localStorage.getItem('recentlyViewedProducts');
            let recentlyViewedIds: number[] = storedValue ? JSON.parse(storedValue) : [];
            
            recentlyViewedIds = recentlyViewedIds.filter(id => id !== productId);
            recentlyViewedIds.unshift(productId);
            
            const trimmedIds = recentlyViewedIds.slice(0, MAX_RECENTLY_VIEWED);
            
            localStorage.setItem('recentlyViewedProducts', JSON.stringify(trimmedIds));
        } catch (error) {
            console.error("Failed to update recently viewed products", error);
        }
    }, [productId]);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewerName.trim() || rating === 0 || !comment.trim()) {
            setReviewError('Please fill in your name, provide a rating, and write a comment.');
            return;
        }

        const newReview: Review = {
            name: reviewerName.trim(),
            rating,
            comment: comment.trim(),
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        };

        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);

        try {
            localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
        } catch (error) {
            console.error("Failed to save reviews to localStorage", error);
        }

        // Reset form
        setReviewerName('');
        setRating(0);
        setHoverRating(0);
        setComment('');
        setReviewError('');
    };


    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl font-bold">Product not found</h1>
                <button onClick={() => setRoute('#/shop')} className="mt-8 bg-green-600 text-white py-3 px-8 rounded-md font-semibold text-lg hover:bg-green-700">
                    Back to Shop
                </button>
            </div>
        );
    }
    
    const handleAddToCart = () => {
        addToCart(product);
        onAddToCart();
    };

    const breadcrumbs = [
        { name: 'Home', path: '#/' },
        { name: 'Shop', path: '#/shop' },
        { name: product.name, path: `#/product/${product.id}` }
    ];

    const tabs = [
        { id: 'description', name: 'Description' },
        { id: 'shipping', name: 'Shipping & Delivery' }
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumbs */}
            <nav className="text-sm mb-8">
                {breadcrumbs.map((crumb, index) => (
                    <span key={crumb.name}>
                        <a href={crumb.path} onClick={(e) => { e.preventDefault(); setRoute(crumb.path); }} className="text-gray-500 hover:text-gray-800">
                            {crumb.name}
                        </a>
                        {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                    </span>
                ))}
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div>
                    <div
                        className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onMouseMove={handleMouseMove}
                    >
                        <img
                            src={activeImage}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 ease-out"
                            style={{
                                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                                transform: isHovered ? 'scale(1.5)' : 'scale(1)',
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.imageUrls.map((url, index) => (
                            <div
                                key={index}
                                className={`aspect-square bg-gray-100 rounded-md cursor-pointer border-2 ${activeImage === url ? 'border-green-600' : 'border-transparent'}`}
                                onClick={() => setActiveImage(url)}
                            >
                                <img src={url} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover rounded-sm" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
                    <div className="my-4">
                        {product.originalPrice && <span className="text-gray-500 line-through mr-3 text-2xl">Rs {product.originalPrice}</span>}
                        <span className="text-3xl font-bold text-green-600">Rs {product.price}</span>
                    </div>
                    <div className="prose text-gray-600 mt-4">
                        <h4 className="font-semibold mt-4">Benefits:</h4>
                        <ul className="list-disc list-inside">
                            {product.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
                        </ul>
                    </div>
                     <div className="mt-8 flex items-center gap-4">
                        <button onClick={handleAddToCart} className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center space-x-2">
                            <ShoppingCartIcon className="w-6 h-6" />
                            <span>Add to Cart</span>
                        </button>
                        <button onClick={() => { handleAddToCart(); setRoute('#/checkout'); }} className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-gray-700 transition-colors duration-300">
                            Buy Now
                        </button>
                    </div>
                    <div className="mt-6 border-t pt-4 text-sm text-gray-500">
                        <p><span className="font-semibold text-gray-700">Category:</span> {product.category}</p>
                    </div>
                </div>
            </div>

            {/* Description Tabs */}
            <div className="mt-16">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-green-600 text-green-700'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-8 prose max-w-none">
                    {activeTab === 'description' && (
                        <div>
                            <h3 className="font-bold">Product Description</h3>
                            <p>{product.description}</p>
                        </div>
                    )}
                    {activeTab === 'shipping' && (
                        <div>
                            <h3 className="font-bold">Shipping & Delivery</h3>
                            <p>We offer free shipping on all orders above Rs 2000. For orders below this amount, a standard shipping fee of Rs 200 will be applied.</p>
                            <p>Orders are typically processed and shipped within 1-2 business days. Delivery times may vary based on your location.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Reviews Section */}
            <div className="mt-16 pt-10 border-t">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
                
                {/* Review Form */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                            <label htmlFor="reviewerName" className="block text-sm font-medium text-gray-700">Your Name</label>
                            <input type="text" id="reviewerName" value={reviewerName} onChange={e => setReviewerName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Your Rating</label>
                            <div className="flex items-center mt-1" onMouseLeave={() => setHoverRating(0)}>
                                {[...Array(5)].map((_, index) => {
                                    const starValue = index + 1;
                                    return (
                                        <button
                                            type="button"
                                            key={starValue}
                                            onClick={() => setRating(starValue)}
                                            onMouseEnter={() => setHoverRating(starValue)}
                                            className="text-gray-300"
                                            aria-label={`Rate ${starValue} stars`}
                                        >
                                            <StarIcon className={`w-6 h-6 transition-colors ${starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Comment</label>
                            <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"></textarea>
                        </div>
                        {reviewError && <p className="text-red-500 text-sm">{reviewError}</p>}
                        <div>
                            <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-colors">Submit Review</button>
                        </div>
                    </form>
                </div>
                
                {/* Display Reviews */}
                <div className="space-y-6">
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <div key={index} className="border-b pb-4">
                                <div className="flex items-center mb-2">
                                    <p className="font-semibold text-gray-800 mr-4">{review.name}</p>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                                    </div>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                                <p className="text-xs text-gray-400 mt-2">{review.date}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Be the first to review this product!</p>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSetRoute = useCallback((newRoute: string) => {
    window.location.hash = newRoute;
    setRoute(newRoute);
  }, []);

  const handleOpenCart = () => {
      setIsCartOpen(true);
  };

  const handleCloseCart = () => {
      setIsCartOpen(false);
  };

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
      const filteredProducts = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      const productMatch = route.match(/^#\/product\/(\d+)$/);
      if (productMatch) {
          const productId = parseInt(productMatch[1], 10);
          return <ProductDetailPage productId={productId} setRoute={handleSetRoute} onAddToCart={handleOpenCart} />;
      }
      
    switch (route) {
      case '#/shop':
        return <ShopPage products={filteredProducts} onProductSelect={(p) => handleSetRoute(`#/product/${p.id}`)} onAddToCart={handleOpenCart} />;
      case '#/about':
        return <AboutPage />;
      case '#/contact':
        return <ContactPage />;
      case '#/faq':
        return <FAQPage />;
      case '#/checkout':
        return <CheckoutPage setRoute={handleSetRoute} />;
      case '#/auth':
          return <AuthPage setRoute={handleSetRoute} />;
      case '#/refund-policy':
          return <RefundPolicyPage />;
      case '#/privacy-policy':
          return <PrivacyPolicyPage />;
      case '#/terms':
          return <TermsAndConditionsPage />;
      default:
        return <HomePage setRoute={handleSetRoute} onProductSelect={(p) => handleSetRoute(`#/product/${p.id}`)} onAddToCart={handleOpenCart} />;
    }
  };

  return (
    <AuthProvider>
        <CartProvider>
            <div className="bg-white text-gray-800 antialiased">
                <Header 
                    setRoute={handleSetRoute} 
                    route={route} 
                    onCartClick={handleOpenCart} 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                />
                <main>
                    {renderPage()}
                </main>
                <Footer setRoute={handleSetRoute} />
                <CartSidebar isOpen={isCartOpen} onClose={handleCloseCart} setRoute={handleSetRoute} />
            </div>
        </CartProvider>
    </AuthProvider>
  );
}

export default App;