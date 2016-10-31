const { Schema } = require('mongoose');

const BaseModelSchema = new Schema({}, { timestamps: true });

module.exports = BaseModelSchema;
