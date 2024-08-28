// src/components/Menu.tsx
import React from 'react';
import { HiHome,HiOutlineHome } from 'react-icons/hi';
import { BsCalendar2DayFill,BsCalendar2Day } from 'react-icons/bs';
import { RiCustomerService2Fill,RiCustomerService2Line  } from 'react-icons/ri';
import { RiInstallFill,RiInstallLine } from 'react-icons/ri';
import { useTheme } from '../components/ThemeProvider';

interface MenuProps {
  setConteudo: React.Dispatch<React.SetStateAction<'inicio' | 'agenda' | 'atendimento' | 'instaladores'>>;
}

const Menu: React.FC<MenuProps> = ({ setConteudo }) => {
  
  const { isDarkMode } = useTheme();
  
  const handleMenuClick = (section: 'inicio' | 'agenda' | 'atendimento' | 'instaladores') => {
    setConteudo(section);
  };

  const iconHome = isDarkMode ? <HiOutlineHome className="text-2xl md:text-3xl" /> : <HiHome className="text-2xl md:text-3xl" /> ;
  const iconAgenda = isDarkMode ? <BsCalendar2Day className="text-2xl md:text-3xl" /> : <BsCalendar2DayFill className="text-2xl md:text-3xl" />;
  const iconAtendimento = isDarkMode ? <RiCustomerService2Line className="text-2xl md:text-3xl" /> :<RiCustomerService2Fill className="text-2xl md:text-3xl" />;
  const iconInstaladores = isDarkMode ? <RiInstallLine className="text-2xl md:text-3xl" /> :<RiInstallFill className="text-2xl md:text-3xl" />;  
  
  return (
    <aside className=" h-[98%] flex md:pl-3 pl-1.5 pt-4 bg-white dark:bg-slate-800 pl-2 pt-2 rounded-md md:w-44 w-10">
      <nav className="flex flex-col gap-8 text-gray-600 dark:text-white font-semibold">
        <div>
          <button onClick={() => handleMenuClick('inicio')} className="flex gap-4 items-center">
            {iconHome}<p className="hidden sm:block">Início</p> 
          </button>
        </div>
        <div>
          <button onClick={() => handleMenuClick('agenda')} className="flex pb-2 gap-4 items-center">
            {iconAgenda}<p className="hidden sm:block">Agendamentos</p> 
          </button>
          <button onClick={() => handleMenuClick('atendimento')} className="flex pb-2 gap-4 items-center">
            {iconAtendimento}<p className="hidden sm:block">Atendimentos</p> 
          </button>
          <button onClick={() => handleMenuClick('instaladores')} className="flex pb-2 gap-4 items-center">
            {iconInstaladores}<p className="hidden sm:block">Instaladores</p> 
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Menu;
