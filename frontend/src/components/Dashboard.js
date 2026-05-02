import React from "react";

const Dashboard = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
        {[
          { title: "Expedientes activos", value: "24" },
          { title: "Clientes", value: "12" },
          { title: "Documentos", value: "58" },
        ].map((card, i) => (
          <div key={i} className="border border-[#1a1a1a] p-8 rounded-2xl bg-[#0f0f10]">
            <p className="text-gray-500 text-sm">{card.title}</p>
            <h2 className="text-4xl mt-4 font-extralight">{card.value}</h2>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;