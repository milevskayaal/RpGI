import React, { useState } from 'react';
import FileInput from './FileInput';
import { processBmpToGrayscale } from '../utils/bmpProcessor';

const ImageProcessorL1: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);

    const handleFileChange = (file: File) => {
        processBmpToGrayscale(file)
            .then(() => setMessage('Image processed to grayscale!'))
            .catch((error) => setMessage(`Error: ${error.message}`));
    };

    return (
        <div className="bg-blue-500 p-6 rounded-lg shadow-lg">
            <FileInput onFileChange={handleFileChange} />
            {message && <p className="text-white mt-4">{message}</p>}
        </div>
    );
};

export default ImageProcessorL1;
