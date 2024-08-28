import React, { useState, useEffect } from 'react';

function HoraAtual() {
    const [horaAtual, setHoraAtual] = useState('');

    const atualizarHora = () => {
        const agora = new Date();
        const horaFormatada = agora.toLocaleString('pt-BR', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\b(\w+)\./g, '$1');
        
        setHoraAtual(horaFormatada);
    };

      useEffect(() => {
        atualizarHora(); 
        const intervalo = setInterval(atualizarHora, 1000); 

   
        return () => clearInterval(intervalo);
    }, []);

    return (
        <p className="self-end text-gray-900 dark:text-white">{horaAtual}</p>
    );
}

export default HoraAtual;