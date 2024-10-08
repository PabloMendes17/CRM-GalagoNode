import LoadingSpinner from '../components/CarregandoSpinner';
import { TbFilterSearch } from "react-icons/tb";
import { CiSquareChevDown, CiSquareChevUp } from "react-icons/ci";
import { BsCalendar2Plus } from "react-icons/bs";
import { AiOutlineFolderView } from "react-icons/ai";
import { MdEdit, MdDeleteForever, MdOutlineClose } from "react-icons/md";
import { useState, useEffect } from "react";
import InputDocumento from '../components/InputDocumento';
import InputFone from '../components/InputFone';
import CheckboxComponente from '../components/CheckboxComponente';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { makeRequest } from "../../../axios";
import { BiBody } from 'react-icons/bi';


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
    classDaSituacao?: string;
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


function Atendimento(){
    
    const datahoje = new Date().toISOString().split('T')[0];
    const [mensagemServidor, setMensagemServidor] = useState('');
    const [atendimento, setAtemdimento] = useState<AgendaItem[] | null>(null);
    const [cliente, setCliente] = useState<ClienteItem[]>([]);
    const [paginaAtualNaBuscaCliente, setPaginaAtualNaBuscaCliente] = useState(1);
    const [quantidadeDeClientesNaPaginaBuscaCliente, setQuantidadeDeClientesNaPaginaBuscaCliente] = useState(10);
    const [totalClientes, setTotalClientes] = useState(0);
    const [limiteDePaginasNaNavegacaoDaBuscaCliente, setLimiteDePaginasNaNavegacaoDaBuscaCliente] = useState(1);
    const [clienteSelecionado, setClienteSelecionado] = useState<ClienteItem | null>(null);
    const [situacaoAgenda, setSituacaoAgenda] = useState<SiatuacaoAgendaItem[]>([]);
    const [tagAtendimento, setTagAtendimento] = useState<TagAtendimentoItem[]>([]);
    const [vendedor, setVendedor] = useState<VendedorItem[]>([]);
    const [usuarioLogado, setUsuarioLogado] = useState<{ NOME: string, usuario_PARAMetro: string }>({ NOME: '', usuario_PARAMetro: '' });

    const [isFiltroVisible, setIsFiltroVisible] = useState<boolean>(false);
    const [filtroDtInicial, setFiltroDtInicial] = useState('');
    const [filtroDtFinal, setFiltroDtFinal] = useState('');
    const [filtroSituacaoAtendimento, setfiltroSituacaoAtendimento] = useState('');
    const [filtroCodCliAtendimento, setfiltroCodCliAtendimento] = useState('');
    const [filtroNomeRazao, setFiltroNomeRazao] = useState('');
    const [filtroDocumento, setFiltroDocumento] = useState('');
    const [abreNovoAtendimento, setabreNovoAtendimento] = useState<boolean>(false);
    const [abreBuscaCliente, setAbreBuscaCliente] = useState<boolean>(false);
    const [documento, setDocumento] = useState<string>(' ');
    const [telefone1, setTelefone1] = useState('');
    const [clientesAtivos, setClientesAtivos] = useState<boolean>(true);
    const [selecionaCodigo, setSelecionaCodigo] = useState<AgendaItem | null>(null);
    const [selecionaCliente, setSelecionaCliente] = useState(null);
    const [mostraDetalhes, setMostraDetalhes] = useState<boolean>(false);
    const [alteraAtendimento, setalteraAtendimento] = useState<boolean>(false);
    const [deletaAtendimento, setdeletaAtendimento] = useState<boolean>(false);

    const [errorsForm, setErrorsForm] = useState({
        codCli: false,
        nomeCli: false,
        responsavelAT: false,
        situacaoAgenda: false,
        tagAtendimentoAT: false,
        TELEFONE1:false,
        HISTORICOAT: false,
    });

    const [errorsFormUp, setErrorsFormUp] = useState({

        codigoAtendimentoAT:false,
        contatoAtualizaAT: false,
        assuntoAtualizaAT: false,
        responsavelAtualizaAT: false,
        situacaoAtualizaAtendimento: false,
        atualizaTELEFONE1: false,
        atualizaHISTORICOAT: false,
        
    });
    
    const quantidadeDePaginasNaNavegacaoDaBuscaCliente = 3
    const paginaInicialNaBuscaClientes = Math.max(1, Math.min(paginaAtualNaBuscaCliente - Math.floor(quantidadeDePaginasNaNavegacaoDaBuscaCliente / 2),
        limiteDePaginasNaNavegacaoDaBuscaCliente - quantidadeDePaginasNaNavegacaoDaBuscaCliente + 1));
    const paginaFinalNaBuscaClientes = Math.min(limiteDePaginasNaNavegacaoDaBuscaCliente,
        paginaInicialNaBuscaClientes + quantidadeDePaginasNaNavegacaoDaBuscaCliente - 1);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const [atendimentosRes, clientesRes, situacaoAgendaRes, tagAtendimentoRes, vendedoresRes] = await Promise.all([
                    makeRequest.get(`atendimentos/atendimentoshoje?datahoje=${datahoje}`),
                    makeRequest.get(`atendimentos/clientes?pagina=${paginaAtualNaBuscaCliente}&resultadoPorPagina=${quantidadeDeClientesNaPaginaBuscaCliente}`),
                    makeRequest.get("atendimentos/situacaoagenda"),
                    makeRequest.get("atendimentos/tagatendimentos"),
                    makeRequest.get("atendimentos/vendedores")
                ]);

                setAtemdimento(atendimentosRes.data.atendimentoshoje || []);
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

    useEffect(() => {

        const webSocketEndereco =process.env.NEXT_PUBLIC_WEBSOCKET_URL;

        if(!webSocketEndereco){
            throw new Error('Endereço WebSocket Inválido');
        }
        const ws = new WebSocket(webSocketEndereco);

        ws.onopen = () => {
            console.log('Conectado ao servidor WebSocket');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.event === "updateAtendimento") {
                verificarAtualizacao();

            }

            if(data.event === "deleta"){
                verificarAtualizacao();
            }
        }           
        ws.onclose = () => {
            console.log('Conexão fechada');
        };

        return () => {
            ws.close(); 
        };
    }, [filtroCodCliAtendimento, filtroDtInicial, filtroDtFinal, filtroSituacaoAtendimento]);

    useEffect(() => {
        const interval = setInterval(() => {
            setAtemdimento(prevAgenda => 
                prevAgenda ? prevAgenda.map(item => ({
                    ...item,
                    classDaSituacao: getClassePorSituacao(item.DATA_AGENDA, item.HORA_AGENDA, item.SITUACAO)
                })) : []
            );
        }, 1000);
    
        return () => clearInterval(interval);
    }, [atendimento]);


    function formatDateToBR(dateString: string): string {

        const dataAgenda=new Date(dateString).toISOString().split('T')[0];
        const [year, month, day] = dataAgenda.split('-');
        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
    }
    const getClassePorSituacao = (dataAgenda: string, horaAgenda: string, situacao: string) => {

        const dataAtual = new Date();
        const dataAtualZerada = new Date(dataAtual)
        dataAtualZerada.setHours(0, 0, 0, 0);

        const dataAtualString = dataAtualZerada.toISOString().split('T')[0];
        const dataAgendaString = dataAgenda.substring(0, 10);

        const horaAgendaObj = horaAgenda.split(':');
        const horaAgendaMin = parseInt(horaAgendaObj[0], 10) * 60 + parseInt(horaAgendaObj[1], 10);

        const horaAtual = dataAtual.getHours() * 60 + dataAtual.getMinutes(); 
 
        if (dataAgendaString > dataAtualString) {

            if (['PENDENTE', 'AGUARDANDO DESENVOLVIMENTO', 'AGUARDANDO SUPERVISAO', 'AGUARDANDO FINANCEIRO', 'NAO CONSEGUIMOS CONTATO'].includes(situacao)) {
                return 'text-blue-800 dark:text-blue-500';
            } else if (situacao === 'RESOLVIDO') {
                return 'text-green-800 dark:text-green-400';
            } else if (situacao === 'REAGENDADO') {
                return 'text-yellow-600';
            }
        } else if (dataAgendaString === dataAtualString) {

            if (horaAgendaMin > horaAtual && ['PENDENTE', 'AGUARDANDO DESENVOLVIMENTO', 'AGUARDANDO SUPERVISAO', 'AGUARDANDO FINANCEIRO', 'NAO CONSEGUIMOS CONTATO'].includes(situacao)) {
                return 'text-blue-800 dark:text-blue-500';
            } else if (horaAtual >= horaAgendaMin && ['PENDENTE', 'AGUARDANDO DESENVOLVIMENTO', 'AGUARDANDO SUPERVISAO', 'AGUARDANDO FINANCEIRO', 'NAO CONSEGUIMOS CONTATO'].includes(situacao)) {
                return 'text-red-800 dark:text-red-600';
            } else if (situacao === 'RESOLVIDO') {
                return 'text-green-800 dark:text-green-400';
            } else if (situacao === 'REAGENDADO') {
                return 'text-yellow-600';
            }
        } else {
            
            if (['PENDENTE', 'AGUARDANDO DESENVOLVIMENTO', 'AGUARDANDO SUPERVISAO', 'AGUARDANDO FINANCEIRO', 'NAO CONSEGUIMOS CONTATO'].includes(situacao)) {
                return 'text-red-800 dark:text-red-600';
            } else if (situacao === 'RESOLVIDO') {
                return 'text-green-800 dark:text-green-400';
            } else if (situacao === 'REAGENDADO') {
                return 'text-yellow-600';
            }
        }
        return ''; 
    };
    
    const handleabreNovoAtendimento = () => {

        setabreNovoAtendimento(!abreNovoAtendimento);
        setIsFiltroVisible(false);
        setErrorsForm({
            codCli: false,
            nomeCli: false,
            responsavelAT: false,
            situacaoAgenda: false,
            tagAtendimentoAT: false,
            TELEFONE1:false,
            HISTORICOAT: false,
        });
    };
    const handleErrorsForm = (field:any) => {
        setErrorsForm((prevErrors) => ({
            ...prevErrors,
            [field]: false,
        }));
    };
    
    const handleSubmitAtendimento = async (event:any) => {
        event.preventDefault();

        const codCli = document.getElementById('inputCodClienteAT') as HTMLInputElement;
        const nomeCli = document.getElementById('inputNomeClienteAT') as HTMLInputElement;
        const responsavelAT = document.getElementById('responsavelAT') as HTMLInputElement;
        const operadorAT = document.getElementById('operadorAT') as HTMLInputElement;
        const contatoAT = document.getElementById('contatoAT') as HTMLInputElement;
        const tagAtendimentoAT =document.getElementById('tagAtendimentoAT') as HTMLInputElement;
        const DATA_GRAVACAOAT = document.getElementById('DATA_GRAVACAOAT') as HTMLInputElement;
        const DATA_AGENDAAT = document.getElementById('DATA_AGENDAAT') as HTMLInputElement;
        const HORA_AGENDAAT = document.getElementById('HORA_AGENDAAT') as HTMLInputElement;
        const situacaoAgenda = document.getElementById('situacaoAgenda') as HTMLInputElement;
        const tipoAT = document.getElementById('tipoAT') as HTMLInputElement;
        const TELEFONE1 = document.getElementById('TELEFONE1') as HTMLInputElement;
        const HISTORICOAT = document.getElementById('HISTORICOAT') as HTMLInputElement;

        let validacaoErrorsForm = {
            codCli: !codCli.value,
            nomeCli: !nomeCli.value,
            tagAtendimentoAT:tagAtendimentoAT.value === 'Selecione',
            responsavelAT: responsavelAT.value === 'Selecione',
            situacaoAgenda: situacaoAgenda.value === 'Selecione',
            TELEFONE1:!TELEFONE1.value || TELEFONE1.value.replace(/\D/g, '').length < 10, 
            HISTORICOAT: !HISTORICOAT.value,
        };

        setErrorsForm(validacaoErrorsForm);

        if (Object.values(validacaoErrorsForm).some(error => error)) {
            toast.error('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        try {
            const response = await makeRequest.post('atendimentos/novoatendimento', { 
                contatoAT: contatoAT.value,
                operadorAT: operadorAT.value,
                tagAtendimentoAT: tagAtendimentoAT.value,
                codCli: codCli.value,
                DATA_GRAVACAOAT: DATA_GRAVACAOAT.value,
                DATA_AGENDAAT: DATA_AGENDAAT.value,
                HORA_AGENDAAT: HORA_AGENDAAT.value,
                situacaoAgenda: situacaoAgenda.value,
                tipoAT: tipoAT.value,
                HISTORICOAT: HISTORICOAT.value,
                TELEFONE1:TELEFONE1.value,
                responsavelAT: responsavelAT.value,
            });
            console.log('Console-respostaAPI: '+response);
    
            if (response.status === 200 || response.status === 201) {

                toast.success(response.data.msg);
                setabreNovoAtendimento(!abreNovoAtendimento);
            } else {

                throw new Error(response.data.msg || 'Erro ao enviar os dados.');
            }

        } catch (error:any) {
            console.log(error);
            toast.error('Erro ao enviar os dados: ' + error.response.data.msg);
        }

    };

    const atualizaratendimentoshoje = async () => {
        try {
            const atendimentosRes = await makeRequest.get(`atendimentos/atendimentoshoje?datahoje=${datahoje}`);
            setAtemdimento(atendimentosRes.data.atendimentoshoje || []);
        } catch (error) {
            console.error("Erro ao buscar agenda:", error);
        }
    };
    const handleBuscaCliente = () => {

        setMensagemServidor('');
        setAbreBuscaCliente(!abreBuscaCliente);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocumento(e.target.value);
        setFiltroDocumento(e.target.value);

    };
    const handleDetalhes = () => {

        setMostraDetalhes(false);
    };
    const handleAtualizaAtendimento = () => {

        setalteraAtendimento(!alteraAtendimento);
        setErrorsFormUp({
            codigoAtendimentoAT:false,
            contatoAtualizaAT: false,
            assuntoAtualizaAT: false,
            responsavelAtualizaAT: false,
            situacaoAtualizaAtendimento: false,
            atualizaTELEFONE1: false,
            atualizaHISTORICOAT: false,
        });
    };

    const handleErrorsFormUp = (field:any) => {
        setErrorsFormUp((prevErrors) => ({
            ...prevErrors,
            [field]: false,
        }));
    };
    const handleSubmitAtualizaAtendimento = async (event:any) =>{
        event.preventDefault();

        const codigoAtendimentoAT = document.getElementById('codigoAtendimentoAT') as HTMLInputElement;
        const contatoAtualizaAT = document.getElementById('contatoAtualizaAT') as HTMLInputElement;
        const assuntoAtualizaAT = document.getElementById('assuntoAtualizaAT') as HTMLInputElement;
        const responsavelAtualizaAT = document.getElementById('responsavelAtualizaAT') as HTMLInputElement;
        const situacaoAtualizaAtendimento = document.getElementById('situacaoAtualizaAtendimento') as HTMLInputElement;
        const atualizaTELEFONE1 = document.getElementById('atualizaTELEFONE1') as HTMLInputElement;
        const atualizaHISTORICOAT = document.getElementById('atualizaHISTORICOAT') as HTMLInputElement;

        let validacaoErrorsForm = {
            codigoAtendimentoAT: !codigoAtendimentoAT.value,
            contatoAtualizaAT: !contatoAtualizaAT.value,
            assuntoAtualizaAT: assuntoAtualizaAT.value === 'Selecione',
            responsavelAtualizaAT: responsavelAtualizaAT.value === 'Selecione',
            situacaoAtualizaAtendimento: situacaoAtualizaAtendimento.value === 'Selecione',
            atualizaTELEFONE1: !atualizaTELEFONE1.value || atualizaTELEFONE1.value.replace(/\D/g, '').length < 10,
            atualizaHISTORICOAT: !atualizaHISTORICOAT.value,
        };

        setErrorsFormUp(validacaoErrorsForm);

        if (Object.values(validacaoErrorsForm).some(error => error)) {
            toast.error('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            const response = await makeRequest.post('atendimentos/atualizaatendimento', { 
                
                codigoAtendimentoAT: codigoAtendimentoAT.value,
                contatoAtualizaAT: contatoAtualizaAT.value,
                assuntoAtualizaAT: assuntoAtualizaAT.value,
                responsavelAtualizaAT: responsavelAtualizaAT.value,
                situacaoAtualizaAtendimento: situacaoAtualizaAtendimento.value,
                atualizaTELEFONE1: atualizaTELEFONE1.value,
                atualizaHISTORICOAT: atualizaHISTORICOAT.value,
            });
    
            if (response.status === 200 || response.status === 201) {

                toast.success(response.data.msg);
                setalteraAtendimento(!alteraAtendimento);
            } else {

                throw new Error(response.data.msg || 'Erro ao enviar os dados.');
            }

        } catch (error:any) {
            console.log(error);
            toast.error('Erro ao enviar os dados: ' + error.response.data.msg);
        }
    };

    const handleDeleta = async () => {

        if (selecionaCodigo) {

            try {
                const response = await makeRequest.delete(`atendimentos/deletaatendimento?codigo=${selecionaCodigo.CODIGO}`);
                console.log(selecionaCodigo.CODIGO);
                if (response.status === 200) {
                    toast.success('Registro excluído com sucesso!');

                } else {
                    throw new Error(response.data.msg || 'Erro ao excluir o registro.');
                }
            } catch (error:any) {

                console.error(error);
                toast.error('Erro ao excluir o registro: ' + error.response.data.msg);
            } finally {

                setdeletaAtendimento(false);
            }
        }
    };
    const notificacaoUsuario = (titulo:string, mensagem:string) => {
        if (Notification.permission === "granted") {
            new Notification(titulo, {
                body: mensagem,
                icon: '/favicon.ico' 
            });
        }
    };
    const verificarAtualizacao = () => {
        console.log('DadosCodCli: '+filtroCodCliAtendimento);
        console.log('DadosDTInicial: '+filtroDtInicial);
        console.log('DadosDTFinal: '+filtroDtFinal);
        console.log('DadosSituacaoAgenda: '+filtroSituacaoAtendimento);
        if (filtroCodCliAtendimento || filtroDtInicial || filtroDtFinal || filtroSituacaoAtendimento) {
            handleFiltrarAgenda();
        } else {
            atualizaratendimentoshoje();
        }
    };
    const handlePaginaAnterior = () => {
        setPaginaAtualNaBuscaCliente(prevPage => Math.max(prevPage - quantidadeDePaginasNaNavegacaoDaBuscaCliente, 1));
    };

    const handleProximaPagina = () => {
        setPaginaAtualNaBuscaCliente(prevPage => Math.min(prevPage + quantidadeDePaginasNaNavegacaoDaBuscaCliente, limiteDePaginasNaNavegacaoDaBuscaCliente));
    };

    const handlePageNumberClick = (pageNumber: number) => {
        setPaginaAtualNaBuscaCliente(pageNumber);
    };
    const handleClienteSelecionado = (cliente: ClienteItem) => {
        setClienteSelecionado(cliente);
        handleBuscaCliente();

        const codCliAtendimentoInput = document.getElementById('filtroCodCliAtendimento') as HTMLInputElement;
        const inputCodClienteAT = document.getElementById('inputCodClienteAT') as HTMLInputElement;
        const inputNomeClienteAT = document.getElementById('inputNomeClienteAT') as HTMLInputElement;


        if (isFiltroVisible) {
            codCliAtendimentoInput.value = cliente.CODIGO.toString();
            setfiltroCodCliAtendimento(cliente.CODIGO.toString());
        } else {
            inputCodClienteAT.value = cliente.CODIGO.toString();
            inputNomeClienteAT.value = cliente.NOME;
        }
    };

    const handleFiltrarAgenda = async () => {

        setMensagemServidor('');
        setAtemdimento([]);
        try {
            const response = await makeRequest.get("/atendimentos/atendimentosfiltrados", {
                params: {
                    CODCLI: filtroCodCliAtendimento,
                    DATAINICIAL: filtroDtInicial,
                    DATAFINAL: filtroDtFinal,
                    SITUACAOAGENDA: filtroSituacaoAtendimento,
                },
            });
            if (response.data.msg) {

                setMensagemServidor(response.data.msg);
            }

            setfiltroCodCliAtendimento('');
            setFiltroNomeRazao('');

            setAtemdimento(response.data.atendimentofiltrado);
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
        }
    };

    const handleAtivo = (checked: boolean) =>{

        setClientesAtivos(checked);
    }

    const handleFiltrarClientes = async () => {
        setMensagemServidor('');
        try {
            const response = await makeRequest.get("/atendimentos/clientefiltrado", {
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
    const removeTags = (text:string) => {
        return text.split('\n').map((item, key) => (
            <span key={key}>
                {item}
                <br />
            </span>
        ));
    };

    return (
        <div className="flex flex-col h-screen">
            {atendimento === null ? (
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
                                <p className="px-2">Novo Atendimento</p>
                                <button className="" onClick={handleabreNovoAtendimento}>
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
                                    <input type="text" id="filtroSituacaoAtendimento" name="filtroSituacaoAtendimento" placeholder="Situação"
                                        className="w-full border border-gray-300 shadow-sm 
                                                            focus:outline-none focus:ring-2 focus:ring-blue-500
                                                            rounded p-1"
                                        onChange={(e) => setfiltroSituacaoAtendimento(e.target.value)} />
                                </div>
                                <div className='w-full md:max-w-max'>
                                    <p className='dark:text-white'>Cod. Cliente</p>
                                    <div className='flex w-full md:max-w-max'>
                                        <div className="w-[85%] md:w-[50%] m-0">
                                            <input type="text" id="filtroCodCliAtendimento" name="filtroCodCliAtendimento" placeholder="99999"
                                                className="w-full h-full border border-gray-300 shadow-sm focus:outline-none
                                                                    focus:ring-2 focus:ring-blue-500 rounded-l p-1"
                                                onChange={(e) => setfiltroCodCliAtendimento(e.target.value)} />
                                        </div>
                                        <div className='w-[10%] md:w-[40%] text-white m-0'>
                                            <button type="button" id="btBuscaCliente" name="btBuscaCliente"
                                                className=' border border-gray-300 shadow-sm border-transparent 
                                                                    bg-blue-600 focus:ring-2 focus:ring-blue-500 rounded-e p-1'
                                                onClick={handleBuscaCliente}>
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
                    {atendimento.length > 0 ? (
                        <div className="flex-1 overflow-auto scrollbar-custom">
                            <table className="min-w-full divide-y divide-gray-500 text-center text-xs">
                                <thead className="bg-blue-950 dark:bg-gray-900 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 text-xs text-white tracking-wider">CÓDIGO</th>
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
                                <tbody className="dark:text-gray-100 font-semibold">
                                    {atendimento.map((item, index) => (
                                        <tr key={item.CODIGO}
                                            className={`hover:bg-neutral-200 dark:hover:bg-slate-600 ${index % 2 === 0 ? 'bg-neutral-100 dark:bg-sky-950 ' : ''}${item.classDaSituacao}`}
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
                                            <td >{item.SITUACAO}</td>
                                            <td className="text-lg">
                                                <button className="p-1" onClick={() => { setSelecionaCodigo(item); setMostraDetalhes(true); }}><AiOutlineFolderView /></button>
                                                <button className="p-1" onClick={() => { setSelecionaCodigo(item); setalteraAtendimento(true); }}><MdEdit /></button>
                                                <button className="p-1" onClick={() => { setSelecionaCodigo(item); setdeletaAtendimento(true); }}><MdDeleteForever /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>    
                    ) : (
                        <>
                            <table className="min-w-full divide-y divide-gray-500 text-center text-xs">
                            <thead className="bg-blue-950 dark:bg-gray-900 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-xs text-white tracking-wider">CÓDIGO</th>
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
                                <td colSpan={2}>{mensagemServidor ?(<p>{mensagemServidor}</p>):(<p>Não há registros para os parâmetros informados</p>)}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td> 
                            </tbody>    
                        </table>
                    </>
                    )}
                        {abreNovoAtendimento && (
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-2">
                                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg h-screen overflow-auto scrollbar-custom 
                                                            md:h-auto md:overflow-visible md:scrollbar-none md:w-[80%]">
                                        <div className='flex justify-between text-blue-700 mb-4'>
                                            <h2 className="text-lg text-blue-700 font-bold">Novo Atendimento</h2>
                                        </div>
                                        <form onSubmit={handleSubmitAtendimento} className="md:grid md:grid-cols-12 items-center">
                                            <div className="col-span-2 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="number" id="inputCodClienteAT" name="inputCodClienteAT"
                                                            className={`w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                dark:bg-slate-800 ${errorsForm.codCli ? 'border-red-500' : ''}`}                    
                                                            defaultValue='999999' 
                                                            onFocus={() => handleErrorsForm('codCli')}
                                                            style={{ 
                                                                appearance: 'textfield', 
                                                                MozAppearance: 'textfield', 
                                                                WebkitAppearance: 'none', 
                                                                margin: 0, 
                                                            }}
                                                            required disabled/>
                                                        <label htmlFor="inputCodClienteAT"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Cod Cliente
                                                        </label>
                                                    </div>
                                                    <button type="button"
                                                        className="py-3 px-4 inline-flex justify-center items-center 
                                                                            gap-x-2 text-sm font-semibold rounded-e-md border border-transparent 
                                                                            bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 
                                                                            focus:ring-blue-500"
                                                        id="btBuscaAgenda" onClick={handleBuscaCliente}>
                                                        Busca</button>
                                                </div>
                                            </div>
                                            <div className="col-span-6 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="text" className={`w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                            dark:bg-slate-800 ${errorsForm.nomeCli ? 'border-red-500' : ''}`}
                                                            id="inputNomeClienteAT" name="inputNomeClienteAT" placeholder="Nome/Razão Social" defaultValue='Ainda Não Cadastrado' 
                                                            onFocus={() => handleErrorsForm('nomeCli')}
                                                            disabled />
                                                        <label htmlFor="inputNomeClienteAT"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Nome/Razão Social</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <select className={`w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                dark:bg-slate-800 ${errorsForm.responsavelAT ? 'border-red-500' : ''} `}
                                                            id="responsavelAT" name="responsavelAT" 
                                                            onFocus={() => handleErrorsForm('responsavelAT')}
                                                            required>
                                                            <option selected disabled>Selecione</option>
                                                            {vendedor.map((item, index) => (
                                                                <option key={item.CODIGO} value={item.usuario_PARAMetro}>{item.usuario_PARAMetro}</option>
                                                            ))}

                                                        </select>
                                                        <label htmlFor="responsavelAT"
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
                                                            aria-label="Default select example" id="operadorAT" name="operadorAT" required disabled>
                                                            <option value={usuarioLogado.usuario_PARAMetro}>{usuarioLogado.usuario_PARAMetro}</option>
                                                        </select>
                                                        <label htmlFor="operadorAT"
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
                                                            id="contatoAT" name="contatoAT" required />
                                                        <label htmlFor="contatoAT"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Contato</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-6 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">

                                                        <select className={`w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                dark:bg-slate-800 ${errorsForm.tagAtendimentoAT ? 'border-red-500' : ''} `}
                                                            id="tagAtendimentoAT" name="tagAtendimentoAT" 
                                                            onFocus={() => handleErrorsForm('tagAtendimentoAT')}
                                                            required>
                                                            <option selected disabled>Selecione</option>
                                                            {tagAtendimento.map((item, index) => (
                                                                <option key={item.CODIGO} value={item.TAG}>{item.TAG}</option>
                                                            ))}
                                                        </select>
                                                        <label htmlFor="tagAtendimentoAT"
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
                                                            id="DATA_GRAVACAOAT" name="DATA_GRAVACAOAT" 
                                                            min={`${new Date().getFullYear() - 10}-01-01`} 
                                                            max={`${new Date().getFullYear() + 10}-12-31`}
                                                            required />
                                                        <label htmlFor="DATA_GRAVACAOAT"
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
                                                            id="DATA_AGENDAAT" name="DATA_AGENDAAT" 
                                                            min={`${new Date().getFullYear() - 10}-01-01`} 
                                                            max={`${new Date().getFullYear() + 10}-12-31`}
                                                            required />
                                                        <label htmlFor="DATA_AGENDAAT"
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
                                                            id="HORA_AGENDAAT" name="HORA_AGENDAAT" required />
                                                        <label htmlFor="HORA_AGENDAAT"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Hora Agenda</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-4 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <select className={`w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                                                                dark:bg-slate-800 ${errorsForm.situacaoAgenda ? 'border-red-500' : ''}`}
                                                            id="situacaoAgenda" name="situacaoAgenda" 
                                                            onFocus={() => handleErrorsForm('situacaoAgenda')}
                                                            required>
                                                            <option selected disabled>Selecione</option>
                                                            {situacaoAgenda.map((item, index) => (
                                                                <option key={item.CODIGO} value={item.DESCRICAO}>{item.DESCRICAO}</option>
                                                            ))}
                                                        </select>
                                                        <label htmlFor="situacaoAgenda"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Situação</label>
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
                                                            id="tipoAT" name="tipoAT" value='ATENDIMENTO' disabled required />
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
                                                        <InputFone 
                                                            value={telefone1} 
                                                            onChange={(e) => {setTelefone1(e.target.value);
                                                                             handleErrorsForm('TELEFONE1');
                                                            }} 
                                                            placeholder="(XX) XXXX-XXXX" 
                                                            className={`w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                                                                            dark:bg-slate-800 ${errorsForm.TELEFONE1 ? 'border-red-500' : ''}`}
                                                            id="TELEFONE1"
                                                            name="TELEFONE1"
                                                            />    
                                                        <label htmlFor="TELEFONE1"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Telefone</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-12 m-1">
                                                <div className="relative flex w-full h-full rounded-lg shadow-sm">
                                                    <textarea className={`w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                h-40 md:h-52 dark:bg-slate-800 ${errorsForm.HISTORICOAT ? 'border-red-500' : ''} `}
                                                        id="HISTORICOAT" name="HISTORICOAT" 
                                                        onFocus={() => handleErrorsForm('HISTORICOAT')}
                                                        ></textarea>
                                                    <label htmlFor="HISTORICOAT"
                                                        className="absolute top-1 left-3 text-gray-500"
                                                    >Detalhes do Registro</label>
                                                </div>
                                            </div>
                                            <div className="col-span-12 m-1">
                                                <div className="relative flex w-full h-full rounded-lg shadow-sm justify-end">
                                                    <button type="button" onClick={handleabreNovoAtendimento}
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
                                            <button type="button" onClick={handleBuscaCliente} className="text-black dark:text-gray-100"><MdOutlineClose /></button>
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
                                                            className="dark:bg-slate-800 border rounded p-1 dark:border-gray-600"
                                                        />
                                                    </div>
                                                    <div className='p-1'>
                                                        <p>NOME ou NOME FANTASIA</p>
                                                        <input type="text" id="filtroNomeRazao" name='filtroNomeRazao'
                                                            placeholder="Nome/NomeFantasia" className="dark:bg-slate-800 border rounded p-1 dark:border-gray-600"
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
                                                                <th className="">CÓDIGO</th>
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
                                            <button type="button" onClick={handleBuscaCliente} className="bg-gray-300 text-black rounded px-4 py-1">Fechar</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {mostraDetalhes && selecionaCodigo && (
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg max-w-lg divide-y divide-black dark:divide-gray-100">
                                        <div className='flex justify-between text-blue-700 mb-2'>
                                            <h1 className="text-lg font-bold">Detalhes do Atendimento</h1>
                                            <button type="button" onClick={() => setMostraDetalhes(false)} className="text-black dark:text-gray-100"><MdOutlineClose /></button>
                                        </div>
                                        <div className='mb-2'>
                                            <dl className="grid grid-cols-3 p-2">
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
                                                <dd className="col-start-2 col-span-2 max-h-40 md:max-h-60 overflow-y-auto scrollbar-custom"><span id="detalhesRegistro"  dangerouslySetInnerHTML={{ __html: selecionaCodigo.HISTORICO }}></span></dd><br></br>
                                            </dl>
                                        </div>
                                        <div className='flex justify-end p-2'>
                                            <button type="button" onClick={() => setMostraDetalhes(false)} className="bg-gray-300 text-black rounded px-4 py-1">Fechar</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {alteraAtendimento && selecionaCodigo && (
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-lg w-full max-w-xl divide-y divide-black dark:divide-gray-100">
                                        <div className='flex justify-between text-blue-700 mb-4'>
                                            <h1 className="text-lg font-bold">Altera o Atendimento</h1>
                                            <h2 className='self-end'>Atendimento Nº: {selecionaCodigo.CODIGO}</h2>
                                            <button type="button" onClick={handleAtualizaAtendimento} className="text-black dark:text-gray-100"><MdOutlineClose /></button>
                                        </div>
                                        <div className='mb-2'>
                                            <form onSubmit={handleSubmitAtualizaAtendimento} className="md:grid md:grid-cols-12 items-center">
                                            <div className="col-span-3 m-1">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="hidden" id="codigoAtendimentoAT" defaultValue={selecionaCodigo.CODIGO} />
                                                        <input type="number" id="codClienteAtualizaAT" name="codClienteAtualizaAT"
                                                            className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                dark:bg-slate-800"                   
                                                            defaultValue={selecionaCodigo.CLIENTE} 
                                                            disabled/>
                                                        <label htmlFor="codClienteAtualizaAT"
                                                            className="text-sm absolute top-1 left-3 text-gray-500"
                                                        >Cod Cliente
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-6 m-0.5">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="text" className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                            dark:bg-slate-800"
                                                            id="nomeClienteAtualizaAT" name="nomeClienteAtualizaAT" placeholder="Nome/Razão Social" 
                                                            defaultValue={selecionaCodigo.NOMEFANTASIA?selecionaCodigo.NOMEFANTASIA:'Ainda não cadastrado'} 
                                                            disabled />
                                                        <label htmlFor="nomeClienteAtualizaAT"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Nome/Razão Social</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-3 m-0.5">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="text" id="documentoAtualizaAT" name="documentoAtualizaAT"
                                                            className="w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                dark:bg-slate-800"                   
                                                            defaultValue={selecionaCodigo.CNPJ ? selecionaCodigo.CNPJ : selecionaCodigo.CPF}
                                                            disabled/>
                                                        <label htmlFor="documentoAtualizaAT"
                                                            className="text-sm absolute top-1 left-3 text-gray-500"
                                                        >CPF/CNPJ
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-3 m-0.5">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <input type="text" className={`w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                            dark:bg-slate-800 ${errorsFormUp.contatoAtualizaAT?'border-red-500' : '' }`}
                                                            id="contatoAtualizaAT" name="contatoAtualizaAT" 
                                                            defaultValue={selecionaCodigo.CONTATO} 
                                                            onFocus={() => handleErrorsFormUp('contatoAtualizaAT')}
                                                            required />
                                                        <label htmlFor="contatoAtualizaAT"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Contato</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-6 m-0.5">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <select className={`w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                dark:bg-slate-800 ${errorsFormUp.assuntoAtualizaAT ? 'border-red-500' : ''} `}
                                                            id="assuntoAtualizaAT" name="assuntoAtualizaAT" 
                                                            onFocus={() => handleErrorsFormUp('assuntoAtualizaAT')}
                                                            required>
                                                            <option selected disabled>Selecione</option>
                                                            {tagAtendimento.map((item, index) => (
                                                                <option key={item.CODIGO} 
                                                                        value={item.TAG}
                                                                        selected={item.TAG===selecionaCodigo.ASSUNTO}
                                                                    >{item.TAG}</option>
                                                            ))}
                                                        </select>    
                                                        <label htmlFor="assuntoAtualizaAT"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Assunto</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-3 m-0.5">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <select className={`w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                dark:bg-slate-800 ${errorsFormUp.responsavelAtualizaAT ? 'border-red-500' : ''} `}
                                                                id="responsavelAtualizaAT" name="responsavelAtualizaAT" 
                                                            onFocus={() => handleErrorsFormUp('responsavelAtualizaAT')}
                                                            required>
                                                            <option selected disabled>Selecione</option>
                                                                {vendedor.map((item) => (
                                                                    <option
                                                                        key={item.CODIGO}
                                                                        value={item.usuario_PARAMetro}
                                                                        selected={item.usuario_PARAMetro === selecionaCodigo.RESPONSAVEL}
                                                                    >
                                                                        {item.usuario_PARAMetro}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        <label htmlFor="responsavelAtualizaAT"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Responsável</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-6 m-0.5">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">
                                                        <select className={`w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                                                                dark:bg-slate-800 ${errorsFormUp.situacaoAtualizaAtendimento ? 'border-red-500' : ''} `}
                                                            id="situacaoAtualizaAtendimento" name="situacaoAtualizaAtendimento" 
                                                            onFocus={() =>handleErrorsFormUp('situacaoAtualizaAtendimento')}
                                                              required>
                                                            <option selected disabled>Selecione</option>
                                                            {situacaoAgenda.map((item, index) => (
                                                                <option key={item.CODIGO} 
                                                                        value={item.DESCRICAO}
                                                                        selected={item.DESCRICAO===selecionaCodigo.SITUACAO}
                                                                    >{item.DESCRICAO}</option>
                                                            ))}
                                                        </select>
                                                        <label htmlFor="situacaoAtualizaAtendimento"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Situacao</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-6 m-0.5">
                                                <div className="relative flex w-full rounded-lg shadow-sm">
                                                    <div className="flex flex-wrap block w-full border-gray-200 shadow-sm rounded-s-lg 
                                                                            text-sm disabled:pointer-events-none">

                                                            <InputFone 
                                                            value={selecionaCodigo.TELEFONE1} 
                                                            onChange={(e) =>{ setTelefone1(e.target.value);
                                                                              handleErrorsFormUp('atualizaTELEFONE1');                          
                                                            }} 
                                                            placeholder="(XX) XXXX-XXXX" 
                                                            className={`w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                            rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                                                                                            dark:bg-slate-800 ${errorsFormUp.atualizaTELEFONE1 ? 'border-red-500' : ''} `}
                                                            id="atualizaTELEFONE1" 
                                                            name="atualizaTELEFONE1"
                                                            />     
                                                        <label htmlFor="atualizaTELEFONE1"
                                                            className="absolute top-1 left-3 text-gray-500"
                                                        >Telefone</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-12 m-1">
                                                <div className="relative flex w-full h-full rounded-lg shadow-sm">
                                                    <textarea className={`w-full h-full pt-6 pb-2 pl-3 block border border-gray-300 dark:border-gray-600
                                                                                rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                                                h-40 md:h-52 dark:bg-slate-800 ${errorsFormUp.atualizaHISTORICOAT ? 'border-red-500' : ''} `}
                                                        id="atualizaHISTORICOAT" name="atualizaHISTORICOAT" 
                                                        defaultValue={selecionaCodigo.HISTORICO.replace(/<br\s*\/?>/g, '\n')}
                                                        onFocus={()=> handleErrorsFormUp('atualizaHISTORICOAT')}
                                                        ></textarea>
                                                    <label htmlFor="atualizaHISTORICOAT"
                                                        className="absolute top-1 left-3 text-gray-500"
                                                    >Detalhes do Registro</label>
                                                </div>
                                            </div>
                                            <div className="col-span-12 m-1">
                                                <div className="relative flex w-full h-full rounded-lg shadow-sm justify-end">
                                                    <button type="button" onClick={handleAtualizaAtendimento} 
                                                        className="bg-gray-300 text-black rounded px-4 py-2 mx-1"
                                                    >Cancelar</button>
                                                    <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 mx-1">Salvar</button>
                                                </div>
                                            </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {deletaAtendimento && selecionaCodigo && (
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                                    <div className="bg-white dark:bg-slate-800  p-4 rounded-lg shadow-lg w-full max-w-md">
                                        <h2 className="text-lg font-semibold">Confirmar Exclusão</h2>
                                        <p>Você tem certeza que deseja excluir o item com código {selecionaCodigo.CODIGO}?</p>
                                        <div className="flex justify-end space-x-2 mt-4">
                                            <button onClick={handleDeleta} className="bg-red-500 text-white rounded px-4 py-2">Excluir</button>
                                            <button onClick={() => setdeletaAtendimento(false)} className="bg-gray-300 text-black rounded px-4 py-2">Cancelar</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                           
                </>
            )}
        <ToastContainer position="bottom-left"/>    
        </div>
    );


}export default Atendimento;