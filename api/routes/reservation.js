import  express  from "express";
import Reservation from "../models/Reservation.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";
import {
   
    createReservation,
    updateReservation,
    deleteReservation,
    getReservationById,
    getAllReservations,
  } from "../controllers/reservation.js";

const router = express.Router();

//CREATE
router.post("/",  verifyToken,createReservation);
//UPDATE
router.put("/:id", verifyToken, updateReservation);
//DELETE
router.delete("/:id", verifyToken, deleteReservation);
//GET
router.get("/:id", verifyToken, getReservationById);
//GET ALL
router.get("/", verifyToken, getAllReservations);



export default router