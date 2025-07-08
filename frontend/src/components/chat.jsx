import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chat = () => {
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_KEY = ""; 

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    
    setIsLoading(true);
    
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Act as a medical professional. Analyze these symptoms: "${symptoms.trim()}". 
      Respond in this exact format:
      
      Severity: [mild/moderate/severe/emergency]
      Summary: [brief summary]
      Recommended Action: [what to do]
      Specialist: [if needed]
      Home Care: [if applicable]`;

      const result = await model.generateContent(prompt);
      const textResponse = (await result.response).text();
      
      const parsedResponse = {
        severity: extractValue(textResponse, "Severity:"),
        summary: extractValue(textResponse, "Summary:"),
        advice: extractValue(textResponse, "Recommended Action:"),
        doctor_specialist: extractValue(textResponse, "Specialist:"),
        home_remedy: extractValue(textResponse, "Home Care:"),
      };

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

  const extractValue = (text, key) => {
    const regex = new RegExp(`${key}\\s*(.*?)(\\n|$)`);
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeSymptoms();
  };

  // Severity color mapping
  const severityColors = {
    emergency: "bg-red-100 border-red-500 text-red-800",
    severe: "bg-orange-100 border-orange-500 text-orange-800",
    moderate: "bg-yellow-100 border-yellow-500 text-yellow-800",
    mild: "bg-blue-100 border-blue-500 text-blue-800",
    error: "bg-gray-100 border-gray-500 text-gray-800"
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Health Consultant</h2>
        <p className="text-gray-600 mb-6">Describe your symptoms for medical analysis</p>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col space-y-4">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Example: 'Sharp chest pain when breathing deeply'"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200 self-end"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : "Analyze Symptoms"}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {response && (
        <div className="space-y-6">
          {/* Symptoms Display */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Symptoms:</h3>
            <p className="text-gray-700">{response.symptoms}</p>
          </div>

          {/* Severity Container */}
          <div className={`rounded-xl p-6 border-l-4 ${severityColors[response.severity] || severityColors.error}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Severity Assessment</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                response.severity === "Emergency" ? "bg-red-500 text-white" :
                response.severity === "Severe" ? "bg-orange-500 text-white" :
                response.severity === "moderate" ? "bg-yellow-500 text-black" :
                response.severity === "mild" ? "bg-blue-500 text-white" :
                "bg-gray-500 text-white"
              }`}>
                {response.severity}
              </span>
            </div>
          </div>

          {/* Summary Container */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Condition Summary</h3>
            <p className="text-gray-700">{response.summary}</p>
          </div>

          {/* Action Container */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Recommended Action</h3>
            <p className="text-gray-700 mb-4">{response.advice}</p>
            
            {response.doctor_specialist && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-1">Consult:</h4>
                <p className="text-gray-700">{response.doctor_specialist}</p>
                <button className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                  Find {response.doctor_specialist}
                </button>
              </div>
            )}

            {response.home_remedy && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1">Home Care:</h4>
                <p className="text-blue-700">{response.home_remedy}</p>
              </div>
            )}
          </div>

          {/* Emergency Warning */}
          {response.severity === "emergency" && (
            <div className="bg-red-600 text-white p-4 rounded-lg text-center animate-pulse">
              <div className="flex items-center justify-center space-x-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="font-bold">EMERGENCY: CALL 108/911 IMMEDIATELY</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;