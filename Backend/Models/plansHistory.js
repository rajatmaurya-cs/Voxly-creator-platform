// import mongoose from "mongoose";

// const configHistorySchema = new mongoose.Schema({

//     configSnapshot:{
//         type: mongoose.Schema.Types.Mixed,
//         required:true
//     },

//     changedBy:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User"
//     },

//     changeReason:{
//         type:String,
//         default:"No reason provided"
//     }

// },{timestamps:true});

// const ConfigHistory =
//    mongoose.models.ConfigHistory ||
//    mongoose.model("ConfigHistory", configHistorySchema);

// export default ConfigHistory;

import mongoose from "mongoose";

const PlanHistorySchema = new mongoose.Schema({

    configSnapshot:{
        type: mongoose.Schema.Types.Mixed,
        required:true
    },

    changedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    changeReason:{
        type:String,
        default:"No reason provided"
    }

},{timestamps:true});

const PlanHistory =
   mongoose.models.PlanHistory ||
   mongoose.model("PlanHistory", PlanHistorySchema);

export default PlanHistory;
