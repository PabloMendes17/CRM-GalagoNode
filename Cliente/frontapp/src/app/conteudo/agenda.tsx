import LoadingSpinner from '../components/CarregandoSpinner';
import { TbFilterSearch } from "react-icons/tb";
import { CiSquareChevDown, CiSquareChevUp } from "react-icons/ci";
import { BsCalendar2Plus } from "react-icons/bs";
import { AiOutlineFolderView } from "react-icons/ai";
import { MdEdit, MdDeleteForever, MdOutlineClose } from "react-icons/md";
import { useState, useEffect } from "react";
import InputDocumento from '../components/InputDocumento';
import CheckboxComponente from '../components/CheckboxComponente';
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
    RESPONSAVEL: string;
    NOME: string;
    NOMEFANTASIA: string;
    CNPJ: string;
    CPF: string;
}
interface ClienteItem {
    CODIGO: number;
    NOME: string;
    NOMEFANTASIA: string;
    CNPJ: string;
    CPF: string;
    DESATIVADO: Boolean;
}
interface SiatuacaoAgendaItem {
    CODIGO: number;
    DESCRICAO: string;
}
interface TagAtendimentoItem {
    CODIGO: number;
    TAG: string;
}
interface VendedorItem {
    CODIGO: number;
    NOME: string;
    EMAIL: string;
    usuario_PARAMetro: string;
}

