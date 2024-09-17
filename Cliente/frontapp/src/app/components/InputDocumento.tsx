import React, { useState } from 'react';

interface InputDocumentoProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const InputDocumento: React.FC<InputDocumentoProps> = ({ value, onChange, placeholder, className }) => {
    
  const [documentoFormatado, setDocumentoFormatado] = useState<string>(value);

  const formataCpfCnpj = (value: string) => {
    const valorNumerico = value.replace(/\D/g, ''); 

    if (valorNumerico.length <= 11) {

      return valorNumerico
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {

      return valorNumerico
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const cpfCnpjFormatado = formataCpfCnpj(value);
    setDocumentoFormatado(cpfCnpjFormatado);
    onChange({ ...e, target: { ...e.target, value: cpfCnpjFormatado } });
  };

  return (
    <input
      value={documentoFormatado}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default InputDocumento;
