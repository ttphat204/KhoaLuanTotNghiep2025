const Auth = require('../models/Auth');
const Candidates = require('../models/Candidates');
const Employers = require('../models/Employers');
const Jobs = require('../models/Jobs');

// Utility functions cho CRUD operations

/**
 * Validate user exists and has correct role
 */
const validateUser = async (userId, requiredRole = null) => {
  const user = await Auth.findById(userId);
  if (!user) {
    throw new Error('User không tồn tại');
  }
  
  if (requiredRole && user.role !== requiredRole) {
    throw new Error(`User phải có role: ${requiredRole}`);
  }
  
  return user;
};

/**
 * Check if record exists
 */
const checkRecordExists = async (Model, id, modelName) => {
  const record = await Model.findById(id);
  if (!record) {
    throw new Error(`${modelName} không tồn tại`);
  }
  return record;
};

/**
 * Build pagination query
 */
const buildPaginationQuery = (query, { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' }) => {
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
  
  return {
    query,
    options: {
      skip: parseInt(skip),
      limit: parseInt(limit),
      sort
    },
    pagination: {
      currentPage: parseInt(page),
      itemsPerPage: parseInt(limit)
    }
  };
};

/**
 * Build search query
 */
const buildSearchQuery = (searchFields, searchTerm) => {
  if (!searchTerm) return {};
  
  const searchQuery = {};
  searchFields.forEach(field => {
    searchQuery[field] = { $regex: searchTerm, $options: 'i' };
  });
  
  return { $or: Object.values(searchQuery) };
};

/**
 * Standard CRUD response
 */
const createResponse = (success, message, data = null, pagination = null) => {
  const response = {
    success,
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (pagination) {
    response.pagination = pagination;
  }
  
  return response;
};

/**
 * Handle CRUD errors
 */
const handleError = (error, operation, modelName) => {
  console.error(`${operation} ${modelName} Error:`, error);
  
  if (error.name === 'ValidationError') {
    return {
      status: 400,
      message: 'Dữ liệu không hợp lệ',
      errors: Object.values(error.errors).map(err => err.message)
    };
  }
  
  if (error.code === 11000) {
    return {
      status: 400,
      message: 'Dữ liệu đã tồn tại'
    };
  }
  
  return {
    status: 500,
    message: `Lỗi khi ${operation} ${modelName}`,
    error: error.message
  };
};

/**
 * Candidate specific helpers
 */
const candidateHelpers = {
  // Validate candidate data
  validateCandidateData: (data) => {
    const required = ['userId', 'fullName', 'phoneNumber'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Thiếu thông tin: ${missing.join(', ')}`);
    }
    
    return true;
  },
  
  // Check if candidate exists by userId
  checkCandidateExists: async (userId) => {
    const candidate = await Candidates.findOne({ userId });
    if (candidate) {
      throw new Error('Candidate đã tồn tại cho user này');
    }
    return false;
  },
  
  // Build candidate search query
  buildSearchQuery: (search, skills, location) => {
    let query = {};
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }
    
    if (location) {
      query.city = { $regex: location, $options: 'i' };
    }
    
    return query;
  }
};

/**
 * Job specific helpers
 */
const jobHelpers = {
  // Validate job data
  validateJobData: (data) => {
    const required = ['employerId', 'jobTitle', 'description', 'location'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Thiếu thông tin: ${missing.join(', ')}`);
    }
    
    return true;
  },
  
  // Build job search query
  buildSearchQuery: (search, location, jobType, categoryId) => {
    let query = {};
    
    if (search) {
      query.$or = [
        { jobTitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (jobType) {
      query.jobType = jobType;
    }
    
    if (categoryId) {
      query.categoryId = categoryId;
    }
    
    return query;
  }
};

module.exports = {
  validateUser,
  checkRecordExists,
  buildPaginationQuery,
  buildSearchQuery,
  createResponse,
  handleError,
  candidateHelpers,
  jobHelpers
}; 