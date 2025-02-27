const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
        cb(null, true);
    } else {
        cb(new Error('Only CSV files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

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
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded or invalid file type' });
    }

    const results = [];
    
    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(req.file.path)
                .pipe(csv())
                .on('data', (data) => {
                    // Map CSV data to match the schema
                    const customer = {
                        name: data['CUSTOMER NAME'] || data.name || '',
                        email: data.EMAIL || data.email || '',
                        phone: data.MOBILE || data.PHONE || data.phone || '',
                        city: data.CITY || data['COUNTRY/STATE'] || data.city || 'Bangalore',
                        state: data['COUNTRY/STATE'] || data.state || 'Karnataka',
                        status: 'active'
                    };
                    
                    // Validate required fields
                    if (customer.name && customer.email && customer.phone) {
                        // Get address from various possible fields
                        let address = data['ADDRESS/LOCATION LINK'] || data.address || '';
                        
                        // If it's a Google Maps link, use it as is
                        if (address.includes('google.com/maps')) {
                            customer.address = address;
                        } else {
                            // Construct a basic address if no Google Maps link
                            customer.address = address || `${customer.city}, ${customer.state}`;
                        }
                        
                        results.push(customer);
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        if (results.length === 0) {
            fs.unlinkSync(req.file.path); // Clean up uploaded file
            return res.status(400).json({ 
                message: 'No valid customer data found in CSV. Please ensure all required fields are present: CUSTOMER NAME, EMAIL, MOBILE/PHONE' 
            });
        }

        const customers = await Customer.insertMany(results);
        fs.unlinkSync(req.file.path); // Clean up uploaded file
        res.json({ 
            message: `Successfully imported ${customers.length} customers`,
            customers 
        });
    } catch (error) {
        // Clean up uploaded file if it exists
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        
        res.status(400).json({ 
            message: error.message || 'Error processing CSV file',
            error: error.toString()
        });
    }
});

// Update customer
router.patch('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        Object.keys(req.body).forEach(key => {
            customer[key] = req.body[key];
        });

        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete customer
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await Customer.deleteOne({ _id: req.params.id });
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
});

module.exports = router;
