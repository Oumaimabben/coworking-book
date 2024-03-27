import  express  from "express";
import Reservation from "../models/Reservation.js";
import {
   
    createReservation,
    updateReservation,
    deleteReservation,
    getReservationById,
    getAllReservations,
  } from "../controllers/reservation.js";

const router = express.Router();

//CREATE
router.post("/", createReservation);
//UPDATE
router.put("/:id", updateReservation);
//DELETE
router.delete("/:id", deleteReservation);
//GET
router.get("/:id", getReservationById);
//GET ALL
router.get("/", getAllReservations);



export default router