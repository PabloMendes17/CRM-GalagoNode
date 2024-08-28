'use client';

import React from 'react';
import {BarLoader} from 'react-spinners';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col loader-container">
      <BarLoader
        color="#241457"
        cssOverride={{}}
        height={5}
        width={180}
        speedMultiplier={1}

        />
      <p className="loading-text">Carregando...</p>
    </div>
  );
};

export default LoadingSpinner;