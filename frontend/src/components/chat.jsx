import React, { useState } from "react";

const Chat = () => {
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate API call to Gemini
  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    
    setIsLoading(true);
    
    // In a real implementation, this would call the actual Gemini API
    // For now, we'll simulate a response after a short delay
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated response based on input length (for demo purposes)
      const severity = symptoms.length > 30 ? "severe" : "mild";
      const advice = severity === "severe" 
        ? "These symptoms may indicate a serious condition. Please consult a healthcare professional immediately."
        : "These symptoms appear mild. Monitor your condition and consult a doctor if symptoms persist or worsen.";
      
      setResponse({
        severity,
        advice,
        symptoms: symptoms.trim()
      });
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      setResponse({
        severity: "error",
        advice: "Sorry, we couldn't analyze your symptoms. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeSymptoms();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Health Consultant</h2>
        <p className="text-gray-600 mb-6">
          Describe your symptoms and our AI will assess the potential severity.
        </p>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col space-y-4">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="4"
              placeholder="Enter your symptoms here (e.g., headache, fever, nausea)..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition duration-200 self-end"
              disabled={isLoading || !symptoms.trim()}
            >
              {isLoading ? "Analyzing..." : "Analyze Symptoms"}
            </button>
          </div>
        </form>
      </div>

      {response && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Symptoms:</h3>
            <p className="text-gray-700">{response.symptoms}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mild Container */}
            <div className={`bg-blue-50 rounded-xl shadow-md p-6 border-2 ${response.severity === "mild" ? "border-blue-400" : "border-transparent"}`}>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-xl">😊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Mild Condition</h3>
              </div>
              <p className="text-gray-700">
                {response.severity === "mild" 
                  ? response.advice 
                  : "If your symptoms were mild, we would recommend monitoring and home care."}
              </p>
            </div>

            {/* Severe Container */}
            <div className={`bg-red-50 rounded-xl shadow-md p-6 border-2 ${response.severity === "severe" ? "border-red-400" : "border-transparent"}`}>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Severe Condition</h3>
              </div>
              <p className="text-gray-700">
                {response.severity === "severe" 
                  ? response.advice 
                  : "If your symptoms were severe, we would recommend immediate medical attention."}
              </p>
              {response.severity === "severe" && (
                <button className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition duration-200">
                  Find Nearby Emergency Care
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;