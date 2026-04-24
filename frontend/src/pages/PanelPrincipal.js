// src/pages/PanelPrincipal.js
const PanelPrincipal = () => {
  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 mb-4">Panel Principal</h1>
      <p className="text-gray-600 mb-6">Bienvenido a tu escritorio legal inteligente.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800">Próximos vencimientos</h3>
          <p className="text-gray-500 text-sm mt-2">No hay eventos próximos.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800">Casos activos</h3>
          <p className="text-3xl font-black text-amber-600 mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800">Consultas IA</h3>
          <p className="text-3xl font-black text-amber-600 mt-2">0</p>
        </div>
      </div>
    </div>
  );
};
export default PanelPrincipal;