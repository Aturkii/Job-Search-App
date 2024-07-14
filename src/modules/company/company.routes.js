import { Router } from "express";
import authorizeRoles from './../../middleware/authorizationMiddleware.js';
import { validation } from './../../middleware/validationMiddleware.js';
import * as valida from "./company.validation.js";
import * as cc from "./company.controller.js";
import authMiddleware from "../../middleware/authmiddleware.js";
import { idSchema } from "../../utils/idSchema.js";

const router = Router()

//^ Create a new company
router.post('/addComany',
  authMiddleware(),
  authorizeRoles('Company_HR'),
  validation(valida.addCompanyValidationSchema),
  cc.addCompany);

//^ Get a company data by ID
router.get('/company/:id',
  authMiddleware(),
  authorizeRoles('Company_HR'),
  validation(idSchema, 'params'),
  cc.getCompanyById);

//^ Update a company by its id
router.put('/updatecomany/:id',
  authMiddleware(),
  authorizeRoles('Company_HR'),
  validation(idSchema, 'params'),
  validation(valida.updateCompanyValidationSchema),
  cc.updateCompany);

//^ Delete a company by its id 
router.delete('/deleteCompany/:id',
  authMiddleware(),
  authorizeRoles('Company_HR'),
  validation(idSchema, 'params'),
  cc.deleteCompany);

//^ Search for a company with a name. 
router.get("/searchCompany",
  authMiddleware(),
  authorizeRoles('Company_HR', 'User'),
  validation(valida.companyNameValidationSchema, "query"),
  cc.searchCompanyByName);

//^  Get all applications for specific Job by the job is
router.get(
  '/job/applications/:id',
  authMiddleware(),
  authorizeRoles('Company_HR'),
  validation(idSchema, 'params'),
  cc.getApplicationsForJob
);



router.get('/applications/:date', authMiddleware(), authorizeRoles('Company_HR'), cc.getApplicationsForCompanyOnDate);


export default router;