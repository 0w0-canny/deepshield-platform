import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { 
  Radio, 
  Play, 
  Square, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Activity,
  Clock,
  Shield,
  Settings,
  Download,
  Share
} from "lucide-react";
import backend from "~backend/client";

export default function StreamingPage() {
  const [streamUrl, setStreamUrl] = useState("");
  const [sensitivity, setSensitivity] = useState<"low" | "medium" | "high">("medium");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<Array<{
    timestamp: Date;
    frameId: number;
    detectionResult: {
      isAuthentic: boolean;
      confidenceScore: number;
      alerts: string[];
    };
    metadata: {
      resolution: string;
      bitrate: number;
      fps: number;
    };
  }>>([]);
  const { toast } = useToast();

  const startAnalysis = async () => {
    if (!streamUrl) {
      toast({
        title: "Stream URL Required",
        description: "Please enter a stream URL to begin analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisData([]);

    try {
      const stream = await backend.streaming.analyzeStream({
        streamUrl,
        sensitivity
      });

      for await (const event of stream) {
        setAnalysisData(prev => [...prev.slice(-20), event]); // Keep last 20 events
      }

      toast({
        title: "Analysis Complete",
        description: "Stream analysis has finished successfully.",
      });
    } catch (error) {
      console.error("Stream analysis error:", error);
      toast({
        title: "Analysis Error",
        description: "There was an error analyzing the stream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
    toast({
      title: "Analysis Stopped",
      description: "Stream analysis has been stopped.",
    });
  };

  const latestFrame = analysisData[analysisData.length - 1];
  const authenticFrames = analysisData.filter(frame => frame.detectionResult.isAuthentic).length;
  const totalFrames = analysisData.length;
  const authenticityRate = totalFrames > 0 ? (authenticFrames / totalFrames) * 100 : 0;

  const getSensitivityColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-400 bg-green-400/10";
      case "medium": return "text-yellow-400 bg-yellow-400/10";
      case "high": return "text-red-400 bg-red-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Real-Time Stream Analysis
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Monitor live video streams for deepfake content with real-time AI detection and instant alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-400" />
                <span>Stream Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure your stream analysis settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stream-url">Stream URL</Label>
                <Input
                  id="stream-url"
                  placeholder="rtmp://example.com/live/stream"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>

              <div className="space-y-2">
                <Label>Detection Sensitivity</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <Button
                      key={level}
                      variant={sensitivity === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSensitivity(level)}
                      disabled={isAnalyzing}
                      className={sensitivity === level ? getSensitivityColor(level) : ""}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                {isAnalyzing ? (
                  <Button
                    onClick={stopAnalysis}
                    className="w-full bg-red-500 hover:bg-red-600"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Stop Analysis
                  </Button>
                ) : (
                  <Button
                    onClick={startAnalysis}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={!streamUrl}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Analysis
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-400" />
                  <span>Frames Analyzed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFrames.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Authenticity Rate</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{authenticityRate.toFixed(1)}%</div>
                <Progress value={authenticityRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-orange-500/10 to-red-500/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  <span>Active Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestFrame?.detectionResult.alerts.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Analysis Display */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Radio className={`h-5 w-5 ${isAnalyzing ? "text-red-400 animate-pulse" : "text-gray-400"}`} />
                <span>Live Analysis {isAnalyzing && "(ACTIVE)"}</span>
              </CardTitle>
              <CardDescription>
                Real-time deepfake detection results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing && streamUrl ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Activity className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                      <p className="text-lg font-medium">Analyzing Stream</p>
                      <p className="text-sm opacity-70">{streamUrl}</p>
                    </div>
                  </div>

                  {latestFrame && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-0 bg-card/50">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-1">
                              {latestFrame.detectionResult.confidenceScore.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Confidence</div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-card/50">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-1">
                              {latestFrame.metadata.fps}
                            </div>
                            <div className="text-sm text-muted-foreground">FPS</div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-card/50">
                        <CardContent className="pt-4">
                          <div className="text-center">
                            <div className="text-lg font-bold mb-1">
                              {latestFrame.metadata.resolution}
                            </div>
                            <div className="text-sm text-muted-foreground">Resolution</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Radio className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Enter a stream URL and click Start Analysis</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          {analysisData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <span>Recent Detections</span>
                </CardTitle>
                <CardDescription>
                  Latest frame analysis results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {analysisData.slice(-10).reverse().map((frame, index) => (
                    <div
                      key={frame.frameId}
                      className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {frame.detectionResult.isAuthentic ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        )}
                        <div>
                          <p className="font-medium">
                            Frame #{frame.frameId}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {frame.detectionResult.confidenceScore.toFixed(1)}% confidence
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {frame.timestamp.toLocaleTimeString()}
                        </div>
                        {frame.detectionResult.alerts.length > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {frame.detectionResult.alerts.length} alerts
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Export Options */}
          {analysisData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Export Analysis</CardTitle>
                <CardDescription>
                  Download or share your analysis results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share className="mr-2 h-4 w-4" />
                    Share Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="border-0 bg-card/50 text-center">
          <CardHeader>
            <Shield className="h-8 w-8 mx-auto text-blue-400 mb-2" />
            <CardTitle className="text-lg">Real-Time Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Instant deepfake detection with sub-second latency
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 text-center">
          <CardHeader>
            <Eye className="h-8 w-8 mx-auto text-purple-400 mb-2" />
            <CardTitle className="text-lg">Multi-Protocol Support</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Compatible with RTMP, HLS, WebRTC, and more
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50 text-center">
          <CardHeader>
            <Activity className="h-8 w-8 mx-auto text-green-400 mb-2" />
            <CardTitle className="text-lg">Live Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Continuous monitoring with instant alerts and reports
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
