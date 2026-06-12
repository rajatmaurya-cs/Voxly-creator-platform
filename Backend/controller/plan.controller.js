import {Plan} from '../Models/Plans'

export const getPlaninfo = async (req, res) => {
  try {
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

