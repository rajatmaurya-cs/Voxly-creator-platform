import {Plan} from '../Models/Plans.js'
import PlanHistory from '../Models/plansHistory.js'

export const getPlans = async (req, res) => {
  try {
    console.log("Request goes into deep for getPlans")
    const plans = await Plan.find({}).sort({ price: 1 });

    return res.status(200).json({
      success: true,
      message: "The Plans of Postify",
      data: plans,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching plans",
      error: error.message,
    });
  }
};


export const updatePlan = async (req, res) => {
  try {

    const { id } = req.params;

    const { price, limits } = req.body;

    const currentPlan = await Plan.findById(id);
    
    if (!currentPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    await PlanHistory.create({
      configSnapshot: currentPlan.toObject(),
      changedBy: req.user.id,
      changeReason: `Plan '${currentPlan.name}' updated price/limits`,
    });

    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      { price, limits },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      data: updatedPlan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating plan",
      error: error.message,
    });
  }
};

export const getPlanHistory = async (req, res) => {
  try {
    const history = await PlanHistory.find()
      .populate("changedBy", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching plan history",
      error: error.message,
    });
  }
};
