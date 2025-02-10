import React, { useState } from 'react';
import FileInput from './FileInput';
import { processBmpWithBorder } from '../utils/bmpProcessor';

const ImageProcessorL2: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);

    const handleFileChange = (file: File) => {
        processBmpWithBorder(file)
            .then(() => setMessage('Image processed with border!'))
            .catch((error: Error) => setMessage(`Error: ${error.message}`));
    };

    return (
        <div className="bg-green-500 p-6 rounded-lg shadow-lg">
            <FileInput onFileChange={handleFileChange} />
            {message && <p className="text-white mt-4">{message}</p>}
        </div>
    );
};

export default ImageProcessorL2;
