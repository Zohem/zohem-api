import * as Joi from "joi";

///example name,phone number,etc,etc,etc
export const datatype: Joi.ObjectSchema = Joi.object({
	
});
export const userSchema: Joi.ObjectSchema = Joi.object({
	id: Joi.number(),
	name: Joi.string().required(),
	pubId: Joi.number().required()
});

///this is the data sent by publishers
export const pubSchema: Joi.ObjectSchema = Joi.object({
	id: Joi.number(),
	name: Joi.string().required(),
	pubId: Joi.number().required(),
	users: Joi.array().items(userSchema)
});




