import React, { useState } from 'react';
import FileInput from './FileInput';
import { processBmpRotation } from '../utils/bmpProcessor';

const ImageProcessorL3: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);

    const handleFileChange = (file: File) => {
        processBmpRotation(file)
            .then(() => setMessage('Image rotated successfully!'))
            .catch((error: Error) => setMessage(`Error: ${error.message}`));
    };

    return (
        <div className="bg-red-500 p-6 rounded-lg shadow-lg">
            <FileInput onFileChange={handleFileChange} />
            {message && <p className="text-white mt-4">{message}</p>}
        </div>
    );
};

export default ImageProcessorL3;
