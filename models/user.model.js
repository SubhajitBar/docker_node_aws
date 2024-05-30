import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter your name"]
    },
    email: {
        type: String,
        required: [true, "Enter your email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Enter your password"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
};


export const UserModel = mongoose.model("user", userSchema);