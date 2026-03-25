const Listing = require('../models/Listing');

// @desc    Fetch all listings with optional category/search filtering
// @route   GET /api/listings
const getListings = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) {
      query.status = status;
    } else {
      query.status = 'Active';
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const listings = await Listing.find(query)
      .populate('seller', 'name university campus avatar reputationScore')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch random featured listings for landing page
// @route   GET /api/listings/featured
const getFeaturedListings = async (req, res) => {
  try {
    const listings = await Listing.aggregate([
      { $match: { status: 'Active' } },
      { $sample: { size: 4 } },
    ]);
    const populated = await Listing.populate(listings, {
      path: 'seller',
      select: 'name university campus avatar reputationScore',
    });
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single listing
// @route   GET /api/listings/:id
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name university campus avatar reputationScore email');
    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a listing
// @route   POST /api/listings
const createListing = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const listing = new Listing({
      title,
      description,
      price,
      category,
      images,
      seller: req.user._id
    });

    const createdListing = await listing.save();
    res.status(201).json(createdListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update listing status (Active/Sold/Hidden)
// @route   PUT /api/listings/:id/status
const updateListingStatus = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    listing.status = req.body.status || listing.status;
    const updated = await listing.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update listing details
// @route   PUT /api/listings/:id
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const { title, description, price, category } = req.body;
    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = price || listing.price;
    listing.category = category || listing.category;

    if (req.files && req.files.length > 0) {
      listing.images = req.files.map(file => file.path);
    }

    const updated = await listing.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getListings, getListingById, getFeaturedListings, createListing, updateListingStatus, updateListing, deleteListing };
