import express from "express";
import {getAgendaDeHoje} from "../controllers/agendamentos.js"

const router= express.Router();

router.get("/agendahoje", getAgendaDeHoje);

export default router;