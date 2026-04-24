import { useState, useEffect } from 'react';
import { getTorneos, getJugadores, getPartidas } from '../services/torneoStorage';

export function useTorneos() {
  const [torneos, setTorneos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);

  const recargar = () => {
    setTorneos(getTorneos());
    setJugadores(getJugadores());
    setPartidas(getPartidas());
    setLoading(false);
  };

  useEffect(() => {
    recargar();
  }, []);

  return { torneos, jugadores, partidas, loading, recargar };
}