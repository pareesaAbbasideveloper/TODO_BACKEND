import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
    },


}, { timestamps: true });

export default mongoose.model("User", userSchema);
