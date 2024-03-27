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
  export const getRoom = async (req, res, next) => {
    try{
        const room = await Room.findById(req.params.id)
        res.status(200).json(room)
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

export const getAvailableRooms = async (req, res) => {
  try {
    // Recherche des chambres disponibles
    const availableRooms = await Room.find({ available: true });

    // Si aucune chambre disponible n'est trouvée, renvoyer un tableau vide
    if (availableRooms.length === 0) {
      return res.status(404).json({ message: "Aucune salle disponible trouvée" });
    }

    // Envoyer la liste des chambres disponibles en réponse
    res.status(200).json(availableRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
