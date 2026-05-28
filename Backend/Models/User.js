// models/User.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(

  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    password: {
      type: String,

      select: false,

      required: function () {
        return this.authProvider.includes("LOCAL");
      },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    authProvider: {
      type: [String],

      enum: ["LOCAL", "GOOGLE"],

      default: ["LOCAL"],
    },

    role: {
      type: String,

      enum: ["USER", "ADMIN"],

      default: "USER",
    },

    subscription: {

      plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
      },

      status: {

        type: String,

        enum: ["ACTIVE", "EXPIRED", "CANCELLED"],

        default: "ACTIVE",
      },

      expiryDate: {
        type: Date,
        default: null,
      },
    },
  },

  { timestamps: true }
);



// HASH PASSWORD
userSchema.pre("save", async function (next) {

  if (!this.password || !this.isModified("password")) {
    return next();
  }

  const saltRounds = 10;

  this.password = await bcrypt.hash(
    this.password,
    saltRounds
  );

  next();
});



const User = model("User", userSchema);

export default User;