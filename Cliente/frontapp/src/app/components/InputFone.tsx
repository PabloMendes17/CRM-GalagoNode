import React, { useState } from 'react';

interface InputFoneProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  id?: string; 
  name?: string;
}

const InputFone: React.FC<InputFoneProps> = ({ value, onChange, placeholder, className,id, name  }) => {
    
  const [foneFormatado, setfoneFormatado] = useState<string>(value);

  const formataFone = (value: string) => {
    const valorNumerico = value.replace(/\D/g, ''); 

    if (valorNumerico.length <= 10) {

      return valorNumerico
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {

      return valorNumerico
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const fixoMovelFormatado = formataFone(value);
    setfoneFormatado(fixoMovelFormatado);
    onChange({ ...e, target: { ...e.target, value: fixoMovelFormatado } });
  };

  return (
    <input
      value={foneFormatado}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      id={id}
      name={name}
    />
  );
};

export default InputFone;
