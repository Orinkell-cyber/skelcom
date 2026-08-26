import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12 px-6 border-t border-emerald-950/50 mt-auto relative z-50">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Droits d'auteur */}
        <p className="text-sm tracking-wide text-gray-400">
          © 2026 <span className="text-pastel-pink font-bold tracking-tight">creé par ORIN</span> - Tous droits réservés
        </p>

        {/* Section Réseaux Sociaux */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <p className="text-[10px] font-bold tracking-widest text-white uppercase">
            Suivez-nous sur les réseaux sociaux
          </p>

          <div className="flex items-center gap-4">
            {/* 1. TikTok - Style Épuré Noir/Blanc Brillant */}
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-black text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 border border-gray-800/60 flex items-center justify-center hover:scale-110"
              title="TikTok"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.15 1.13 1.18 2.69 1.83 4.3 1.94V10c-1.3-.17-2.58-.69-3.64-1.47-.56-.42-1.05-.93-1.44-1.52-.03 2.87.01 5.73-.02 8.6-.08 1.98-.74 3.96-1.99 5.48-1.54 1.93-3.95 3.03-6.4 2.91-2.92-.05-5.69-1.78-6.93-4.42-1.4-2.88-.93-6.52 1.14-8.91 1.66-1.99 4.22-2.91 6.78-2.51v3.91c-1.34-.33-2.83.1-3.69 1.17-.92 1.09-1.02 2.74-.29 3.93.73 1.25 2.19 1.95 3.63 1.8 1.48-.09 2.75-1.18 3.04-2.64.12-.46.13-.94.13-1.42V0z"/>
              </svg>
            </a>

            {/* 2. WhatsApp - Couleur Officielle Vert Fluo */}
            <a 
              href="https://wa.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5  rounded-full bg-[#25D366] text-white hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] transition-all duration-300 border border-gray-800/60 flex items-center justify-center hover:scale-110"
              title="WhatsApp"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66 1.11 3.328 1.882 5.354 1.883 5.466 0 9.912-4.444 9.915-9.913.002-2.651-1.02-5.143-2.877-7c-1.856-1.857-4.324-2.88-6.973-2.883-5.47 0-9.92 4.443-9.923 9.913-.001 2.13.565 4.212 1.634 6.014L2.6 21.432l4.047-1.278zm12.115-4.407c-.316-.16-1.872-.924-2.162-1.027-.29-.105-.502-.157-.712.157-.21.314-.813 1.026-.997 1.237-.183.21-.365.235-.68.077-1.316-.65-2.235-1.077-3.13-2.613-.235-.4-.235-.66-.076-.82.143-.143.315-.364.473-.546.06-.07.12-.14.18-.21.158-.293.22-.502.32-.71.1-.21.05-.393-.025-.55-.075-.157-.712-1.717-.975-2.35-.257-.615-.518-.532-.712-.542-.184-.01-.395-.01-.605-.01-.21 0-.552.08-.84.394-.287.316-1.1 1.077-1.1 2.63s1.132 3.064 1.29 3.273c.158.21 2.226 3.4 5.4 4.766.753.325 1.342.518 1.802.663.757.24 1.447.207 1.994.125.61-.09 1.872-.765 2.134-1.47.26-.707.26-1.313.183-1.44-.077-.126-.288-.207-.604-.367z"/>
              </svg>
            </a>

            {/* 3. Instagram - Dégradé Instagram Lumineux */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5  rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:shadow-[0_0_15px_rgba(238,42,123,0.4)] transition-all duration-300 border border-gray-800/60 flex items-center justify-center hover:scale-110"
              title="Instagram"
            >
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            {/* 4. Facebook - Bleu Facebook Officiel */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5  rounded-full bg-[#1877F2] text-white hover:shadow-[0_0_15px_rgba(24,119,242,0.4)] transition-all duration-300 border border-gray-800/60 flex items-center justify-center hover:scale-110"
              title="Facebook"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
