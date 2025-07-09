import React, { useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";
import logoImg from "../img/tatamg.png";
import phlogo from "../img/images.png";

export default function Find() {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medicineList, setMedicineList] = useState([]);
  const [scrapedResults, setScrapedResults] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    fetch("/data/medicines.json")
      .then((res) => res.json())
      .then((data) => setMedicineList(data))
      .catch((err) => console.error("Failed to load medicines:", err));
  }, []);

  const matchMedicinesFromOCR = (ocrText) => {
    const words = ocrText
      .split(/\s+|,|\.|\n/)
      .map((w) => w.trim().toLowerCase())
      .filter((w) => w.length > 2);

    const matches = new Set();

    medicineList.forEach((med) => {
      const medWords = med.toLowerCase().split(" ");
      const isMatched = medWords.every((word) => words.includes(word));
      if (isMatched) {
        matches.add(med);
      }
    });

    return Array.from(matches);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setOcrText([]);
      setScrapedResults([]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setOcrText([]);
      setScrapedResults([]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setOcrText([]);
    setScrapedResults([]);
  };

  const handleClickToUpload = () => {
    if (!image && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleOCR = () => {
    if (!image) return;

    setLoading(true);
    setOcrText(["Searching Web..."]);
    setScrapedResults([]);

    Tesseract.recognize(image, "eng", {
      logger: (m) => console.log(m),
    })
      .then(async ({ data: { text } }) => {
        console.log("OCR Extracted Text:", text);
        const matched = matchMedicinesFromOCR(text);
        setOcrText(matched.length > 0 ? matched : ["No known medicines found."]);

        if (matched.length > 0) {
          try {
            console.log("Sending to backend:", matched);
            const res = await fetch("http://localhost:5000/api/scrape", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ medicines: matched }),
            });
            
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            console.log("Received from backend:", data);
            setScrapedResults(data);
          } catch (err) {
            console.error("Scraping failed:", err);
            setOcrText(prev => [...prev, "Failed to fetch product details."]);
          }
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("OCR error:", err);
        setOcrText(["Failed to extract text."]);
        setLoading(false);
      });
  };

  // Filter out non-medicine messages
  const validMedicines = ocrText.filter(
    name => name !== "No known medicines found." && 
            name !== "Failed to extract text." && 
            name !== "Searching Web..."
  );
  
  // Check if we should show messages
  const showMessages = ocrText.some(
    name => name === "No known medicines found." || 
            name === "Failed to extract text." || 
            name === "Searching Web..."
  );

  return (
    
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-5 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Find My Druggist</h1>

      <div
        className={`w-full max-w-md h-64 border-4 border-dashed border-blue-500 bg-white rounded-xl flex items-center justify-center relative overflow-hidden cursor-pointer transition-colors ${image ? '' : 'hover:bg-blue-50'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClickToUpload}
      >
        {image ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xl w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
            >
              &times;
            </button>
            <img src={image} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" />
          </div>
        ) : (
          <div className="text-center text-gray-600 pointer-events-none">
            <p className="text-lg">Drag & Drop Image Here</p>
            <p className="text-lg">or Click to Upload</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
      </div>

      {image && (
        <button
          className={`mt-6 px-6 py-2 rounded-lg font-bold text-white transition-colors ${loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          onClick={handleOCR}
          disabled={loading}
        >
          {loading ? "Processing..." : "Search"}
        </button>
      )}

      {ocrText.length > 0 && (
        <div className="w-full max-w-6xl mt-8 flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-gray-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Matched Medicines</h2>
            
            {showMessages && (
              <div className="text-center py-4 text-gray-500">
                {ocrText.find(
                  name => name === "No known medicines found." || 
                          name === "Failed to extract text." || 
                          name === "Searching Web..."
                )}
              </div>
            )}
            
            {validMedicines.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {validMedicines.map((name, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="font-medium text-gray-800 text-center mb-4 border-b pb-3">
                      {name}
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <a
                        href={`https://www.1mg.com/search/all?name=${encodeURIComponent(name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-800 rounded-lg hover:bg-blue-100 transition-colors group"
                      >
                        <img 
                          src={logoImg} 
                          alt="1mg" 
                          className="w-6 h-6 mr-2 transition-transform group-hover:scale-110" 
                        />
                        <span>1mg</span>
                      </a>
                      
                      <a
                        href={`https://pharmeasy.in/search/all?name=${encodeURIComponent(name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-3 py-2 bg-green-50 text-green-800 rounded-lg hover:bg-green-100 transition-colors group"
                      >
                        <img 
                          src={phlogo} 
                          alt="PharmEasy" 
                          className="w-6 h-6 mr-2 transition-transform group-hover:scale-110" 
                        />
                        <span>PharmEasy</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

<div className="flex-1 bg-gray-50 p-6 rounded-xl shadow-sm">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Products</h2>
  {scrapedResults.length === 0 ? (
    <p className="text-gray-500 text-center py-4">No products found. Try another image.</p>
  ) : (
    <div className="space-y-6">
      {scrapedResults.map(({ query, results }, idx) => (
        <div key={idx} className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="text-xl font-medium text-gray-700 mb-3">{query}</h3>
          
          {results.length === 0 ? (
            <p className="text-gray-500">No products found for {query}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((item, i) => (
                <div 
                  key={i} 
                  className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-600 mt-1">Price: ₹{item.price.toFixed(2)}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-2 inline-flex items-center justify-center px-4 py-2 rounded-md text-white font-medium w-full ${
                      item.source === '1mg' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {item.source === '1mg' ? (
                      <>
                        <img 
                          src={logoImg} 
                          alt="1mg" 
                          className="w-5 h-5 mr-2" 
                        />
                        Buy on 1mg
                      </>
                    ) : (
                      <>
                        <img 
                          src={phlogo} 
                          alt="PharmEasy" 
                          className="w-5 h-5 mr-2" 
                        />
                        Buy on PharmEasy
                      </>
                    )}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>
        </div>
      )}
    </div>
  );
}