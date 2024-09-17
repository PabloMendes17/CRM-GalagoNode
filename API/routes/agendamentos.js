import express from "express";
import {getAgendaDeHoje,
        getClientes,
        getSituacaoAgenda,
        getTagAtendimentos,
        getVendedor,
        getAgendaFiltrada,
        getClienteFiltrado} from "../controllers/agendamentos.js"

const router= express.Router();

router.get("/agendahoje", getAgendaDeHoje);
router.get("/clientes", getClientes);
router.get("/situacaoagenda", getSituacaoAgenda);
router.get("/tagatendimentos", getTagAtendimentos);
router.get("/vendedores", getVendedor);
router.get("/agendafiltrada", getAgendaFiltrada);
router.get("/clientefiltrado", getClienteFiltrado);

export default router;

