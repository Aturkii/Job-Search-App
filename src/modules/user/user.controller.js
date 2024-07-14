
import User from './../../../db/models/user.model.js';
import { asyncHandler } from './../../middleware/asyncHandler.js';
import { generateOTP } from './../../utils/otpGenerator.js';
import bcrypt from 'bcrypt';
import { sendEmail } from './../../utils/sendEmail.js';
import { AppError } from './../../utils/AppError.js';
import jwt from 'jsonwebtoken';
import Company from '../../../db/models/company.model.js';
import Job from '../../../db/models/job.model.js';
import Application from '../../../db/models/application.model.js';


//& Sign Up 
export const signUp = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, mobileNumber, DOB, role, recoveryEmail } = req.body;

  const existedUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });
  if (existedUser) {
    return next(new AppError('Email or mobile number already exists.', 400))
  }
  const otp = generateOTP();
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    firstName,
    lastName,
    username: `${firstName} ${lastName}`,
    email,
    password: hashedPassword,
    mobileNumber,
    DOB,
    otp,
    role,
    recoveryEmail
  });

  const emailSubject = 'Verify Your Email Address';
  const emailHtml = `Your OTP for email verification is: <strong>${otp}</strong>`;
  await sendEmail(email, emailSubject, emailHtml);
  return res.status(201).json({
    message: "User registered successfully. Please verify your email.", user: {
      username: newUser.username,
      email: newUser.email,
      recoveryEmail: newUser.recoveryEmail,
      mobileNumber: newUser.mobileNumber,
      DOB: new Date(newUser.DOB).toISOString().split('T')[0],
      role: newUser.role
    }
  })
});


//& Verify Email 
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  if (user.isConfirmed) {
    return next(new AppError('Email is already verified.', 400));
  }

  if (user.otp !== otp) {
    return next(new AppError('Invalid OTP.', 400));
  }

  const updatedUser = await User.updateOne(
    { email },
    { $set: { isConfirmed: true, otp: null } }
  );

  if (updatedUser.modifiedCount === 0) {
    return next(new AppError('Failed to update user.', 500));
  }

  return res.status(200).json({ message: 'Email verified successfully.' });
});


//& Sign In and you won't be allowed to sign in without confirming your email also you can use (email or phoneNumber orrecveryEmail) to sign in
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, recoveryEmail, mobileNumber, password } = req.body;
  const user = await User.findOne({
    $or: [{ email }, { recoveryEmail }, { mobileNumber }],
  });

  if (!user) {
    return next(new AppError('User Not Found.', 401));
  }

  if (!user.isConfirmed) {
    return next(new AppError('Please Verify your email to login.', 403));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError('Invalid Password.', 401));
  }

  user.status = 'online';
  await user.save();

  const token = jwt.sign({
    id: user._id,
    username: user.username,
    email: user.email,
    mobileNumber: user.mobileNumber,
    role: user.role,
    status: user.status,
    recoveryEmail: user.recoveryEmail
  }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });


  return res.status(200).json({
    message: 'Signed in successfully.',
    token
  });
});


//& Update user account you can update email mobileNumber recoveryEmail DOB lastName firstName
export const updateAccount = asyncHandler(async (req, res, next) => {
  const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } = req.body;
  const userId = req.user._id;

  const existingUser = await User.findOne({
    $or: [
      { email, _id: { $ne: userId } },
      { mobileNumber, _id: { $ne: userId } }
    ]
  });

  if (existingUser) {
    return next(new AppError('Email or mobile number already exists.', 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { email, mobileNumber, recoveryEmail, DOB, lastName, firstName },
    { new: true, runValidators: true, select: '-password -otp -isConfirmed' }
  );

  if (!updatedUser) {
    return next(new AppError('Failed to update user.', 500));
  }

  return res.status(200).json({
    message: 'Account updated successfully.',
    updatedUser
  });
});


//& Delete user account and if the user role is company_HR it will automatically delete the company account too and when delete company if there is jobs for this company it will be deleted too and the applications for the jobs and if the user role is user it delete the applications they did 
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('User not found.', 404));
  }
  if (user.role === 'Company_HR') {
    const company = await Company.findOne({ companyHR: userId });

    if (company) {
      const jobs = await Job.find({ addedBy: userId });
      const jobIds = jobs.map(job => job._id);

      await Application.deleteMany({ jobId: { $in: jobIds } });

      await Job.deleteMany({ addedBy: userId });

      await Company.findByIdAndDelete(company._id);
    }
  } else if (user.role === 'User') {
    await Application.deleteMany({ userId });
  }

  await User.findByIdAndDelete(userId);

  return res.status(200).json({ message: 'Account deleted successfully.' });
});



//& Get user account data 
export const getAccountData = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select('-password -otp');

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  return res.status(200).json({ message: "Success!", data: user });
});


//& update user account password
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, rePassword } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return next(new AppError('Incorrect current password.', 400));
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await User.updateOne(
    { _id: userId },
    { $set: { password: hashedNewPassword } }
  );

  if (updatedUser.nModified === 0) {
    return next(new AppError('Failed to update password.', 500));
  }

  return res.status(200).json({ message: 'Password updated successfully.' });
});


//* _______________________ Forgot Password Cdoe _______________ 
//& Forget password
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  if (user.otp) {
    return next(new AppError('Verify code already sent to your mail', 500));
  }

  const otp = generateOTP();
  user.otp = otp;
  await user.save();

  const emailSubject = 'Reset Your Password';
  const emailHtml = `Your OTP for password reset is: <strong>${otp}</strong>`;
  await sendEmail(user.email, emailSubject, emailHtml);

  return res.status(200).json({ message: 'OTP sent to your email.' });
});

//& Verify otp to reset password
export const verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, otp });
  if (!user) {
    return next(new AppError('Invalid OTP or email.', 400));
  }

  user.otp = null;
  await user.save();

  return res.status(200).json({ message: 'OTP verified. You can now reset your password.' });
});

//& Reset password after verification the otp
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword, rePassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  if (user.otp !== null) {
    return next(new AppError(`You can't reset password without verifying otp`, 400));
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;
  user.otp = null;
  await user.save();

  return res.status(200).json({ message: 'Password reset successfully.' });
});


//& Get another user account
export const getAnotherUserProfile = asyncHandler(async (req, res, next) => {
  const id = req.params.id || req.query.id;

  if (!id) {
    return next(new AppError('User ID is required', 400));
  }

  const user = await User.findById(id).select('-password -otp -isConfirmed -firstName -lastName -recoveryEmail');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  return res.status(200).json({
    message: 'User profile retrieved successfully',
    user
  });
});


//& Get all accounts associated to a specific recovery Email  


export const getAccountsByRecoveryEmail = asyncHandler(async (req, res, next) => {
  const { recoveryEmail } = req.query;

  const users = await User.find({ recoveryEmail }).select('-password -otp -isConfirmed');

  if (!users || users.length === 0) {
    return next(new AppError('No accounts found with this recovery email', 404));
  }

  return res.status(200).json({
    message: 'Accounts retrieved successfully',
    users
  });
});