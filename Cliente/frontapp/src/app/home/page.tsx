"use client";
import { useState } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Menu from "../components/Menu";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AreaDeTrabalho from "../components/AreaDeTrabalho";

export default function Home() {

  const router = useRouter();
  const [conteudo, setConteudo] = useState<'inicio' | 'agenda' | 'atendimento' | 'instaladores'>('inicio');

  useEffect(() => {
    let credenciais = localStorage.getItem("CrmGalago:token");

    if(!credenciais){
        router.push("/login")  
    } 

    const requestNotificationPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Permissão para notificações concedida!");
      } else {
        console.log("Permissão para notificações não concedida.");
      }
    };
    requestNotificationPermission();

}, [router]);

  return (
    <main className="min-h-screen flex-col items-center bg-zinc-100">
      <div>
        <Header/>
      </div>
      <div className="h-screen flex md:pt-20 pt-24  ">
        <Menu setConteudo={setConteudo}/>
        <AreaDeTrabalho conteudo={conteudo}/>
      </div> 
    </main>
  );
}
