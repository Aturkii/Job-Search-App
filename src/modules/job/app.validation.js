import Joi from "joi";

export const applyJobValidationSchema = Joi.object({
  jobId: Joi.string().required(),
  userTechSkills: Joi.array().items(Joi.string()).required(),
  userSoftSkills: Joi.array().items(Joi.string()).required(),
  userResume: Joi.string().required()
});