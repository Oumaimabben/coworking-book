import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    roomNumbers: [{
        number: Number,
        unavailableDates: {
            type: [Date]
        }
    }],
    capacity: {
        type: Number,
        required: true
    },
    amenities: [String],
    available: {
        type: Boolean,
        default: true
    },
    reservations: [{
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        }
    }]
}, { timestamps: true });

export default mongoose.model("Room", RoomSchema);
