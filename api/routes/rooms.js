import  express  from "express";
import Room from "../models/Room.js";
import {
    createRoom,
    updateRoom,
    deleteRoom,
    getRooms,
    getRoomDetails
  } from "../controllers/room.js";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/",verifyAdmin, createRoom);
//UPDATE
router.put("/:id",verifyAdmin, updateRoom);
//DELETE
router.delete("/:id",verifyAdmin, deleteRoom);
//getRoomDetails
router.get("/:roomId", verifyToken, getRoomDetails);





export default router