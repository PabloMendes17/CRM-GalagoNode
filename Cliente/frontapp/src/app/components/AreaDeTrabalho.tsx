import dynamic from 'next/dynamic';
import React from 'react';

interface AreaDeTrabalhoProps {
  conteudo: 'inicio' | 'agenda' | 'atendimento' | 'instaladores';
}


const AreaDeTrabalho: React.FC<AreaDeTrabalhoProps> = ({ conteudo }) => {

  const ComponentMap: {
    [key in AreaDeTrabalhoProps['conteudo']]: React.ComponentType<any>;
  } = {
    inicio: dynamic(() => import('../conteudo/inicio')),
    agenda: dynamic(() => import('../conteudo/agenda')),
    atendimento: dynamic(() => import('../conteudo/atendimento')),
    instaladores: dynamic(() => import('../conteudo/instaladores')),
  };

  const Componente = ComponentMap[conteudo] || dynamic(() => import('../conteudo/inicio'));

  return (
    <div className="w-[85%] h-[98%] flex-1 ml-2 bg-white dark:bg-slate-800 dark:text-white rounded-md overflow-hidden ">
      <Componente />
    </div>
  );
};

export default AreaDeTrabalho;