import { useEffect } from "react";


function Instaladores(){

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
        <div className="grid md:grid-cols-4 grid-cols-2 h-[98%] overflow-auto scrollbar-custom">
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/iconegalago.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">Retaguarda FULL 4.0</h5>
                    <p className="text-center">Módulo Gestor.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/setup4.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/iconegalago.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                <h5 className="text-center">Retaguarda Light 4.0</h5>
                <p className="text-center">Módulo Gestor.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/setup4light.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/iconegalago.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                <h5 className="text-center">Retaguarda NFe 4.0</h5>
                <p className="text-center">Módulo Gestor.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/setup4nfe.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/FireBird.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">Firebird 2.5</h5>
                    <p className="text-center">Serviço de banco de Dados.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/firebird-2.5.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/PDV.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">PDV NFCe</h5>
                    <p className="text-center">Módulo Frente de Caixa.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/instala-nfce.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/SAT.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">PDV SAT</h5>
                    <p className="text-center">Módulo Frente de caixa.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/instala-sat.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/apitrafego.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">API Tráfego</h5>
                    <p className="text-center">API de controle do Tráfego.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/instala-apitrafego.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/Trafego.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">Tráfego</h5>
                    <p className="text-center">Aplicação de integração PDV-SERVIDOR.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/trafego.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/Gsinc.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">Gsinc</h5>
                    <p className="text-center">Módulo envio de pendencias para SEFAZ.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/gsincnfe.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/mesa.jpg" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">Gmesa</h5>
                    <p className="text-center">Módulo de controle de mesa, comandas e entregas.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/gmesa.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/mesa.jpg" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">Mesa Mobile</h5>
                    <p className="text-center">Módulo para uso móvel do Gmesa.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/gmesamobile.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/Backup.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">Backup</h5>
                    <p className="text-center">Módulo de Backup.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/instalador-backup.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/ConsultaP.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">Consultor de Preço</h5>
                    <p className="text-center">Módulo alternativo Sweda Getec.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/instala-tconsultas.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/ModuloF.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">Modulo Fiscal</h5>
                    <p className="text-center">Módulo Integração IMendes.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/instala-modulofiscal.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/ApiPed.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">API Pedido</h5>
                    <p className="text-center">API para orçamentos e balanço.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://galago-app.s3-sa-east-1.amazonaws.com/instaladores/instala-apipedido.exe" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/AppPed.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">Pedido Eletronico Mobile</h5>
                    <p className="text-center">Aplicação Mobile para API Pedido.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://play.google.com/store/apps/details?id=com.test.pedidoeletronicomobile" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/PedWEB.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">Pedido Eletronico WEB</h5>
                    <p className="text-center">Portal para orçamentos externos.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://pedido.appgalago.com" className="">Download</a> 
                </button>
            </div>
            <div className="flex flex-col items-center w-[90%] text-white bg-blue-900 border-solid border-4 border-black rounded-md p-1 m-1" id="card">
                <img src="/imagens/ConsultaM.png" className="h-[50%] w-[40%] rounded-md" alt="..."/>
                <div className="flex flex-col items-center p-2">
                    <h5 className="text-center">Consulta Mobile</h5>
                    <p className="text-center">Portal Gerencial Gálago.</p>
                </div>
                <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-black
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300">
                        <a href="https://mobile.appgalago.com" className="">Download</a> 
                </button>
            </div>
        </div>
    );

}export default Instaladores;