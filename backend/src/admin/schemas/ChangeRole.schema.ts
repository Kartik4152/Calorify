import * as Joi from 'joi';

export const ChangeRoleSchema = Joi.object({
  id: Joi.number().integer().required(),
  role: Joi.string().trim().valid('user', 'mod', 'admin').required(),
});
