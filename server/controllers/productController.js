
const Product = require('../models/Product');

// CONTROLLER METHODS FOR PRODUCT
exports.createProduct = async(req,res)=>{
    try {
        const {name,description,price,category,stock} = req.body;
        
        // Assign seller. If admin adds, it can be admin or null.
        // If we want to allow admins to assign specific sellers, we'd check req.body.seller
        // For now, default to current user.
        const seller = req.user._id;

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            seller
        });

        res.status(201).json({
            message:"Product created successfully",
            product
        });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

exports.getProducts = async(req,res)=>{
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (category && category !== "All") {
             // Assuming category is passed as ID or we need to look up category by name first
             // For simplicity, let's assume filtering by category happens mostly on frontend or 
             // via a specific category ID if needed. 
             // If category is a name, we might need to find the Category ID first.
             // But for now, let's focus on Search which was requested.
        }

        const products = await Product.find(query).populate('category').sort({createdAt:-1});
        res.json(products);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

exports.getProductById = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id)
            .populate('category')
            .populate('seller', 'name shopName sellerRating');
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

exports.updateProduct = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Check permission
        if (product.seller && product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: "Not authorized to edit this product" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.json({
            message:"Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

exports.deleteProduct = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.seller && product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: "Not authorized to delete this product" });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({message:"Product deleted successfully"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

exports.addProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: "Product already reviewed" });
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.averageRating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: "Review added" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};