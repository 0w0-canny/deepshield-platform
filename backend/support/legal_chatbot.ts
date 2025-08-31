import { api } from "encore.dev/api";

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  response: string;
  conversationId: string;
  suggestedActions?: string[];
}

// Provides legal guidance through AI-powered chatbot for deepfake victims.
export const legalChat = api<ChatRequest, ChatResponse>(
  { expose: true, method: "POST", path: "/support/legal-chat" },
  async (req) => {
    const conversationId = req.conversationId || generateConversationId();
    
    // Simulate AI legal chatbot response
    const response = await generateLegalResponse(req.message);
    
    return {
      response: response.text,
      conversationId,
      suggestedActions: response.actions,
    };
  }
);

async function generateLegalResponse(message: string) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('evidence') || lowerMessage.includes('proof')) {
    return {
      text: "When dealing with deepfake evidence, it's crucial to preserve the original files and metadata. I recommend: 1) Don't edit or modify the suspicious media, 2) Document the source and discovery circumstances, 3) Use professional forensic tools for analysis, 4) Consider hiring a digital forensics expert. Would you like specific guidance on evidence preservation?",
      actions: ["Evidence Preservation Guide", "Find Forensics Expert", "Legal Documentation Templates"]
    };
  }
  
  if (lowerMessage.includes('report') || lowerMessage.includes('police')) {
    return {
      text: "Reporting deepfake crimes can be complex as laws vary by jurisdiction. Generally, you should: 1) Contact local law enforcement, 2) File a report with the FBI's IC3 if applicable, 3) Document all evidence, 4) Consider consulting with a cybercrime attorney. The type of harm (financial, reputational, etc.) affects which laws apply.",
      actions: ["Find Local Cybercrime Unit", "FBI IC3 Reporting", "Cybercrime Attorney Directory"]
    };
  }
  
  if (lowerMessage.includes('sue') || lowerMessage.includes('lawsuit')) {
    return {
      text: "Civil litigation for deepfake harm is an emerging area of law. Potential claims may include defamation, privacy violations, copyright infringement, or intentional infliction of emotional distress. Success depends on identifying the perpetrator, proving damages, and applicable state laws. Consultation with an attorney specializing in cyber law is recommended.",
      actions: ["Calculate Potential Damages", "Cyber Law Attorney Search", "State Law Database"]
    };
  }
  
  return {
    text: "I'm here to help with legal questions about deepfake incidents. I can provide guidance on evidence preservation, reporting procedures, potential legal remedies, and victim resources. Please note this is informational guidance only - for specific legal advice, consult with a qualified attorney. What specific aspect of your situation would you like help with?",
    actions: ["Evidence Help", "Reporting Guide", "Legal Resources", "Find Attorney"]
  };
}

function generateConversationId(): string {
  return 'conv_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}
