import express from "express";
import {getAgendaDeHoje,
        getClientes,
        getSituacaoAgenda,
        getTagAtendimentos,
        getVendedor,
        getAgendaFiltrada,
        getClienteFiltrado,
        postNovaAgenda,
        postAtualizaAgenda} from "../controllers/agendamentos.js"

const router= express.Router();

router.get("/agendahoje", getAgendaDeHoje);
router.get("/clientes", getClientes);
router.get("/situacaoagenda", getSituacaoAgenda);
router.get("/tagatendimentos", getTagAtendimentos);
router.get("/vendedores", getVendedor);
router.get("/agendafiltrada", getAgendaFiltrada);
router.get("/clientefiltrado", getClienteFiltrado);
router.post("/novaagenda", postNovaAgenda);
router.post("/atualizaagenda",postAtualizaAgenda);

export default router;

