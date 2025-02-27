const express = require('express');
const router = express.Router();
const Supplier = require('../models/supplierModel');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Get all suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new supplier
router.post('/', async (req, res) => {
    const supplier = new Supplier(req.body);
    try {
        const newSupplier = await supplier.save();
        res.status(201).json(newSupplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Import suppliers from CSV
router.post('/import', upload.single('file'), async (req, res) => {
    const results = [];
    
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                const suppliers = await Supplier.insertMany(results);
                fs.unlinkSync(req.file.path); // Clean up uploaded file
                res.json(suppliers);
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
});

// Update supplier
router.patch('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(supplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete supplier
router.delete('/:id', async (req, res) => {
    try {
        await Supplier.findByIdAndDelete(req.params.id);
        res.json({ message: 'Supplier deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
