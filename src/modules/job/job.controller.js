import Application from "../../../db/models/application.model.js";
import Job from "../../../db/models/job.model.js";
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { AppError } from "../../utils/AppError.js";
import Company from './../../../db/models/company.model.js';



//& Add job by company hr 
export const addJob = asyncHandler(async (req, res, next) => {
  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;

  const newJob = await Job.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: req.user._id
  });

  return res.status(201).json({ message: 'Job added successfully.', job: newJob });
});


//& Update job by the company hr
export const updateJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;


  const updatedJob = await Job.findByIdAndUpdate(
    id,
    { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills },
    { new: true, runValidators: true }
  );

  if (!updatedJob) {
    return next(new AppError('Job not found or failed to update.', 404));
  }

  return res.status(200).json({ message: 'Job updated successfully.', job: updatedJob });
});


//& Delete a job by the company hr and delet that job applications also
export const deleteJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const job = await Job.findById(id);

  if (!job) {
    return next(new AppError('Job not found.', 404));
  }
  await Job.findByIdAndDelete(id);

  await Application.deleteMany({ jobId: id });

  return res.status(200).json({ message: 'Job and related applications deleted successfully.' });
});

//& Get all Jobs with their company's information
export const getAllJobsWithCompanyInfo = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find().populate('addedBy', 'companyHR');

  if (!jobs.length) {
    return next(new AppError('No jobs found.', 404));
  }

  const jobsWithCompanyInfo = [];
  for (let job of jobs) {
    const company = await Company.findOne({ companyHR: job.addedBy });
    if (company) {
      jobsWithCompanyInfo.push({
        ...job.toObject(),
        company
      });
    }
  }

  return res.status(200).json({ message: 'Success', jobs: jobsWithCompanyInfo });
});


//& Get all Jobs for a specific company by company name
export const getJobsForCompany = asyncHandler(async (req, res, next) => {
  const { name } = req.query;

  if (!name) {
    return next(new AppError('Company name is required to perform the search.', 400));
  }

  const company = await Company.findOne({ companyName: { $regex: name, $options: 'i' } });

  if (!company) {
    return next(new AppError('Company not found.', 404));
  }

  const jobs = await Job.find({ addedBy: company.companyHR });

  if (!jobs.length) {
    return next(new AppError('No jobs found for the given company.', 404));
  }

  return res.status(200).json({ message: 'Success', jobs });
});


//& Get all Jobs that match the filters and You can filter the search by workingTime || jobLocation || seniorityLevel || jobTitle || technicalSkills 
export const getFilteredJobs = asyncHandler(async (req, res, next) => {
  const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

  const filterSearch = {};

  if (workingTime) {
    filterSearch.workingTime = workingTime;
  }
  if (jobLocation) {
    filterSearch.jobLocation = jobLocation;
  }
  if (seniorityLevel) {
    filterSearch.seniorityLevel = seniorityLevel;
  }
  if (jobTitle) {
    filterSearch.jobTitle = { $regex: jobTitle, $options: 'i' };
  }
  if (technicalSkills) {
    filterSearch.technicalSkills = { $in: technicalSkills.split(',') };
  }

  const jobs = await Job.find(filterSearch);

  const jobsWithCompanyInfo = await Promise.all(
    jobs.map(async job => {
      const company = await Company.findOne({ companyHR: job.addedBy });
      return {
        ...job.toObject(),
        company
      };
    })
  );

  return res.status(200).json({ message: "success", jobs: jobsWithCompanyInfo });
});

//& Apply to job 
export const applyToJob = asyncHandler(async (req, res, next) => {
  const { jobId, userTechSkills, userSoftSkills } = req.body;
  const userId = req.user._id;

  if (!req.file) {
    return next(new AppError('Resume file is required.', 400));
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return next(new AppError('Job not found.', 404));
  }


  const newApplication = new Application({
    jobId,
    userId,
    userTechSkills,
    userSoftSkills,
    userResume: req.file.filename
  });

  await newApplication.save();

  return res.status(201).json({ message: 'Application submitted successfully.', application: newApplication });
}); 

