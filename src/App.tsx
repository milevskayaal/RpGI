import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ImageProcessorL1 from './components/ImageProcessorL1';
import ImageProcessorL2 from './components/ImageProcessorL2';
import ImageProcessorL3 from './components/ImageProcessorL3';

const App: React.FC = () => {
    return (
        <Router>
            <div className="flex">
                <aside className="w-1/4 bg-gray-800 text-white p-4">
                    <h1 className="text-2xl font-bold mb-4">lab 1-3</h1>
                    <nav className="flex flex-col space-y-2">
                        <Link to="/l1" className="bg-antique-gold text-gray-900 py-2 px-4 rounded-md transition duration-300 hover:bg-gray-700">Convert to Grayscale</Link>
                        <Link to="/l2" className="bg-antique-gold text-gray-900 py-2 px-4 rounded-md transition duration-300 hover:bg-gray-700">Add Border</Link>
                        <Link to="/l3" className="bg-antique-gold text-gray-900 py-2 px-4 rounded-md transition duration-300 hover:bg-gray-700">Rotate Image</Link>
                    </nav>
                </aside>
                <main className="flex-1 p-4">
                    <Routes>
                        <Route path="/l1" element={<ImageProcessorL1 />} />
                        <Route path="/l2" element={<ImageProcessorL2 />} />
                        <Route path="/l3" element={<ImageProcessorL3 />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;