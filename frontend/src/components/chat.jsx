import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { 
  Activity,
  AlertTriangle,
  Stethoscope,
  Home,
  ClipboardList,
  Thermometer,
  HeartPulse
} from "lucide-react";

const Chat = () => {
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_KEY = "AIzaSyAanJAL8uUfDkdRBFLteXeL-h2MEbFmKpc";

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
  const severityData = {
    emergency: {
      color: "bg-red-50 border-red-200 text-red-900",
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      badge: "bg-red-600 text-white"
    },
    severe: {
      color: "bg-orange-50 border-orange-200 text-orange-900",
      icon: <Thermometer className="h-5 w-5 text-orange-600" />,
      badge: "bg-orange-500 text-white"
    },
    moderate: {
      color: "bg-yellow-50 border-yellow-200 text-yellow-900",
      icon: <Activity className="h-5 w-5 text-yellow-600" />,
      badge: "bg-yellow-500 text-black"
    },
    mild: {
      color: "bg-blue-50 border-blue-200 text-blue-900",
      icon: <HeartPulse className="h-5 w-5 text-blue-600" />,
      badge: "bg-blue-500 text-white"
    },
    error: {
      color: "bg-gray-50 border-gray-200 text-gray-900",
      icon: <AlertTriangle className="h-5 w-5 text-gray-600" />,
      badge: "bg-gray-500 text-white"
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Input Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-2xl font-bold text-gray-800">AI Health Consultant</CardTitle>
          </div>
          <p className="text-gray-600">Describe your symptoms for medical analysis</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              className="min-h-[120px] text-base"
              placeholder="Example: 'Sharp chest pain when breathing deeply, lasting for 30 minutes'"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              disabled={isLoading}
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ClipboardList className="h-4 w-4" />
                    Analyze Symptoms
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Section */}
      {response && (
        <div className="space-y-6">
          {/* Symptoms Display */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Your Symptoms</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 pl-7">{response.symptoms}</p>
            </CardContent>
          </Card>

          {/* Severity Assessment */}
          <Card className={severityData[response.severity]?.color || severityData.error.color}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {severityData[response.severity]?.icon || severityData.error.icon}
                  <h3 className="text-lg font-semibold">Severity Assessment</h3>
                </div>
                <Badge variant="outline" className={severityData[response.severity]?.badge || severityData.error.badge}>
                  {response.severity.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Condition Summary */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Condition Summary</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 pl-7">{response.summary}</p>
            </CardContent>
          </Card>

          {/* Recommended Action */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Recommended Action</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 pl-7">{response.advice}</p>
              
              {response.doctor_specialist && (
<div className="pl-7 space-y-2">
  <div className="flex items-center gap-2">
    <Stethoscope className="h-4 w-4 text-indigo-600" />
    <h4 className="font-medium text-gray-800">Consult Specialist:</h4>
  </div>
  <p className="text-gray-700 pl-6">{response.doctor_specialist}</p>
  {!/(^|\s)(not|unable|cannot|can't|don't|doesn't|no\s)/i.test(response.doctor_specialist) && (
    <Button variant="outline" className="ml-6 gap-2">
      <Stethoscope className="h-4 w-4" />
      Find {response.doctor_specialist.trim().split(/\s+/)[0]}
    </Button>
  )}
</div>
              )}

              {response.home_remedy && (
                <Card className="bg-blue-50 border-blue-200 ml-7">
                  <CardHeader className="py-3">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium text-blue-800">Home Care</h4>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-blue-700">{response.home_remedy}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Emergency Warning */}
          {response.severity === "emergency" && (
            <Card className="bg-red-600 border-red-700 text-white">
              <CardHeader className="py-4">
                <div className="flex items-center justify-center gap-3">
                  <AlertTriangle className="h-6 w-6" />
                  <h3 className="text-lg font-bold text-center">EMERGENCY: CALL 108 IMMEDIATELY</h3>
                </div>
              </CardHeader>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;