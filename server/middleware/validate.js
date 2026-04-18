// Simple validation middleware
const validateRegistration = (req, res, next) => {
  const { name, email, collegeId, password } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) errors.push('Name is required');
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required');
  if (!collegeId || collegeId.trim().length === 0) errors.push('College ID is required');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters');

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid email is required');
  if (!password) errors.push('Password is required');

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
};

const validateEvent = (req, res, next) => {
  const { title, description, date, venue, category } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) errors.push('Title is required');
  if (!description || description.trim().length === 0) errors.push('Description is required');
  if (!date) errors.push('Date is required');
  if (!venue || venue.trim().length === 0) errors.push('Venue is required');
  if (!category) errors.push('Category is required');

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
};

const validateFeedback = (req, res, next) => {
  const { rating } = req.body;
  const errors = [];

  if (!rating || rating < 1 || rating > 5) errors.push('Rating must be between 1 and 5');

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
};

module.exports = { validateRegistration, validateLogin, validateEvent, validateFeedback };
