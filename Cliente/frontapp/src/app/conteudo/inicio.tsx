import { useState, useEffect } from "react";

function inicio(){

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8001');

        ws.onopen = () => {
            console.log('Conectado ao servidor WebSocket');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.event === "update") {

                notificacaoUsuario("Atualização da Agenda", "A agenda foi atualizada com sucesso!");
            }
        }           
        ws.onclose = () => {
            console.log('Conexão fechada');
        };

        return () => {
            ws.close(); 
        };
    }, []);

    const notificacaoUsuario = (titulo:string, mensagem:string) => {
        if (Notification.permission === "granted") {
            new Notification(titulo, {
                body: mensagem,
                icon: '/favicon.ico' 
            });
        }
    };

    return(
        <div>
            Inicio
        </div>
    );

}export default inicio;