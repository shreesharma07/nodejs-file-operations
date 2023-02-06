// ! // Import Joi //
import Joi from 'joi';

// * // Custom Schema to Move Files //
export const joiSchema = Joi.object({
	folderPath: Joi.string().required().messages({ 'any.only': "'Enter Valid File Path'" }),
	maxBatchQuantity: Joi.number().min(1).max(500).required().messages({ 'any.only': 'Enter Max. Batch Quantity Below 500.' }),
	maxFileSize: Joi.number().min(1).max(1024000000).required().messages({ 'any.only': 'Enter Max. File Size Below 1GB' }),
	folderPrexfix: Joi.string().required()
});
