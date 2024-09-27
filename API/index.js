import express from "express";
import vendedorRouter from "./routes/vendedor.js";
import agendamentosRouter from "./routes/agendamentos.js";
import atendimentosRouter from "./routes/atendimentos.js";
import authRouter from "./routes/auth.js";
import bodyParser from "body-parser";
import cors from "cors";
import { WebSocketServer } from "ws";
 
const app = express();
const PORT = 8001;

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());



app.use("/api/vendedores/",vendedorRouter);
app.use("/api/auth/",authRouter);
app.use("/api/agendamentos/",agendamentosRouter);
app.use("/api/atendimentos/",atendimentosRouter);



const server = app.listen(PORT, () => {
    console.log("Servidor Rodando na porta " + PORT);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
    console.log("Novo cliente conectado");
    ws.send(JSON.stringify({ message: "Bem-vindo ao CrmGalago WebSocket!" }));

    ws.on("message", (message) => {
        console.log(`Recebido: ${message}`);
    });

    ws.on("close", () => {
        console.log("Cliente desconectado");
    });
});

const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(data);
        }
    });
};

export const updateAgenda = () => {
    const message = JSON.stringify({ event: "update", data: "Agenda atualizada!" });
    broadcast(message);
};

