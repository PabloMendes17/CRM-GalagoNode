'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './components/CarregandoSpinner';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem('CrmGalago:token');
        
        if (!token) {
          router.push('/login');
        } else {
          router.push('/home');
        }
      };

    const timer = setTimeout(() => {
      setLoading(false);
      checkAuth(); 
    }, 3000); 

    return () => clearTimeout(timer);

  }, [router]);

  return (
    <div>
      <LoadingSpinner />
    </div>
  );
}
