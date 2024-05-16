const express = require("express");
const router =  express.Router();
const Contact = require("../models/Contact.js");

router.get("/contacts", async(req, res) => {
    try{
        const contacts = await Contact.find(); 
        if(!contacts || contacts.length ===0){
            return res.status(200).json({contacts: []});
        }
        res.status(200).json({contacts : contacts.reverse()})

    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})
router.delete("/contacts/:id", async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        await contact.deleteOne(); 
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/contacts", async(req, res) => {
    try {
        const { name, email, message } = req.body;
        const contact = new Contact({
            name: name,
            email: email,
            message: message
        });
        await contact.save();
        res.status(201).json(contact.id);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
router.get("/contacts/:id", async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await New.findById(contactId);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        res.status(200).json({ contact: contact });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;