const express = require("express");
const router =  express.Router();
const New = require("../models/New.js");

router.get("/news", async(req, res) => {
    try{
        const news = await New.find(); 
        if(!news || news.length ===0){
            return res.status(200).json({news: []});
        }
        res.status(200).json({news : news.reverse()})

    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})

router.post("/news", async(req, res) => {
    try {
        const { name, description, image } = req.body;
        const news = new New({
            name: name,
            description: description,
            image: image
        });
        await news.save();
        res.status(201).json(news.id);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
router.delete("/news/:id", async (req, res) => {
    try {
        const newId = req.params.id;
        const news = await New.findById(newId);
        if (!news) {
            return res.status(404).json({ error: "New not found" });
        }
        await news.deleteOne(); 
        res.status(200).json({ message: "New deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/news/:id", async (req, res) => {
    try {
        const newId = req.params.id;
        const { name, description, image } = req.body;
        const news = await New.findById(newId);
        if (!news) {
            return res.status(404).json({ error: "New not found" });
        }
        news.name = name;
        news.description = description;
        news.image = image;
        await news.save();
        res.status(200).json({ message: "New updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/news/:id", async (req, res) => {
    try {
        const newId = req.params.id;
        const news = await New.findById(newId);
        if (!news) {
            return res.status(404).json({ error: "New not found" });
        }
        res.status(200).json({ news: news });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;