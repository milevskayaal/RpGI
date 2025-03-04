import React, { useState } from 'react';
import FileInput from './FileInput';
import { processBmpFile, processBmpToGrayscale, processBmpWithBorder, processBmpRotation } from '../utils/bmpProcessor';

const ImageProcessorL4: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [fileInfo, setFileInfo] = useState<{ width: number; height: number; size: number; name: string } | null>(null);

    const handleFileChange = (file: File) => {
        const reader = new FileReader();

        // Читаем файл как Data URL для получения метаданных
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.getElementById('canvas') as HTMLCanvasElement;
                const ctx = canvas.getContext('2d');

                if (ctx && canvas) {
                    // Устанавливаем размеры канваса в соответствии с изображением
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Отрисовываем изображение на канвасе
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    // Сохраняем информацию о файле
                    setFileInfo({
                        width: img.width,
                        height: img.height,
                        size: file.size,
                        name: file.name,
                    });

                    // Обрабатываем BMP-файл
                    processBmpFile(file)
                        .then(() => {
                            setMessage('Файл BMP успешно обработан!');
                            return Promise.all([
                                processBmpToGrayscale(file),
                                processBmpWithBorder(file),
                                processBmpRotation(file),
                            ]);
                        })
                        .catch((error) => setMessage(`Ошибка: ${error.message}`));
                }
            };
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
            {/* Заголовок */}
            <h2 className="text-purple-400 text-2xl font-bold text-center mb-6">
                Обработчик BMP-изображений
            </h2>

            {/* Пояснительный текст */}
            <p className="text-gray-400 text-center mb-8">
                Загрузите BMP-файл для его вывода.
            </p>

            {/* Форма загрузки файла */}
            <div className="mb-8">
                <label
                    htmlFor="file-upload"
                    className="block text-purple-300 font-medium text-lg mb-2 text-center"
                >
                    Выберите BMP-файл:
                </label>
                <FileInput onFileChange={handleFileChange} />
            </div>

            {/* Сообщение о результате */}
            {message && (
                <p className={`text-center text-xl font-semibold ${message.includes('Ошибка') ? 'text-red-500' : 'text-green-400'}`}>
                    {/* message */}
                </p> 
            )}  

            {/* Canvas для отображения результатов */}
            <canvas
                id="canvas"
                className="mt-8 border border-purple-400 rounded-lg shadow-md bg-gray-700 w-full"
            ></canvas>

            {/* Информация о файле */}
            {fileInfo && (
                <div className="mt-8 text-gray-400 text-center">
                    <p>Имя файла: {fileInfo.name}</p>
                    <p>Размер файла: {(fileInfo.size / 1024).toFixed(2)} KB</p>
                    <p>Ширина: {fileInfo.width}px</p>
                    <p>Высота: {fileInfo.height}px</p>
                </div>
            )}
        </div>
    );
};

export default ImageProcessorL4;