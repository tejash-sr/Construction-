import User from '../models/User.js';
import Quote from '../models/Quote.js';
import ContactMessage from '../models/ContactMessage.js';
import Project from '../models/Project.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalQuotes = await Quote.countDocuments();
    const pendingQuotes = await Quote.countDocuments({ status: 'pending' });
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'in-progress' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    const unreadMessages = await ContactMessage.countDocuments({ status: 'unread' });
    
    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      isAdmin: false
    });

    // Get revenue data (sum of quoted amounts for approved quotes)
    const revenueData = await Quote.aggregate([
      { $match: { status: { $in: ['approved', 'in-progress', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$quotedAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // Get this month's revenue
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const thisMonthRevenue = await Quote.aggregate([
      { 
        $match: { 
          status: { $in: ['approved', 'in-progress', 'completed'] },
          updatedAt: { $gte: firstDayOfMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$quotedAmount' } } }
    ]);
    
    // Get last month's revenue
    const firstDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const lastMonthRevenue = await Quote.aggregate([
      { 
        $match: { 
          status: { $in: ['approved', 'in-progress', 'completed'] },
          updatedAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$quotedAmount' } } }
    ]);

    const thisMonth = thisMonthRevenue[0]?.total || 0;
    const lastMonth = lastMonthRevenue[0]?.total || 0;
    const growth = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;

    // Get quotes by status
    const quotesByStatus = await Quote.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get recent activity
    const recentQuotes = await Quote.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name projectType status createdAt');

    const recentMessages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email status createdAt');

    // Format recent activity
    const recentActivity = [];
    recentQuotes.forEach(quote => {
      recentActivity.push({
        type: 'quote',
        message: `New quote request for ${quote.projectType}`,
        time: new Date(quote.createdAt).toLocaleString('en-IN')
      });
    });
    recentMessages.forEach(msg => {
      recentActivity.push({
        type: 'message',
        message: `New message from ${msg.name}`,
        time: new Date(msg.createdAt).toLocaleString('en-IN')
      });
    });
    recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json({
      totalUsers,
      totalQuotes,
      pendingQuotes,
      totalProjects,
      activeProjects,
      completedProjects,
      unreadMessages,
      totalMessages: await ContactMessage.countDocuments(),
      revenue: {
        total: totalRevenue,
        thisMonth: thisMonth,
        lastMonth: lastMonth,
        growth: growth
      },
      recentActivity: recentActivity.slice(0, 5)
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;

    const query = { isAdmin: false };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.isActive = status === 'active';
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify admin users'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
