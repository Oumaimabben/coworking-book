import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";
import { sendReservationConfirmationEmail,sendReservationModificationEmail,sendReservationCancellationEmail } from "../utils/emailService.js";


// Create a new reservation
export const createReservation = async (req, res) => {
  try {
    // Extract data from request body
    const { userId, roomId, startTime, endTime } = req.body;

    // Check if the room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if the room is available for the specified time period
    const existingReservation = await Reservation.findOne({
      roomId: roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Check if there is any overlapping reservation
        { $and: [ // Check if the new reservation completely contains an existing reservation
            { startTime: { $gte: startTime, $lte: endTime } },
            { endTime: { $gte: startTime, $lte: endTime } }
          ]
        }
      ]
    });
    if (existingReservation) {
      return res.status(400).json({ message: "Room is not available for the specified time period" });
    }

    // Create reservation
    const reservation = await Reservation.create(req.body);
      // Add reservation to the room's reservations array
      room.reservations.push(reservation);
    // Update room availability
    room.available = false; // Room is no longer available
    await room.save();
    // Envoyer un e-mail de confirmation de réservation
    const reservationDetails = {
      date: startTime, // ou toute autre information pertinente sur la réservation
      room: room.name // ou toute autre information pertinente sur la salle
    };
    sendReservationConfirmationEmail('destinataire@example.com', reservationDetails);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};








// Get all reservations
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single reservation by ID
export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a reservation by ID
export const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!reservation) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }
    
    // Extract room information from the updated reservation object
    const { room } = reservation;
    
    // Envoyer un e-mail de confirmation de mise à jour de réservation
    const reservationDetails = {
      date: reservation.startTime,
      room: room // Include the room information
    };
    sendReservationModificationEmail('destinataire@example.com', reservationDetails);

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a reservation by ID
//export const deleteReservation = async (req, res) => {
 // try {
   // const reservation = await Reservation.findByIdAndDelete(req.params.id);
  //  if (!reservation) {
   //   res.status(404).json({ message: "Reservation not found" });
   //   return;
   // }
   // res.status(200).json({ message: "Reservation deleted successfully" });
  ///} catch (error) {
   // res.status(500).json({ message: error.message });
 // }
//};
// Delete a reservation by ID
export const deleteReservation = async (req, res) => {
  try {
    // Find the reservation to delete by its ID
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }

    // Once the reservation is deleted, update the corresponding room to mark it as available
    const room = await Room.findById(reservation.roomId);
    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    room.available = true; // Mark the room as available
    await room.save();

    // Envoyer un e-mail de confirmation de suppression de réservation
    const reservationDetails = {
      date: reservation.startTime, // ou toute autre information pertinente sur la réservation
      room: room.name // ou toute autre information pertinente sur la salle
    };
    sendReservationCancellationEmail('destinataire@example.com', reservationDetails);


    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
