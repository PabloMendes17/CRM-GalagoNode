import express from "express";
import vendedorRouter from "./routes/vendedor.js";
import agendamentosRouter from "./routes/agendamentos.js";
import atendimentosRouter from "./routes/atendimentos.js";
import dashboardRouter from "./routes/dashboard.js";
import authRouter from "./routes/auth.js";
import bodyParser from "body-parser";
import cors from "cors";
import { WebSocketServer } from "ws";
 
const app = express();
const PORT = 8001;

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));



app.use("/api/vendedores/",vendedorRouter);
app.use("/api/auth/",authRouter);
app.use("/api/agendamentos/",agendamentosRouter);
app.use("/api/atendimentos/",atendimentosRouter);
app.use("/api/dashboard/",dashboardRouter);



const server = app.listen(PORT, '0.0.0.0', () => {
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
    const message = JSON.stringify({ event: "updateAgenda", data: "Agenda atualizada!" });
    broadcast(message);
};

export const updateAtendimento = () => {
    const message = JSON.stringify({ event: "updateAtendimento", data: "Atendimento atualizada!" });
    broadcast(message);
};

export const deletaAgenda = () => {
    const message = JSON.stringify({ event: "deleta", data: "Agenda deletada!" });
    broadcast(message);
};

export const deletaAtendimento = () => {
    const message = JSON.stringify({ event: "deleta", data: "Atendimento deletado!" });
    broadcast(message);
};

