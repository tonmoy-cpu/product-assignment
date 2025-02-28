const express = require('express');
const router = express.Router();
const Supplier = require('../models/supplierModel');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

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
    try {
        const supplierData = {
            company: req.body['SUPPLIER NAME'] || req.body.company,
            mobile: req.body['MOBILE'] || req.body.mobile,
            email: req.body['EMAIL'] || req.body.email,
            phone: req.body['PHONE'] || req.body.phone,
            gstNumber: req.body['GST NUMBER'] || req.body.gstNumber,
            taxNumber: req.body['TAX NUMBER'] || req.body.taxNumber,
            state: req.body['COUNTRY/STATE'] || req.body.state,
            postcode: req.body['POSTCODE'] || req.body.postcode,
            address: req.body['ADDRESS'] || req.body.address,
            openingBalance: parseFloat(req.body['OPENING BALANCE']) || req.body.openingBalance || 0,
            status: 'active'
        };

        const supplier = new Supplier(supplierData);
        const newSupplier = await supplier.save();
        res.status(201).json(newSupplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Import suppliers from CSV
router.post('/import', upload.single('file'), async (req, res) => {
    console.log('Import request received');
    
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File received:', req.file);
    const results = [];
    let rowCount = 0;
    
    fs.createReadStream(req.file.path)
        .pipe(csv({
            mapHeaders: ({ header }) => header.trim()
        }))
        .on('data', (data) => {
            rowCount++;
            console.log('Processing row', rowCount, ':', data);
            
            // Map CSV data to match the schema
            const supplier = {
                company: data['SUPPLIER NAME'] || '',
                mobile: data['MOBILE'] || '',
                email: data['EMAIL'] || '',
                phone: data['PHONE'] || '',
                gstNumber: data['GST NUMBER'] || '',
                taxNumber: data['TAX NUMBER'] || '',
                state: data['COUNTRY/STATE'] || '',
                postcode: data['POSTCODE'] || '',
                address: data['ADDRESS'] || '',
                openingBalance: parseFloat(data['OPENING BALANCE']) || 0,
                status: 'active'
            };
            
            console.log('Mapped supplier data:', supplier);
            
            // Validate required fields
            const requiredFields = ['company', 'mobile', 'email', 'phone', 'gstNumber', 'taxNumber', 'state', 'postcode', 'address'];
            const missingFields = requiredFields.filter(field => !supplier[field]);
            
            if (missingFields.length === 0) {
                results.push(supplier);
            } else {
                console.log(`Row ${rowCount} missing required fields:`, missingFields);
                console.log('Row data:', data);
            }
        })
        .on('end', async () => {
            try {
                console.log(`Processed ${rowCount} rows, found ${results.length} valid suppliers`);
                
                if (results.length === 0) {
                    console.log('No valid supplier data found');
                    fs.unlinkSync(req.file.path);
                    return res.status(400).json({ 
                        message: `No valid supplier data found in CSV. Please ensure all required fields are present. Required fields: SUPPLIER NAME, MOBILE, EMAIL, PHONE, GST NUMBER, TAX NUMBER, COUNTRY/STATE, POSTCODE, ADDRESS` 
                    });
                }

                console.log('Attempting to insert suppliers:', results);
                const suppliers = await Supplier.insertMany(results);
                fs.unlinkSync(req.file.path);
                res.json({ 
                    message: `Successfully imported ${suppliers.length} suppliers`,
                    suppliers 
                });
            } catch (error) {
                console.error('Error during import:', error);
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                res.status(400).json({ 
                    message: 'Error importing suppliers: ' + error.message,
                    error: error
                });
            }
        })
        .on('error', (error) => {
            console.error('CSV parsing error:', error);
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(400).json({ 
                message: 'Error parsing CSV file: ' + error.message 
            });
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
