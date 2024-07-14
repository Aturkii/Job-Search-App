import { Router } from "express";
import * as jc from "./job.controller.js";
import authMiddleware from '../../middleware/authmiddleware.js';
import authorizeRoles from './../../middleware/authorizationMiddleware.js';
import { validation } from "../../middleware/validationMiddleware.js";
import * as valida from "./job.validation.js";
import { idSchema } from "../../utils/idSchema.js";
import { upload } from "../../Service/multer.js";
import { applyJobValidationSchema } from "./app.validation.js";

const router = Router()

//^ Add job 
router.post("/addjob",
  authMiddleware(),
  validation(valida.addJobValidationSchema),
  authorizeRoles('Company_HR'),
  jc.addJob)

//^ Update job
router.put(
  '/update/:id',
  authMiddleware(),
  validation(idSchema, 'params'),
  validation(valida.updateJobValidationSchema),
  authorizeRoles('Company_HR'),
  jc.updateJob
);

//^ Delete job
router.delete(
  '/delete/:id',
  authMiddleware(),
  validation(idSchema, 'params'),
  authorizeRoles('Company_HR'),
  jc.deleteJob
);

//^ Get all Jobs with their company's information 
router.get(
  '/all',
  authMiddleware(),
  authorizeRoles('User', 'Company_HR'),
  jc.getAllJobsWithCompanyInfo
);

//^ Get all jobs for a specific company
router.get(
  '/company',
  authMiddleware(),
  authorizeRoles('User', 'Company_HR'),
  validation(valida.companyNameValidationSchema, 'query'),
  jc.getJobsForCompany
);

//^ Get all jobs that match the filters
router.get(
  '/filter',
  authMiddleware(),
  authorizeRoles('User', 'Company_HR'),
  validation(valida.jobFilterValidationSchema, 'query'),
  jc.getFilteredJobs
);

//^ Apply to job
router.post('/apply',
  authMiddleware(),
  authorizeRoles('User'),
  validation(applyJobValidationSchema,'file'),
  upload.single('userResume'),
  jc.applyToJob);









export default router;