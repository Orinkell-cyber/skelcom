import redis from "../lib/redis.js";
import Product from "../model/product.model.js";
import cloudinary from "../lib/cloudinary.js";



export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const search = req.query.search || ""; // 💡 Récupère la recherche textuelle
    const skip = (page - 1) * limit;

    // Construit dynamiquement le filtre de recherche MongoDB
    let queryFilter = {};
    if (search) {
      queryFilter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } }
        ]
      };
    }

    // Compte le total uniquement parmi les produits correspondants à la recherche
    const totalProducts = await Product.countDocuments(queryFilter);

    const products = await Product.find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
    });
  } catch (error) {
    console.error("Erreur dans getAllProducts:", error.message);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des produits" });
  }
};


export const getFeaturedProducts=async(req,res)=>{
    try{

        let featuredProducts = await redis.get("featured_products");
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts));
        }
        featuredProducts = await Product.find({isFeatured:true}).lean();
        if(!featuredProducts){
            return res.status(401).json({message:"No featured products found"});
        }
       
        await redis.set("featuredProducts",JSON.stringify(featuredProducts));

        res.json(featuredProducts);
    }catch(error){
        console.log("Error in getFeaturedProduct controller",error.message);
        res.status(500).json({message:"Server error",error:error.message});

    }
}

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category,isFeatured,countInStock } = req.body;
        let cloudinaryResponse = null;
        
        if (image) {
           cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        }
        
        // CORRECTION : Ajout de category dans l'objet de création
        const product = await Product.create({
           name,
           description,
           price,
           category, // <-- Ligne ajoutée
           image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
           isFeatured: isFeatured || false,
           countInStock: countInStock || 0,
        });
        
        res.status(201).json(product);
    } catch (error) {
         console.log("Error in createProduct controller", error.message);
         res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export const deleteProduct = async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0];
            try{
            await cloudinary.uploader.destroy(`products/${publicId}`);
            console.log("deleted image from cloudinary");
            }catch(error){
                console.log("error deleting image from cloudinary",error);
            }
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Product deleted successfully"});

   }catch(error){
    console.log("Error in deleteProduct controller",error.message);
    res.status(500).json({message:"Server Error",error:error.message});
   }

}

export  const getRecommendedProducts= async(req,res)=>{
     try{
       const products = await Product.aggregate([
        {
            $sample:{size:3}
        },
        {
            $project:{
                _id:1,
                name:1,
                description:1,
                image:1,
                price:1
            }
        }
       ]);
       res.json(products);
     }catch(error){
      console.log("Errorin getRecommendedProducts controller",error.message);
      res.status(500).json({message:"Server Error",error:error.message});
     }
}

export const getProductsByCategory = async(req,res)=>{
    const {category} = req.params;
    try{
        const products = await Product.find({category : { $regex: category, $options: "i" } });
        res.json({products});
    }catch(error){
       console.log("Error in getProductsByCategory controller",error.message);
       res.status(500).json({message:"Server Error",error:error.message});
    }
}

export const toggleFeaturedProduct = async(req,res)=>{
    try{
      const product = await Product.findById(req.params.id);
      if(product){
        product.isFeatured = !product.isFeatured;
        const updatedProduct = await product.save();
        await updateFeaturedProductsCache();
        res.json(updatedProduct);
      }else{
        res.status(404).json({message:"Product not found"});
      }
    }catch(error){
      console.log("Error in toggleFeaturedProduct controller",error.message);
      res.status(500).json({message:"Server Error",error:error.message});
    }
}

async function updateFeaturedProductsCache(){
     try{
      //The lean method is used to return plain javascript objects instead of
      //full mongoose documents.This can significantly improve performance
      const featuredProducts = await Product.find({isFeatured:true}).lean();
      await redis.set("featured_products",JSON.stringify(featuredProducts));
     }catch(error){
      console.log("Error in updateFeaturedProductsCache function",error.message);
     }

}