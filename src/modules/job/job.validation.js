import Joi from 'joi';

//~ Add job validation schema 
export const addJobValidationSchema = Joi.object({
  jobTitle: Joi.string().required().messages({
    'string.empty': `"jobTitle" cannot be an empty field`,
    'any.required': `"jobTitle" is a required field`
  }),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').required().messages({
    'any.only': `"jobLocation" must be one of ['onsite', 'remotely', 'hybrid']`,
    'any.required': `"jobLocation" is a required field`
  }),
  workingTime: Joi.string().valid('part-time', 'full-time').required().messages({
    'any.only': `"workingTime" must be one of ['part-time', 'full-time']`,
    'any.required': `"workingTime" is a required field`
  }),
  seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required().messages({
    'any.only': `"seniorityLevel" must be one of ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO']`,
    'any.required': `"seniorityLevel" is a required field`
  }),
  jobDescription: Joi.string().required().messages({
    'string.empty': `"jobDescription" cannot be an empty field`,
    'any.required': `"jobDescription" is a required field`
  }),
  technicalSkills: Joi.array().items(Joi.string()).required().messages({
    'array.base': `"technicalSkills" should be an array`,
    'any.required': `"technicalSkills" is a required field`
  }),
  softSkills: Joi.array().items(Joi.string()).required().messages({
    'array.base': `"softSkills" should be an array`,
    'any.required': `"softSkills" is a required field`
  })
});

//~ Update job validation schema 
export const updateJobValidationSchema = Joi.object({
  jobTitle: Joi.string().messages({
    'string.empty': `"jobTitle" cannot be an empty field`,
    'any.required': `"jobTitle" is a required field`
  }),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').messages({
    'string.empty': `"jobLocation" cannot be an empty field`,
    'any.only': `"jobLocation" must be one of [onsite, remotely, hybrid]`,
    'any.required': `"jobLocation" is a required field`
  }),
  workingTime: Joi.string().valid('part-time', 'full-time').messages({
    'string.empty': `"workingTime" cannot be an empty field`,
    'any.only': `"workingTime" must be one of [part-time, full-time]`,
    'any.required': `"workingTime" is a required field`
  }),
  seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').messages({
    'string.empty': `"seniorityLevel" cannot be an empty field`,
    'any.only': `"seniorityLevel" must be one of [Junior, Mid-Level, Senior, Team-Lead, CTO]`,
    'any.required': `"seniorityLevel" is a required field`
  }),
  jobDescription: Joi.string().messages({
    'string.empty': `"jobDescription" cannot be an empty field`,
    'any.required': `"jobDescription" is a required field`
  }),
  technicalSkills: Joi.array().items(Joi.string()).messages({
    'array.base': `"technicalSkills" should be an array of strings`,
    'any.required': `"technicalSkills" is a required field`
  }),
  softSkills: Joi.array().items(Joi.string()).messages({
    'array.base': `"softSkills" should be an array of strings`,
    'any.required': `"softSkills" is a required field`
  })
});

//~ Validation schema for company name
export const companyNameValidationSchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    'string.empty': `"name" cannot be an empty field`,
    'string.min': `"name" should have a minimum length of {#limit}`,
    'string.max': `"name" should have a maximum length of {#limit}`,
    'any.required': `"name" is a required field`
  })
});

//~ Validation schema for job filters
export const jobFilterValidationSchema = Joi.object({
  workingTime: Joi.string().valid('part-time', 'full-time'),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid'),
  seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
  jobTitle: Joi.string(),
  technicalSkills: Joi.string()
});