import { useState } from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Menu, X, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useProductStore } from "../stores/useProductStore";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
     // 💡 MODIFICATION : On utilise directement l'état et l'action du ProductStore
    const { searchQuery, setSearchQueryDebounced  } = useProductStore(); 
   
    const { user, logout } = useUserStore(); 
    const isAdmin = user?.role === "admin";

    const handleSearchSubmit = (e) => e.preventDefault();
    
    return (
        <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-95 backdrop-blur-md shadow-lg z-50 transition-all duration-300 border-b border-emerald-800">
            <div className="container mx-auto px-4 py-5 flex justify-between items-center gap-4">
                
                {/* Logo */}
                <Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex min-w-fit' onClick={() => setIsOpen(false)}>
                    <h2>Skelcom</h2> kell ecommerce
                </Link>

                {/* Barre de recherche centrale */}
                <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-grow max-w-md relative mx-4">
                    <input
                        type="text"
                        placeholder="Rechercher une œuvre, un artiste..."
                        value={searchQuery}
                        onChange={(e) => setSearchQueryDebounced(e.target.value)}
                        className="w-full bg-white border border-gray-700 text-sm text-black rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-emerald-500 placeholder-gray-500 transition-colors"
                    />
                    <svg className="absolute left-3 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </form>

                {/* Bouton Hamburger Mobile */}
                <button 
                    className="text-gray-300 hover:text-emerald-400 md:hidden focus:outline-none ml-auto"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Navigation Grand Écran */}
                <nav className='hidden md:flex items-center gap-6 min-w-fit'>
                    <NavLinks user={user} isAdmin={isAdmin} logout={logout} isMobile={false} />
                </nav>
            </div>

            {/* Menu Mobile Déroulant */}
            {isOpen && (
                <nav className="md:hidden bg-gray-900 border-b border-emerald-800 px-4 py-4 space-y-4 flex flex-col">
                    <form onSubmit={handleSearchSubmit} className="relative w-full mb-2">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 text-sm text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-emerald-500 placeholder-gray-500"
                        />
                        <svg className="absolute left-3 top-3 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </form>
                    
                    <NavLinks user={user} isAdmin={isAdmin} logout={logout} closeMenu={() => setIsOpen(false)} isMobile={true} />
                </nav>
            )}
        </header>
    );
};

const NavLinks = ({ user, isAdmin, logout, closeMenu, isMobile }) => {
    const { cart } = useCartStore();
    
    const handleLogoutClick = () => {
        logout(); 
        if (closeMenu) closeMenu(); 
    };

    return (
        <>
            <Link to="/" className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out' onClick={closeMenu}>
                Accueil
            </Link>

            {user && (
                <div className={`flex items-center gap-4 ${isMobile ? 'w-full' : ''}`}>
                    <Link 
                        to="/cart" 
                        className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center p-2" 
                        onClick={closeMenu}
                    >
                        <ShoppingCart className="group-hover:text-emerald-400" size={20}/>
                        <span className="ml-2">Panier</span>
                        
                        <span className="absolute top-0 right-[-10px] bg-emerald-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold shadow-sm group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                             {cart ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0}
                        </span>
                    </Link>
                </div>
            )}

            {isAdmin && (
                <Link to="/dashboard" className={`bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md font-medium transition duration-300 ease-in-out flex items-center justify-center ${isMobile ? 'w-full' : ''}`} onClick={closeMenu}>
                    <Lock className="inline-block mr-2" size={18}/>
                    <span>Dashboard</span>
                </Link>
            )}

            {user ? (
                <>
                    {isMobile && (
                        <Link 
                            to="/my-orders" 
                            className="w-full text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center py-1" 
                            onClick={closeMenu}
                        >
                            <ShoppingBag className="inline-block mr-2" size={18}/>
                            <span>Mes Commandes</span>
                        </Link>
                    )}

                    <button 
                        className={`bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-300 ease-in-out ${isMobile ? 'w-full' : ''}`} 
                        onClick={handleLogoutClick}
                    >
                        <LogOut size={18} className="mr-2"/>
                        <span>Se déconnecter</span>
                    </button>
                </>
            ) : (
                <>
                    <Link to="/signup" className={`bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-300 ease-in-out ${isMobile ? 'w-full' : ''}`} onClick={closeMenu}>
                        <UserPlus className="mr-2" size={18}/>
                        S'inscrire
                    </Link>

                    <Link to="/login" className={`bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-300 ease-in-out ${isMobile ? 'w-full' : ''}`} onClick={closeMenu}>
                        <LogIn className="mr-2" size={18}/>
                        Se connecter
                    </Link>
                </>
            )}
        </>
    );
};

export default Navbar;
