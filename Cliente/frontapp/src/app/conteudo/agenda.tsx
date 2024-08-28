import { useRouter } from "next/navigation";
import LoadingSpinner from '../components/CarregandoSpinner';
import { CiSquareChevDown } from "react-icons/ci";
import { AiOutlineFolderView } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { useState,useEffect } from "react";
import { makeRequest } from "../../../axios";

interface AgendaItem {
    CODIGO: number;
    CONTATO: string;
    OPERADOR: string;
    ASSUNTO: string;
    CLIENTE: number;
    DATA_GRAVACAO: string;
    DATA_AGENDA: string;
    HORA_AGENDA: string;
    SITUACAO: string;
    TIPO: string;
    HISTORICO: string;
    TELEFONE1: string;
    RESPONSAVEL:string;
}

function agenda(){

    const [agenda, setAgenda] = useState<AgendaItem[] | null>(null);

    const [isFiltroVisible, setIsFiltroVisible] = useState<boolean>(false);

    useEffect(() => {
        makeRequest.get("agendamentos/agendahoje").then((res)=>{

            if (res.data.agendahoje) {
                setAgenda(res.data.agendahoje);
            } else {
                console.log(res.data.msg); 
            }

        }).catch((error) => {
            console.error("Servidor indisponível:", error);
        });
    },[])

    function formatDateToBR(dateString: string): string {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        };
        return date.toLocaleDateString('pt-BR', options);
    }

    return(
        <div  className="relative">
           <div className="font-medium text-lg text-white bg-blue-950 dark:bg-gray-900">
           <CiSquareChevDown/>
           </div>
            {agenda ? (
                <table className="min-w-full divide-y divide-gray-500 text-center text-xs">
                    <thead className="bg-blue-950 dark:bg-gray-900 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-xs text-white tracking-wider">CODIGO</th>
                            <th className="px-4 py-3 text-xs text-white tracking-wider">CONTATO</th>
                            <th className="px-4 py-3 text-xs text-white tracking-wider">ASSUNTO</th>
                            <th className="px-4 py-3 text-xs text-white tracking-wider">TIPO</th>
                            <th className="px-4 py-3 text-xs text-white tracking-wider">TELEFONE</th>
                            <th className="px-4 py-3 text-xs text-white tracking-wider">DATA AGENDADA</th>
                            <th className="px-4 py-3 text-xs text-white tracking-wider">HORA AGENDADA</th>
                            <th className="px-4 py-3 text-xs text-white tracking-wider">RESPONSÁVEL</th>
                            <th className="px-4 py-3 text-xs text-white tracking-wider">OPERADOR</th>
                            <th className="px-4 py-3 text-xs text-white tracking-wider">SITUAÇÃO</th>
                            <th className="px-4 py-3 text-xs text-white tracking-wider">OPÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agenda.map((item,index) => (
                            <tr key={item.CODIGO}
                                className={`hover:bg-neutral-200 dark:hover:bg-slate-400 ${index % 2 === 0 ? 'bg-neutral-100 dark:bg-slate-500 ' : ''}`}
                            >
                                <td className="font-medium whitespace-nowrap">{item.CODIGO}</td>
                                <td>{item.CONTATO}</td>
                                <td>{item.ASSUNTO}</td>
                                <td>{item.TIPO}</td>
                                <td>{item.TELEFONE1}</td>
                                <td>{formatDateToBR(item.DATA_AGENDA)}</td>
                                <td>{item.HORA_AGENDA}</td>
                                <td>{item.RESPONSAVEL}</td>
                                <td>{item.OPERADOR}</td>
                                <td>{item.SITUACAO}</td>
                                <td className="text-lg">
                                    <button className="p-1"><AiOutlineFolderView /></button>
                                    <button className="p-1"><MdEdit /></button>
                                    <button className="p-1"><MdDeleteForever /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>    
                </table>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    );

}export default agenda;