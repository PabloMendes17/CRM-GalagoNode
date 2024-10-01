import express from "express";
import {getAtendimentoDoMes,
        getTopDezAssuntos,
        getAtendimentoPorHora,
        getSituacoes} from "../controllers/dashboard.js"

const router= express.Router();

router.get("/atendimentosdomes", getAtendimentoDoMes);
router.get("/topdezassuntos", getTopDezAssuntos);
router.get("/atendimentosporhora", getAtendimentoPorHora);
router.get("/situacoes", getSituacoes);

export default router;

