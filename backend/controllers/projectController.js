import Project from '../models/Project.js';

// @desc    Get all projects
// @route   GET /api/admin/projects
// @access  Private/Admin
export const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', category = '', search = '' } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const projects = await Project.find(query)
      .populate('client', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        projects,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single project
// @route   GET /api/admin/projects/:id
// @access  Private/Admin
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email phone')
      .populate('teamMembers', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { project }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create project
// @route   POST /api/admin/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    const projectData = req.body;

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update project
// @route   PUT /api/admin/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: { project: updatedProject }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/admin/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Toggle project public visibility
// @route   PUT /api/admin/projects/:id/toggle-public
// @access  Private/Admin
export const toggleProjectPublic = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.isPublic = !project.isPublic;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project ${project.isPublic ? 'published' : 'unpublished'} successfully`,
      data: { project }
    });
  } catch (error) {
    console.error('Toggle project public error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Toggle project featured status
// @route   PUT /api/admin/projects/:id/toggle-featured
// @access  Private/Admin
export const toggleProjectFeatured = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project.isFeatured = !project.isFeatured;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project ${project.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: { project }
    });
  } catch (error) {
    console.error('Toggle project featured error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get public projects (for portfolio page)
// @route   GET /api/projects
// @access  Public
export const getPublicProjects = async (req, res) => {
  try {
    const { category = '', featured = '' } = req.query;

    const query = { isPublic: true };
    
    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const projects = await Project.find(query)
      .select('title description category location featuredImage testimonial completionPercentage status')
      .sort({ isFeatured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { projects }
    });
  } catch (error) {
    console.error('Get public projects error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
