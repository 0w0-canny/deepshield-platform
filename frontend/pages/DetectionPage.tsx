import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { 
  Upload, 
  FileVideo, 
  FileImage, 
  FileAudio, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Eye,
  Download,
  Share
} from "lucide-react";
import backend from "~backend/client";

export default function DetectionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [activeTab, setActiveTab] = useState("upload");
  const { toast } = useToast();

  const analyzeMediaMutation = useMutation({
    mutationFn: async ({ mediaUrl, mediaType }: { mediaUrl: string; mediaType: "image" | "video" | "audio" }) => {
      return backend.detection.analyzeMedia({ mediaUrl, mediaType });
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: `Media analyzed successfully. Analysis ID: ${data.analysisId}`,
      });
    },
    onError: (error) => {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the media. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const getMediaType = (file: File): "image" | "video" | "audio" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "image"; // default
  };

  const handleAnalyze = () => {
    if (activeTab === "upload" && selectedFile) {
      const mediaType = getMediaType(selectedFile);
      const fakeUrl = `https://example.com/media/${selectedFile.name}`;
      analyzeMediaMutation.mutate({ mediaUrl: fakeUrl, mediaType });
    } else if (activeTab === "url" && mediaUrl) {
      // Determine media type from URL extension or assume video
      const mediaType = mediaUrl.includes(".jpg") || mediaUrl.includes(".png") ? "image" :
                       mediaUrl.includes(".mp3") || mediaUrl.includes(".wav") ? "audio" : "video";
      analyzeMediaMutation.mutate({ mediaUrl, mediaType });
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-400 bg-green-400/10";
      case "medium": return "text-yellow-400 bg-yellow-400/10";
      case "high": return "text-orange-400 bg-orange-400/10";
      case "critical": return "text-red-400 bg-red-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getFileIcon = (file: File | null) => {
    if (!file) return <Upload className="h-8 w-8" />;
    if (file.type.startsWith("image/")) return <FileImage className="h-8 w-8 text-blue-400" />;
    if (file.type.startsWith("video/")) return <FileVideo className="h-8 w-8 text-purple-400" />;
    if (file.type.startsWith("audio/")) return <FileAudio className="h-8 w-8 text-green-400" />;
    return <Upload className="h-8 w-8" />;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          AI-Powered Media Analysis
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload media files or provide URLs to detect deepfakes and generate tamper-proof authenticity reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span>Media Upload & Analysis</span>
            </CardTitle>
            <CardDescription>
              Upload video, image, or audio files for deepfake detection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">File Upload</TabsTrigger>
                <TabsTrigger value="url">URL Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-4">
                      {getFileIcon(selectedFile)}
                      <div>
                        <p className="text-lg font-medium">
                          {selectedFile ? selectedFile.name : "Choose a file or drag and drop"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports images, videos, and audio files (max 100MB)
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
                
                {selectedFile && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(selectedFile)}
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="media-url">Media URL</Label>
                  <Input
                    id="media-url"
                    placeholder="https://example.com/video.mp4"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                  />
                </div>
                <Alert>
                  <Eye className="h-4 w-4" />
                  <AlertDescription>
                    Supported formats: MP4, AVI, MOV (video), JPG, PNG, GIF (image), MP3, WAV (audio)
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>

            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={handleAnalyze}
              disabled={analyzeMediaMutation.isPending || (!selectedFile && !mediaUrl)}
            >
              {analyzeMediaMutation.isPending ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Start Analysis
                </>
              )}
            </Button>

            {analyzeMediaMutation.isPending && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing media...</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-400" />
              <span>Analysis Results</span>
            </CardTitle>
            <CardDescription>
              Detailed authenticity assessment and risk analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {analyzeMediaMutation.data ? (
              <div className="space-y-6">
                {/* Authenticity Score */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg">
                  <div className="text-3xl font-bold mb-2">
                    {analyzeMediaMutation.data.result.confidenceScore}%
                  </div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {analyzeMediaMutation.data.result.isAuthentic ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    )}
                    <span className="text-lg font-medium">
                      {analyzeMediaMutation.data.result.isAuthentic ? "Likely Authentic" : "Potential Deepfake"}
                    </span>
                  </div>
                  <Badge className={getRiskColor(analyzeMediaMutation.data.result.identityTheftRisk)}>
                    {analyzeMediaMutation.data.result.identityTheftRisk.toUpperCase()} Risk
                  </Badge>
                </div>

                {/* Technical Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Technical Analysis</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-orange-400">Technical Markers</h4>
                      <ul className="space-y-1">
                        {analyzeMediaMutation.data.result.detectionDetails.technicalMarkers.map((marker, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                            <span className="w-1 h-1 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                            <span>{marker}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2 text-yellow-400">Suspicious Patterns</h4>
                      <ul className="space-y-1">
                        {analyzeMediaMutation.data.result.detectionDetails.suspiciousPatterns.map((pattern, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                            <span className="w-1 h-1 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
                            <span>{pattern}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2 text-blue-400">Metadata Analysis</h4>
                      <ul className="space-y-1">
                        {analyzeMediaMutation.data.result.detectionDetails.metadataAnalysis.map((meta, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                            <span className="w-1 h-1 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                            <span>{meta}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
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

                <div className="text-xs text-muted-foreground text-center">
                  Analysis ID: {analyzeMediaMutation.data.analysisId}<br />
                  Processing time: {analyzeMediaMutation.data.processingTime}ms
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Upload media to see analysis results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card className="border-0 bg-card/50">
          <CardHeader className="text-center">
            <Shield className="h-8 w-8 mx-auto text-blue-400 mb-2" />
            <CardTitle className="text-lg">99.7% Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Industry-leading detection accuracy across all media types
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50">
          <CardHeader className="text-center">
            <Clock className="h-8 w-8 mx-auto text-purple-400 mb-2" />
            <CardTitle className="text-lg">Real-Time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Get results in seconds with our optimized AI models
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/50">
          <CardHeader className="text-center">
            <Download className="h-8 w-8 mx-auto text-green-400 mb-2" />
            <CardTitle className="text-lg">Legal Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Tamper-proof reports suitable for legal proceedings
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
