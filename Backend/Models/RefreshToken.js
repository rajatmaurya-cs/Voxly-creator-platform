import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },


  token: {
    type: String,
    required: true,
    unique: true,
  },



  used: {
    type: Boolean,
    default: false,
  },


  
  usedAt: {
    type: Date,
    default: null,
  },


  createdAt: {
    type: Date,
    default: Date.now,

    
    expires: 7 * 24 * 60 * 60,
  },

});


const RefreshToken = mongoose.model(
  "RefreshToken",
  refreshTokenSchema
);


export default RefreshToken;