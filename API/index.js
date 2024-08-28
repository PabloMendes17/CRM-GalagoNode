import express from "express";
import vendedorRouter from "./routes/vendedor.js";
import agendamentosRouter from "./routes/agendamentos.js";
import authRouter from "./routes/auth.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());



app.use("/api/vendedores/",vendedorRouter);
app.use("/api/auth/",authRouter);
app.use("/api/agendamentos/",agendamentosRouter);



app.listen(8001,()=>{
    console.log("Servidor Rodando");
});
