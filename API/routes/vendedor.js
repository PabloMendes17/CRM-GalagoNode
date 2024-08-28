import express from "express";
import {getVendedor} from "../controllers/vendedores.js";

const router= express.Router();

router.get("/teste",getVendedor);

export default router;