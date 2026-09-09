import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
    },

    date: {
        type: Date,
        required: true
    },

    dateOfcreation: {
        type: Date,
        required: true
    },

    state: {
        type: Boolean,
        default: false
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },

    createdByPartner: {
        type: Boolean,
        default: false
    }


}, { timestamps: true });

export default mongoose.model("Task", taskSchema);