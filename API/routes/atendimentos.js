import express from "express";
import {getAtendimentosDeHoje,
        getClientes,
        getSituacaoAgenda,
        getTagAtendimentos,
        getVendedor,
        getAtendimentosFiltrados,
        getClienteFiltrado,
        postNovoAtendimento,
        postAtualizaAtendimento} from "../controllers/atendimentos.js"

const router= express.Router();

router.get("/atendimentoshoje", getAtendimentosDeHoje);
router.get("/clientes", getClientes);
router.get("/situacaoagenda", getSituacaoAgenda);
router.get("/tagatendimentos", getTagAtendimentos);
router.get("/vendedores", getVendedor);
router.get("/atendimentosfiltrados", getAtendimentosFiltrados);
router.get("/clientefiltrado", getClienteFiltrado);
router.post("/novoatendimento", postNovoAtendimento);
router.post("/atualizaatendimento",postAtualizaAtendimento);

export default router;

