import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ImageProcessorL4 from "./components/ImageProcessorL4";
import ImageProcessorL5 from "./components/ImageProcessorL5";
import ImageProcessorL6 from "./components/ImageProcessorL6";
import ImageProcessorL7 from "./components/ImageProcessorL7";
import PCXDecoder from "./components/PCXDecoder";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App flex min-h-screen bg-gray-900 text-gray-100">
        {/* Сайдбар */}
        <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
          {/* Заголовок */}
          <h1 className="text-2xl font-gothic text-center text-purple-400 mb-8">
            ПГИ Милевская
          </h1>

          {/* Кнопки */}
          <div className="flex flex-col space-y-4 px-2">
            <Link
              to="/l4"
              className="py-3 px-6 bg-gray-700 text-purple-300 rounded-lg text-center font-medium transform transition-all duration-300 hover:scale-105 hover:bg-purple-600 hover:text-gray-100 active:scale-95"
            >
              Лабораторная 4
            </Link>
            <Link
              to="/l5"
              className="py-3 px-6 bg-gray-700 text-purple-300 rounded-lg text-center font-medium transform transition-all duration-300 hover:scale-105 hover:bg-purple-600 hover:text-gray-100 active:scale-95"
            >
              Лабораторная 5
            </Link>
            <Link
              to="/l6"
              className="py-3 px-6 bg-gray-700 text-purple-300 rounded-lg text-center font-medium transform transition-all duration-300 hover:scale-105 hover:bg-purple-600 hover:text-gray-100 active:scale-95"
            >
              Лабораторная 6
            </Link>
            <Link
              to="/l7"
              className="py-3 px-6 bg-gray-700 text-purple-300 rounded-lg text-center font-medium transform transition-all duration-300 hover:scale-105 hover:bg-purple-600 hover:text-gray-100 active:scale-95"
            >
              Лабораторная 7
            </Link>
            <Link
              to="/l8"
              className="py-3 px-6 bg-gray-700 text-purple-300 rounded-lg text-center font-medium transform transition-all duration-300 hover:scale-105 hover:bg-purple-600 hover:text-gray-100 active:scale-95"
            >
              Лабораторная 8
            </Link>
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/l4" element={<ImageProcessorL4 />} />
            <Route path="/l5" element={<ImageProcessorL5 />} />
            <Route path="/l6" element={<ImageProcessorL6 />} />
            <Route path="/l7" element={<ImageProcessorL7 />} />
            <Route path="/l8" element={<PCXDecoder />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
