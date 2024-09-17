import React, { useState } from 'react';
import '../styles/globals.css'; // Certifique-se de que o caminho está correto

const CheckboxComponente = ({ checked = false, onChange }) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleChange = () => {
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);
        if (onChange) onChange(newCheckedState);
    };

    return (
        <div className='w-full md:max-w-max self-end'>
            <div className='flex w-full md:max-w-max'>
                <label htmlFor="clienteAtivo" className="checkbox-wrapper">
                    <input
                        type="checkbox"
                        id="clienteAtivo"
                        name="clienteAtivo"
                        className="checkbox-hidden"
                        checked={isChecked}
                        onChange={handleChange}
                    />
                    <div className="checkbox-visible"></div>
                    <span className="ms-3 dark:text-white">Clientes Ativos</span>
                </label>
            </div>
        </div>
    );
};

export default CheckboxComponente;
