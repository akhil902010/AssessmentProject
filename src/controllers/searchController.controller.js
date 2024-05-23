 import { User } from '../models/user.models.js';
 import { Policy } from '../models/policy.models.js';

 const searchByUsername = async (req, res) => {
    try {
        
        const user = await User.findOne({ name: req.params.username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const policies = await Policy.find({ userId: user._id });

        res.status(200).json({ user, policies });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default { searchByUsername };