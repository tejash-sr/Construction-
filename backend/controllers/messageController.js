import ContactMessage from '../models/ContactMessage.js';
import { sendContactNotificationEmail, sendContactConfirmationEmail } from '../utils/emailService.js';

// @desc    Get all contact messages
// @route   GET /api/admin/messages
// @access  Private/Admin
export const getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const messages = await ContactMessage.find(query)
      .populate('repliedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await ContactMessage.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        messages,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single message
// @route   GET /api/admin/messages/:id
// @access  Private/Admin
export const getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id).populate('repliedBy', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Mark as read if unread
    if (message.status === 'unread') {
      message.status = 'read';
      await message.save();
    }

    res.status(200).json({
      success: true,
      data: { message }
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Reply to message
// @route   PUT /api/admin/messages/:id/reply
// @access  Private/Admin
export const replyToMessage = async (req, res) => {
  try {
    const { adminReply } = req.body;

    if (!adminReply) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required'
      });
    }

    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.adminReply = adminReply;
    message.status = 'replied';
    message.repliedAt = new Date();
    message.repliedBy = req.user.id;

    await message.save();

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      data: { message }
    });
  } catch (error) {
    console.error('Reply to message error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update message status
// @route   PUT /api/admin/messages/:id/status
// @access  Private/Admin
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.status = status;
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: { message }
    });
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/admin/messages/:id
// @access  Private/Admin
export const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create contact message (public)
// @route   POST /api/messages
// @access  Public
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create contact message in database
    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      message
    });

    // Send notification email to admin
    const adminEmailResult = await sendContactNotificationEmail({
      name,
      email,
      phone,
      message
    });

    // Send confirmation email to customer
    const customerEmailResult = await sendContactConfirmationEmail({
      name,
      email,
      phone,
      message
    });

    // Log email status (don't fail the request if email fails)
    if (!adminEmailResult.success) {
      console.error('Failed to send admin notification email:', adminEmailResult.error);
    }
    if (!customerEmailResult.success) {
      console.error('Failed to send customer confirmation email:', customerEmailResult.error);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon!',
      data: { contactMessage }
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
