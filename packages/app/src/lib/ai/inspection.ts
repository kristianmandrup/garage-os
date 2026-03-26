import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export interface DetectionItem {
  label: string;
  severity: 'info' | 'warning' | 'critical';
  confidence: number;
  category: string;
  description?: string;
  estimatedRepairCost?: number;
}

export interface AIInspectionResult {
  detections: DetectionItem[];
  overallCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  summary: string;
  confidence: number;
}

const PARTS_CATEGORIES = [
  'brake',
  'tire',
  'engine',
  'transmission',
  'suspension',
  'electrical',
  'body',
  'fluid',
  'exhaust',
  'safety',
];

const SEVERITY_MAP: Record<string, 'info' | 'warning' | 'critical'> = {
  low: 'info',
  medium: 'warning',
  high: 'critical',
};

export async function analyzeVehiclePhoto(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<AIInspectionResult> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ],
  });

  const prompt = `You are an expert automotive mechanic AI assistant. Analyze this vehicle photo and identify any visible issues or damage.

Focus on these categories:
${PARTS_CATEGORIES.join(', ')}

For each issue found, provide:
1. A clear label (e.g., "Worn brake pads", "Cracked windshield")
2. Severity level: low (info), medium (warning), or high (critical)
3. Confidence score (0-1)
4. Category from the list above
5. Brief description of what you observed
6. Estimated repair cost in THB (Thai Baht)

Return a JSON response with this structure:
{
  "detections": [
    {
      "label": "string",
      "severity": "info" | "warning" | "critical",
      "confidence": 0.0-1.0,
      "category": "string",
      "description": "string",
      "estimatedRepairCost": number
    }
  ],
  "overallCondition": "excellent" | "good" | "fair" | "poor" | "critical",
  "summary": "Overall assessment string",
  "confidence": 0.0-1.0
}

If no issues found, return "excellent" or "good" condition with empty detections array.

Be thorough but conservative - only report issues you can clearly see.`;

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
      prompt,
    ]);

    const response = result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      detections: parsed.detections || [],
      overallCondition: parsed.overallCondition || 'good',
      summary: parsed.summary || 'Analysis complete',
      confidence: parsed.confidence || 0.8,
    };
  } catch (error) {
    console.error('AI inspection error:', error);
    throw new Error('Failed to analyze vehicle photo');
  }
}

export async function diagnoseFromSymptoms(
  symptoms: string[],
  vehicleInfo: {
    brand: string;
    model: string;
    year: number;
    mileage?: number;
  }
): Promise<{
  suggestions: Array<{
    symptom: string;
    possibleCauses: string[];
    recommendedActions: string[];
    urgency: 'low' | 'medium' | 'high';
  }>;
  confidence: number;
}> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const prompt = `You are an expert automotive diagnostic AI. Based on the symptoms described and vehicle information, provide diagnostic suggestions.

Vehicle: ${vehicleInfo.year} ${vehicleInfo.brand} ${vehicleInfo.model}
${vehicleInfo.mileage ? `Mileage: ${vehicleInfo.mileage.toLocaleString()} km` : ''}

Symptoms reported:
${symptoms.map((s, i) => `${i + 1}. ${s}`).join('\n')}

For each symptom, provide:
1. Possible causes (ranked by likelihood)
2. Recommended actions to diagnose/fix
3. Urgency level (low, medium, high)

Return JSON:
{
  "suggestions": [
    {
      "symptom": "string",
      "possibleCauses": ["cause1", "cause2"],
      "recommendedActions": ["action1", "action2"],
      "urgency": "low" | "medium" | "high"
    }
  ],
  "confidence": 0.0-1.0
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse diagnostic response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('AI diagnostic error:', error);
    throw new Error('Failed to generate diagnostic suggestions');
  }
}
