import * as Joi from 'joi';

const MealSchema = Joi.object({
  id: Joi.number().integer().integer(),
  name: Joi.string().trim().max(60),
  calories: Joi.number().integer().min(1).max(100000),
  date: Joi.number()
    .integer()
    .custom((value, helper) => {
      if (value < 1) throw new Error('Date Invalid');
      let month = helper.state.ancestors[0].month;
      let year = helper.state.ancestors[0].year;
      let daysinmonth = new Date(year, month, 0).getDate();
      if (value > daysinmonth) throw new Error('Date Invalid');
      return value;
    })
    .required(),
  month: Joi.number().integer().min(1).max(12),
  year: Joi.number().integer().min(1),
  hour: Joi.number().integer().min(0).max(23),
  minute: Joi.number().integer().min(0).max(59),
}).custom((val, helper) => {
  let today = new Date();
  let providedDate = new Date(val.year, val.month - 1, val.date);
  if (providedDate > today) {
    throw new Error('Future Date Invalid');
  }
  return val;
});

const UpdateSchema = Joi.object({
  id: Joi.number().integer().integer().required(),
  name: Joi.string().trim().max(60),
  calories: Joi.number().integer().min(1).max(100000),
  date: Joi.number()
    .integer()
    .custom((value, helper) => {
      if (value < 1) throw new Error('Date Invalid');
      let month = helper.state.ancestors[0].month;
      let year = helper.state.ancestors[0].year;
      let daysinmonth = new Date(year, month, 0).getDate();
      if (value > daysinmonth) throw new Error('Date Invalid');
      return value;
    }),
  month: Joi.number().integer().min(1).max(12),
  year: Joi.number().integer().min(1),
  hour: Joi.number().integer().min(0).max(23),
  minute: Joi.number().integer().min(0).max(59),
})
  .and('month', 'year', 'date')
  .custom((val, helper) => {
    let today = new Date();
    let providedDate = new Date(val.year, val.month - 1, val.date);
    if (providedDate > today) {
      throw new Error('Future Date Invalid');
    }
    return val;
  });

const CreateSchema = Joi.object({
  name: Joi.string().trim().max(60).required(),
  calories: Joi.number().integer().min(1).max(100000).required(),
  date: Joi.number()
    .integer()
    .custom((value, helper) => {
      if (value < 1) throw new Error('Date Invalid');
      let month = helper.state.ancestors[0].month;
      let year = helper.state.ancestors[0].year;
      let daysinmonth = new Date(year, month, 0).getDate();
      if (value > daysinmonth) throw new Error('Date Invalid');
      return value;
    })
    .required(),
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(1).required(),
  hour: Joi.number().integer().min(0).max(23).required(),
  minute: Joi.number().integer().min(0).max(59).required(),
}).custom((val, helper) => {
  let today = new Date();
  let providedDate = new Date(val.year, val.month - 1, val.date);
  if (providedDate > today) {
    throw new Error('Future Date Invalid');
  }
  return val;
});

export { CreateSchema, UpdateSchema, MealSchema };
