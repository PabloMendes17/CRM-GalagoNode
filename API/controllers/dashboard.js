import {db} from "../connect.js";

export const getAtendimentoDoMes = (req,res) => {

    const { dtInicial, dtFinal } = req.query;

    db.query(
        `SELECT 
            AGENDA.OPERADOR, COUNT(*) AS VOLUME
        FROM AGENDA 
        WHERE AGENDA.TIPO = 'ATENDIMENTO' 
        AND DATA_AGENDA BETWEEN ? AND ?
        GROUP BY AGENDA.OPERADOR ORDER BY 2 DESC`,[dtInicial, dtFinal],async(error, data)=>{

            if(error){
                return res.status(500).json({
                    
                    msg:"O servidor esta indisponível no momento entre em contato com o suporte",
                });
            }
            if (data.length === 0) {

                const tabelaDeAtendimentos = [
                    ['Operador', 'Volume'],
                    ['Nenhum atendimento', 1] 
                ];
                return res.status(200).json({ tabelaDeAtendimentos });
            }else{
                
                const rows = data.map(row=>[row.OPERADOR, parseInt(row.VOLUME)]);
                const tabelaDeAtendimentos = [
                    ['Operador', 'Volume'],
                    ...rows
                ];
                return res.status(200).json({

                    tabelaDeAtendimentos:tabelaDeAtendimentos,
                });
            }    

    });

};

export const getTopDezAssuntos = (req, res)=>{

    const { dtInicial, dtFinal } = req.query;

    db.query(
        `SELECT 
            AGENDA.ASSUNTO, COUNT(*) AS VOLUME 
        FROM AGENDA 
        WHERE  AGENDA.TIPO='ATENDIMENTO' AND 
        DATA_AGENDA BETWEEN  ? and ? 
        GROUP BY AGENDA.ASSUNTO ORDER BY 2 DESC LIMIT 10`,[dtInicial, dtFinal],async(error, data)=>{

            if(error){
                return res.status(500).json({
                    
                    msg:"O servidor esta indisponível no momento entre em contato com o suporte",
                });
            }
            if (data.length === 0) {

                const tabelaDeTopAssuntos = [
                    ['Assunto', 'Volume'],
                    ['Nenhum atendimento', 1] 
                ];
                return res.status(200).json({ tabelaDeTopAssuntos });
            }else{
                
                const rows = data.map(row=>[row.ASSUNTO, parseInt(row.VOLUME)]);
                const tabelaDeTopAssuntos = [
                    ['Assunto', 'Volume'],
                    ...rows
                ];
                return res.status(200).json({

                    tabelaDeTopAssuntos:tabelaDeTopAssuntos,
                });
            }    

    });
    
};
export const getAtendimentoPorHora = (req, res)=>{

    const { dtInicial, dtFinal } = req.query;

    db.query(
        `SELECT 
            AGENDA.HORA_AGENDA, COUNT(*) AS VOLUME 
        FROM AGENDA 
        WHERE AGENDA.TIPO IN ('AGENDAMENTO','AGENDAMENTO 1H','AGENDAMENTO 1H:30m','AGENDAMENTO 2H') AND 
        DATA_AGENDA BETWEEN  ? and ? 
        GROUP BY AGENDA.HORA_AGENDA ORDER BY 1 `,[dtInicial, dtFinal], async(error, data)=>{

            if(error){
                return res.status(500).json({
                    
                    msg:"O servidor esta indisponível no momento entre em contato com o suporte",
                });
            }
            if (data.length === 0) {

                const tabelaDeTopAssuntos = [
                    ['Horario', 'Volume'],
                    ['Nenhum Agendamento', 1] 
                ];
                return res.status(200).json({ tabelaDeTopAssuntos });
            }else{
                
                const rows = data.map(row=>[row.HORA_AGENDA, parseInt(row.VOLUME)]);
                const tabelaAgendaHora = [
                    ['Horario', 'Volume'],
                    ...rows
                ];
                return res.status(200).json({

                    tabelaAgendaHora:tabelaAgendaHora,
                });
            }    

    });
    
};
export const getSituacoes = (req, res)=>{

    const { dtInicial, dtFinal } = req.query;

    db.query(
        `SELECT
            AGENDA.SITUACAO, COUNT(*) AS VOLUME
        FROM AGENDA 
        WHERE AGENDA.TIPO IN ('AGENDAMENTO','AGENDAMENTO 1H','AGENDAMENTO 1H:30m','AGENDAMENTO 2H') 
        AND DATA_AGENDA BETWEEN  ? and ?
        GROUP BY AGENDA.SITUACAO ORDER BY 2 DESC`,[dtInicial, dtFinal],async(error, data)=>{

            if(error){
                return res.status(500).json({
                    
                    msg:"O servidor esta indisponível no momento entre em contato com o suporte",
                });
            }
            if (data.length === 0) {

                const tabelaSitacoes = [
                    ['Situações', 'Volume'],
                    ['Nenhum Agendamento', 1] 
                ];
                return res.status(200).json({ tabelaSitacoes });
            }else{
                
                const rows = data.map(row=>[row.SITUACAO, parseInt(row.VOLUME)]);
                const tabelaSitacoes = [
                    ['Situações', 'Volume'],
                    ...rows
                ];
                return res.status(200).json({

                    tabelaSitacoes:tabelaSitacoes,
                });
            }    

    });
    
};

