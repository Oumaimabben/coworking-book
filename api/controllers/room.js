import Room from "../models/Room.js";

export const createRoom = async (req, res, next) => {
    const newRoom = new Room(req.body)

    try{
        const savedRoom = await newRoom.save()
        res.status(200).json(savedRoom)
    }catch(err){
        next(err)
    }
  };
  export const updateRoom = async (req, res, next) => {
    const newRoom = new Room(req.body)

    try{
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { $set: req.body}, {new: true})
        res.status(200).json(updatedRoom)
    }catch(err){
        next(err)
    }
  };
  export const deleteRoom = async (req, res, next) => {
    try{
        await Room.findByIdAndDelete(req.params.id)
        res.status(200).json("room deleted")
    }catch(err){
        next(err)
    }

  };
 
  export const getRooms = async (req, res, next) => {
    try{
        const rooms = await Room.find()
        res.status(200).json(rooms)
    }catch(err){
        next(err)
    }
  };  



  export const getRoomDetails = async (req, res, next) => {
    try {
      const { roomId } = req.params;
      const room = await Room.findById(roomId);
      console.log("Room: ", room); // Log the room object to inspect its structure
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
  
      // Extract reservation intervals from the room's reservations array
      const reservationIntervals = room.reservations.map(reservation => ({
        startTime: reservation.startTime,
        endTime: reservation.endTime
      }));
  
      res.status(200).json({
        _id: room._id,
        name: room.name,
        desc: room.desc,
        capacity: room.capacity,
        amenities: room.amenities,
        available: room.available,
        reservations: reservationIntervals // Include reservation intervals in response
      });
    } catch (error) {
      next(err)
    }
  };
  