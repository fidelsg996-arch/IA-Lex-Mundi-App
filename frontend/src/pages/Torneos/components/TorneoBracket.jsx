export default function TorneoBracket({ torneo, partidas, currentUserEmail, onEntrarPartida }) {
  const rondaActual = torneo.ronda_actual;
  const partidasRonda = partidas.filter(p => p.ronda === rondaActual);
  const getNombreFase = (r) => {
    if (r === 1) return "FASE DE GRUPOS";
    if (r === 2) return "OCTAVOS";
    if (r === 3) return "CUARTOS";
    if (r === 4) return "SEMIFINAL";
    if (r === 5) return "FINAL";
    return `RONDA ${r}`;
  };
  return (
    <div className="border rounded p-4">
      <div className="text-center font-bold">{getNombreFase(rondaActual)}</div>
      <div className="grid md:grid-cols-2 gap-4 mt-2">
        {partidasRonda.map(p => (
          <div key={p.id} className="border p-2 rounded">
            <div className="flex justify-between">
              <span>{p.jugador1_nombre}</span>
              <span>{p.puntos_j1}</span>
            </div>
            <div className="text-center text-xs">vs</div>
            <div className="flex justify-between">
              <span>{p.jugador2_nombre}</span>
              <span>{p.puntos_j2}</span>
            </div>
            {p.estado === 'finalizada' && <div className="text-xs text-green-600 text-center">Finalizado</div>}
            {(p.jugador1_email === currentUserEmail || p.jugador2_email === currentUserEmail) && p.estado !== 'finalizada' && (
              <button onClick={() => onEntrarPartida(p)} className="mt-2 text-sm bg-amber-500 text-white px-2 py-1 rounded w-full">Tu turno</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}