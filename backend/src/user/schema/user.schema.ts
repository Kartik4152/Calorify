import * as Joi from 'joi';

const UserSchema = Joi.object({
  id: Joi.number().integer(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .max(320),
  name: Joi.string().max(60).trim(),
  password: Joi.string().min(6).max(100),
  calorielimit: Joi.number().integer().min(1).max(100000),
  role: Joi.string().trim().valid('user', 'mod', 'admin'),
});

const SignupSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(320)
    .trim()
    .required(),
  name: Joi.string().trim().max(60).required(),
  password: Joi.string().min(6).max(100).required(),
});

const LoginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .max(320)
    .required(),
  password: Joi.string().min(6).max(100).required(),
});

const UpdateSchema = Joi.object({
  id: Joi.number().integer().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .max(320),
  name: Joi.string().trim().max(60),
  password: Joi.string().min(6).max(100),
  calorielimit: Joi.number().integer().min(1).max(100000),
  role: Joi.string().trim().valid('user', 'mod', 'admin'),
});

const CreateSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .max(320)
    .required(),
  name: Joi.string().trim().max(60).required(),
  password: Joi.string().min(6).max(100).required(),
  calorielimit: Joi.number().integer().min(1).max(100000).required(),
  role: Joi.string().trim().valid('user', 'mod', 'admin').required(),
});

export { SignupSchema, LoginSchema, UpdateSchema, CreateSchema, UserSchema };
