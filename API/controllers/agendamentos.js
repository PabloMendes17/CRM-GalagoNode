import {db} from "../connect.js";

export const getAgendaDeHoje = (req, res)=>{

    db.query(
        "SELECT * FROM AGENDA  WHERE AGENDA.DATA_AGENDA between '2024.01.01' and '2024.05.13'",async(error, data)=>{

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