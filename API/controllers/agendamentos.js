import {db} from "../connect.js";

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
    db.query(
        'SELECT * FROM CLIENTES',async(error, data)=>{
            if(error){
                return res.status(500).json({
                    msg:"O servidor esta indisponível no momento entre em contato com o suporte",
                });
            }
            if(data.length===0){

                return res.status(200).json({
                    msg:'NÃO HÁ CLIENTES CADASTRADOS',
                });
            }else{
                
                return res.status(200).json({
                    clientes:data,
                });
            }
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