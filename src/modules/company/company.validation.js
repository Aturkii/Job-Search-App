import Joi from "joi";

//~ Add comany validation schema 
export const addCompanyValidationSchema = Joi.object({
  companyName: Joi.string().required().messages({
    'string.empty': `"companyName" cannot be an empty field`,
    'any.required': `"companyName" is a required field`
  }),
  description: Joi.string().required().messages({
    'string.empty': `"description" cannot be an empty field`,
    'any.required': `"description" is a required field`
  }),
  industry: Joi.string().required().messages({
    'string.empty': `"industry" cannot be an empty field`,
    'any.required': `"industry" is a required field`
  }),
  address: Joi.string().required().messages({
    'string.empty': `"address" cannot be an empty field`,
    'any.required': `"address" is a required field`
  }),
  numberOfEmployees: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+').required().messages({
    'any.only': `"numberOfEmployees" must be one of [1-10, 11-50, 51-200, 201-500, 501-1000, 1001-5000, 5001-10000, 10001+]`,
    'any.required': `"numberOfEmployees" is a required field`
  }),
  companyEmail: Joi.string().email().required().messages({
    'string.empty': `"companyEmail" cannot be an empty field`,
    'string.email': `"companyEmail" must be a valid email`,
    'any.required': `"companyEmail" is a required field`
  })
});

//~ Update company validations schema 
export const updateCompanyValidationSchema = Joi.object({
  companyName: Joi.string().messages({
    'string.empty': `"companyName" cannot be an empty field`
  }),
  description: Joi.string().messages({
    'string.empty': `"description" cannot be an empty field`
  }),
  industry: Joi.string().messages({
    'string.empty': `"industry" cannot be an empty field`
  }),
  address: Joi.string().messages({
    'string.empty': `"address" cannot be an empty field`
  }),
  numberOfEmployees: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+').messages({
    'any.only': `"numberOfEmployees" must be one of [1-10, 11-50, 51-200, 201-500, 501-1000, 1001-5000, 5001-10000, 10001+]`
  }),
  companyEmail: Joi.string().email().messages({
    'string.email': `"companyEmail" must be a valid email`
  })
});

//~ validation name shcema for search 
export const companyNameValidationSchema = Joi.object({
  name: Joi.string().min(1).required().messages({
    'string.empty': `"name" cannot be an empty field`,
    'string.min': `"name" should have a minimum length of {#limit}`,
    'any.required': `"name" is a required field`
  })
});