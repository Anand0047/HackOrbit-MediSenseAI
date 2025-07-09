import React, { useState } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Activity, AlertTriangle, Stethoscope, Home,
  ClipboardList, Thermometer, HeartPulse, Pill
} from "lucide-react";
import MapPopup from "./MapPopup"; 

const Chat = () => {
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapType, setMapType] = useState("specialist");

  const GROQ_API_KEY = "";
  const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
  const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

  const detectLanguage = (text) => {
    const tamil = /[\u0B80-\u0BFF]/;
    const hindi = /[\u0900-\u097F]/;
    if (tamil.test(text)) return "ta";
    if (hindi.test(text)) return "hi";
    return "en";
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;

    setIsLoading(true);
    const lang = detectLanguage(symptoms.trim());

    const languageInstruction = {
      en: "Respond in English in this exact format:",
      hi: "इस सटीक प्रारूप में हिंदी में उत्तर दें:",
      ta: "இந்த பரிமாணத்தில் தமிழில் பதிலளிக்கவும்:"
    };

    const prompt = `Act as a medical professional. Analyze these symptoms: "${symptoms.trim()}".

${languageInstruction[lang]}

Always respond in this format:
Severity: [mild/moderate/severe/emergency ]
Summary: [brief summary (dont give any Symbol )]
Recommended Action: [what to do]
Specialist: [only mention the English name of the specialist if needed, or reply 'Not needed']
Home Care: [if applicable]
Medicines: [suggest medicine names only if severity is mild or moderate, else leave blank]`;

    try {
      const result = await axios.post(
        GROQ_API_URL,
        {
          model: MODEL,
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const text = result.data.choices[0].message.content;

      const extractValue = (text, key) => {
        const regex = new RegExp(`${key}\\s*(.*?)(\\n|$)`);
        const match = text.match(regex);
        return match ? match[1].trim() : "";
      };

      const parsedResponse = {
        severity: extractValue(text, "Severity:").toLowerCase().trim(),
        summary: extractValue(text, "Summary:"),
        advice: extractValue(text, "Recommended Action:"),
        doctor_specialist: extractValue(text, "Specialist:"),
        home_remedy: extractValue(text, "Home Care:"),
        medicines: extractValue(text, "Medicines:") 
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
      console.error("Groq API Error:", error);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    analyzeSymptoms();
  };

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

  const isEmergencyOrSevere = ["emergency", "severe"].includes(response?.severity);
  const isMildOrModerate = ["mild", "moderate"].includes(response?.severity);

  return (
    <div className="max-w-4xl mx-auto bg-breathing p-4 md:p-6 space-y-6">
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
              <Button type="submit" className="gap-2" disabled={isLoading}>
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

      {response && (
        <div className="space-y-6">
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

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">Recommended Action</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 pl-7">{response.advice}</p>

              {isEmergencyOrSevere && response.doctor_specialist && response.doctor_specialist !== "Not needed" && (
                <div className="pl-7 space-y-2">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-indigo-600" />
                    <h4 className="font-medium text-gray-800">Consult Specialist:</h4>
                  </div>
                  <p className="text-gray-700 pl-6">{response.doctor_specialist}</p>
                  <Button
                    variant="outline"
                    className="ml-6 gap-2"
                    onClick={() => {
                      setMapType("specialist");
                      setShowMap(true);
                    }}
                  >
                    <Stethoscope className="h-4 w-4" />
                    Find {response.doctor_specialist.trim().split(/\s+/)[0]}
                  </Button>
                </div>
              )}

              {isMildOrModerate && response.medicines && (
                <div className="pl-7 space-y-2">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-gray-800">Suggested Medicines:</h4>
                  </div>
                  <p className="text-gray-700 pl-6">{response.medicines}</p>
                  <Button
                    variant="outline"
                    className="ml-6 gap-2"
                    onClick={() => {
                      setMapType("pharmacy");
                      setShowMap(true);
                    }}
                  >
                    <Pill className="h-4 w-4" />
                    Find Pharmacy
                  </Button>
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

          {showMap && (
            <MapPopup
              specialist={mapType === "specialist" ? response.doctor_specialist.trim().split(/\s+/)[0] : "pharmacy"}
              onClose={() => setShowMap(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;