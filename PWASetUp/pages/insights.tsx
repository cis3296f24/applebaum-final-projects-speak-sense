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
        const res = await fetch('http://localhost:8080/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: "Analyze the following speech and provide detailed feedback including: 1) Key strengths 2) Areas for improvement 3) Specific tips for better speaking 4) Tone analysis 5) Overall confidence score. Format the response in JSON.",
          }),
        });
        
        if (res.ok) {
          const data = await res.json();
          setResponse(data.message);
          
          // Process the API response into structured feedback
          try {
            // You might need to adjust this parsing based on your API response format
            const parsedFeedback = {
              strengths: extractStrengths(data.message),
              weaknesses: extractWeaknesses(data.message),
              tips: extractTips(data.message),
              toneAnalysis: extractToneAnalysis(data.message),
              confidenceScore: calculateConfidenceScore(data.message)
            };
            setProcessedFeedback(parsedFeedback);
          } catch (parseError) {
            console.error('Error parsing feedback:', parseError);
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

  // Helper functions to extract information from API response
  const extractStrengths = (text: string): string[] => {
    // Implement extraction logic based on your API response format
    return ['Clear articulation', 'Good pace', 'Engaging tone'];
  };

  const extractWeaknesses = (text: string): string[] => {
    return ['Occasional filler words', 'Could vary vocabulary more'];
  };

  const extractTips = (text: string): string[] => {
    return ['Practice pausing instead of using filler words', 'Record yourself speaking'];
  };

  const extractToneAnalysis = (text: string): string => {
    return 'Your tone is professional with elements of conversational style';
  };

  const calculateConfidenceScore = (text: string): number => {
    return 85; // Example score
  };

  return (
    <Page>
      <Section>
        <div>
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
              {/* Confidence Score Card */}
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

              {/* Detailed Analysis Card */}
              <Card className="mb-6">
                <CardHeader>
                  <h3 className="text-xl font-bold">Detailed Analysis</h3>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="space-y-6">
                    {/* Strengths */}
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">Key Strengths</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {processedFeedback.strengths.map((strength, index) => (
                          <li key={index} className="text-zinc-600">{strength}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div>
                      <h4 className="font-semibold text-amber-600 mb-2">Areas for Improvement</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {processedFeedback.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-zinc-600">{weakness}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvement Tips */}
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

                    {/* Tone Analysis */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">
                        🎭 Tone Analysis
                      </h4>
                      <p className="text-purple-600">{processedFeedback.toneAnalysis}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Raw API Response (for debugging) */}
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