import Joi from 'joi';

//~ Sign up validation schema 
export const signUpValidationSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    'string.empty': `"firstName" cannot be an empty field`,
    'string.min': `"firstName" should have a minimum length of {#limit}`,
    'string.max': `"firstName" should have a maximum length of {#limit}`,
    'any.required': `"firstName" is a required field`
  }),
  lastName: Joi.string().min(3).max(30).required().messages({
    'string.empty': `"lastName" cannot be an empty field`,
    'string.min': `"lastName" should have a minimum length of {#limit}`,
    'string.max': `"lastName" should have a maximum length of {#limit}`,
    'any.required': `"lastName" is a required field`
  }),
  email: Joi.string().email().required().messages({
    'string.empty': `"email" cannot be an empty field`,
    'string.email': `"email" must be a valid email`,
    'any.required': `"email" is a required field`
  }),
  recoveryEmail: Joi.string().email().messages({
    'string.empty': `"recoveryEmail" cannot be an empty field`,
    'string.email': `"recoveryEmail" must be a valid email`
  }),
  role: Joi.string().valid('User', 'Company_HR').required().messages({
    'string.empty': `"role" cannot be an empty field`,
    'any.only': `"role" must be one of [User, Company_HR]`,
    'any.required': `"role" is a required field`
  }),
  password: Joi.string().min(6).pattern(/(?=.*[!#$%&?^*@~() "])(?=.{6,})/).required().messages({
    'string.empty': `"password" cannot be an empty field`,
    'string.min': `"password" should have a minimum length of {#limit}`,
    'string.pattern.base': `"password" must contain at least one special character`,
    'any.required': `"password" is a required field`
  }),
  repassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': `"repassword" does not match "password"`,
    'any.required': `"repassword" is a required field`
  }),
  mobileNumber: Joi.string().pattern(/^01[0125][0-9]{8}$/).required().messages({
    'string.base': `"mobileNumber" should be a type of 'number'`,
    'string.empty': `"mobileNumber" cannot be an empty field`,
    'string.pattern.base': `"mobileNumber" must be a valid Egyptian mobile number starting with 010, 011, 012, or 015 and should be 11 numbers`,
    'any.required': `"mobileNumber" is a required field`
  }),
  DOB: Joi.date().iso().required().messages({
    'date.base': `"DOB" should be a valid date`,
    'date.iso': `"DOB" must be in ISO format (YYYY-MM-DD)`,
    'any.required': `"DOB" is a required field`
  })
});


//~ Verify email address validation schema
export const otpValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required()
});


//~ Sign in schema validation
export const signInValidationSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Invalid email format.',
  }),
  recoveryEmail: Joi.string().email().messages({
    'string.email': 'Invalid recovery email format.',
  }),
  mobileNumber: Joi.string().pattern(/^01[0125][0-9]{8}$/).messages({
    'string.pattern.base': 'Invalid mobile number format.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 6 characters long.',
  }),
});


//~ Update user info schema validation
export const updateAccountValidationSchema = Joi.object({
  firstName: Joi.string().min(3).max(30),
  lastName: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  recoveryEmail: Joi.string().email(),
  mobileNumber: Joi.string().pattern(/^01[0125][0-9]{8}$/),
  DOB: Joi.date().iso()
});


//~ Update user password schema validation
export const updatePasswordValidationSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).pattern(/(?=.*[!#$%&?^*@~() "])(?=.{6,})/).required(),
  rePassword: Joi.any().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
  }),
}); 


//! Forget password schema
export const forgotPasswordValidationSchema = Joi.object({
  email: Joi.string().email().required()
});

//! verify otp tp reset password 
export const verifyOtpValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required().length(6) 
});

//! reset password 
export const resetPasswordValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(6).pattern(/(?=.*[!#$%&?^*@~() "])(?=.{6,})/).required(),
  rePassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'New password and re-password do not match.'
  })
});


//~ recovery email schema validation 
export const recoveryEmailSchema = Joi.object({
  recoveryEmail: Joi.string().email().required().messages({
    'string.empty': `"recoveryEmail" cannot be an empty field`,
    'string.email': `"recoveryEmail" must be a valid email`,
    'any.required': `"recoveryEmail" is a required field`
  })
});