import React, { useState } from "react";
import { PlusCircle, List, BarChart2, Loader, Upload } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import ProductsList from "../components/ProductsList";
import AnalyticsTab from "../components/AnalyticsTab"; // Nous allons créer ce composant juste après

const categories = ["Peinture", "Sculpture", "Dessin", "Photographie", "Digital Art"];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("create"); // 'create', 'stock' ou 'analytics'
  const { createProduct, loading } = useProductStore();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isFeatured: false,
    countInStock: 0,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(formData);
      setFormData({ name: "", description: "", price: "", category: "", image: "", isFeatured: false ,countInStock: 0});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-10">
      
      {/* Menu des Onglets Administrateur */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setActiveTab("create")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition ${
            activeTab === "create" ? "bg-emerald-600 text-white shadow-lg" : "bg-gray-900 text-gray-400 hover:text-white"
          }`}
        >
          <PlusCircle size={18} /> Ajouter une Œuvre
        </button>

        <button
          onClick={() => setActiveTab("stock")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition ${
            activeTab === "stock" ? "bg-emerald-600 text-white shadow-lg" : "bg-gray-900 text-gray-400 hover:text-white"
          }`}
        >
          <List size={18} /> Gérer le Stock
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition ${
            activeTab === "analytics" ? "bg-emerald-600 text-white shadow-lg" : "bg-gray-900 text-gray-400 hover:text-white"
          }`}
        >
          <BarChart2 size={18} /> Statistiques
        </button>
      </div>

      {/* Rendu conditionnel des panneaux de contrôle */}
      {activeTab === "create" && (
        <div className="max-w-2xl mx-auto p-6 bg-gray-900 bg-opacity-95 text-gray-100 rounded-xl shadow-2xl border border-emerald-800">
          <div className="flex items-center space-x-2 border-b border-emerald-800 pb-4 mb-6">
            <PlusCircle className="text-emerald-400" size={28} />
            <h2 className="text-2xl font-bold text-emerald-400">Ajouter une Nouvelle Œuvre</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300">Nom de l'œuvre</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-emerald-500 text-white text-sm"
                placeholder="Ex: La Nuit Étoilée"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                required
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-emerald-500 text-white text-sm"
                placeholder="Décrivez l'univers ou la technique..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Prix (FCFA)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-emerald-500 text-white text-sm"
                  placeholder="450"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Catégorie</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-emerald-500 text-white text-sm"
                >
                  <option value="">Sélectionner...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Image de l'œuvre</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md hover:border-emerald-500 transition-colors relative bg-gray-800">
                <div className="space-y-1 text-center">
                  {formData.image ? (
                    <div className="flex flex-col items-center">
                      <img src={formData.image} alt="Preview" className="max-h-40 rounded-md shadow-md mb-2 object-contain" />
                      <p className="text-xs text-emerald-400 font-medium">Image prête</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-emerald-400 hover:text-emerald-300 focus-within:outline-none">
                          <span>Télécharger un fichier</span>
                          <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} required />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG jusqu'à 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
                <label htmlFor="countInStock" className="block text-sm font-medium text-gray-300">
                    Stock Disponible
                </label>
                <input
                    type="number"
                    id="countInStock"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                    className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    min="0"
                />
            </div>

            {/* Checkbox pour mettre en vedette */}

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-300 select-none">
                Mettre en vedette sur la page d'accueil
              </label>
            </div>
            
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader className="animate-spin mr-2" size={18} /> : "Publier l'œuvre"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "stock" && <ProductsList />}

      {activeTab === "analytics" && <AnalyticsTab />}
    </div>
  );
}

export default AdminDashboard;
