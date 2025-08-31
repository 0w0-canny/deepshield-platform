import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  Clock, 
  MapPin,
  Search,
  ExternalLink,
  Scale,
  Shield,
  Users,
  BookOpen,
  Bot,
  FileText
} from "lucide-react";
import backend from "~backend/client";

export default function SupportPage() {
  const [chatMessage, setChatMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "assistant"; content: string; timestamp: Date }>>([]);
  const { toast } = useToast();

  const { data: resourcesData } = useQuery({
    queryKey: ["resources", selectedType],
    queryFn: () => backend.support.getResources({
      type: selectedType !== "all" ? selectedType : undefined
    })
  });

  const chatMutation = useMutation({
    mutationFn: (message: string) => backend.support.chat({
      message,
      conversationId
    }),
    onSuccess: (data) => {
      setConversationId(data.conversationId);
      setChatHistory(prev => [
        ...prev,
        { role: "user", content: chatMessage, timestamp: new Date() },
        { role: "assistant", content: data.response, timestamp: new Date() }
      ]);
      setChatMessage("");
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast({
        title: "Chat Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      chatMutation.mutate(chatMessage);
    }
  };

  const filteredResources = resourcesData?.resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "legal": return <Scale className="h-4 w-4" />;
      case "victim-support": return <Users className="h-4 w-4" />;
      case "technical": return <Shield className="h-4 w-4" />;
      case "educational": return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "legal": return "text-blue-400 bg-blue-400/10";
      case "victim-support": return "text-purple-400 bg-purple-400/10";
      case "technical": return "text-green-400 bg-green-400/10";
      case "educational": return "text-yellow-400 bg-yellow-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-400 bg-red-400/10";
      case "high": return "text-orange-400 bg-orange-400/10";
      case "medium": return "text-yellow-400 bg-yellow-400/10";
      case "low": return "text-green-400 bg-green-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Support & Legal Assistance
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Get help with deepfake-related issues through our AI legal assistant, 
          comprehensive resource directory, and victim support network.
        </p>
      </div>

      <Tabs defaultValue="chat" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="chat">Legal Assistant</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-blue-400" />
                    <span>AI Legal Assistant</span>
                  </CardTitle>
                  <CardDescription>
                    Get immediate help with deepfake-related legal questions and guidance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Chat History */}
                  <div className="h-96 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg">
                    {chatHistory.length === 0 ? (
                      <div className="text-center text-muted-foreground py-12">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Welcome! I'm here to help you with deepfake-related legal questions.</p>
                        <p className="text-sm mt-2">Ask me about reporting procedures, evidence collection, or legal rights.</p>
                      </div>
                    ) : (
                      chatHistory.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.role === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-card border"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Describe your situation or ask a legal question..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="min-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={chatMutation.isPending || !chatMessage.trim()}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Suggested Questions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Common Questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "How do I report a deepfake?",
                        "What evidence should I collect?",
                        "What are my legal rights?",
                        "How to get victim support?"
                      ].map((question) => (
                        <Button
                          key={question}
                          variant="outline"
                          size="sm"
                          onClick={() => setChatMessage(question)}
                          className="text-xs"
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="border-0 bg-gradient-to-br from-red-500/10 to-orange-500/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-red-400" />
                    <span>Emergency Support</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">Crisis Hotline</p>
                    <p className="text-muted-foreground">1-800-DEEPFAKE</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">24/7 Support</p>
                    <p className="text-muted-foreground">Available all hours</p>
                  </div>
                  <Button className="w-full" variant="destructive">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    File a Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Scale className="mr-2 h-4 w-4" />
                    Find Legal Help
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Victim Support
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Evidence Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-8">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="legal">Legal</option>
              <option value="victim-support">Victim Support</option>
              <option value="technical">Technical</option>
              <option value="educational">Educational</option>
            </select>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getTypeIcon(resource.type)}
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                      </div>
                      <CardDescription>{resource.description}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getTypeColor(resource.type)}>
                        {resource.type.replace("-", " ")}
                      </Badge>
                      <Badge className={getPriorityColor(resource.priority)}>
                        {resource.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resource.contactInfo && (
                    <div className="space-y-2 text-sm">
                      {resource.contactInfo.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{resource.contactInfo.phone}</span>
                        </div>
                      )}
                      {resource.contactInfo.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{resource.contactInfo.email}</span>
                        </div>
                      )}
                      {resource.contactInfo.hours && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{resource.contactInfo.hours}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {resource.location && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{resource.location}</span>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button className="flex-1" variant="outline" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Resource
                      </a>
                    </Button>
                    {resource.contactInfo?.phone && (
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    {resource.contactInfo?.email && (
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No resources found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search or filter settings.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
