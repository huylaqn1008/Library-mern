const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const test = (req, res) => {
    res.json({
        message: 'Api route is working'
    });
}

const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
        return res.status(401).json({ error: 'You can only update your own account!!!' });

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.body.email && user.emailChanged) {
            return res.status(400).json({ error: 'You can only change your email once' });
        }

        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username || user.username,
                email: req.body.email || user.email,
                password: req.body.password || user.password,
                avatar: req.body.avatar || user.avatar,
                emailChanged: req.body.email ? true : user.emailChanged,
            }
        }, { new: true });

        const { password, ...rest } = updatedUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

module.exports = { test, updateUser }
