import Application from '../../../db/models/application.model.js';
import Job from '../../../db/models/job.model.js';
import { AppError } from '../../utils/AppError.js';
import Company from './../../../db/models/company.model.js';
import { asyncHandler } from './../../middleware/asyncHandler.js';
import moment from "moment";
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

//& Add company 
export const addCompany = asyncHandler(async (req, res, next) => {
  const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;

  const existedCompany = await Company.findOne({ $or: [{ companyName }, { companyEmail }] });
  if (existedCompany) {
    return next(new AppError('Company name or email already exists.', 400));
  }

  const newCompany = await Company.create({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR: req.user._id
  });

  return res.status(201).json({ message: "Company created successfully.", newCompany });
});


//& Update a company
export const updateCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
  const userId = req.user._id;
  const company = await Company.findById(id);
  if (!company) {
    return next(new AppError('Company not found.', 404));
  }

  if (company.companyHR.toString() !== userId.toString() || req.user.role !== 'Company_HR') {
    return next(new AppError('You do not have permission to update this company.', 403));
  }

  const existingCompany = await Company.findOne({
    $or: [
      { companyName, _id: { $ne: id } },
      { companyEmail, _id: { $ne: id } }
    ]
  });

  if (existingCompany) {
    return next(new AppError('Company name or email already exists.', 400));
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    id,
    { companyName, description, industry, address, numberOfEmployees, companyEmail },
    { new: true, runValidators: true }
  );

  if (!updatedCompany) {
    return next(new AppError('Failed to update company.', 500));
  }

  return res.status(200).json({ message: 'Company updated successfully.', updatedCompany });
});


export const deleteCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const company = await Company.findById(id);
  if (!company) {
    return next(new AppError('Company not found.', 404));
  }

  const jobs = await Job.find({ addedBy: company.companyHR });
  const jobIds = jobs.map(job => job._id);

  await Application.deleteMany({ jobId: { $in: jobIds } });

  await Job.deleteMany({ addedBy: company.companyHR });

  const deletedCompany = await Company.findByIdAndDelete(id);
  if (!deletedCompany) {
    return next(new AppError('Failed to delete company.', 500));
  }

  return res.status(200).json({ message: 'Company deleted successfully.' });
});


//& Get a company data by ID
export const getCompanyById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const company = await Company.findById(id).populate('companyHR', 'username email');
  if (!company) {
    return next(new AppError('Company not found.', 404));
  }
  const jobs = await Job.find({ addedBy: company.companyHR });
  return res.status(200).json({ message: "Success", company, jobs });
});


//& Search for a company with a name. 
export const searchCompanyByName = asyncHandler(async (req, res, next) => {
  const { name } = req.query;

  if (!name) {
    return next(new AppError('Company name is required to perform the search.', 400));
  }

  const company = await Company.findOne({ companyName: { $regex: name, $options: 'i' } })
    .populate('companyHR', 'username email'); // Populate company HR data

  if (!company) {
    return next(new AppError('No company found with the given name.', 404));
  }

  const jobs = await Job.find({ addedBy: company.companyHR });

  return res.status(200).json({ message: "success", company, jobs });
});


//& Get all applications with user data for specific Job by the job id
export const getApplicationsForJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const job = await Job.findById(id).populate('addedBy');

  if (!job) {
    return next(new AppError('Job not found.', 404));
  }

  if (!job.addedBy._id.equals(userId)) {
    return next(new AppError('You do not have permission to view applications for this job.', 403));
  }

  const applications = await Application.find({ jobId: id })
    .populate('userId', '-password -otp -isConfirmed -firstName -lastName');

  const applicationsWithResumes = applications.map(application => ({
    user: application.userId,
    application
  }));

  return res.status(200).json({
    message: "success",
    applications: applicationsWithResumes
  });
});


//& Special end point for creating excel files 
export const getApplicationsForCompanyOnDate = asyncHandler(async (req, res, next) => {
  const { date } = req.params;
  const userId = req.user._id;

  const company = await Company.findOne({ companyHR: userId });

  if (!company) {
    return next(new AppError('Company not found.', 404));
  }

  const startDate = moment(date).startOf('day').toDate();
  const endDate = moment(date).endOf('day').toDate();

  const applications = await Application.find({
    createdAt: { $gte: startDate, $lte: endDate }
  }).populate('userId', 'username email mobileNumber');

  if (applications.length === 0) {
    return next(new AppError('No applications found for the specified date.', 404));
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Applications');

  worksheet.columns = [
    { header: 'Username', key: 'username', width: 20 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Mobile Number', key: 'mobileNumber', width: 15 },
    { header: 'Technical Skills', key: 'technicalSkills', width: 30 },
    { header: 'Soft Skills', key: 'softSkills', width: 30 },
    { header: 'Resume', key: 'resume', width: 40 },
  ];

  applications.forEach(app => {
    worksheet.addRow({
      username: app.userId.username,
      email: app.userId.email,
      mobileNumber: app.userId.mobileNumber,
      technicalSkills: app.userTechSkills.join(', '),
      softSkills: app.userSoftSkills.join(', '),
      resume: app.userResume
    });
  });

  const dir = path.resolve('Uploads/ExcelSheets');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `applications_${company._id}_${date}.xlsx`);
  await workbook.xlsx.writeFile(filePath);

  res.status(200).json({
    message: 'Excel file created successfully.',
    filePath
  });
});





