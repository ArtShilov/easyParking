const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: Number,  required: true ,  unique: true },
    password: { type: String, required: true },
    parkingId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parking' }],

});

module.exports = mongoose.model('Organization', organizationSchema);
