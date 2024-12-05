import { useEffect, useState } from 'react';
import Page from '../components/page';
import Section from '../components/section';
import { fullTranscriptGlobal } from 'pages';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Divider,
  Chip,
  Progress
} from "@nextui-org/react";

interface AIFeedback {
  strengths: string[];
  weaknesses: string[];
  tips: string[];
  toneAnalysis: string;
  confidenceScore: number;
}

const Insights = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processedFeedback, setProcessedFeedback] = useState<AIFeedback | null>(null);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        if (!fullTranscriptGlobal) {
          setError("No speech transcript available. Please record your speech first.");
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:8080/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `Analyze the following speech transcript: "${fullTranscriptGlobal}". 
                    Please provide a detailed analysis in the following JSON format:
                    {
                      "strengths": ["strength1", "strength2", ...],
                      "weaknesses": ["weakness1", "weakness2", ...],
                      "tips": ["tip1", "tip2", ...],
                      "toneAnalysis": "detailed tone analysis",
                      "confidenceScore": number between 0-100
                    }`,
          }),
        });
        
        if (res.ok) {
          const data = await res.json();
          setResponse(data.message);
          
          try {
            const parsedFeedback = parseAIResponse(data.message);
            setProcessedFeedback(parsedFeedback);
          } catch (parseError) {
            console.error('Error parsing feedback:', parseError);
            setError("Error processing AI response");
          }
        } else {
          throw new Error('Failed to fetch insights');
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, []);

  const parseAIResponse = (text: string): AIFeedback => {
    try {
      const jsonResponse = JSON.parse(text);
      return {
        strengths: jsonResponse.strengths || [],
        weaknesses: jsonResponse.weaknesses || [],
        tips: jsonResponse.tips || [],
        toneAnalysis: jsonResponse.toneAnalysis || "Analysis not available",
        confidenceScore: jsonResponse.confidenceScore || 0
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        strengths: ["Clear communication"],
        weaknesses: ["Areas for improvement not analyzed"],
        tips: ["Recording more samples will help provide better analysis"],
        toneAnalysis: "Analysis not available",
        confidenceScore: 50
      };
    }
  };

  return (
    <Page>
      <Section>
        <div className="p-8 pt-20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Speech Insights</h1>
              <p className="text-zinc-500">AI-powered analysis and recommendations</p>
            </div>
          </div>

          {loading && (
            <Card>
              <CardBody>
                <div className="text-center py-4">
                  <p className="text-zinc-600">Analyzing your speech patterns...</p>
                </div>
              </CardBody>
            </Card>
          )}

          {error && (
            <Card>
              <CardBody>
                <div className="text-red-600 py-4">
                  Error: {error}
                </div>
              </CardBody>
            </Card>
          )}

          {processedFeedback && (
            <>
              <Card className="mb-6">
                <CardBody>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Speaking Confidence</span>
                      <Chip color="primary" variant="flat">
                        {processedFeedback.confidenceScore}%
                      </Chip>
                    </div>
                    <Progress 
                      value={processedFeedback.confidenceScore} 
                      color={processedFeedback.confidenceScore > 80 ? "success" : "primary"}
                      className="h-2"
                    />
                  </div>
                </CardBody>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <h3 className="text-xl font-bold">Detailed Analysis</h3>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">Key Strengths</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {processedFeedback.strengths.map((strength, index) => (
                          <li key={index} className="text-zinc-600">{strength}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-amber-600 mb-2">Areas for Improvement</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {processedFeedback.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-zinc-600">{weakness}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        💡 Improvement Tips
                      </h4>
                      <ul className="space-y-2">
                        {processedFeedback.tips.map((tip, index) => (
                          <li key={index} className="text-blue-600">{tip}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">
                        🎭 Tone Analysis
                      </h4>
                      <p className="text-purple-600">{processedFeedback.toneAnalysis}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold">Raw Analysis</h3>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="text-zinc-600">{response}</p>
                </CardBody>
              </Card>
            </>
          )}
        </div>
      </Section>
    </Page>
  );
};

export default Insights;