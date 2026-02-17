
const Category = require('../models/Category');

// CREATE CATEGORY
exports.createCategory = async(req,res)=>{
    try {
        const {name,description} = req.body;    
        const exists = await Category.findOne({name});

        if(exists){
            return res.status(400).json({message:"Category already exists"});
        }

        const category = await Category.create({name,description});
        res.status(201).json({
            message:"Category created successfully",
            category
        });
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}


exports.getCategories = async(req,res)=>{
    try {
        const categories = await Category.find().sort({createdAt:-1});
        res.json(categories)
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};