import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MessageCircle, Send, Phone, Globe, Heart, Scale, Cpu, DollarSign, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import backend from '~backend/client';
import type { ChatRequest } from '~backend/support/legal_chatbot';
import type { VictimResource } from '~backend/support/victim_resources';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestedActions?: string[];
}

export default function Support() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm here to help with legal questions about deepfake incidents. I can provide guidance on evidence preservation, reporting procedures, potential legal remedies, and victim resources. How can I assist you today?",
      suggestedActions: ["Evidence Help", "Reporting Guide", "Legal Resources", "Find Attorney"]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState<string>();

  const resourcesQuery = useQuery({
    queryKey: ['victimResources'],
    queryFn: async () => {
      const response = await backend.support.getVictimResources();
      return response.resources;
    },
  });

  const chatMutation = useMutation({
    mutationFn: async (request: ChatRequest) => {
      return await backend.support.legalChat(request);
    },
    onSuccess: (data) => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        suggestedActions: data.suggestedActions
      }]);
      setConversationId(data.conversationId);
    },
  });

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    setChatMessages(prev => [...prev, {
      role: 'user',
      content: inputMessage
    }]);

    chatMutation.mutate({
      message: inputMessage,
      conversationId
    });

    setInputMessage('');
  };

  const handleSuggestedAction = (action: string) => {
    setInputMessage(action);
    sendMessage();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'legal': return Scale;
      case 'psychological': return Heart;
      case 'technical': return Cpu;
      case 'financial': return DollarSign;
      default: return Heart;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'legal': return 'from-blue-500 to-indigo-500';
      case 'psychological': return 'from-green-500 to-emerald-500';
      case 'technical': return 'from-purple-500 to-violet-500';
      case 'financial': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'hotline': return Phone;
      case 'website': return Globe;
      case 'organization': return Heart;
      default: return Heart;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Victim Support Center
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get legal guidance, access victim resources, and find support for deepfake-related incidents
        </p>
      </div>

      <Tabs defaultValue="chatbot" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chatbot" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Legal Chatbot</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>Victim Resources</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chatbot" className="space-y-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center">
                  <Scale className="h-4 w-4 text-white" />
                </div>
                <span>Legal AI Assistant</span>
              </CardTitle>
              <CardDescription>
                Get immediate legal guidance for deepfake incidents. This is informational only - consult with a qualified attorney for specific legal advice.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col space-y-4">
              <ScrollArea className="flex-1 p-4 border rounded-lg bg-gray-50">
                <div className="space-y-4">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border shadow-sm'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        {message.suggestedActions && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggestedActions.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestedAction(action)}
                                className="text-xs h-7"
                              >
                                {action}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-white border shadow-sm p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about legal procedures, evidence, reporting..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputMessage.trim() || chatMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Victim Support Resources</h2>
            
            {resourcesQuery.isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resourcesQuery.data?.map((resource: VictimResource) => {
                  const IconComponent = getCategoryIcon(resource.category);
                  const ResourceIconComponent = getResourceIcon(resource.resourceType);
                  
                  return (
                    <Card key={resource.id} className="hover:shadow-lg transition-all duration-200 bg-white/70 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getCategoryColor(resource.category)} flex items-center justify-center mb-4`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {resource.category}
                            </Badge>
                            <Badge 
                              className={
                                resource.cost === 'free' 
                                  ? 'bg-green-100 text-green-700' 
                                  : resource.cost === 'paid' 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }
                            >
                              {resource.cost}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {resource.contactInfo && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{resource.contactInfo}</span>
                          </div>
                        )}
                        
                        {resource.availability && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Available:</span> {resource.availability}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-1">
                          {resource.tags.slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex space-x-2">
                          {resource.website && (
                            <Button variant="outline" size="sm" className="flex-1">
                              <Globe className="h-4 w-4 mr-2" />
                              Visit Website
                            </Button>
                          )}
                          <Button size="sm" className="flex-1">
                            <ResourceIconComponent className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
