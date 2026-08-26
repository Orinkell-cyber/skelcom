import mongoose from "mongoose";


const productSchema= new mongoose.Schema({
    name:{
        type: String,
        required:[true,"le nom du produit est obligatoire"],
        trim:true
    },
    description:{
        type: String,
        required:[true,"la description est obligatoire"]
    },
    price:{
        type: Number,
        rquired:[true,"le prix est obligatoire"],
        min:[0,"le prix ne peut pas etre négatif"]
    },
    image:{
        type: String,
        required:[true,"l'image du produit est obligatoire"]
    },
    category:{
        type: String,
        required:[true,"la categorie est obligatoire"]
    },
    isFeatured:{
        type: Boolean,
        required:false,
        default:false
    },
    countInStock:{
        type: Number,
        required:[true,"le stock est obligatoire"],
        min:[0,"le stock ne peut pas etre négatif"]
    }
},{timestamps: true});

const Product = mongoose.model("Product",productSchema);
export default Product;