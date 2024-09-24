import {db} from "../connect.js";
import { updateAgenda } from "../index.js";

export const getAgendaDeHoje = (req, res)=>{

    db.query(
        `SELECT 
            AGENDA.CODIGO,
            AGENDA.CONTATO,
            AGENDA.OPERADOR,
            AGENDA.ASSUNTO,
            AGENDA.CLIENTE,
            AGENDA.DATA_GRAVACAO,
            AGENDA.DATA_AGENDA,
            AGENDA.HORA_AGENDA,
            AGENDA.SITUACAO,
            AGENDA.TIPO,
            AGENDA.HISTORICO,
            AGENDA.TELEFONE1,
            AGENDA.RESPONSAVEL,
            CLIENTES.NOME,
            CLIENTES.NOMEFANTASIA,
            CLIENTES.CNPJ,
            CLIENTES.CPF
        FROM AGENDA LEFT JOIN CLIENTES ON 
        CLIENTES.CODIGO=AGENDA.CLIENTE  
        WHERE AGENDA.DATA_AGENDA between '2024.01.01' and '2024.05.13'`,async(error, data)=>{

            if(error){
                return res.status(500).json({
                    
                    msg:"O servidor esta indisponível no momento entre em contato com o suporte",
                });
            }
            if(data.length===0){

                return res.status(200).json({

                    msg:'NÃO EXISTEM REGISTROS PARA ESTA DATA',
                });
            }else{
                
                return res.status(200).json({

                    agendahoje:data,
                });
            }    

    });
};

export const getClientes = (req,res) =>{
    
    const pagina = parseInt(req.query.pagina) || 1;
    const resultadoPorPagina = parseInt(req.query.resultadoPorPagina) || 10;
    const offset = (pagina - 1) * resultadoPorPagina;

    db.query(

        'SELECT COUNT(*) AS total FROM CLIENTES',(countError, countData)=>{

            if(countError){

                return res.status(500).json({

                    msg:"O servidor esta indisponível no momento entre em contato com o suporte",
                });
            }
  
            const totalClientes = countData[0].total;

            db.query(

                `SELECT 
                    CODIGO, NOME, NOMEFANTASIA, CNPJ, CPF, DESATIVADO
                 FROM CLIENTES WHERE CLIENTES.DESATIVADO='false' LIMIT ? OFFSET ?`,
                [resultadoPorPagina, offset],
                (error, data) => {

                    if (error) {

                        return res.status(500).json({

                            msg: "O servidor está indisponível no momento. Entre em contato com o suporte.",
                        });
                    }

                    if (data.length === 0) {

                        return res.status(200).json({

                            msg: 'NÃO HÁ CLIENTES CADASTRADOS COM ESTES PARAMETROS',
                            total: totalClientes
                        });
                    } else {

                        return res.status(200).json({

                            clientes: data,
                            total: totalClientes
                        });
                    }
                }
            );
    });
};    

export const getSituacaoAgenda = (req,res) =>{
    db.query(

        'SELECT * FROM SITUACAO_AGENDA',async(error, data)=>{

            if(error){

                return res.status(500).json({
                    msg:"O servidor esta indisponível no momento entre em contato com o suporte",
                });
            }
            if(data.length===0){

                return res.status(200).json({
                    msg:'NÃO HÁ SITUACOES CADASTRADAS',
                });
            }else{
                
                return res.status(200).json({
                    situacaoAgenda:data,
                });
            }
    });
};

export const getTagAtendimentos = (req,res) =>{
    db.query(

        'SELECT * FROM TAG_ATENDIMENTO',async(error, data)=>{

            if(error){

                return res.status(500).json({
                    msg:"O servidor esta indisponível no momento entre em contato com o suporte",
                });
            }
            if(data.length===0){

                return res.status(200).json({
                    msg:'NÃO HÁ TAGS CADASTRADAS',
                });
            }else{
                
                return res.status(200).json({
                    tagAtendimento:data,
                });
            }
    });
};

export const getVendedor = (req,res) =>{
    db.query(
        'SELECT * FROM VENDEDOR',async(error, data)=>{
            if(error){

                return res.status(500).json({
                    msg:"O servidor esta indisponível no momento entre em contato com o suporte",
                });
            }
            if(data.length===0){

                return res.status(200).json({
                    msg:'NÃO HÁ VENDEDORES CADASTRADOS',
                });
            }else{
                
                return res.status(200).json({
                    Operadores:data,
                });
            }
    });
};

export const getAgendaFiltrada = (req, res) => {
    
    const CODCLI = req.query.CODCLI || "";
    const DATAINICIAL = req.query.DATAINICIAL || "";
    const DATAFINAL = req.query.DATAFINAL || "";
    const SITUACAOAGENDA = req.query.SITUACAOAGENDA || "";

    const codcliNumber = CODCLI ? parseInt(CODCLI, 10) : null;

    let query = "SELECT * FROM AGENDA WHERE AGENDA.TIPO in('AGENDAMENTO','AGENDAMENTO 1H','AGENDAMENTO 1H:30m','AGENDAMENTO 2H')";
    let params = [];

    if (CODCLI) {

        query += " AND (AGENDA.CLIENTE = ?)";
        params.push(CODCLI);
    }
    if (DATAINICIAL&& !DATAFINAL) {

        query += " AND (AGENDA.DATA_AGENDA= ?)";
        params.push(DATAINICIAL);
    }
    if (DATAINICIAL&&DATAFINAL) {

        query += " AND (AGENDA.DATA_AGENDA BETWEEN ? AND  ?)";
        params.push(DATAINICIAL,DATAFINAL);
    }
    if (SITUACAOAGENDA) {

        query += " AND (AGENDA.SITUACAO = ?)";
        params.push(SITUACAOAGENDA);
    }
       query+="ORDER BY DATA_AGENDA,HORA_AGENDA"
    
    db.query(query, params, (error, data) => {
        if (error) {

            console.log(error);
            return res.status(500).json({

                msg: "O servidor está indisponível no momento. Entre em contato com o suporte.",
            });
        }
        if (data.length === 0) {

            return res.status(200).json({

                msg: 'NÃO HÁ REGISTROS PARA OS PARAMETROS FORNECIDOS',
                agendafiltrada: [],
            });
        } else {

            return res.status(200).json({

                agendafiltrada: data,
            });
        }
    });
};

