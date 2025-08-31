import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star, 
  Search,
  FileText,
  Award,
  TrendingUp,
  Shield,
  Eye,
  AlertTriangle
} from "lucide-react";
import backend from "~backend/client";

export default function EducationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const { data: tutorialsData } = useQuery({
    queryKey: ["tutorials", selectedCategory, selectedDifficulty],
    queryFn: () => backend.education.getTutorials({
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      difficulty: selectedDifficulty !== "all" ? selectedDifficulty : undefined,
      limit: 20
    })
  });

  const { data: caseStudiesData } = useQuery({
    queryKey: ["case-studies"],
    queryFn: () => backend.education.getCaseStudies()
  });

  const filteredTutorials = tutorialsData?.tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-400 bg-green-400/10";
      case "intermediate": return "text-yellow-400 bg-yellow-400/10";
      case "advanced": return "text-red-400 bg-red-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "detection": return <Eye className="h-4 w-4" />;
      case "prevention": return <Shield className="h-4 w-4" />;
      case "awareness": return <AlertTriangle className="h-4 w-4" />;
      case "tools": return <Award className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-green-400 bg-green-400/10";
      case "medium": return "text-yellow-400 bg-yellow-400/10";
      case "high": return "text-orange-400 bg-orange-400/10";
      case "critical": return "text-red-400 bg-red-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Education & Awareness Center
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Learn about deepfake detection, stay informed with real-world case studies, 
          and build your expertise with our comprehensive educational resources.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <CardHeader className="text-center pb-3">
            <BookOpen className="h-8 w-8 mx-auto text-blue-400 mb-2" />
            <CardTitle className="text-2xl">{tutorialsData?.total || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">Educational Tutorials</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-emerald-500/10">
          <CardHeader className="text-center pb-3">
            <FileText className="h-8 w-8 mx-auto text-purple-400 mb-2" />
            <CardTitle className="text-2xl">{caseStudiesData?.total || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">Real-World Cases</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-orange-500/10">
          <CardHeader className="text-center pb-3">
            <Users className="h-8 w-8 mx-auto text-emerald-400 mb-2" />
            <CardTitle className="text-2xl">50K+</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">Active Learners</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-500/10 to-red-500/10">
          <CardHeader className="text-center pb-3">
            <TrendingUp className="h-8 w-8 mx-auto text-orange-400 mb-2" />
            <CardTitle className="text-2xl">95%</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">Completion Rate</CardDescription>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tutorials" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="cases">Case Studies</TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="space-y-8">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                <option value="detection">Detection</option>
                <option value="prevention">Prevention</option>
                <option value="awareness">Awareness</option>
                <option value="tools">Tools</option>
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-md text-sm"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Tutorials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial) => (
              <Card key={tutorial.id} className="hover:shadow-lg transition-shadow border-0 bg-card/50 backdrop-blur-sm">
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-t-lg flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-80" />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{tutorial.title}</CardTitle>
                    <Badge className={getDifficultyColor(tutorial.difficulty)}>
                      {tutorial.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {tutorial.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{tutorial.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{tutorial.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>{tutorial.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(tutorial.category)}
                    <Badge variant="outline" className="text-xs">
                      {tutorial.category}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {tutorial.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {tutorial.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{tutorial.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Start Tutorial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cases" className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Real-World Case Studies</h2>
            <p className="text-muted-foreground">
              Learn from actual deepfake incidents and their resolutions
            </p>
          </div>

          <div className="space-y-6">
            {caseStudiesData?.caseStudies.map((caseStudy) => (
              <Card key={caseStudy.id} className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-xl">{caseStudy.title}</CardTitle>
                        <Badge className={getSeverityColor(caseStudy.severity)}>
                          {caseStudy.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">
                        {caseStudy.description}
                      </CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {caseStudy.dateOccurred.toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-blue-400">Category</h4>
                      <Badge variant="outline">{caseStudy.category}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-purple-400">Impact Scope</h4>
                      <Badge variant="outline">{caseStudy.impactScope}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-green-400">Detection Method</h4>
                      <p className="text-sm text-muted-foreground">{caseStudy.detectionMethod}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-yellow-400">Outcome</h4>
                    <p className="text-sm text-muted-foreground">{caseStudy.outcome}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-orange-400">Key Lessons Learned</h4>
                    <ul className="space-y-1">
                      {caseStudy.lessonsLearned.map((lesson, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                          <span className="w-1 h-1 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-emerald-400">Related Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.relatedTools.map((tool) => (
                        <Badge key={tool} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
