import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Book, Play, Clock, Users, AlertTriangle, ExternalLink, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import backend from '~backend/client';
import type { Tutorial } from '~backend/education/get_tutorials';
import type { CaseStudy } from '~backend/education/get_case_studies';

export default function Education() {
  const [tutorialFilter, setTutorialFilter] = useState('all');
  const [caseFilter, setCaseFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const tutorialsQuery = useQuery({
    queryKey: ['tutorials'],
    queryFn: async () => {
      const response = await backend.education.getTutorials();
      return response.tutorials;
    },
  });

  const caseStudiesQuery = useQuery({
    queryKey: ['caseStudies'],
    queryFn: async () => {
      const response = await backend.education.getCaseStudies();
      return response.caseStudies;
    },
  });

  const filteredTutorials = tutorialsQuery.data?.filter((tutorial: Tutorial) => {
    const matchesFilter = tutorialFilter === 'all' || tutorial.category.toLowerCase() === tutorialFilter.toLowerCase();
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const filteredCaseStudies = caseStudiesQuery.data?.filter((caseStudy: CaseStudy) => {
    const matchesFilter = caseFilter === 'all' || caseStudy.severity.toLowerCase() === caseFilter.toLowerCase();
    const matchesSearch = caseStudy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseStudy.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Education Center
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Learn to identify deepfakes and protect yourself from digital deception through 
          our comprehensive tutorials and real-world case studies.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tutorials and case studies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="tutorials" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tutorials" className="flex items-center space-x-2">
            <Book className="h-4 w-4" />
            <span>Tutorials</span>
          </TabsTrigger>
          <TabsTrigger value="case-studies" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Case Studies</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Educational Tutorials</h2>
            <Select value={tutorialFilter} onValueChange={setTutorialFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="detection">Detection</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial: Tutorial) => (
              <Card key={tutorial.id} className="hover:shadow-lg transition-all duration-200 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      {tutorial.videoUrl ? (
                        <Play className="h-6 w-6 text-white" />
                      ) : (
                        <Book className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <Badge className={getDifficultyColor(tutorial.difficulty)}>
                      {tutorial.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                  <CardDescription>{tutorial.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{tutorial.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{tutorial.views} views</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {tutorial.tags.slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full">
                    Start Tutorial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="case-studies" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Real-World Case Studies</h2>
            <Select value={caseFilter} onValueChange={setCaseFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity Levels</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {filteredCaseStudies.map((caseStudy: CaseStudy) => (
              <Card key={caseStudy.id} className="hover:shadow-lg transition-all duration-200 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <Badge className={getSeverityColor(caseStudy.severity)}>
                      {caseStudy.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{caseStudy.title}</CardTitle>
                  <CardDescription>{caseStudy.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Media Type:</span>
                      <p className="text-gray-600">{caseStudy.mediaType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Attack Method:</span>
                      <p className="text-gray-600">{caseStudy.attackMethod}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-900 text-sm">Victim Profile:</span>
                    <p className="text-gray-600 text-sm">{caseStudy.victimProfile}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-900 text-sm">Outcome:</span>
                    <p className="text-gray-600 text-sm">{caseStudy.outcome}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-900 text-sm">Prevention Tips:</span>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 mt-1">
                      {caseStudy.preventionTips.slice(0, 2).map((tip: string, index: number) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {caseStudy.tags.slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Case Study
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
