import React, { useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";
import "../Styles/Find.css";
import logoImg from "../img/tatamg.png";

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

  return (
    <div className="container">
      <h1 className="heading">Find My Druggist</h1>

      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClickToUpload}
      >
        {image ? (
          <div className="image-preview-wrapper">
            <button
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
            >
              &times;
            </button>
            <img src={image} alt="Preview" className="preview-image" />
          </div>
        ) : (
          <div className="upload-text">
            <p>Drag & Drop Image Here</p>
            <p>or Click to Upload</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
          ref={fileInputRef}
        />
      </div>

      {image && (
        <button className="ocr-button" onClick={handleOCR} disabled={loading}>
          {loading ? "Processing..." : "Search"}
        </button>
      )}

      {ocrText.length > 0 && (

    </div>
  );
}
