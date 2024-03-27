import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";
// Controller functions

// Create a new reservation
export const createReservation = async (req, res) => {
  try {
    // Extract data from request body
    const { userId, roomId, startTime, endTime } = req.body;

    // Check if the room is available
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (!room.available) {
      return res.status(400).json({ message: "Room is not available" });
    }

    // Create reservation
    const reservation = await Reservation.create(req.body);

    // Update room availability
    room.available = false; // Room is no longer available
    await room.save();

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
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a reservation by ID
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
