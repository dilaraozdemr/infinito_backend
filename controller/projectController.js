const express = require("express");
const router =  express.Router();
const Project = require("../models/Project.js");

router.get("/projects", async(req, res) => {
    try{
        const projects = await Project.find(); 
        if(!projects || projects.length ===0){
            return res.status(200).json({projects: []});
        }
        res.status(200).json({projects : projects.reverse()})

    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})

router.post("/projects", async(req, res) => {
    try {
        const { name, description, images } = req.body; // req.body'den gerekli alanları alın
        const project = new Project({
            name: name,
            description: description,
            images: images
        });
        await project.save();
        res.status(201).json(project.id);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
router.delete("/projects/:id", async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        await project.deleteOne(); // veya deleteMany() kullanabilirsiniz
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/projects/:id", async (req, res) => {
    try {
        const projectId = req.params.id;
        const { name, description, images } = req.body;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        project.name = name;
        project.description = description;
        project.images = images;
        await project.save();
        res.status(200).json({ message: "Project updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/projects/:id", async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.status(200).json({ project: project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;