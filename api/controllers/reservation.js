import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";
import { sendReservationConfirmationEmail,sendReservationModificationEmail,sendReservationCancellationEmail } from "../utils/emailService.js";


//Create a new reservation
export const createReservation = async (req, res ,next) => {
  try {
    const { userId, roomId, startTime, endTime } = req.body;
    //verfication
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    // Check if the room is available for the specified time period
    const existingReservation = await Reservation.findOne({
      roomId: roomId,
      $or: [ //pour plusieurs condition du recherche si la date de reservation existe
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, 
        { $and: [ 
            { startTime: { $gte: startTime, $lte: endTime } },
            { endTime: { $gte: startTime, $lte: endTime } }
          ]
        }
      ]
    });
    if (existingReservation) {
      return res.status(400).json({ message: "Room is not available for the specified time period" });
    }
    const reservation = await Reservation.create(req.body);
      room.reservations.push(reservation); //Add reservation to the room's reservations array 
    // Update room availability
    room.available = false;
    await room.save();
    // Envoyer un email de confirmation de réservation
    const reservationDetails = {
      date: startTime, 
      room: room.name 
    };
    sendReservationConfirmationEmail('destinataire@example.com', reservationDetails);
    res.status(201).json(reservation);
  } catch (error) {
    next(err)
  }
};

// Get all reservations
export const getAllReservations = async (req, res,next) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    next(err)
  }
};

// Get a single reservation by ID
export const getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }
    res.status(200).json(reservation);
  } catch (error) {
    next(err)
  }
};

// Update a reservation by ID
export const updateReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } //retouner info updated for mongo
    );
    if (!reservation) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }
    // Extract  info room  from the updated reservation 
    const { room } = reservation;
    // Envoyer un email de confirmation de mise à jour de réservation
    const reservationDetails = {
      date: reservation.startTime,
      room: room 
    };
    sendReservationModificationEmail('destinataire@example.com', reservationDetails);

    res.status(200).json(reservation);
  } catch (error) {
    next(err)
  }
};
// Delete a reservation by ID
export const deleteReservation = async (req, res ,next) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }
    //update the corresponding room to mark it as available
    const room = await Room.findById(reservation.roomId);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }
    room.available = true;
    await room.save();
    // Envoyer un email de confirmation de suppression de réservation
    const reservationDetails = {
      date: reservation.startTime, 
      room: room.name 
    };
    sendReservationCancellationEmail('destinataire@example.com', reservationDetails);
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    next(err)
  }
};
