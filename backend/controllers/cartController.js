import Product from "../model/product.model.js";

// backend/controllers/cart.controller.js
export const addToCart = async (req, res) => {
    try {
        // ⚠️ CORRECTION : Assurez-vous d'extraire exactement 'productId' (et non 'id')
        const { productId } = req.body; 
        const user = req.user; // Récupéré par votre middleware protectRoute

        // Vérifier si le produit est déjà dans le panier
        const existingItem = user.cartItems.find(item => item.productId?.toString() === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // 💡 On pousse un objet contenant explicitement productId et sa quantité initiale
            user.cartItems.push({ productId, quantity: 1 });
        }

        await user.save();
        res.json(user.cartItems);

    } catch (error) {
        console.error("Error in addToCart controller", error.message);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};



export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        user.cartItems = user.cartItems.filter(item => item.productId.toString() !== productId);
        await user.save();

        // Renvoie le panier restant mis à jour
        const productIds = user.cartItems.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });
        const cartWithDetails = user.cartItems.map(item => {
            const product = products.find(p => p._id.toString() === item.productId.toString());
            return product ? { ...product.toObject(), quantity: item.quantity } : null;
        }).filter(Boolean);

        res.json(cartWithDetails);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};


export const updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params; // 💡 Récupère l'ID depuis /api/cart/:productId
        const { quantity } = req.body;
        const user = req.user;

        const cartItem = user.cartItems.find(item => item.productId.toString() === productId);

        if (cartItem) {
            if (quantity <= 0) {
                user.cartItems = user.cartItems.filter(item => item.productId.toString() !== productId);
            } else {
                cartItem.quantity = quantity;
            }
            await user.save();
            
            // 💡 Astuce Cruciale : Pour que le frontend s'actualise instantanément, 
            // on renvoie le panier complet avec les détails mis à jour
            const productIds = user.cartItems.map(item => item.productId);
            const products = await Product.find({ _id: { $in: productIds } });
            const cartWithDetails = user.cartItems.map(item => {
                const product = products.find(p => p._id.toString() === item.productId.toString());
                return product ? { ...product.toObject(), quantity: item.quantity } : null;
            }).filter(Boolean);

            return res.json(cartWithDetails);
        } else {
            return res.status(404).json({ message: "Produit introuvable dans le panier" });
        }
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


export const getCartProducts = async(req,res)=>{
    try{
      const products = await Product.find({_id:{$in:req.user.cartItems}});

      const cartItems = products.map(product => {
      const item = req.user.cartItems.find(cartItem=>cartItem.id===product.id);
      return {...product.toJSON(),quantity:item.quantity}
      });
      res.json(cartItems)
    }catch(error){
      console.log("Error in getCartProducts controller",error.message);
      res.status(500).json({message:"Server Error",error:message.error});
    }
}