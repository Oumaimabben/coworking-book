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
router.post("/", verifyUser,createReservation);
//UPDATE
router.put("/:id",verifyUser, updateReservation);
//DELETE
router.delete("/:id",verifyUser, deleteReservation);
//GET
router.get("/:id",verifyUser, getReservationById);
//GET ALL
router.get("/",verifyUser, getAllReservations);



export default router