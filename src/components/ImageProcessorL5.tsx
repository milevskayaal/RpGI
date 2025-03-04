import React, { useState } from 'react';
import FileInput from './FileInput';

const ImageProcessorL5: React.FC = () => {
    const [scale, setScale] = useState<number>(2);
    const [fileInfo, setFileInfo] = useState<{ width: number; height: number; size: number; name: string } | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleFileChange = (file: File) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const buffer = e.target?.result as ArrayBuffer;
            const canvas = document.getElementById('resultCanvas') as HTMLCanvasElement;

            try {
                scaleBMP(canvas, buffer, scale);
                // Получаем информацию о файле
                const img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = () => {
                    setFileInfo({
                        width: img.width,
                        height: img.height,
                        size: file.size,
                        name: file.name,
                    });
                };
            } catch (error) {
                setMessage(`Ошибка: ${(error as Error).message}`);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const scaleBMP = (canvas: HTMLCanvasElement, buffer: ArrayBuffer, k: number) => {
        const dataView = new DataView(buffer);

        // Проверка сигнатуры BMP
        if (dataView.getUint16(0, true) !== 0x4D42) throw new Error('Invalid BMP');

        // Разбор заголовков
        const pixelOffset = dataView.getUint32(10, true);
        const width = dataView.getInt32(18, true);
        const height = dataView.getInt32(22, true);
        const bpp = dataView.getUint16(28, true);
        const absHeight = Math.abs(height);

        // Поддерживается только формат 8-bit BMP
        if (bpp !== 8) throw new Error('Only 8-bit BMP supported');

        // Настройка размеров канваса с учетом коэффициента масштабирования
        canvas.width = Math.round(width * k);
        canvas.height = Math.round(absHeight * k);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas context');
        }

        // Чтение палитры
        const palette = new Array(256);
        for (let i = 0; i < 256; i++) {
            const offset = 54 + i * 4;
            palette[i] = {
                r: dataView.getUint8(offset + 2),
                g: dataView.getUint8(offset + 1),
                b: dataView.getUint8(offset),
            };
        }

        // Вычисление параметров оригинального изображения
        const rowSize = Math.floor((width * 8 + 31) / 32) * 4;
        const pixels = new Uint8Array(buffer, pixelOffset);
        const imageData = ctx.createImageData(canvas.width, canvas.height);

        // Масштабирование методом ближайшего соседа
        for (let y = 0; y < canvas.height; y++) {
            const srcY = Math.min(absHeight - 1, Math.floor(y / k));
            const origY = height > 0 ? absHeight - 1 - srcY : srcY;

            for (let x = 0; x < canvas.width; x++) {
                const srcX = Math.min(width - 1, Math.floor(x / k));
                const colorIndex = pixels[origY * rowSize + srcX];
                const color = palette[colorIndex] || { r: 0, g: 0, b: 0 };

                const idx = (y * canvas.width + x) * 4;
                imageData.data[idx] = color.r;
                imageData.data[idx + 1] = color.g;
                imageData.data[idx + 2] = color.b;
                imageData.data[idx + 3] = 255; // Alpha канал
            }
        }

        ctx.putImageData(imageData, 0, 0);

        // Создание ссылки для скачивания
        canvas.toBlob((blob) => {
            if (!blob) {
                throw new Error('Could not create blob from canvas');
            }

            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'scaled.bmp';
            a.textContent = 'Скачать отмасштабированное изображение';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, 'image/bmp');

        setMessage('Изображение успешно отмасштабировано!');
    };

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
            {/* Заголовок */}
            <h2 className="text-purple-400 text-2xl font-bold text-center mb-6">Масштабирование BMP-изображений</h2>

            {/* Пояснительный текст */}
            <p className="text-gray-400 text-center mb-8">
                Загрузите BMP-файл и настройте коэффициент масштабирования. Изображение будет автоматически отмасштабировано.
            </p>

            {/* Форма загрузки файла */}
            <div className="mb-8">
                <label htmlFor="file-upload" className="block text-purple-300 font-medium text-lg mb-2 text-center">
                    Выберите BMP-файл:
                </label>
                <FileInput onFileChange={handleFileChange} />
            </div>

            {/* Настройка коэффициента масштабирования */}
            <div className="flex items-center justify-center mb-8">
                <label className="text-gray-400 mr-4">Коэффициент масштабирования:</label>
                <input
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="ml-2 p-2 bg-gray-700 text-white rounded w-24 text-center"
                />
            </div>

            {/* Сообщение о результате */}
            {message && (
                <p className={`text-center text-xl font-semibold ${message.includes('Ошибка') ? 'text-red-500' : 'text-green-400'}`}>
                    {message}
                </p>
            )}

            {/* Canvas для отображения результатов */}
            <canvas id="resultCanvas" className="mt-8 border border-purple-400 rounded-lg shadow-md bg-gray-700 w-full"></canvas>

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

export default ImageProcessorL5;