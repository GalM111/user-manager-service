const UserData = require('../models/UserData');

// Create new UserData
exports.createUserData = async (req, res) => {
    try {
        const { name, email, assets, investorType, contentType } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        // Check if email already exists
        const existingUserData = await UserData.findOne({ email });
        if (existingUserData) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create new UserData
        const userData = new UserData({
            name,
            email,
            assets: assets || [],
            investorType: investorType || null,
            contentType: contentType || [],
        });

        await userData.save();
        res.status(201).json({ message: 'UserData created successfully', data: userData });
    } catch (err) {
        res.status(500).json({ message: 'Error creating UserData', error: err.message });
    }
};

// Update existing UserData
exports.updateUserData = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, assets, investorType, contentType } = req.body;

        // Find and update UserData
        const userData = await UserData.findByIdAndUpdate(
            id,
            {
                name,
                email,
                assets,
                investorType,
                contentType,
            },
            { new: true, runValidators: true }
        );

        if (!userData) {
            return res.status(404).json({ message: 'UserData not found' });
        }

        res.status(200).json({ message: 'UserData updated successfully', data: userData });
    } catch (err) {
        res.status(500).json({ message: 'Error updating UserData', error: err.message });
    }
};

// Delete UserData
exports.deleteUserData = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete UserData
        const userData = await UserData.findByIdAndDelete(id);

        if (!userData) {
            return res.status(404).json({ message: 'UserData not found' });
        }

        res.status(200).json({ message: 'UserData deleted successfully', data: userData });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting UserData', error: err.message });
    }
};

// Get all UserData (optional utility function)
exports.getAllUserData = async (req, res) => {
    try {
        const userData = await UserData.find();
        res.status(200).json({ message: 'All UserData retrieved', data: userData });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving UserData', error: err.message });
    }
};

// Get UserData by ID (optional utility function)
exports.getUserDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = await UserData.findById(id);

        if (!userData) {
            return res.status(404).json({ message: 'UserData not found' });
        }

        res.status(200).json({ message: 'UserData retrieved', data: userData });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving UserData', error: err.message });
    }
};

// Get UserData by Email
exports.getUserDataByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const userData = await UserData.findOne({ email });

        if (!userData) {
            return res.status(404).json({ message: 'UserData not found for this email' });
        }

        res.status(200).json({ message: 'UserData retrieved', data: userData });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving UserData by email', error: err.message });
    }
};
