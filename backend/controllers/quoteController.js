import Quote from '../models/Quote.js';
import { sendQuoteStatusUpdateEmail } from '../utils/emailService.js';
import { analyzeQuote } from '../utils/aiService.js';

// @desc    Get all quotes
// @route   GET /api/admin/quotes
// @access  Private/Admin
export const getAllQuotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '', priority = '' } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { whaemail: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const quotes = await Quote.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Quote.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        quotes,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single quote
// @route   GET /api/admin/quotes/:id
// @access  Private/Admin
export const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).populate('user', 'name email phone');

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { quote }
    });
  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update quote status
// @route   PUT /api/admin/quotes/:id/status
// @access  Private/Admin
export const updateQuoteStatus = async (req, res) => {
  try {
    const { status, quotedAmount, quotedDetails, priority, adminNotes } = req.body;

    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    const oldStatus = quote.status;
    const oldQuotedAmount = quote.quotedAmount;

    if (status) quote.status = status;
    if (quotedAmount) quote.quotedAmount = quotedAmount;
    if (quotedDetails) quote.quotedDetails = quotedDetails;
    if (priority) quote.priority = priority;
    if (adminNotes !== undefined) quote.adminNotes = adminNotes;

    await quote.save();

    // Send email notification if status changed OR if quoted amount was updated
    const shouldSendEmail = (status && status !== oldStatus) || (quotedAmount && quotedAmount !== oldQuotedAmount);
    
    if (shouldSendEmail) {
      console.log(`📧 Sending email: ${oldStatus} → ${status || oldStatus} to ${quote.email}`);
      if (quotedAmount && quotedAmount !== oldQuotedAmount) {
        console.log(`💰 Quote amount updated: ₹${oldQuotedAmount || 0} → ₹${quotedAmount}`);
      }
      sendQuoteStatusUpdateEmail({
        name: quote.name,
        email: quote.email,
        projectType: quote.projectType,
        location: quote.location,
        budgetRange: quote.budgetRange,
        timeline: quote.timeline,
        status: quote.status,
        quotedAmount: quote.quotedAmount,
        quotedDetails: quote.quotedDetails
      }).then(result => {
        if (result.success) {
          console.log('✅ Email sent successfully to', quote.email);
        } else {
          console.log('⚠️ Email failed:', result.error);
        }
      }).catch(err => {
        console.log('❌ Email error:', err.message);
      });
    } else {
      console.log(`ℹ️ No changes requiring email notification`);
    }

    res.status(200).json({
      success: true,
      message: 'Quote updated successfully',
      data: { quote }
    });
  } catch (error) {
    console.error('Update quote error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete quote
// @route   DELETE /api/admin/quotes/:id
// @access  Private/Admin
export const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    await quote.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Quote deleted successfully'
    });
  } catch (error) {
    console.error('Delete quote error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create quote (for submitting from contact form)
// @route   POST /api/quotes
// @access  Private
export const createQuote = async (req, res) => {
  try {
    const { name, email, phone, projectType, projectSize, location, budgetRange, timeline, description } = req.body;

    const quote = await Quote.create({
      user: req.user.id,
      name,
      email,
      phone,
      projectType,
      projectSize,
      location,
      budgetRange,
      timeline,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      data: { quote }
    });
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get AI analysis for a quote
// @route   GET /api/admin/quotes/:id/ai-analysis
// @access  Private/Admin
export const getAIAnalysis = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id).populate('user', 'name email phone');

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
    }

    // Prepare quote data for AI analysis
    const quoteData = {
      name: quote.name,
      email: quote.email,
      phone: quote.phone,
      projectType: quote.projectType,
      projectSize: quote.projectSize,
      location: quote.location,
      budgetRange: quote.budgetRange,
      timeline: quote.timeline,
      description: quote.description
    };

    // Get AI analysis
    const analysis = await analyzeQuote(quoteData);

    res.status(200).json({
      success: true,
      data: { 
        analysis,
        quote: {
          _id: quote._id,
          name: quote.name,
          projectType: quote.projectType,
          status: quote.status
        }
      }
    });
  } catch (error) {
    console.error('Get AI analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get AI analysis'
    });
  }
};
