import { Router } from "express";
import { validation } from "../../middleware/validationMiddleware.js";
import * as Valida from "./user.validation.js";
import * as uc from "./user.controller.js";
import authMiddleware from '../../middleware/authmiddleware.js';
import { idSchema } from "../../utils/idSchema.js";

const router = Router()

//^ Sign up 
router.post('/signup',
  validation(Valida.signUpValidationSchema),
  uc.signUp);

//^ Email Verification
router.post('/verifyEmail',
  validation(Valida.otpValidationSchema, 'body'),
  uc.verifyEmail);

//^ Sign In 
router.post('/signin',
  validation(Valida.signInValidationSchema),
  uc.signIn);

//^ Update user account
router.put('/updateAcount',
  validation(Valida.updateAccountValidationSchema),
  authMiddleware(), uc.updateAccount);

//^ Delete user account
router.delete('/deleteAccount',
  authMiddleware(),
  uc.deleteAccount);

//^ Get user account data  
router.get('/getAccountData',
  authMiddleware(),
  uc.getAccountData);

//^ Update user account password
router.patch('/updatePassword',
  validation(Valida.updatePasswordValidationSchema),
  authMiddleware(),
  uc.updatePassword);

//! Forget password Routes 
router.post('/forgot-password', //* forget password
  validation(Valida.forgotPasswordValidationSchema),
  uc.forgotPassword);
router.post('/verify-otp',//* verify otp to reset password
  validation(Valida.verifyOtpValidationSchema),
  uc.verifyOtp);
router.post('/reset-password', //* reset password
  validation(Valida.resetPasswordValidationSchema),
  uc.resetPassword);

//^ Get profile data for another user
router.get('/profile/:id?',
  authMiddleware(), validation(idSchema, 'params'),
  uc.getAnotherUserProfile);

//^ Get all accounts associated to a specific recovery Email 
router.get('/accounts',
  authMiddleware(),
  validation(Valida.recoveryEmailSchema, 'query'),
  uc.getAccountsByRecoveryEmail);



export default router;