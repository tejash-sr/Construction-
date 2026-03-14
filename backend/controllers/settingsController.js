import SiteSettings from '../models/SiteSettings.js';

// @desc    Get site settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    res.status(200).json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update site settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      settings = await SiteSettings.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get public settings (for frontend)
// @route   GET /api/settings
// @access  Public
export const getPublicSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create({});
    }

    res.status(200).json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
