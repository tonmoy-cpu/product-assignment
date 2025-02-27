const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new customer
router.post('/', async (req, res) => {
    const customer = new Customer(req.body);
    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Import customers from CSV
router.post('/import', upload.single('file'), async (req, res) => {
    const results = [];
    
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                const customers = await Customer.insertMany(results);
                fs.unlinkSync(req.file.path); // Clean up uploaded file
                res.json(customers);
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
});

// Update customer
router.patch('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete customer
router.delete('/:id', async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Customer deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
