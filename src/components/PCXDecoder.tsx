import React, { useState } from 'react';

const PCXDecoder: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const canvas = decodePCX(buffer);
        setImageUrl(canvas.toDataURL());
      } catch (err) {
        console.error(err);
        alert("Ошибка: " + (err as Error).message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const decodePCX = (buffer: ArrayBuffer): HTMLCanvasElement => {
    const dataView = new DataView(buffer);

    // Чтение заголовка PCX
    const id = dataView.getUint8(0);
    if (id !== 0x0A) {
      throw new Error("Неверный идентификатор PCX (ожидается 0x0A)");
    }

    const coding = dataView.getUint8(2);
    if (coding !== 1) {
      throw new Error("Неподдерживаемый метод кодирования (не RLE)");
    }

    const bitsPerPixel = dataView.getUint8(3);
    const planes = dataView.getUint8(65);
    if (bitsPerPixel !== 8 || planes !== 1) {
      throw new Error("Поддерживаются только 8-битные, 1-плановые PCX файлы");
    }

    const xMin = dataView.getUint16(4, true);
    const yMin = dataView.getUint16(6, true);
    const xMax = dataView.getUint16(8, true);
    const yMax = dataView.getUint16(10, true);
    const width = xMax - xMin + 1;
    const height = yMax - yMin + 1;
    const bytesPerLine = dataView.getUint16(66, true);

    // Декодирование данных RLE
    const imageSize = height * bytesPerLine;
    let decoded = new Uint8Array(imageSize);
    let pos = 0;
    let dataOffset = 128;

    while (pos < imageSize && dataOffset < buffer.byteLength) {
      let byte = dataView.getUint8(dataOffset++);
      let count, value;
      if ((byte & 0xC0) === 0xC0) {
        count = byte & 0x3F;
        value = dataView.getUint8(dataOffset++);
      } else {
        count = 1;
        value = byte;
      }
      for (let i = 0; i < count && pos < imageSize; i++) {
        decoded[pos++] = value;
      }
    }

    // Извлечение палитры
    if (buffer.byteLength < 769 + 128) {
      throw new Error("Файл слишком маленький для палитры");
    }
    const paletteMarker = dataView.getUint8(buffer.byteLength - 769);
    if (paletteMarker !== 0x0C) {
      throw new Error("Отсутствует маркер палитры (ожидается 0x0C)");
    }
    let palette = new Uint8Array(256 * 3);
    let paletteStart = buffer.byteLength - 768;
    for (let i = 0; i < 256 * 3; i++) {
      palette[i] = dataView.getUint8(paletteStart + i);
    }

    // Создание canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Не удалось получить контекст canvas");

    const imgData = ctx.createImageData(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let idx = y * bytesPerLine + x;
        let colorIndex = decoded[idx];
        let r = palette[colorIndex * 3];
        let g = palette[colorIndex * 3 + 1];
        let b = palette[colorIndex * 3 + 2];
        let pixelIndex = (y * width + x) * 4;
        imgData.data[pixelIndex] = r;
        imgData.data[pixelIndex + 1] = g;
        imgData.data[pixelIndex + 2] = b;
        imgData.data[pixelIndex + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      {/* Заголовок */}
      <h1 className="text-purple-400 text-2xl font-bold text-center mb-6">
        Декодирование PCX-изображений
      </h1>

      {/* Пояснительный текст */}
      <p className="text-gray-400 text-center mb-8">
        Загрузите PCX-файл, и он будет автоматически декодирован и отображен.
      </p>

      {/* Форма загрузки файла */}
      <label htmlFor="pcxFile" className="block text-purple-300 font-medium text-lg mb-2 text-center">
        Выберите PCX-файл:
      </label>
      <input
        type="file"
        id="pcxFile"
        accept=".pcx"
        onChange={handleFileChange}
        className="w-full bg-gray-700 text-white rounded p-2 mb-8"
      />

      {/* Отображение декодированного изображения */}
      {imageUrl && (
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="Decoded PCX"
            className="border border-purple-400 rounded-lg shadow-md bg-gray-700 max-w-full h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default PCXDecoder;