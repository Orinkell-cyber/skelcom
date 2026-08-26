import React, { useEffect } from "react"
import { Navigate, Route , Routes, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // 💡 1. Importez le Footer
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";
import { MessageCircle } from "lucide-react"; // 💡 Import de l'icône WhatsApp
import ContactPage from "./pages/ContactPage";
import CategoryPage from "./pages/CategoryPage"; 
import AllProductsPage from "./pages/AllProductsPage";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [user, getCartItems]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#f4fafd] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    // 💡 Note : flex flex-col min-h-screen permet de pousser le footer tout en bas si la page a peu de contenu
    <div className="min-h-screen flex flex-col bg-[#f4fafd] text-slate-900 relative overflow-hidden">
      
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute inset-0 bg-[linear-gradient(60deg,#e0f2fe_1px,transparent_1px),linear-gradient(-60deg,#e0f2fe_1px,transparent_1px)] bg-[size:6rem_10rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)] opacity-70" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,1)_0%,rgba(224,242,254,0.9)_30%,rgba(186,230,253,0.4)_60%,transparent_100%)] filter blur-[2px]"/>
          <div className="absolute top-[-10%] left-1/4 w-[60%] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(219,234,254,0.4)_0%,rgba(219,219,254,0.15)_40%,rgba(254,226,226,0.15)_70%,transparent_100%)] mix-blend-multiply filter blur-3xl opacity-80 animate-pulse [animation-duration:8s]" />
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
      </div>

      {/* Contenu de l'application */}
      <div className="relative z-50 flex flex-col flex-grow">
        <Navbar />
        
        {user && (
          <div className="fixed top-[70px] left-0 w-full bg-gray-900/90 backdrop-blur-sm border-b border-emerald-950 text-slate-300 text-xs tracking-wide px-8 py-5 z-40 flex justify-between items-center">
            <div>
              Connecté en tant que : <strong className="text-emerald-400 font-medium">{user.name}</strong>
            </div>
            <Link to="/my-orders" className="hidden md:flex items-center gap-1.5 text-gray-300 hover:text-emerald-400 font-medium transition duration-300">
              <span>Mes Commandes</span>
            </Link>
          </div>
        )}

        {/* flex-grow pousse le contenu à occuper l'espace restant pour plaquer le footer */}
        <main className={`flex-grow ${user ? 'pt-28' : 'pt-20'}`}>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/'/>} />
            <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/'/>} />
            <Route path='/cart' element={user ? <CartPage /> : <Navigate to="/login" />} />
            <Route path='/my-orders' element={user ? <OrdersPage /> : <Navigate to="/login" />} />
            <Route path='/payment-success' element={<PaymentSuccess />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/category/:categoryName' element={<CategoryPage />} />
            <Route path='/all-products' element={<AllProductsPage />} />
            {/* Redirection vers la page d'accueil si l'utilisateur n'est pas admin */}
            <Route path='/dashboard' element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          </Routes> 
        </main>

                {/* 💡 Bouton Flottant WhatsApp Corrigé (Reste toujours au-dessus du footer) */}
        <a 
          href="https://wa.me" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-20 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] z-[100] hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group animate-bounce [animation-duration:3s]"
          title="Discuter sur WhatsApp"
        >
          {/* Icône de secours SVG WhatsApp pour un design parfait */}
          <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66 1.11 3.328 1.882 5.354 1.883 5.466 0 9.912-4.444 9.915-9.913.002-2.651-1.02-5.143-2.877-7c-1.856-1.857-4.324-2.88-6.973-2.883-5.47 0-9.92 4.443-9.923 9.913-.001 2.13.565 4.212 1.634 6.014L2.6 21.432l4.047-1.278zm12.115-4.407c-.316-.16-1.872-.924-2.162-1.027-.29-.105-.502-.157-.712.157-.21.314-.813 1.026-.997 1.237-.183.21-.365.235-.68.077-1.316-.65-2.235-1.077-3.13-2.613-.235-.4-.235-.66-.076-.82.143-.143.315-.364.473-.546.06-.07.12-.14.18-.21.158-.293.22-.502.32-.71.1-.21.05-.393-.025-.55-.075-.157-.712-1.717-.975-2.35-.257-.615-.518-.532-.712-.542-.184-.01-.395-.01-.605-.01-.21 0-.552.08-.84.394-.287.316-1.1 1.077-1.1 2.63s1.132 3.064 1.29 3.273c.158.21 2.226 3.4 5.4 4.766.753.325 1.342.518 1.802.663.757.24 1.447.207 1.994.125.61-.09 1.872-.765 2.134-1.47.26-.707.26-1.313.183-1.44-.077-.126-.288-.207-.604-.367z"/>
          </svg>
          
          <span className="absolute right-16 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gray-800 shadow-md pointer-events-none">
            Besoin d'aide ? Contactez-nous !
          </span>
        </a>

        {/* 💡 3. Affichage du Footer */}
        <Footer />
      </div>

      <Toaster position="top-center" />
    </div>
  );
}

export default App;
