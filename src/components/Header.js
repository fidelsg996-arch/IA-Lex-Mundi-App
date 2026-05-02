import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-14">
      <div>
        <h1 className="text-5xl font-extralight">
          Panel Jurídico
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Control total de operaciones legales
        </p>
      </div>

      <button className="border border-yellow-500 text-yellow-400 px-6 py-2 rounded-xl hover:bg-yellow-500 hover:text-black transition">
        Nuevo expediente
      </button>
    </div>
  );
};

export default Header;