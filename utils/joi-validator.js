const Joi = require("joi");

const authSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  password: Joi.string().min(3).max(15).required(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),

  role: Joi.string()
});

const restaurantSchema = Joi.object({
  title: Joi.string().min(5).required(),

  description: Joi.string().min(5).required()
})

const productSchema = Joi.object({
  title: Joi.string().min(5).required(),

  description: Joi.string().min(5).required(),

  price: Joi.number().required(),

  restaurantId : Joi.string().alphanum().required()
})

module.exports = { 
  authSchema,
  restaurantSchema,
  productSchema
 };
