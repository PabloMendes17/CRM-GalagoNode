import LoadingSpinner from '../components/CarregandoSpinner';
import { TbFilterSearch } from "react-icons/tb";
import { CiSquareChevDown,CiSquareChevUp } from "react-icons/ci";
import { BsCalendar2Plus } from "react-icons/bs";
import { AiOutlineFolderView } from "react-icons/ai";
import { MdEdit, MdDeleteForever,MdOutlineClose } from "react-icons/md";
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
    NOME:string;
    NOMEFANTASIA:string;
    CNPJ:string;
    CPF:string;
}
interface ClienteItem {
    CODIGO: number;
    NOME:string;
    NOMEFANTASIA: string;
    CNPJ: string;
    CPF: string;
    DESATIVADO: Boolean;
}
interface SiatuacaoAgendaItem {
    CODIGO: number;
    DESCRICAO:string;
}
interface TagAtendimentoItem {
    CODIGO: number;
    TAG:string;
}
interface VendedorItem {
    CODIGO: number;
    NOME:string;
    EMAIL:string;
    usuario_PARAMetro:string;
}

function Agenda(){

    const [agenda, setAgenda] = useState<AgendaItem[] | null>(null);
    const [cliente, setCliente] = useState<ClienteItem[] | null>(null);
    const [situacaoAgenda, setSituacaoAgenda] = useState<SiatuacaoAgendaItem[] | null>(null);
    const [tagAtendimento, setTagAtendimento] = useState<TagAtendimentoItem[] | null>(null);
    const [vendedor, setVendedor] = useState<VendedorItem[]>([]);
    const [usuarioLogado, setUsuarioLogado] = useState<{ NOME: string,usuario_PARAMetro:string }>({ NOME: '',usuario_PARAMetro:'' });

    const [isFiltroVisible, setIsFiltroVisible] = useState<boolean>(false);
    const [abreNovaAgenda, setAbreNovaAgenda] = useState<boolean>(false);
    const [selecionaCodigo, setSelecionaCodigo] = useState<AgendaItem | null>(null);
    const [mostraDetalhes, setMostraDetalhes] = useState<boolean>(false);
    const [alteraAgenda, setAlteraAgenda] = useState<boolean>(false);
    const [deletaAgenda, setDeletaAgenda] = useState<boolean>(false);
    useEffect(() => {

        const fetchData = async () => {
            try {
                const [agendaRes, clientesRes, situacaoAgendaRes, tagAtendimentoRes, vendedoresRes] = await Promise.all([
                    makeRequest.get("agendamentos/agendahoje"),
                    makeRequest.get("agendamentos/clientes"),
                    makeRequest.get("agendamentos/siatuacaoagenda"),
                    makeRequest.get("agendamentos/tagatendimentos"),
                    makeRequest.get("agendamentos/vendedores")
                ]);

                setAgenda(agendaRes.data.agendahoje || []);
                setCliente(clientesRes.data.clientes || []);
                setSituacaoAgenda(situacaoAgendaRes.data.situacaoAgenda || []);
                setTagAtendimento(tagAtendimentoRes.data.tagAtendimento || []);
                setVendedor(vendedoresRes.data.Operadores || []);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };
        
        let atualUser = localStorage.getItem("CrmGalago:usuarioLogado");
        if(atualUser){
            setUsuarioLogado(JSON.parse(atualUser));
        }
 
        fetchData();
    }, []);


    function formatDateToBR(dateString: string): string {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        };
        return date.toLocaleDateString('pt-BR', options);
    }
    const handleNovaAgenda = () => {

        setAbreNovaAgenda(false);
    };
    const handleDetalhes = () => {

        setMostraDetalhes(false);
    };
    const handleAtualiza = () => {

        setAlteraAgenda(false);
    };

    const handleDeleta = () => {
        if (selecionaCodigo) {

            setDeletaAgenda(false);
        }
    };

    /*const handleFiltrarClientes= async()=>{
        try{
            const response =await makeRequest.get("/agendamentos/clientesfiltrados",{
                params:{
                    NOMERAZAO:filtroNomeRazao,
                    DOCUMENTO:filtroDocumento,
                    ATIVO:filtroAtivo,
                },
            });

            setClienteFiltrado(response.data.clientes);
        }catch(error){
            console.error("Erro ao buscar cliente:",error);
        }
    };*/

    return(
        <div className="flex flex-col h-screen">
            {agenda?(          
                <div className="sticky top-0 z-20 font-medium text-sm text-white bg-blue-950 dark:bg-gray-900">
                    <div className="flex justify-between mb-4">
                        <span className="flex items-center px-0.5">
                            <p className="px-0.5"><TbFilterSearch/></p>
                            <p className="px-0.5">Filtros</p>
                            <button className="text-lg" onClick={() => setIsFiltroVisible(!isFiltroVisible)}>
                                {isFiltroVisible ? <CiSquareChevUp/> :<CiSquareChevDown/> } 
                            </button>
                        </span>
                        <span className="flex items-center px-0.5">
                            <p className="px-2">Nova Agenda</p>
                            <button className="" onClick={() => setAbreNovaAgenda(true)}>
                                <BsCalendar2Plus/>
                            </button>     
                        </span>                   
                    </div>
                    <div className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isFiltroVisible ? 'max-h-screen' : 'max-h-0'}`}>
                        <div className="h-full flex flex-wrap items-center space-x-2 p-4 text-black bg-gray-100 dark:bg-gray-800">
                            <div>
                                <p>De:</p>
                                <input type="date" id="filtroIdInicial" placeholder="Date" className="border rounded p-1"/>
                            </div>
                            <div>
                                <p>Até:</p>
                                <input type="date" id="filtroIdFinal"placeholder="Date" className="border rounded p-1"/>
                            </div>
                            <div>
                                <p>Situação</p>
                                <input type="text" id="filtroSituacaoAgenda"placeholder="Situação" className="border rounded p-1"/>
                            </div>
                            <div>
                                <p>Cod. CLiente</p>
                                <div className='flex'>
                                    <div className="w-[50%] m-0">
                                        <input type="text" id="filtroSituacaoAgenda"placeholder="Situação" 
                                            className="w-full h-full border border-gray-300 shadow-sm focus:outline-none
                                                        focus:ring-2 focus:ring-blue-500 rounded-l p-1"/>
                                    </div>
                                    <div className='w-[40%] text-white m-0'>
                                        <button type="button" id="btBuscaCliente" name="btBuscaCliente"
                                                className=' border border-gray-300 shadow-sm border-transparent 
                                                           bg-blue-600 focus:ring-2 focus:ring-blue-500 rounded-e p-1'>
                                        Buscar</button>
                                    </div>
                                </div>
                                
                            </div>
                            <button className="self-end bg-blue-500 text-white rounded px-4 py-2">
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>
                </div>
            ) :<p></p>}
            {agenda ? (
                <div className="flex-1 overflow-auto scrollbar-custom">
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
                        <tbody className="">
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
                                        <button className="p-1" onClick={() => { setSelecionaCodigo(item); setMostraDetalhes(true); }}><AiOutlineFolderView /></button>
                                        <button className="p-1" onClick={() => { setSelecionaCodigo(item); setAlteraAgenda(true); }}><MdEdit /></button>
                                        <button className="p-1" onClick={() => { setSelecionaCodigo(item); setDeletaAgenda(true); }}><MdDeleteForever /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>    
                    </table>
                        {abreNovaAgenda && (
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-2">
                                <div className="bg-white p-4 rounded-lg shadow-lg w-[80%]">
                                    <div className='flex justify-between text-blue-700 mb-4'>
                                        <h2 className="text-lg text-blue-700 font-bold">Nova Agenda</h2>
                                    </div>
                                    <form onSubmit={handleNovaAgenda} className="grid grid-cols-12 items-center">
                                        <div className="col-span-2 m-1">
                                            <div className="relative flex w-full rounded-lg shadow-sm">
                                                <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                text-sm disabled:pointer-events-none">
                                                    <input type="number" id="inputCodClienteAG" name="inputCodClienteAG"
                                                            className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 rounded-l-lg 
                                                                        shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            defaultValue='999999' required/>
                                                    <label htmlFor="inputCodClienteAG"
                                                        className="absolute top-1 left-3 text-gray-500"
                                                        >Cod Cliente
                                                    </label>    
                                                </div>          
                                                <button type="button" 
                                                        className="py-3 px-4 inline-flex justify-center items-center 
                                                                gap-x-2 text-sm font-semibold rounded-e-md border border-transparent 
                                                                bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 
                                                                focus:ring-blue-500"
                                                        id="btBuscaAgenda">                            
                                                Busca</button>
                                            </div>
                                        </div>
                                        <div className="col-span-6 m-1">
                                            <div className="relative flex w-full rounded-lg shadow-sm">
                                                <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                text-sm disabled:pointer-events-none">
                                                    <input type="text" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 rounded-lg 
                                                                                shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                            id="inputNomeClienteAG" name="inputNomeClienteAG" placeholder="Nome/Razão Social" defaultValue='Ainda Não Cadastrado' disabled/>
                                                    <label htmlFor="inputNomeClienteAG"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                    >Nome/Razão Social</label>
                                                </div>
                                            </div>    
                                        </div>
                                        <div className="col-span-2 m-1">
                                            <div className="relative flex w-full rounded-lg shadow-sm">
                                                <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                text-sm disabled:pointer-events-none">
                                                    <select className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 rounded-lg 
                                                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                            aria-label="Default select example" id="Responsavel" name="Responsavel" required>
                                                        <option selected disabled>Selecione</option>
                                                        {vendedor.map((item,index) => (
                                                           <option key={item.CODIGO} value={item.usuario_PARAMetro}>{item.usuario_PARAMetro}</option>    
                                                        ))}
                                                        
                                                    </select> 
                                                    <label htmlFor="Responsavel"
                                                        className="absolute top-1 left-3 text-gray-500" 
                                                    >Responsável</label>  
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 m-1">
                                            <div className="relative flex w-full rounded-lg shadow-sm">
                                                <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                text-sm disabled:pointer-events-none">
                                                    <select className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 rounded-lg 
                                                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                            aria-label="Default select example" id="Operador" name="OPERADOR" required disabled>
                                                        <option selected value={usuarioLogado.usuario_PARAMetro}>{usuarioLogado.usuario_PARAMetro}</option>
                                                    </select> 
                                                    <label htmlFor="Operador"
                                                        className="absolute top-1 left-3 text-gray-500"
                                                    >Angedado Por:</label>  
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-6 m-1">
                                            <div className="relative flex w-full rounded-lg shadow-sm">
                                                <div  className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                text-sm disabled:pointer-events-none">
                                                    <input type="text" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 rounded-lg 
                                                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                            id="floatingContato" name="CONTATO" required/>
                                                    <label htmlFor="floatingContato"
                                                        className="absolute top-1 left-3 text-gray-500"
                                                    >Contato</label>  
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-6 m-1">
                                            <div className="relative flex w-full rounded-lg shadow-sm">
                                                <div  className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                text-sm disabled:pointer-events-none">
                                                    <input type="text" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 rounded-lg 
                                                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            id="floatingAssunto" name="ASSUNTO" required/>
                                                    <label htmlFor="floatingAssunto"
                                                        className="absolute top-1 left-3 text-gray-500"
                                                    >Assunto</label>  
                                                </div>
                                            </div>    
                                        </div>
                                        <div className="col-span-4 m-1">
                                            <div className="relative flex w-full rounded-lg shadow-sm">
                                                <div  className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                text-sm disabled:pointer-events-none">
                                                    <input type="date" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 rounded-lg 
                                                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                            id="floatingDtRegistro" name="DATA_GRAVACAO" required/>
                                                    <label htmlFor="floatingDtRegistro"
                                                        className="absolute top-1 left-3 text-gray-500" 
                                                    >Data Registro</label>  
                                                </div>
                                            </div>    
                                        </div>
                                        <div className="col-span-4 m-1">
                                            <div className="relative flex w-full rounded-lg shadow-sm">
                                                <div  className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                text-sm disabled:pointer-events-none">
                                                    <input type="date" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 rounded-lg 
                                                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                            id="floatingDtAgenda" name="DATA_AGENDA" required/>
                                                    <label htmlFor="floatingDtAgenda"
                                                        className="absolute top-1 left-3 text-gray-500" 
                                                    >Data Agenda</label>  
                                                </div>
                                            </div>    
                                        </div>
                                        <div className="col-span-4 m-1">
                                            <div className="relative flex w-full rounded-lg shadow-sm">
                                                <div  className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                text-sm disabled:pointer-events-none">
                                                    <input type="time" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 rounded-lg 
                                                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                            id="floatingHrAgenda" name="HORA_AGENDA" required/>
                                                    <label htmlFor="floatingHrAgenda"
                                                        className="absolute top-1 left-3 text-gray-500" 
                                                    >Hora Agenda</label>  
                                                </div>
                                            </div>    
                                        </div>
                                        <div className="col-span-4 m-1">
                                            <div className="relative flex w-full rounded-lg shadow-sm">
                                                <div  className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                text-sm disabled:pointer-events-none">
                                                    <select className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 rounded-lg 
                                                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            id="floatingSituacao" name="SITUACAO" required>
                                                        <option selected disabled>Selecione</option>
                                                        <option value=""></option>
                                                    </select>
                                                    <label htmlFor="floatingSituacao"
                                                        className="absolute top-1 left-3 text-gray-500" 
                                                    >Situacao</label>  
                                                </div>
                                            </div>
                                        </div>    
                                        <div className="col-span-4 m-1">
                                            <div className="relative flex w-full rounded-lg shadow-sm">
                                                <div  className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                text-sm disabled:pointer-events-none">
                                                    <select className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 rounded-lg 
                                                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            id="Tipo" name="TIPO" required>
                                                        <option selected disabled>Selecione</option>
                                                        <option value="AGENDAMENTO 1H">AGENDAMENTO 1H</option>
                                                        <option value="AGENDAMENTO 1H:30m">AGENDAMENTO 1H:30m</option>
                                                        <option value="AGENDAMENTO 2H">AGENDAMENTO 2H</option>
                                                    </select> 
                                                <label htmlFor="Tipo"
                                                    className="absolute top-1 left-3 text-gray-500"  
                                                >Tipo</label>  
                                                </div>
                                            </div>
                                        </div>    
                                        <div className="col-span-4 m-1">
                                            <div className="relative flex w-full rounded-lg shadow-sm">
                                                <div  className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                text-sm disabled:pointer-events-none">
                                                    <input type="text" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 rounded-lg 
                                                                    shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                                            id="Telefone" name="TELEFONE1" required/>
                                                    <label htmlFor="Telefone"
                                                        className="absolute top-1 left-3 text-gray-500"  
                                                    >Telefone</label>  
                                                </div>
                                            </div>
                                        </div>    
                                        <div className="col-span-12 m-1">
                                            <div className="relative flex w-full h-full rounded-lg shadow-sm">
                                                <textarea className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 rounded-l-lg 
                                                                        shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-40" 
                                                        id="floatingDetalhes" name="HISTORICO" ></textarea>
                                                <label htmlFor="floatingDetalhes"
                                                    className="absolute top-1 left-3 text-gray-500"  
                                                >Detalhes do Registro</label>
                                            </div>
                                        </div>    
                                        <div className="col-span-12 m-1">
                                            <div className="relative flex w-full h-full rounded-lg shadow-sm justify-end">
                                                <button type="button" onClick={() => setAbreNovaAgenda(false)} 
                                                            className="bg-gray-300 text-black rounded px-4 py-2 mx-1"
                                                >Cancelar</button>
                                                <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 mx-1">Salvar</button>
                                            </div>
                                        </div>    
                                    </form>
                                </div>
                            </div>
                        )}
                         {mostraDetalhes && selecionaCodigo && (
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg w-full max-w-md divide-y divide-black dark:divide-gray-100">
                                    <div className='flex justify-between text-blue-700 mb-4'>
                                        <h1 className="text-lg font-bold">Detalhes da Agenda</h1>
                                        <button type="button" onClick={() => setMostraDetalhes(false)} className="text-black dark:text-gray-100"><MdOutlineClose/></button>   
                                    </div>
                                    <div className='mb-2'>
                                        <dl className="grid grid-cols-2 p-2">
                                            <dt className="col-start-1"><strong>Código do Cliente:</strong></dt> 
                                            <dd className="col-start-2"><span id="RegistroCodCli">{selecionaCodigo.CLIENTE}</span></dd>  
                                            <dt className="col-start-1"><strong>Nome/Razão:</strong></dt>
                                            <dd className="col-start-2"><span id="RegistroNameCli">{selecionaCodigo.NOMEFANTASIA}</span></dd>
                                            <dt className="col-start-1"><strong>CPF/CNPJ:</strong></dt>
                                            <dd className="col-start-2"><span id="RegistroDocCli">{selecionaCodigo.CNPJ?selecionaCodigo.CNPJ:selecionaCodigo.CPF}</span></dd>
                                            <br></br>
                                            <dt className="col-start-1"><strong>Atendimento Nº:</strong></dt>
                                            <dd className="col-start-2"><span id="codigoRegistro">{selecionaCodigo.CODIGO}</span></dd>
                                            <dt className="col-start-1"><strong>Detalhes:</strong></dt>
                                            <dd className="col-start-2"><span id="detalhesRegistro"></span>{selecionaCodigo.HISTORICO}</dd><br></br>
                                        </dl>
                                    </div>
                                    <div className='flex justify-end p-2'>
                                        <button type="button" onClick={() => setMostraDetalhes(false)} className="bg-gray-300 text-black rounded px-4 py-1">Fechar</button>   
                                    </div>
                                </div>
                            </div>
                        )}
                        {alteraAgenda && selecionaCodigo && (
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg w-full max-w-md divide-y divide-black dark:divide-gray-100">
                                    <div className='flex justify-between text-blue-700 mb-4'>
                                        <h1 className="text-lg font-bold">Altera a Agenda</h1>
                                        <button type="button" onClick={() => setAlteraAgenda(false)} className="text-black dark:text-gray-100"><MdOutlineClose/></button>   
                                    </div>
                                    <div className='mb-2'>
                                        <dl className="grid grid-cols-2 p-2">
                                            <dt className="col-start-1"><strong>Código do Cliente:</strong></dt> 
                                            <dd className="col-start-2"><span id="RegistroCodCli">{selecionaCodigo.CLIENTE}</span></dd>  
                                            <dt className="col-start-1"><strong>Nome/Razão:</strong></dt>
                                            <dd className="col-start-2"><span id="RegistroNameCli">{selecionaCodigo.NOMEFANTASIA}</span></dd>
                                            <dt className="col-start-1"><strong>CPF/CNPJ:</strong></dt>
                                            <dd className="col-start-2"><span id="RegistroDocCli">{selecionaCodigo.CNPJ?selecionaCodigo.CNPJ:selecionaCodigo.CPF}</span></dd>
                                            <br></br>
                                            <dt className="col-start-1"><strong>Atendimento Nº:</strong></dt>
                                            <dd className="col-start-2"><span id="codigoRegistro">{selecionaCodigo.CODIGO}</span></dd>
                                            <dt className="col-start-1"><strong>Detalhes:</strong></dt>
                                            <dd className="col-start-2"><span id="detalhesRegistro"></span>{selecionaCodigo.HISTORICO}</dd><br></br>
                                        </dl>
                                    </div>
                                    <div className='flex justify-end p-2'>
                                        <button type="button" onClick={() => setAlteraAgenda(false)} className="bg-gray-300 text-black rounded px-4 py-1">Fechar</button>   
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Modal de Deletar */}
                        {deletaAgenda && selecionaCodigo && (
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                                <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
                                    <h2 className="text-lg font-semibold">Confirmar Exclusão</h2>
                                    <p>Você tem certeza que deseja excluir o item com código {selecionaCodigo.CODIGO}?</p>
                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button onClick={handleDeleta} className="bg-red-500 text-white rounded px-4 py-2">Excluir</button>
                                        <button onClick={() => setDeletaAgenda(false)} className="bg-gray-300 text-black rounded px-4 py-2">Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    );

}export default Agenda;