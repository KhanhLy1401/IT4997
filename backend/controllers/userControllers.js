import User from "../models/User.js";

export const changeUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const newRole = req.body.role;

        const user = await User.findById(userId);
        if(!user) return res.status(400).json({message: "Not found user"})
        user.role=newRole;
        await user.save();
        return res.status(201).json(user);

    } catch(error) {
        return res.status(500).json({message: error.message});
    }
}

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) return res.status(404).json({message: "Not found allUsers"});
        return res.status(200).json (users);
    } catch(error) {
        return res.status(500).json({message: error.message});
    }
}

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if(!user) return res.status(404).json({message: "Not found user by id"});
        return res.status(200).json(user);
    } catch(error) {
        return res.status(500).json({message: error.message});
    }
}

export const getAllOwners = async (req, res) => {
    try {
        const owners = await User.find({role: "Owner"});
        if(!owners) return res.status(404).json({message: "Not found owner"})
        return res.status(200).json(owners);
    } catch(error) {
        return res.status(500).json({message: error.message})
    }
}