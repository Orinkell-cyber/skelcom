import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader, Send, Mail, Phone, MapPin } from "lucide-react";

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      access_key: "c45bcb37-4863-46d7-813f-aa68b06fa776",
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      // 💡 CORRIGÉ : L'URL de soumission utilise bien l'API dédiée
      const response = await fetch("https://web3forms.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message envoyé directement dans votre boîte mail ! 📨");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Échec de l'envoi.");
      }
    } catch (error) {
       console.error("VRAIE ERREUR RÉSEAU CONTACT :", error);
       toast.error("Une erreur réseau est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Grille principale : Infos + Formulaire */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        
        {/* Infos de contact à gauche */}
        <div className="bg-gray-900 bg-opacity-95 text-white p-6 rounded-2xl border border-emerald-950 flex flex-col justify-between shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-emerald-400 mb-2">Restons en Contact</h2>
            <p className="text-gray-400 text-xs mb-8">Une question sur une œuvre ou une commande ? Écrivez-nous directement.</p>
            
            <div className="space-y-5 text-sm">
              {/* 💡 LIEN CLIQUABLE : Ouvrir le client Email de l'utilisateur */}
              <a 
                href="mailto:contact@jaxtech.com" 
                className="flex items-center gap-3 hover:text-emerald-400 transition group"
              >
                <div className="p-2 bg-gray-800 rounded-lg text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition"><Mail size={16} /></div>
                <span className="underline decoration-transparent group-hover:decoration-emerald-400 transition">contact@jaxtech.com</span>
              </a>

              {/* 💡 LIEN CLIQUABLE : Lancer l'appel depuis le smartphone/ordinateur */}
              <a 
                href="tel:+22893042248" 
                className="flex items-center gap-3 hover:text-emerald-400 transition group"
              >
                <div className="p-2 bg-gray-800 rounded-lg text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition"><Phone size={16} /></div>
                <span className="underline decoration-transparent group-hover:decoration-emerald-400 transition">+228 93 04 22 48</span>
              </a>

              {/* 💡 LIEN CLIQUABLE : Ouvrir l'itinéraire Google Maps dans un nouvel onglet */}
              <a 
                href="https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d495.7985515702144!2d1.1702130421144652!3d6.212395824004265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m3!3m2!1d6.2123963!2d1.1704097!4m5!1s0x102159b800d20051%3A0xe906ddb43b1a395!2sVakpossito%2C%20Lom%C3%A9!3m2!1d6.2162397!2d1.1609549!5e0!3m2!1sfr!2stg!4v1783428684165!5m2!1sfr!2stg"  
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 hover:text-emerald-400 transition group"
              >
                <div className="p-2 bg-gray-800 rounded-lg text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition"><MapPin size={16} /></div>
                <span className="underline decoration-transparent group-hover:decoration-emerald-400 transition">Lomé, Togo</span>
              </a>
            </div>
          </div>
          <div className="text-[10px] text-gray-500 tracking-wider uppercase mt-8 border-t border-gray-800 pt-4">
            Support Client JAX TECH
          </div>
        </div>

        {/* Formulaire à droite */}
        <div className="md:col-span-2 bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-sky-100 shadow-xl">
          <form onSubmit={handleSubmit2} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Votre Nom</label>
                <input
                  type="text" required value={formData.name}
                  name="name"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition shadow-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Votre Adresse Email</label>
                <input
                  type="email" required value={formData.email}
                  name="email"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition shadow-sm"
                  placeholder="johndoe@exemple.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Sujet du Message</label>
              <input
                type="text" required value={formData.subject}
                name="subject"
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition shadow-sm"
                placeholder="Ex: Demande de personnalisation"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Votre Message</label>
              <textarea
                required rows="5" value={formData.message}
                name="message"
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition shadow-sm"
                placeholder="Écrivez votre message ici..."
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-gray-900 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-300 disabled:opacity-50 shadow-md shadow-gray-900/10"
            >
              {loading ? <Loader className="animate-spin" size={18} /> : (
                <>
                  <Send size={16} />
                  <span>Envoyer le Message</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* BLOC INFERIEUR : BOUTON APPEL + GOOGLE MAPS */}
      <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col items-center gap-6">
        
        {/* Bouton d'appel direct */}
        <a 
          href="tel:+22893042248"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-10 rounded-xl shadow-lg hover:shadow-emerald-600/20 hover:scale-105 transition-all duration-300 flex items-center gap-3 text-base group"
        >
          <Phone className="w-5 h-5 animate-pulse group-hover:rotate-12 transition-transform" />
          <span>Appelez-moi directement</span>
        </a>

        {/* Conteneur de la carte Google Maps */}
        <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl border border-slate-200 relative bg-slate-100">
          <iframe
            title="Emplacement JAX TECH Lomé"
            src="https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d495.7985515702144!2d1.1702130421144652!3d6.212395824004265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m3!3m2!1d6.2123963!2d1.1704097!4m5!1s0x102159b800d20051%3A0xe906ddb43b1a395!2sVakpossito%2C%20Lom%C3%A9!3m2!1d6.2162397!2d1.1609549!5e0!3m2!1sfr!2stg!4v1783428684165!5m2!1sfr!2stg" 
            // 💡 CORRIGÉ : Retrait des attributs HTML bruts doublés, style converti en objet
            style={{ border: 0,width: "600", height: "800" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full"
          />
        </div>
      </div>

    </div>
  );
}

export default ContactPage;
