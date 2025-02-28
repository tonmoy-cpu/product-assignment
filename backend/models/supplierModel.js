const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    gstNumber: {
        type: String,
        required: true
    },
    taxNumber: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    openingBalance: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Supplier', supplierSchema);
