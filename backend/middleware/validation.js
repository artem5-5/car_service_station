const Joi = require('joi');

exports.validateEmployee = (req, res, next) => {
  const schema = Joi.object({
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    position: Joi.string().min(2).max(100).required(),
    salary: Joi.number().positive().required(),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).optional(),
    email: Joi.string().email().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

exports.validatePart = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(200).required(),
    category_id: Joi.number().integer().positive().optional(),
    part_number: Joi.string().max(100).optional(),
    manufacturer: Joi.string().max(100).optional(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
    min_quantity: Joi.number().integer().min(0).default(5),
    location: Joi.string().max(50).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};