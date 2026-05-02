import React, { useState } from 'react';
import ReglasTorneo from './ReglasTorneo';

const RankingPhase = ({ participantes, estadisticas, participanteInfo, onBuscarContraparte, onAbrirAdmin, modoAdmin }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Torneo Legal 2026</h1>
            <p className="opacity-90 mt-2">Demuestra tus conocimientos jurídicos y gana grandes premios</p>
          </div>
          <button onClick={onAbrirAdmin} className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1 text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
            Admin
          </button>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="bg-white/20 rounded-lg px-3 py-1">💰 Premio: ${estadisticas.premioMonto || 1000}</div>
          <div className="bg-white/20 rounded-lg px-3 py-1">🎫 Inscripción: ${estadisticas.costoInscripcion || 10}</div>
          <div className="bg-white/20 rounded-lg px-3 py-1">✅ Victorias necesarias: 3</div>
        </div>
      </div>

      <ReglasTorneo />

      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center gap-4">
          <img src={participanteInfo?.avatar} className="w-16 h-16 rounded-full object-cover" alt="" />
          <div>
            <p className="font-bold text-lg">{participanteInfo?.nombre || "Sin registrar"}</p>
            <p className="text-sm text-gray-600">{participanteInfo?.especialidad || "Especialidad no seleccionada"}</p>
            <div className="flex gap-4 mt-1 text-sm">
              <span>🏆 Puntuación: {estadisticas.puntaje || 0}</span>
              <span>✅ Victorias: {estadisticas.fallosFavor || 0}</span>
              <span>❌ Derrotas: {estadisticas.fallosContra || 0}</span>
              <span>⚖️ Duelos: {(estadisticas.fallosFavor || 0) + (estadisticas.fallosContra || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">📊 Ranking del Torneo</h2>
          <button onClick={onBuscarContraparte} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            🔍 Buscar Contraparte
          </button>
        </div>

        {participantes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No hay participantes registrados aún. ¡Sé el primero!</p>
        ) : (
          participantes
            .sort((a, b) => (b.puntaje || 0) - (a.puntaje || 0))
            .map((p, idx) => (
              <div key={p.id} className="flex justify-between items-center p-3 border rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg w-8">{idx + 1}</span>
                  <span className="font-medium">{p.usuarioNombre}</span>
                  {p.usuarioId === participanteInfo?.usuarioId && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Tú</span>}
                </div>
                <div className="flex gap-4">
                  <span>🏆 {p.puntaje || 0} pts</span>
                  <span>✅ {p.fallosFavor || 0} V</span>
                  <span>❌ {p.fallosContra || 0} D</span>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default RankingPhase;