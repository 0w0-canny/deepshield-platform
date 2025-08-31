import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, CheckCircle, Clock, ExternalLink, Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import backend from '~backend/client';
import type { DetectionResult } from '~backend/detection/analyze_media';

export default function Results() {
  const resultsQuery = useQuery({
    queryKey: ['detectionResults'],
    queryFn: async () => {
      const response = await backend.detection.getResults();
      return response.results;
    },
  });

  const getRiskLevel = (score: number): { level: string; color: string; bgColor: string } => {
    if (score >= 80) return { level: 'Critical', color: 'text-red-700', bgColor: 'bg-red-100' };
    if (score >= 60) return { level: 'High', color: 'text-orange-700', bgColor: 'bg-orange-100' };
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
    return { level: 'Low', color: 'text-green-700', bgColor: 'bg-green-100' };
  };

  const stats = resultsQuery.data ? {
    total: resultsQuery.data.length,
    deepfakes: resultsQuery.data.filter((r: DetectionResult) => r.isFake).length,
    authentic: resultsQuery.data.filter((r: DetectionResult) => !r.isFake).length,
    averageConfidence: resultsQuery.data.reduce((acc: number, r: DetectionResult) => acc + r.confidence, 0) / resultsQuery.data.length * 100
  } : { total: 0, deepfakes: 0, authentic: 0, averageConfidence: 0 };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Detection Results
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          View all your media analysis results and track detection patterns over time
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-700 mb-2">{stats.total}</div>
            <div className="text-blue-600 text-sm font-medium">Total Analyses</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-red-700 mb-2">{stats.deepfakes}</div>
            <div className="text-red-600 text-sm font-medium">Deepfakes Detected</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-700 mb-2">{stats.authentic}</div>
            <div className="text-green-600 text-sm font-medium">Authentic Media</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-700 mb-2">{stats.averageConfidence.toFixed(1)}%</div>
            <div className="text-purple-600 text-sm font-medium">Avg. Confidence</div>
          </CardContent>
        </Card>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Recent Analyses</h2>
          <div className="flex items-center space-x-2 text-gray-600">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm">Ordered by most recent</span>
          </div>
        </div>

        {resultsQuery.isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : resultsQuery.data?.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Yet</h3>
              <p className="text-gray-600 mb-6">
                Start analyzing media files to see your detection results here.
              </p>
              <Button asChild>
                <a href="/detection">Start Detection</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {resultsQuery.data?.map((result: DetectionResult) => (
              <Card key={result.id} className="hover:shadow-lg transition-all duration-200 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {result.isFake ? (
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      ) : (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      )}
                      <div>
                        <CardTitle className="text-lg">
                          {result.mediaType.charAt(0).toUpperCase() + result.mediaType.slice(1)} Analysis
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(result.timestamp).toLocaleString()}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={result.isFake ? "destructive" : "default"}
                      className="text-sm px-3 py-1"
                    >
                      {result.isFake ? 'DEEPFAKE' : 'AUTHENTIC'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Confidence Score</div>
                      <div className="flex items-center space-x-2">
                        <Progress value={result.confidence * 100} className="flex-1" />
                        <span className="text-sm font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Identity Theft Risk</div>
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const risk = getRiskLevel(result.identityTheftScore);
                          return (
                            <>
                              <Progress 
                                value={result.identityTheftScore} 
                                className="flex-1"
                              />
                              <Badge className={`${risk.bgColor} ${risk.color} border-0 text-xs`}>
                                {risk.level}
                              </Badge>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Media Type</div>
                      <Badge variant="outline" className="text-sm">
                        {result.mediaType}
                      </Badge>
                    </div>
                  </div>

                  {/* Technical Details */}
                  {(result.analysisDetails.faceManipulation !== undefined || result.analysisDetails.voiceCloning !== undefined) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-900 mb-2">Technical Analysis</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {result.analysisDetails.faceManipulation !== undefined && (
                          <div>
                            <span className="text-gray-600">Face Manipulation:</span>
                            <span className="font-medium text-blue-600 ml-2">
                              {result.analysisDetails.faceManipulation.toFixed(1)}%
                            </span>
                          </div>
                        )}
                        {result.analysisDetails.voiceCloning !== undefined && (
                          <div>
                            <span className="text-gray-600">Voice Cloning:</span>
                            <span className="font-medium text-purple-600 ml-2">
                              {result.analysisDetails.voiceCloning.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Indicators */}
                  {result.analysisDetails.deepfakeIndicators && (
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-2">Detection Indicators</div>
                      <div className="flex flex-wrap gap-2">
                        {result.analysisDetails.deepfakeIndicators.map((indicator: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Proof Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
