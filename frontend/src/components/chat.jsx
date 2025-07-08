import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chat = () => {
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_KEY = "AIzaSyAanJAL8uUfDkdRBFLteXeL-h2MEbFmKpc"; // Replace with your actual API key

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    
    setIsLoading(true);
    
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Simple prompt that works reliably
      const prompt = `Act as a medical professional. Analyze these symptoms: "${symptoms.trim()}". 
      Respond in this exact format:
      
      Severity: [mild/moderate/severe/emergency]
      Summary: [brief summary]
      Recommended Action: [what to do]
      Specialist: [if needed]
      Home Care: [if applicable]`;

      const result = await model.generateContent(prompt);
      const textResponse = (await result.response).text();
      
      // Parse the response into an object
      const parsedResponse = {
        severity: extractValue(textResponse, "Severity:"),
        summary: extractValue(textResponse, "Summary:"),
        advice: extractValue(textResponse, "Recommended Action:"),
        doctor_specialist: extractValue(textResponse, "Specialist:"),
        home_remedy: extractValue(textResponse, "Home Care:"),
      };

      // Auto-upgrade severity for critical symptoms
      if (symptoms.toLowerCase().match(/chest pain|breath|bleeding|unconscious|severe pain/)) {
        if (parsedResponse.severity === 'mild') parsedResponse.severity = 'moderate';
        if (parsedResponse.severity === 'moderate') parsedResponse.severity = 'severe';
        if (parsedResponse.severity === 'severe') parsedResponse.severity = 'emergency';
      }

      setResponse({
        ...parsedResponse,
        symptoms: symptoms.trim()
      });

    } catch (error) {
      console.error("Error:", error);
      setResponse({
        severity: "error",
        summary: "Analysis failed",
        advice: "Please try again or consult a doctor",
        symptoms: symptoms.trim()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to extract values from text response
  const extractValue = (text, key) => {
    const regex = new RegExp(`${key}\\s*(.*?)(\\n|$)`);
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeSymptoms();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Health Consultant</h2>
        <p className="text-gray-600 mb-6">
          Describe your symptoms for medical analysis
        </p>
        
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg mb-4"
            rows="4"
            placeholder="Example: 'Sharp chest pain when breathing deeply'"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze Symptoms"}
          </button>
        </form>
      </div>

      {response && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Your Symptoms:</h3>
            <p>{response.symptoms}</p>
          </div>

          <div className={`p-6 rounded-lg ${
            response.severity === "emergency" ? "bg-red-100 border-l-4 border-red-500" :
            response.severity === "severe" ? "bg-orange-100 border-l-4 border-orange-500" :
            response.severity === "moderate" ? "bg-yellow-100 border-l-4 border-yellow-500" :
            "bg-blue-100 border-l-4 border-blue-500"
          }`}>
            <h3 className="text-lg font-semibold mb-2">Assessment:</h3>
            <p><strong>Severity:</strong> {response.severity}</p>
            <p><strong>Summary:</strong> {response.summary}</p>
            <p><strong>Action:</strong> {response.advice}</p>
            {response.doctor_specialist && (
              <p><strong>Specialist:</strong> {response.doctor_specialist}</p>
            )}
            {response.home_remedy && (
              <p><strong>Home Care:</strong> {response.home_remedy}</p>
            )}
          </div>

          {response.severity === "emergency" && (
            <div className="bg-red-600 text-white p-4 rounded-lg text-center">
              <p className="font-bold">EMERGENCY: CALL 108/911 IMMEDIATELY</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;