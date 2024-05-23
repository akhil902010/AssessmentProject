
import {Policy} from '../models/policy.models.js';
import { User } from '../models/user.models.js';

const aggregatePolicies = async (req, res) => {
  try {
    const aggregation = await Policy.aggregate([
      {
        $group: {
          _id: "$userId",
          policies: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
    ]);

    res.status(200).json(aggregation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { aggregatePolicies };
