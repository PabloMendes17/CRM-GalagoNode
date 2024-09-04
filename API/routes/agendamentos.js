import express from "express";
import {getAgendaDeHoje,
        getClientes,
        getSituacaoAgenda,
        getTagAtendimentos,
        getVendedor} from "../controllers/agendamentos.js"

const router= express.Router();

router.get("/agendahoje", getAgendaDeHoje);
router.get("/clientes", getClientes);
router.get("/siatuacaoagenda", getSituacaoAgenda);
router.get("/tagatendimentos", getTagAtendimentos);
router.get("/vendedores", getVendedor);

export default router;