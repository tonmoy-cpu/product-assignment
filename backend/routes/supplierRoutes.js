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
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            // Map CSV data to match the schema
            const supplier = {
                name: data['SUPPLIER NAME'] || data['CUSTOMER NAME'] || data.name || '',
                email: data.EMAIL || data.email || '',
                phone: data.MOBILE || data.PHONE || data.phone || '',
                // Extract address from LOCATION LINK
                address: data['ADDRESS/LOCATION LINK'] || data.address || '',
                city: data.CITY || data['COUNTRY/STATE'] || data.city || 'Bangalore',
                state: data['COUNTRY/STATE'] || data.state || 'Karnataka',
                status: 'active'
            };
            
            // Validate required fields
            if (supplier.name && supplier.email && supplier.phone) {
                // If address is a Google Maps link, use it as is
                if (supplier.address.includes('google.com')) {
                    results.push(supplier);
                } else {
                    // If no Google Maps link, construct a basic address
                    supplier.address = supplier.address || `${supplier.city}, ${supplier.state}`;
                    results.push(supplier);
                }
            }
        })
        .on('end', async () => {
            try {
                if (results.length === 0) {
                    fs.unlinkSync(req.file.path); // Clean up uploaded file
                    return res.status(400).json({ 
                        message: 'No valid supplier data found in CSV. Please ensure all required fields are present: SUPPLIER NAME/CUSTOMER NAME, EMAIL, MOBILE/PHONE' 
                    });
                }

                const suppliers = await Supplier.insertMany(results);
                fs.unlinkSync(req.file.path); // Clean up uploaded file
                res.json({ 
                    message: `Successfully imported ${suppliers.length} suppliers`,
                    suppliers 
                });
            } catch (error) {
                // Clean up uploaded file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                res.status(400).json({ 
                    message: 'Error importing suppliers: ' + error.message,
                    details: 'Please ensure your CSV file has the correct column names: SUPPLIER NAME/CUSTOMER NAME, EMAIL, MOBILE/PHONE'
                });
            }
        });
});

// Update supplier
router.patch('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        Object.keys(req.body).forEach(key => {
            supplier[key] = req.body[key];
        });

        const updatedSupplier = await supplier.save();
        res.json(updatedSupplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete supplier
router.delete('/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        await Supplier.deleteOne({ _id: req.params.id });
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Delete supplier error:', error);
        res.status(500).json({ message: 'Error deleting supplier', error: error.message });
    }
});

module.exports = router;
