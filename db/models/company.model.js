import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  numberOfEmployees: {
    type: String,
    required: true,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+']
  },
  companyEmail: {
    type: String,
    required: true,
    unique: true
  },
  companyHR: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
  {
    timestamps: { createdAt: true },
    versionKey: false
  });

const Company = mongoose.model('Company', companySchema);

export default Company;
