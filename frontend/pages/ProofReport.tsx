import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Shield, Download, ExternalLink, CheckCircle, AlertCircle, Hash, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import backend from '~backend/client';

export default function ProofReport() {
  const { id } = useParams<{ id: string }>();

  const reportQuery = useQuery({
    queryKey: ['proofReport', id],
    queryFn: async () => {
      if (!id) throw new Error('Report ID is required');
      return await backend.detection.getProofReport({ id });
    },
    enabled: !!id,
  });

  if (reportQuery.isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (reportQuery.error || !reportQuery.data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <Card>
          <CardContent className="p-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
            <p className="text-gray-600">
              The requested proof report could not be found or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const report = reportQuery.data;
  const result = report.detectionResult;

  const getRiskLevel = (score: number): { level: string; color: string; bgColor: string } => {
    if (score >= 80) return { level: 'Critical', color: 'text-red-700', bgColor: 'bg-red-100' };
    if (score >= 60) return { level: 'High', color: 'text-orange-700', bgColor: 'bg-orange-100' };
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
    return { level: 'Low', color: 'text-green-700', bgColor: 'bg-green-100' };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Shield className="h-4 w-4" />
          <span>Tamper-Proof Report</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Detection Analysis Report
        </h1>
        <p className="text-xl text-gray-600">
          Blockchain-secured forensic analysis for legal proceedings
        </p>
      </div>

      {/* Report Metadata */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <span>Report Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Report Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Report ID:</span>
                  <span className="font-mono text-gray-900">{report.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Generated:</span>
                  <span className="text-gray-900">{new Date(report.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-700">
                    {report.isTamperProof ? 'Tamper-Proof' : 'Standard'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Blockchain Verification</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Hash:</span>
                  <span className="font-mono text-xs text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {report.hash}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Blockchain Ref:</span>
                  <span className="font-mono text-xs text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {report.blockchainReference}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detection Results */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                {result.isFake ? (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
                <span>Detection Analysis</span>
              </CardTitle>
              <CardDescription>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4" />
                  <span>Analyzed on {new Date(result.timestamp).toLocaleString()}</span>
                </div>
              </CardDescription>
            </div>
            <Badge 
              variant={result.isFake ? "destructive" : "default"}
              className="text-lg px-4 py-2"
            >
              {result.isFake ? 'DEEPFAKE DETECTED' : 'AUTHENTIC MEDIA'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Confidence and Risk Scores */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Detection Confidence</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Confidence Level</span>
                  <span className="font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <Progress value={result.confidence * 100} className="h-3" />
                <p className="text-sm text-gray-600">
                  {result.confidence >= 0.9 ? 'Very High' : 
                   result.confidence >= 0.7 ? 'High' : 
                   result.confidence >= 0.5 ? 'Moderate' : 'Low'} confidence in detection result
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Identity Theft Risk Assessment</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Risk Score</span>
                  {(() => {
                    const risk = getRiskLevel(result.identityTheftScore);
                    return (
                      <Badge className={`${risk.bgColor} ${risk.color} border-0`}>
                        {result.identityTheftScore.toFixed(1)} - {risk.level}
                      </Badge>
                    );
                  })()}
                </div>
                <Progress value={result.identityTheftScore} className="h-3" />
                <p className="text-sm text-gray-600">
                  Potential for misuse in identity theft or fraud scenarios
                </p>
              </div>
            </div>
          </div>

          {/* Technical Analysis */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Technical Analysis Details</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-900">Media Type:</span>
                  <p className="text-gray-700 capitalize">{result.mediaType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">Analysis Method:</span>
                  <p className="text-gray-700">AI Neural Network Detection</p>
                </div>
              </div>
              
              {result.analysisDetails.faceManipulation !== undefined && (
                <div>
                  <span className="text-sm font-medium text-gray-900">Face Manipulation Score:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress value={result.analysisDetails.faceManipulation} className="flex-1 h-2" />
                    <span className="text-sm font-medium">{result.analysisDetails.faceManipulation.toFixed(1)}%</span>
                  </div>
                </div>
              )}
              
              {result.analysisDetails.voiceCloning !== undefined && (
                <div>
                  <span className="text-sm font-medium text-gray-900">Voice Cloning Score:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress value={result.analysisDetails.voiceCloning} className="flex-1 h-2" />
                    <span className="text-sm font-medium">{result.analysisDetails.voiceCloning.toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detection Indicators */}
          {result.analysisDetails.deepfakeIndicators && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Detection Indicators</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {result.analysisDetails.deepfakeIndicators.map((indicator: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {indicator}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legal Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="font-semibold text-blue-900 mb-2">Legal Notice</h4>
          <p className="text-blue-800 text-sm leading-relaxed">
            This report has been generated using AI-powered detection algorithms and is secured via blockchain 
            technology to ensure tamper-proof integrity. The report can be used as supporting evidence in legal 
            proceedings. For questions about admissibility in court, consult with a qualified attorney familiar 
            with digital forensics and AI-generated evidence.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Download className="h-5 w-5 mr-2" />
          Download PDF Report
        </Button>
        <Button variant="outline" size="lg">
          <ExternalLink className="h-5 w-5 mr-2" />
          Verify on Blockchain
        </Button>
        <Button variant="outline" size="lg">
          <FileText className="h-5 w-5 mr-2" />
          Generate Legal Summary
        </Button>
      </div>
    </div>
  );
}
