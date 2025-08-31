import React, { useState } from 'react';
import { Upload, File, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import backend from '~backend/client';
import type { AnalyzeMediaRequest, DetectionResult } from '~backend/detection/analyze_media';

export default function Detection() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [proofReportId, setProofReportId] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (request: AnalyzeMediaRequest) => {
      return await backend.detection.analyzeMedia(request);
    },
    onSuccess: (data) => {
      setResult(data.result);
      setProofReportId(data.proofReportId);
      toast({
        title: "Analysis Complete",
        description: "Your media has been analyzed successfully.",
      });
    },
    onError: (error) => {
      console.error('Analysis failed:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing your media. Please try again.",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile);
        setResult(null);
        setProofReportId(null);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload an image, video, or audio file.",
        });
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
        setResult(null);
        setProofReportId(null);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload an image, video, or audio file.",
        });
      }
    }
  };

  const isValidFileType = (file: File): boolean => {
    const validTypes = ['image/', 'video/', 'audio/'];
    return validTypes.some(type => file.type.startsWith(type));
  };

  const getMediaType = (file: File): "image" | "video" | "audio" => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'audio';
  };

  const analyzeFile = async () => {
    if (!file) return;
    
    // Create a mock URL for demo purposes
    const mockUrl = `https://example.com/media/${file.name}`;
    
    analyzeMutation.mutate({
      mediaUrl: mockUrl,
      mediaType: getMediaType(file),
    });
  };

  const getRiskLevel = (score: number): { level: string; color: string; bgColor: string } => {
    if (score >= 80) return { level: 'Critical', color: 'text-red-700', bgColor: 'bg-red-100' };
    if (score >= 60) return { level: 'High', color: 'text-orange-700', bgColor: 'bg-orange-100' };
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
    return { level: 'Low', color: 'text-green-700', bgColor: 'bg-green-100' };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI-Powered Media Detection
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload your media files to detect deepfakes and generate tamper-proof analysis reports
        </p>
      </div>

      {/* Upload Section */}
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30">
        <CardContent className="p-8">
          <div
            className={`text-center transition-all duration-200 ${
              dragActive ? 'scale-105' : ''
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Media for Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Supports images, videos, and audio files (max 100MB)
            </p>
            
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*,video/*,audio/*"
              onChange={handleFileInput}
            />
            <label htmlFor="file-upload">
              <Button asChild className="cursor-pointer">
                <span>Choose File</span>
              </Button>
            </label>
          </div>

          {file && (
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                  </p>
                </div>
                <Button 
                  onClick={analyzeFile} 
                  disabled={analyzeMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Media'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {analyzeMutation.isPending && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold">AI Analysis in Progress</h3>
              <p className="text-gray-600">
                Our advanced algorithms are examining your media for signs of manipulation...
              </p>
              <Progress value={75} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    {result.isFake ? (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    ) : (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    )}
                    <span>Detection Results</span>
                  </CardTitle>
                  <CardDescription>
                    Analysis completed on {new Date(result.timestamp).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge 
                  variant={result.isFake ? "destructive" : "default"}
                  className="text-lg px-4 py-2"
                >
                  {result.isFake ? 'DEEPFAKE DETECTED' : 'AUTHENTIC'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Confidence Score</h4>
                  <div className="flex items-center space-x-2">
                    <Progress value={result.confidence * 100} className="flex-1" />
                    <span className="font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Identity Theft Risk</h4>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const risk = getRiskLevel(result.identityTheftScore);
                      return (
                        <>
                          <Progress 
                            value={result.identityTheftScore} 
                            className="flex-1"
                          />
                          <Badge className={`${risk.bgColor} ${risk.color} border-0`}>
                            {risk.level}
                          </Badge>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Analysis Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Analysis Details</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.analysisDetails.faceManipulation !== undefined && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">Face Manipulation</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {result.analysisDetails.faceManipulation.toFixed(1)}%
                      </div>
                    </div>
                  )}
                  
                  {result.analysisDetails.voiceCloning !== undefined && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">Voice Cloning</div>
                      <div className="text-lg font-semibold text-purple-600">
                        {result.analysisDetails.voiceCloning.toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>

                {result.analysisDetails.deepfakeIndicators && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Detected Indicators</h5>
                    <div className="flex flex-wrap gap-2">
                      {result.analysisDetails.deepfakeIndicators.map((indicator: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Proof Report Link */}
              {proofReportId && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Tamper-Proof Report Generated</h4>
                  <p className="text-blue-700 text-sm mb-3">
                    A blockchain-secured proof report has been generated for legal use.
                  </p>
                  <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                    <a href={`/report/${proofReportId}`}>View Proof Report</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