export const getClienteFiltrado = (req, res) => {
    
    const NOME_RAZAO = req.query.NOME_RAZAO || "";
    const CNPJ_CPF = req.query.CNPJ_CPF || "";
    const ATIVO = req.query.ATIVO || "false";
    

    let query = "SELECT CLIENTES.CODIGO, CLIENTES.NOME, CLIENTES.NOMEFANTASIA, CLIENTES.CNPJ, CLIENTES.CPF FROM CLIENTES WHERE";
    let params = [];

    if (NOME_RAZAO) {

        let usandoLike = `%${NOME_RAZAO}%`;
        query += " (CLIENTES.NOME LIKE ? OR CLIENTES.NOMEFANTASIA LIKE ?)";
        params.push(usandoLike,usandoLike);
    }
    if (CNPJ_CPF) {

        if (CNPJ_CPF.length===18) {

            query += " CLIENTES.CNPJ = ?";
        } else if (CNPJ_CPF.length === 14) {

            query += " CLIENTES.CPF = ?";
        }
        params.push(CNPJ_CPF);
    }
    if(params){

        query+=" AND CLIENTES.DESATIVADO=?";
        params.push(ATIVO);
    }


    db.query(query, params, (error, data) => {

        if (error) {

            console.log(error);
            return res.status(500).json({

                msg: "O servidor está indisponível no momento. Entre em contato com o suporte.",
            });
        }
        if (data.length === 0) {

            return res.status(200).json({

                msg: 'NÃO HÁ CLIENTES CADASTRADOS PARA OS PARAMETROS FORNECIDOS',
            });
        } else {

            return res.status(200).json({

                clientes: data,
            });
        }
    });
};

export const postNovaAgenda =(req,res)=>{

    const { 
        contatoAG,
        operadorAG,
        assuntoAG,
        codCli,
        DATA_GRAVACAOAG,
        DATA_AGENDAAG,
        HORA_AGENDAAG,
        situacaoAgenda,
        tipoAG,
        HISTORICOAG,
        TELEFONE1,
        responsavelAG,
    } = req.body;

    const historicoFormatado = HISTORICOAG.replace(/\n/g, '<br>');

    const query = `INSERT INTO AGENDA ( 
                                       CONTATO,
                                       OPERADOR,
                                       ASSUNTO,
                                       CLIENTE,
                                       DATA_GRAVACAO,
                                       DATA_AGENDA,
                                       HORA_AGENDA,
                                       SITUACAO,
                                       TIPO,
                                       HISTORICO,
                                       TELEFONE1,
                                       RESPONSAVEL
                                       )
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
                    contatoAG,
                    operadorAG,
                    assuntoAG,
                    codCli,
                    DATA_GRAVACAOAG,
                    DATA_AGENDAAG,
                    HORA_AGENDAAG,
                    situacaoAgenda,
                    tipoAG,
                    historicoFormatado,
                    TELEFONE1,
                    responsavelAG,];

    db.query(query, params, (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                msg: "Erro ao criar a agenda. Tente novamente.",
            });
        }
        console.error(query);
        console.error(params);
        updateAgenda();
        return res.status(201).json({
            msg: "Agenda gravada com sucesso!",
            agendaId: result.insertId,
        });
    });

};

export const postAtualizaAgenda = (req,res)=>{

    const { 
        codigoAtendimentoAG,
        contatoAtualizaAG,
        assuntoAtualizaAG,
        responsaveAtualizalAG,
        situacaoAtualizaAgenda,
        atualizaTELEFONE1,
        atualizaHISTORICOAG,
    } = req.body;

    const historicoFormatado = atualizaHISTORICOAG.replace(/\n/g, '<br>');

    const query = `UPDATE AGENDA SET 
                    CONTATO = ?, 
                    ASSUNTO = ?, 
                    RESPONSAVEL = ?,
                    SITUACAO = ?, 
                    TELEFONE1 = ?, 
                    HISTORICO = ?  
                WHERE CODIGO = ?`;
    const params = [
                contatoAtualizaAG,
                assuntoAtualizaAG,
                responsaveAtualizalAG,
                situacaoAtualizaAgenda,
                atualizaTELEFONE1,
                historicoFormatado,
                codigoAtendimentoAG,];     

           
    db.query(query, params, (error, result) => {
        if (error) {

            console.error(error);
            return res.status(500).json({
                msg: "Erro ao atualizar os dados. Tente novamente.",
            });
        }
        updateAgenda();
        return res.status(201).json({

            msg: "Agenda Atualizada com sucesso!",
        });
    });    
}; 
