import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: true,
            min: 3,
            max: 50,
        },
        lastName: {
            type: String,
            required: true,
            min: 3,
            max: 50,
        },
        friends: {
            type: Array,
            default: [],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        password: {
            type: String,
            // required is set as true then we can create a document which may
            // not have that property assigned but when we are saving it in
            // mongodb, then we have to make sure that the required properties
            // are assigned values
            required: true,
            min: 5,
        },
        picturePath: {
            type: String,
            default: "",
        },
        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number,
    },
    {
        timestamps: true
    },
);

const usersModel = mongoose.model('User', userSchema);

export default usersModel;