function Agenda() {

    const [mensagemServidor, setMensagemServidor] = useState('');
    const [agenda, setAgenda] = useState<AgendaItem[] | null>(null);
    const [cliente, setCliente] = useState<ClienteItem[]>([]);
    const [paginaAtualNaBuscaCliente, setPaginaAtualNaBuscaCliente] = useState(1);
    const [quantidadeDeClientesNaPaginaBuscaCliente, setQuantidadeDeClientesNaPaginaBuscaCliente] = useState(10);
    const [totalClientes, setTotalClientes] = useState(0);
    const [limiteDePaginasNaNavegacaoDaBuscaCliente, setLimiteDePaginasNaNavegacaoDaBuscaCliente] = useState(1);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [situacaoAgenda, setSituacaoAgenda] = useState<SiatuacaoAgendaItem[]>([]);
    const [tagAtendimento, setTagAtendimento] = useState<TagAtendimentoItem[] | null>(null);
    const [vendedor, setVendedor] = useState<VendedorItem[]>([]);
    const [usuarioLogado, setUsuarioLogado] = useState<{ NOME: string, usuario_PARAMetro: string }>({ NOME: '', usuario_PARAMetro: '' });

    const [isFiltroVisible, setIsFiltroVisible] = useState<boolean>(false);
    const [filtroDtInicial, setFiltroDtInicial] = useState('');
    const [filtroDtFinal, setFiltroDtFinal] = useState('');
    const [filtroSituacaoAgenda, setFiltroSituacaoAgenda] = useState('');
    const [filtroCodCliAgenda, setFiltroCodCliAgenda] = useState('');
    const [filtroNomeRazao, setFiltroNomeRazao] = useState('');
    const [filtroDocumento, setFiltroDocumento] = useState('');
    const [abreNovaAgenda, setAbreNovaAgenda] = useState<boolean>(false);
    const [abreBuscaCliente, setAbreBuscaCliente] = useState<boolean>(false);
    const [documento, setDocumento] = useState<string>(' ');
    const [clientesAtivos, setClientesAtivos] = useState<boolean>(true);
    const [selecionaCodigo, setSelecionaCodigo] = useState<AgendaItem | null>(null);
    const [selecionaCliente, setSelecionaCliente] = useState(null);
    const [mostraDetalhes, setMostraDetalhes] = useState<boolean>(false);
    const [alteraAgenda, setAlteraAgenda] = useState<boolean>(false);
    const [deletaAgenda, setDeletaAgenda] = useState<boolean>(false);

    const quantidadeDePaginasNaNavegacaoDaBuscaCliente = 3
    const paginaInicialNaBuscaClientes = Math.max(1, Math.min(paginaAtualNaBuscaCliente - Math.floor(quantidadeDePaginasNaNavegacaoDaBuscaCliente / 2),
        limiteDePaginasNaNavegacaoDaBuscaCliente - quantidadeDePaginasNaNavegacaoDaBuscaCliente + 1));
    const paginaFinalNaBuscaClientes = Math.min(limiteDePaginasNaNavegacaoDaBuscaCliente,
        paginaInicialNaBuscaClientes + quantidadeDePaginasNaNavegacaoDaBuscaCliente - 1);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const [agendaRes, clientesRes, situacaoAgendaRes, tagAtendimentoRes, vendedoresRes] = await Promise.all([
                    makeRequest.get("agendamentos/agendahoje"),
                    makeRequest.get(`agendamentos/clientes?pagina=${paginaAtualNaBuscaCliente}&resultadoPorPagina=${quantidadeDeClientesNaPaginaBuscaCliente}`),
                    makeRequest.get("agendamentos/situacaoagenda"),
                    makeRequest.get("agendamentos/tagatendimentos"),
                    makeRequest.get("agendamentos/vendedores")
                ]);

                setAgenda(agendaRes.data.agendahoje || []);
                setCliente(clientesRes.data.clientes || []);
                setTotalClientes(clientesRes.data.total || 0);
                setSituacaoAgenda(situacaoAgendaRes.data.situacaoAgenda || []);
                setTagAtendimento(tagAtendimentoRes.data.tagAtendimento || []);
                setVendedor(vendedoresRes.data.Operadores || []);

            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        if (totalClientes > 10) {

            const totalPages = Math.ceil(totalClientes / quantidadeDeClientesNaPaginaBuscaCliente);
            setLimiteDePaginasNaNavegacaoDaBuscaCliente(totalPages);

        } else {
            setLimiteDePaginasNaNavegacaoDaBuscaCliente(1);
        };

        let atualUser = localStorage.getItem("CrmGalago:usuarioLogado");
        if (atualUser) {
            setUsuarioLogado(JSON.parse(atualUser));
        };

        fetchData();
    }, [paginaAtualNaBuscaCliente, quantidadeDeClientesNaPaginaBuscaCliente, totalClientes]);


    function formatDateToBR(dateString: string): string {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        return date.toLocaleDateString('pt-BR', options);
    }
    const handleFechaNovaAgenda = () => {

        setAbreNovaAgenda(false);
    };
    const handleAbreNovaAgenda = () => {

        setAbreNovaAgenda(true);
        setIsFiltroVisible(false);
    };
    const handleBuscaCliente = () => {

        setAbreBuscaCliente(false);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocumento(e.target.value);
        setFiltroDocumento(e.target.value);
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
    const handlePaginaAnterior = () => {
        setPaginaAtualNaBuscaCliente(prevPage => Math.max(prevPage - quantidadeDePaginasNaNavegacaoDaBuscaCliente, 1));
    };

    const handleProximaPagina = () => {
        setPaginaAtualNaBuscaCliente(prevPage => Math.min(prevPage + quantidadeDePaginasNaNavegacaoDaBuscaCliente, limiteDePaginasNaNavegacaoDaBuscaCliente));
    };

    const handlePageNumberClick = (pageNumber) => {
        setPaginaAtualNaBuscaCliente(pageNumber);
    };
    const handleClienteSelecionado = (cliente) => {
        setClienteSelecionado(cliente);
        setAbreBuscaCliente(false);

        if (isFiltroVisible) {
            document.getElementById('filtroCodCliAgenda').value = cliente.CODIGO;
        } else {
            document.getElementById('inputCodClienteAG').value = cliente.CODIGO;
            document.getElementById('inputNomeClienteAG').value = cliente.NOME;
        }
    };

    const handleFiltrarAgenda = async () => {

        setMensagemServidor('');
        setAgenda([]);
        try {
            const response = await makeRequest.get("/agendamentos/agendafiltrada", {
                params: {
                    CODCLI: filtroCodCliAgenda,
                    DATAINICIAL: filtroDtInicial,
                    DATAFINAL: filtroDtFinal,
                    SITUACAOAGENDA: filtroSituacaoAgenda,
                },
            });
            if (response.data.msg) {

                setMensagemServidor(response.data.msg);
            }
            setAgenda(response.data.agendafiltrada);
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
        }
    };

    const handleAtivo = (checked) =>{

        setClientesAtivos(checked);
    }

    const handleFiltrarClientes = async () => {
        setMensagemServidor('');
        try {
            const response = await makeRequest.get("/agendamentos/clientefiltrado", {
                params: {
                    NOME_RAZAO: filtroNomeRazao,
                    CNPJ_CPF: filtroDocumento,
                    ATIVO:!clientesAtivos,
                },
            });
            if (response.data.msg) {

                setMensagemServidor(response.data.msg);
            }
            setCliente(response.data.clientes || []);
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            {agenda === null ? (
                <LoadingSpinner />
            ) : (
                <>
                    <div className="sticky top-0 z-20 font-medium text-sm text-white bg-blue-950 dark:bg-gray-900">
                        <div className="flex justify-between mb-4">
                            <span className="flex items-center px-0.5">
                                <p className="px-0.5"><TbFilterSearch /></p>
                                <p className="px-0.5">Filtros</p>
                                <button className="text-lg" onClick={() => setIsFiltroVisible(!isFiltroVisible)}>
                                    {isFiltroVisible ? <CiSquareChevUp /> : <CiSquareChevDown />}
                                </button>
                            </span>
                            <span className="flex items-center px-0.5">
                                <p className="px-2">Nova Agenda</p>
                                <button className="" onClick={handleAbreNovaAgenda}>
                                    <BsCalendar2Plus />
                                </button>
                            </span>
                        </div>
                        <div className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isFiltroVisible ? 'max-h-screen' : 'max-h-0'}`}>
                            <div className="h-full flex flex-wrap items-center md:space-x-2 p-4 text-black bg-gray-100 dark:bg-gray-800">
                                <div className='w-full md:max-w-min'>
                                    <p className='dark:text-white'>De:</p>
                                    <input type="date" id="filtroDtInicial" name="filtroDtInicial" placeholder="Date"
                                        className="w-full md:max-w-min border border-gray-300 shadow-sm 
                                                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                            rounded p-1"
                                        onChange={(e) => setFiltroDtInicial(e.target.value)} />
                                </div>
                                <div className='w-full md:max-w-min'>
                                    <p className='dark:text-white'>Até:</p>
                                    <input type="date" id="filtroDtFinal" name="filtroDtFinal" placeholder="Date"
                                        className="w-full md:max-w-min border border-gray-300 shadow-sm 
                                                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                            rounded p-1"
                                        onChange={(e) => setFiltroDtFinal(e.target.value)} />
                                </div>
                                <div className='w-full md:max-w-max'>
                                    <p className='dark:text-white'>Situação</p>
                                    <input type="text" id="filtroSituacaoAgenda" name="filtroSituacaoAgenda" placeholder="Situação"
                                        className="w-full border border-gray-300 shadow-sm 
                                                            focus:outline-none focus:ring-2 focus:ring-blue-500
                                                            rounded p-1"
                                        onChange={(e) => setFiltroSituacaoAgenda(e.target.value)} />
                                </div>
                                <div className='w-full md:max-w-max'>
                                    <p className='dark:text-white'>Cod. CLiente</p>
                                    <div className='flex w-full md:max-w-max'>
                                        <div className="w-[85%] md:w-[50%] m-0">
                                            <input type="text" id="filtroCodCliAgenda" name="filtroCodCliAgenda" placeholder="99999"
                                                className="w-full h-full border border-gray-300 shadow-sm focus:outline-none
                                                                    focus:ring-2 focus:ring-blue-500 rounded-l p-1"
                                                onChange={(e) => setFiltroCodCliAgenda(e.target.value)} />
                                        </div>
                                        <div className='w-[10%] md:w-[40%] text-white m-0'>
                                            <button type="button" id="btBuscaCliente" name="btBuscaCliente"
                                                className=' border border-gray-300 shadow-sm border-transparent 
                                                                    bg-blue-600 focus:ring-2 focus:ring-blue-500 rounded-e p-1'
                                                onClick={() => setAbreBuscaCliente(true)}>
                                                Buscar</button>
                                        </div>
                                    </div>
                                </div>
                                <button className="self-end bg-blue-500 text-white rounded px-3 py-1"
                                    onClick={handleFiltrarAgenda}>
                                    Aplicar Filtros
                                </button>
                            </div>
                        </div>
                    </div>
                    {agenda.length > 0 ? (
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
                                <tbody className="dark:text-gray-100">
                                    {agenda.map((item, index) => (
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
                                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg h-screen overflow-auto scrollbar-custom 
                                                            md:h-auto md:overflow-visible md:scrollbar-none md:w-[80%]">
                                        <div className='flex justify-between text-blue-700 mb-4'>
                                            <h2 className="text-lg text-blue-700 font-bold">Nova Agenda</h2>
                                        </div>
                                        <form onSubmit={handleFechaNovaAgenda} className="md:grid md:grid-cols-12 items-center">
                                            <div className="col-span-2 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="number" id="inputCodClienteAG" name="inputCodClienteAG"
                                                            className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                dark:bg-slate-800"
                                                            defaultValue='999999' required />
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
                                                        id="btBuscaAgenda" onClick={() => setAbreBuscaCliente(true)}>
                                                        Busca</button>
                                                </div>
                                            </div>
                                            <div className="col-span-6 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="text" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                            dark:bg-slate-800"
                                                            id="inputNomeClienteAG" name="inputNomeClienteAG" placeholder="Nome/Razão Social" defaultValue='Ainda Não Cadastrado' disabled />
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
                                                        <select className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                dark:bg-slate-800"
                                                            aria-label="Default select example" id="Responsavel" name="Responsavel" required>
                                                            <option selected disabled>Selecione</option>
                                                            {vendedor.map((item, index) => (
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
                                                        <select className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                dark:bg-slate-800"
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
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="text" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                            dark:bg-slate-800"
                                                            id="floatingContato" name="CONTATO" required />
                                                        <label htmlFor="floatingContato"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Contato</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-6 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="text" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                            dark:bg-slate-800"
                                                            id="floatingAssunto" name="ASSUNTO" required />
                                                        <label htmlFor="floatingAssunto"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Assunto</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-4 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="date" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                                                                            dark:bg-slate-800"
                                                            id="floatingDtRegistro" name="DATA_GRAVACAO" required />
                                                        <label htmlFor="floatingDtRegistro"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Data Registro</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-4 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="date" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                                                                            dark:bg-slate-800"
                                                            id="floatingDtAgenda" name="DATA_AGENDA" required />
                                                        <label htmlFor="floatingDtAgenda"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Data Agenda</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-4 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="time" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                                                                            dark:bg-slate-800"
                                                            id="floatingHrAgenda" name="HORA_AGENDA" required />
                                                        <label htmlFor="floatingHrAgenda"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Hora Agenda</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-4 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <select className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                                                                dark:bg-slate-800"
                                                            id="floatingSituacao" name="SITUACAO" required>
                                                            <option selected disabled>Selecione</option>
                                                            {situacaoAgenda.map((item, index) => (
                                                                <option key={item.CODIGO} value={item.DESCRICAO}>{item.DESCRICAO}</option>
                                                            ))}
                                                        </select>
                                                        <label htmlFor="floatingSituacao"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Situacao</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-4 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <select className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                                                                dark:bg-slate-800"
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
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="text" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                                                                            dark:bg-slate-800"
                                                            id="Telefone" name="TELEFONE1" required />
                                                        <label htmlFor="Telefone"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Telefone</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-12 m-1">
                                                <div className="relative flex w-full h-full rounded-lg shadow-sm">
                                                    <textarea className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                h-40 md:h-52 dark:bg-slate-800"
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
                            {abreBuscaCliente && (
                                <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50'>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg w-full max-w-2xl divide-y divide-black dark:divide-gray-100">
                                        <div className='flex justify-between text-blue-700 mb-4'>
                                            <h1 className="text-lg font-bold">Selecionar ou Buscar</h1>
                                            <button type="button" onClick={() => setAbreBuscaCliente(false)} className="text-black dark:text-gray-100"><MdOutlineClose /></button>
                                        </div>
                                        <div className='w-full mb-4'>
                                            <div className='flex-wrap mb-4'>
                                                <div className='flex flex-wrap'>
                                                    <div className='p-1'>
                                                        <p>CNPJ ou CPF</p>
                                                        <InputDocumento
                                                            value={documento}
                                                            onChange={handleChange}
                                                            placeholder="CNPJ/CPF"
                                                            className="border rounded p-1"
                                                        />
                                                    </div>
                                                    <div className='p-1'>
                                                        <p>NOME ou NOME FANTASIA</p>
                                                        <input type="text" id="filtroNomeRazao" name='filtroNomeRazao'
                                                            placeholder="Nome/NomeFantasia" className="border rounded p-1"
                                                            onChange={(e) => setFiltroNomeRazao(e.target.value)} />
                                                    </div>
                                                    <CheckboxComponente checked={clientesAtivos} onChange={handleAtivo} />
                                                    <button className="ms-3 self-end bg-blue-500 text-white rounded px-3 py-1"
                                                        onClick={handleFiltrarClientes}>
                                                        Buscar
                                                    </button>
                                                </div>
                                                <div className='w-full divide-y divide-gray-500 text-center text-sm'>
                                                    <table className='w-full'>
                                                        <thead className="text-white bg-blue-950 dark:bg-gray-900">
                                                            <tr>
                                                                <th className="">CODIGO</th>
                                                                <th className="">NOME/RAZAO</th>
                                                                <th className="">DOCUMENTO</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {cliente.map((item, index) => (
                                                                <tr key={item.CODIGO} onClick={() => handleClienteSelecionado(item)}>
                                                                    <td>{item.CODIGO}</td>
                                                                    <td>{item.NOME}</td>
                                                                    <td>{item.CNPJ ? item.CNPJ : item.CPF}</td>
                                                                </tr>
                                                            ))}
                                                            {mensagemServidor?(
                                                                <tr>
                                                                    <td></td>
                                                                    <td>{mensagemServidor}</td>
                                                                    <td></td>
                                                                </tr>
                                                                ):('')
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <nav className="flex justify-center items-center -space-x-px" aria-label="Pagination">
                                            <button
                                                type="button"
                                                className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex 
                                                        justify-center items-center gap-x-1.5 text-sm first:rounded-s-lg 
                                                        last:rounded-e-lg border border-gray-200 text-gray-800 
                                                        hover:bg-gray-100 focus:outline-none focus:bg-gray-100 
                                                        disabled:opacity-50 disabled:pointer-events-none 
                                                        dark:border-neutral-700 dark:text-white 
                                                        dark:hover:bg-white/10 dark:focus:bg-white/10"
                                                onClick={handlePaginaAnterior}
                                                aria-label="Previous"
                                            >
                                                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="m15 18-6-6 6-6"></path>
                                                </svg>
                                                <span className="sr-only">Anterior</span>
                                            </button>
                                            {Array.from({ length: Math.min(limiteDePaginasNaNavegacaoDaBuscaCliente, quantidadeDePaginasNaNavegacaoDaBuscaCliente) }, (_, i) => {
                                                const pageNumber = paginaInicialNaBuscaClientes + i;
                                                const isActive = pageNumber === paginaAtualNaBuscaCliente;
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        type="button"
                                                        className={`min-h-[38px] min-w-[38px] flex justify-center items-center border text-gray-800 py-2 px-3 text-sm first:rounded-s-lg last:rounded-e-lg 
                                                                focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none 
                                                                dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10
                                                                ${isActive ? 'bg-blue-300 border-gray-300' : 'border-gray-200 hover:bg-gray-100'}`}
                                                        onClick={() => handlePageNumberClick(pageNumber)}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            })}
                                            <button
                                                type="button"
                                                className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex 
                                                        justify-center items-center gap-x-1.5 text-sm first:rounded-s-lg 
                                                        last:rounded-e-lg border border-gray-200 text-gray-800 
                                                        hover:bg-gray-100 focus:outline-none focus:bg-gray-100 
                                                        disabled:opacity-50 disabled:pointer-events-none 
                                                        dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 
                                                        dark:focus:bg-white/10"
                                                aria-label="Next"
                                                onClick={handleProximaPagina}
                                            >
                                                <span className="sr-only">Próximo</span>
                                                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="m9 18 6-6-6-6"></path>
                                                </svg>
                                            </button>
                                        </nav>
                                        <div className='flex justify-end p-2'>
                                            <button type="button" onClick={() => setAbreBuscaCliente(false)} className="bg-gray-300 text-black rounded px-4 py-1">Fechar</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {mostraDetalhes && selecionaCodigo && (
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg w-full max-w-md divide-y divide-black dark:divide-gray-100">
                                        <div className='flex justify-between text-blue-700 mb-4'>
                                            <h1 className="text-lg font-bold">Detalhes da Agenda</h1>
                                            <button type="button" onClick={() => setMostraDetalhes(false)} className="text-black dark:text-gray-100"><MdOutlineClose /></button>
                                        </div>
                                        <div className='mb-2'>
                                            <dl className="grid grid-cols-2 p-2">
                                                <dt className="col-start-1"><strong>Código do Cliente:</strong></dt>
                                                <dd className="col-start-2"><span id="RegistroCodCli">{selecionaCodigo.CLIENTE}</span></dd>
                                                <dt className="col-start-1"><strong>Nome/Razão:</strong></dt>
                                                <dd className="col-start-2"><span id="RegistroNameCli">{selecionaCodigo.NOMEFANTASIA}</span></dd>
                                                <dt className="col-start-1"><strong>CPF/CNPJ:</strong></dt>
                                                <dd className="col-start-2"><span id="RegistroDocCli">{selecionaCodigo.CNPJ ? selecionaCodigo.CNPJ : selecionaCodigo.CPF}</span></dd>
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
                                            <button type="button" onClick={() => setAlteraAgenda(false)} className="text-black dark:text-gray-100"><MdOutlineClose /></button>
                                        </div>
                                        <div className='mb-2'>
                                            <dl className="grid grid-cols-2 p-2">
                                                <dt className="col-start-1"><strong>Código do Cliente:</strong></dt>
                                                <dd className="col-start-2"><span id="RegistroCodCli">{selecionaCodigo.CLIENTE}</span></dd>
                                                <dt className="col-start-1"><strong>Nome/Razão:</strong></dt>
                                                <dd className="col-start-2"><span id="RegistroNameCli">{selecionaCodigo.NOMEFANTASIA}</span></dd>
                                                <dt className="col-start-1"><strong>CPF/CNPJ:</strong></dt>
                                                <dd className="col-start-2"><span id="RegistroDocCli">{selecionaCodigo.CNPJ ? selecionaCodigo.CNPJ : selecionaCodigo.CPF}</span></dd>
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
                            {deletaAgenda && selecionaCodigo && (
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                                    <div className="bg-white dark:bg-slate-800  p-4 rounded-lg shadow-lg w-full max-w-md">
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
                        <>
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
                            <tbody className="dark:text-gray-100">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Não há registros para os parâmetros fornecidos.</td>
                                <td><p>{mensagemServidor}</p></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td> 
                            </tbody>    
                        </table>
                    </>
                    )}
                </>
            )}
        </div>
    );

} export default Agenda;