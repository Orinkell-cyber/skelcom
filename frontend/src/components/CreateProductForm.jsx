import React, { useState } from 'react';
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';

const categories = ["Peinture", "Sculpture", "Dessin", "Photographie", "Digital Art"];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    countInStock: "",
    image: "",
    isFeatured: false,
  });
  
  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await createProduct(newProduct);
       setNewProduct({
         name: "",
         description: "",
         price: "",
         category: "",
         countInStock: "",
         image: "",
         isFeatured: false
       });
    } catch (error) {
       console.log("Error creating a product", error);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewProduct({ ...newProduct, image: reader.result });
        };
        reader.readAsDataURL(file);
    }
  };

  return (
       <motion.div className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
       >
        <h2 className="text-2xl font-semibold mb-6 text-emerald-300">Create new Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Product name
                </label>
                <input 
                  type="text" 
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required 
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                    Description
                </label>
                <textarea            
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required 
                />
            </div>

            {/* Prix */}
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                    Price (FCFA)
                </label>
                <input  
                  type="number"          
                  id="price"
                  name="price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required 
                />
            </div>

            {/* 💡 CHAMP STOCK CORRIGÉ ET BIEN POSITIONNÉ */}
            <div>
                <label htmlFor="countInStock" className="block text-sm font-medium text-gray-300">
                    Stock Disponible
                </label>
                <input
                    type="number"
                    id="countInStock"
                    name="countInStock"
                    value={newProduct.countInStock}
                    onChange={(e) => setNewProduct({ ...newProduct, countInStock: e.target.value })}
                    className="mt-1 block w-full bg-white border border-gray-600 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    min="0"
                />
            </div>

            {/* Catégorie */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                    Catégorie
                </label>
                <select          
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required 
                >
                  <option value=''>Sélectionner une catégorie</option>
                  {categories.map((category) => (
                      <option key={category} value={category}>
                          {category}
                      </option>
                  ))}
                </select>
            </div>

            {/* Image Upload */}
            <div className="mt-1 flex items-center">
                <input type="file" id="image" className="sr-only" accept="image/*" onChange={handleImageChange} />
                <label htmlFor="image" className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <Upload className="h-5 w-5 inline-block mr-2" />
                  Uploader une image
                </label>
                {newProduct.image && <span className="ml-3 text-sm text-gray-400">image uploaded</span>}
            </div>

            {/* Is Featured Checkbox */}
            <div className="flex items-center gap-3 my-4 bg-gray-700 p-3 rounded-lg border border-gray-600">
                <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={newProduct.isFeatured}
                    onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                    className="w-5 h-5 text-emerald-600 border-gray-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-300 cursor-pointer select-none">
                    Mettre cette œuvre en avant (Section "À la Une" sur la page d'accueil)
                </label>
            </div>

            {/* BOUTON DE SOUMISSION ENTIÈREMENT REFERMÉ ET SÉCURISÉ */}
            <button 
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                disabled={loading}
            >
               {loading ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Enregistrement....
                  </>
               ) : (
                  <>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Ajouter une œuvre
                  </>
               )}
            </button>
        </form>
       </motion.div> 
  );
};

export default CreateProductForm;
