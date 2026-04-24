import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-72 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col justify-between">

      <div>
        <div className="px-8 py-6 border-b border-[#1a1a1a]">
          <h1 className="text-lg tracking-[0.2em] text-white font-light">
            IA LEX MUNDI
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Legal Intelligence System
          </p>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {["Dashboard", "Expedientes", "Clientes", "Documentos"].map((item, i) => (
            <div
              key={i}
              className="px-5 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-[#111] transition cursor-pointer"
            >
              {item}
            </div>
          ))}
        </nav>
      </div>

      <div className="px-6 py-6 border-t border-[#1a1a1a] text-xs text-gray-500">
        © 2026 IA Lex Mundi
      </div>
    </aside>
  );
};

export default Sidebar;