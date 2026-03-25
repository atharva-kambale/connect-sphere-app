const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Active', 'Sold', 'Hidden'], default: 'Active' }
}, {
  timestamps: true
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
