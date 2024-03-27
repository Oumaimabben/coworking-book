import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
  {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence à votre modèle User
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room', // Référence à votre modèle Room
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  // Autres champs de votre modèle Reservation
});


export default mongoose.model("Reservation",  ReservationSchema );

