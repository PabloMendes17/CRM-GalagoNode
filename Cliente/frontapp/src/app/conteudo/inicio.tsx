import { useState, useEffect } from "react";
import { makeRequest } from "../../../axios";
import { Chart } from "react-google-charts";

function Inicio(){

    const diaDeHoje= new Date();
    const primeiroDiaDoMes = new Date(diaDeHoje.getFullYear(), diaDeHoje.getMonth(), 1);
    const [dadosAtendimentos, setDadosAtendimentos] = useState([]);
    const [dadosAssuntos, setDadosAssuntos] = useState([]);
    const [dadosAtendimentosPorHora, setDadosAtendimentosPorHora] = useState([]);
    const [dadosSituacao, setDadosSituacao] = useState([]);

    const dataHoje = diaDeHoje.toISOString().split('T')[0];
    const primeiraDataMes = primeiroDiaDoMes.toISOString().split('T')[0];

    useEffect(() => {

        const fetchData = async () => {
            try {

                const atendimentosResponse = await makeRequest.get('dashboard/atendimentosdomes', {
                    params: {
                        dtInicial:primeiraDataMes,
                        dtFinal: dataHoje
                    }
                });
                setDadosAtendimentos(atendimentosResponse.data.tabelaDeAtendimentos);

                const assuntosResponse = await makeRequest.get('dashboard/topdezassuntos', {
                    params: {
                        dtInicial:primeiraDataMes,
                        dtFinal: dataHoje
                    }
                });
                setDadosAssuntos(assuntosResponse.data.tabelaDeTopAssuntos);

                
                const atendimentosPorHoraResponse = await makeRequest.get('dashboard/atendimentosporhora', {
                    params: {
                        dtInicial:primeiraDataMes,
                        dtFinal: dataHoje
                    }
                });
                setDadosAtendimentosPorHora(atendimentosPorHoraResponse.data.tabelaAgendaHora);

                
                const situacaoResponse = await makeRequest.get('dashboard/situacoes', {
                    params: {
                        dtInicial:dataHoje,
                        dtFinal: dataHoje
                    }
                });
                setDadosSituacao(situacaoResponse.data.tabelaSitacoes);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchData();

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

      const tituloAtendimentos = {
        title: "Atendimento do mês",
        pieHole: 0.4, 
        is3D: true,
      };
      const titloAssuntos = {
        title: "Top 10 Assuntos",
        pieHole: 0.4, 
        is3D: true,
      };
      const titloAgendaHora = {
        title: "Agenda por Hora",
      };
      const tituloSituacoes = {
        title: "Situações dos Agendamentos",

      };

      console.log(dadosAtendimentosPorHora);
    return(
        <div className="grid md:grid-cols-2 grid-cols-1 h-[98%] overflow-auto scrollbar-custom">
            <div>
                <Chart
                    chartType="PieChart"
                    data={dadosAtendimentos}
                    options={tituloAtendimentos}
                    width={"100%"}
                    height={"300px"}
                />
            </div>
            <div>
                <Chart
                    chartType="PieChart"
                    data={dadosAssuntos}
                    options={titloAssuntos}
                    width={"100%"}
                    height={"300px"}
                />
           </div>
           <div>

                <Chart
                    chartType="ColumnChart"
                    data={dadosAtendimentosPorHora}
                    options={titloAgendaHora}
                    width={"100%"}
                    height={"300px"}
                />
            </div>
            <div>
                <Chart
                    chartType="ColumnChart"
                    data={dadosSituacao}
                    options={tituloSituacoes}
                    width={"100%"}
                    height={"300px"}
                />
            </div>
           
        </div>
    );
   
}export default Inicio;