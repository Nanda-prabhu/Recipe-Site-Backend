const express = require("express");
const mongoose = require("mongoose");
const RecipeModel = require("../models/Recipes");
const UserModel = require("../models/Users");
// const verifyToken = require("./users");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await RecipeModel.find({});
        //find all -> with empty object field
        res.status(200).json(response);
    }
    catch(err) {
        res.status(500).json(err)
    }
});

router.post("/", async (req, res) => {
    const recipe = new RecipeModel(req.body);

    try {
        const response = await recipe.save();
        res.status(200).json(response);
    }
    catch(err) {
        res.status(500).json(err);
    }
});

router.put("/" , async (req, res) => {
    // {userId, recipeId}
    
    try {
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);

        // if (!recipe) {
        //     return res.status(404).json({ message: "Recipe not found" });
        // }

        // if (!user) {
        //     return res.status(404).json({ message: "User not found" });
        // }

        user.savedRecipes.push(recipe);
        await user.save();
        res.status(200).json({savedRecipes: user.savedRecipes});
    }
    catch(err) {
        res.status(500).json(err)
    }
});

router.get("/savedRecipes/ids/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        res.status(200).json({savedRecipes: user?.savedRecipes})
    }
    catch(err){
        res.status(500).json(err);
    }
});

router.get("/savedRecipes/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID);
        const savedRecipes = await RecipeModel.find({
            _id: { $in: user.savedRecipes }
        });
        res.status(200).json({savedRecipes})
    }
    catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;