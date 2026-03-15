
import { GoogleGenAI } from "@google/genai";

export const scanRouteConditions = async (origin, destination) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Perform an exhaustive safety and traffic audit for the route from ${origin} to ${destination}. 
      MANDATORY: Use Google Maps and Search to find:
      1. Current traffic congestion levels and specific bottleneck locations.
      2. Active roadworks, lane closures, or construction projects.
      3. Any weather-related hazards (flooding, ice, high winds).
      4. If no hazards are found, explicitly report that the route is 'CLEAR' with 'FREE FLOW' traffic.`,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
      },
    });

    const text = response.text || "No route data found.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = groundingChunks.map((chunk) => {
      if (chunk.maps) return { title: chunk.maps.title, uri: chunk.maps.uri };
      if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
      return null;
    }).filter(Boolean);

    return { text, sources };
  } catch (error) {
    console.error("Route Scan Error:", error);
    throw error;
  }
};

export const scanAreaConditions = async (locationName, coords) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `MANDATORY: Use Google Maps and Search to monitor road conditions and traffic EXCLUSIVELY within the city boundaries of ${locationName}. 
      1. Search for 'traffic congestion in ${locationName}', 'road construction ${locationName}', and 'road hazards ${locationName}'.
      2. DO NOT include data from neighboring cities (e.g., if searching Salem, do not include Tiruppur).
      3. Identify specific street names for any issues found.
      4. If the area is generally quiet, report 'NORMAL CONDITIONS' for major thoroughfares.`,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: coords ? { latitude: coords.latitude, longitude: coords.longitude } : undefined
          }
        }
      },
    });

    const text = response.text || "No data found.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = groundingChunks.map((chunk) => {
      if (chunk.maps) return { title: chunk.maps.title, uri: chunk.maps.uri };
      if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
      return null;
    }).filter(Boolean);

    return { text, sources };
  } catch (error) {
    console.error("Area Scan Error:", error);
    throw error;
  }
};

export const parseScanToIncidents = async (scanText) => {
  if (!scanText || scanText.length < 10) return { incidents: [], weatherSummary: null };

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this road report: "${scanText}".
      1. Extract all road incidents, traffic jams, and construction zones.
      2. Extract the current general weather/environmental status for the area (temperature, condition like Sunny/Rainy, and feel like Hot/Cold).
      
      IMPORTANT: You MUST categorize every finding into exactly one of these types:
      - ACCIDENT HAZARD
      - ROADWORK
      - FLOODING RISK
      - TRAFFIC JAM
      - CONSTRUCTION
      - CLEAR (Use only if no hazards are found)
      
      Return strictly a JSON object with these fields:
      {
        "incidents": [
          {
            "type": "One of the 6 types listed above",
            "severity": "LOW, MEDIUM, HIGH, CRITICAL",
            "specificLocation": "Street name or landmark",
            "description": "Summary",
            "recommendation": "Advice",
            "safetyScore": 0-100,
            "flowStatus": "e.g., Heavy Congestion, Free Flow",
            "delayMinutes": number or null,
            "weather": "Condition"
          }
        ],
        "weatherSummary": {
          "temperature": "e.g., 32°C",
          "condition": "e.g., Sunny",
          "status": "e.g., Hot"
        }
      }`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      incidents: Array.isArray(result.incidents) ? result.incidents : [],
      weatherSummary: result.weatherSummary || { temperature: "N/A", condition: "Unknown", status: "Neutral" }
    };
  } catch (e) {
    console.error("Parsing Error:", e);
    return {
      incidents: [{
        type: 'CLEAR',
        severity: 'LOW',
        specificLocation: 'General Area',
        description: 'System could not identify specific hazards. Proceed with standard caution.',
        recommendation: 'Monitor local news for sudden changes.',
        safetyScore: 95,
        flowStatus: 'Normal',
        delayMinutes: null,
        weather: 'Clear'
      }],
      weatherSummary: { temperature: "N/A", condition: "Unknown", status: "Neutral" }
    };
  }
};
