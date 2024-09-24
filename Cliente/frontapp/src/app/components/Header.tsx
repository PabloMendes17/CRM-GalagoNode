"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import React, { useState, useEffect } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import HoraAtual from '../components/HoraAtual';
import { useTheme } from '../components/ThemeProvider';

function Header(){

    const { isDarkMode, toggleDarkMode } = useTheme();
    const [usuarioLogado,setUsuarioLogado] = useState({NOME:''});
    const [mostraLogout, setMostraLogout] = useState(false);
    const router = useRouter();


    useEffect(() => {

        let credenciais = localStorage.getItem("CrmGalago:usuarioLogado");
        
        if(credenciais){
            setUsuarioLogado(JSON.parse(credenciais)); 
            
        } 
    }, []);

    const logout = (e:any)=>{
        e.preventDefault();
        localStorage.removeItem('CrmGalago:token');
        router.push("/login");
    }

    const logoSrc = isDarkMode ? "/imagens/logogalagob.png" : "/imagens/logogalago.png";
    const imgUserSrc = isDarkMode ? "/imagens/ImgUserDark.png" : "/imagens/ImgUserLight.png";

    return(
        <header className="fixed top-0 z-30 left-0 right-0 py-1 w-full py-1 flex bg-white dark:bg-slate-800 justify-between items-center shadow-md">
            <div className="">
                <img className="h-12 m-1" src={logoSrc} alt="Logo Gálago"/>
            </div>
            <div className="flex items-center">
                <div className="flex flex-col items-center justify-center self-end px-2">
                    <div className="bg-zinc-50 dark:bg-slate-500 p-1 rounded-full">
                        <DarkModeSwitch
                            checked={isDarkMode}
                            onChange={toggleDarkMode}
                            size={20}
                        />
                    </div>
                    <HoraAtual />  
                </div>
                <div className="relative" onMouseLeave={()=>setMostraLogout(false)}>
                    <button className="flex flex-col items-center justify-center self-end px-2" onClick={()=>setMostraLogout(!mostraLogout)}>
                        <img className="h-10 rounded-full" src={imgUserSrc} alt="Imagem Perfil"/>
                        <span className="dark:text-white">{usuarioLogado.NOME}</span>
                    </button>
                    {mostraLogout && (
                        <div className="absolute w-[100%] text-center bg-white dark:bg-slate-800 dark:text-white p-2 shadow-md rounded-md">
                            <Link href="" onClick={(e)=>logout(e)}>Logout</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
export default Header;