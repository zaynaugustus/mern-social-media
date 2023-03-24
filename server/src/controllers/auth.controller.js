import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import userModel from '../models/users.model.js'; // try using some other name

/* REGISTER USER */
export const register = async (req, res) => {
    console.log('Register function initiated');
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000),
        })

        console.log(newUser);
        
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        // json() method tells that the content type is json
        // and converts the json to string using json.stringify
        // but here we are sending a mongoose document, dont know
        // how that works
    }
    catch (error) {
        console.log('Failed in registering the user');
        console.log(error.message);
        return res.status(400).json({ message: 'Email already resistered'});
    }
}

/* LOGIN */
export const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        
        // is user of type document?
        const user = await userModel.findOne({ email: email });
        // console.log(user);
    
        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials',
            });
        }
        
        // original first and hash later
        const correctPassword = await bcrypt.compare(password, user.password);
        
        if (!correctPassword) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
    
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
        // what it means deleting user.password
        // we are not doing user.save()
        // the below didnt work
        // delete user.password;
        
        // when property of document is assigned undefined,
        // then that property is deleted from document
        // and in order to remove the property from mongodb too,
        // then save using save function
        user.password = undefined;

        // await user.save();
        return res.status(200).json({ token, user });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}