"use client";
import { M_PLUS_1_Code } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { makeRequest } from "../../../axios";

function Login(){

    const [email,setEmail]=useState('');
    const [senha,setSenha]=useState('');
    const [error,setError]=useState('');
    const router = useRouter();

    const doLogin= (e:any)=>{
        e.preventDefault();

        if(!email){
            setError("Email não informado");
        }else if(!senha||senha.length<4){
            setError("Senha inferior a 4 dígitos");
        }else{
            makeRequest.post("auth/login",{email,senha}).then((res)=>{
                localStorage.setItem("CrmGalago:vendedor",JSON.stringify(res.data.data.vendedor))
                localStorage.setItem("CrmGalago:token",JSON.stringify(res.data.data.token))
                setError('');
                router.push("/home");
           }).catch((err)=>{
                console.log(err);
                setError(err.response.data.msg);
           }) 
        }
    }

    console.log(email,senha);

    return(

        <main className="lg:h-full sm:h-lvh" id="login">
            <div className="h-[95%] w-full content-center md:place-content-center" id="loginBody">
                <div className="h-[95%] grid lg:grid-cols-6 gap-2 md:grid-cols-4 sm:grid-cols-2 gap-0" id="credenciais">
                    <div className="h-5/6 lg:col-start-3 lg:col-span-2 md:col-start-2 md:col-span-2 sm:col-start-1 sm:col-span-0 mt-12 rounded-lg shadow-2xl bg-gray divide-y divide-gray-400">
                        <div className="h-2/5 rounded-t-lg flex flex-col items-center justify-center text-center p-20 bg-gray-50" id="cardHead">
                            <img className="h-16" src="/imagens/logogalago.png"/>
                            <h4 className="pt-10 antialiased font-bold">Acesse </h4>
                            <h6 className=" antialiased font-bold">E registre seu Atendimento </h6>
                        </div>
                        <div className="h-3/5 rounded-b-lg bg-white" id="bodyCard">
                            <form onSubmit={doLogin}>
                                <div className="h-18 m-4">
                                    <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="inputEmail">Email</label>                                    
                                    <input  required  className="w-full h-12 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:border-sky-500 p-2" 
                                                      id="inputEmail" type="email" placeholder="nome@example.com" name="email" 
                                                    onChange={(e)=>setEmail(e.currentTarget.value)}  
                                    />
                                </div>
                                <div className="h-18 m-4">
                                    <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="inputPassword">Senha</label>
                                    <input  required  className="w-full h-12 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:border-sky-500 p-2" 
                                                      id="inputPassword" type="password" placeholder="Senha" name="senha"   
                                                    onChange={(e)=>setSenha(e.currentTarget.value)}
                                    />
                                </div>
                                <div className="flex justify-between m-2">
                                    <div className="flex items-center">
                                        <input className="accent-blue-700" id="inputRememberPassword" type="checkbox" name="remember"/>
                                        <label className="block text-sm font-medium leading-6 text-gray-900 p-1" htmlFor="inputRememberPassword">Lembrar Credenciais</label>
                                    </div>
                                    <div className="">
                                        <button className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-semibold text-blue-100 shadow-sm ring-1 ring-inset ring-blue-300
                                                           hover:bg-blue-300 hover:text-gray-900 active:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300" 
                                                           id="btnLogin" type="submit"
                                        >Login
                                        </button>
                                    </div>
                                </div>
                                {error.length>0 && <div className="grid">
                                                    <span className="justify-self-center text-red-600">{error}</span>    
                                                   </div>}    
                            </form>
                        </div>    
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 h-[5%] w-full content-center bg-gray-100 end-0" id="loginFooter">
                <div className="flex justify-between text-sm text-gray-700">
                    <div className="px-4">
                        Copyright &copy; Galago 2024
                    </div>
                    <div className="px-4">
                        <a href="/Politicas">Politicas de Privacidade</a>
                                &middot;
                        <a href="/Politicas">Termos &amp; Uso</a>
                    </div>
                </div>
            </div>
        </main>

        
    );
}
export default Login;