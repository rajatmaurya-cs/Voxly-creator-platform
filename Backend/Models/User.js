import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String
    },

    
    password: {
      type: String,
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
   plan:{
    type:mongoose.Schema.Types.ObjectId,
      ref:"Plan"
   },
    planExpiresAt: {
        type: Date,
        default: null
      }
  },
  { timestamps: true }
);



userSchema.pre("save", async function () {

  if (!this.password || !this.isModified("password")) {
    return;
  }

  const saltRounds = 10;

  this.password = await bcrypt.hash(
    this.password,
    saltRounds
  );
});




const User = model("User", userSchema);

export default User;