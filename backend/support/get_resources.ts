import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";

export interface SupportResource {
  id: string;
  title: string;
  description: string;
  type: "legal" | "victim-support" | "technical" | "educational";
  category: string;
  url: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    hours?: string;
  };
  location?: string;
  priority: "low" | "medium" | "high" | "urgent";
}

export interface GetResourcesRequest {
  type?: Query<string>;
  category?: Query<string>;
  location?: Query<string>;
}

export interface GetResourcesResponse {
  resources: SupportResource[];
  total: number;
}

// Retrieves support resources based on type, category, and location.
export const getResources = api<GetResourcesRequest, GetResourcesResponse>(
  { expose: true, method: "GET", path: "/resources" },
  async (req) => {
    const mockResources: SupportResource[] = [
      {
        id: "res_1",
        title: "FBI Internet Crime Complaint Center",
        description: "Federal resource for reporting internet-related crimes including deepfake fraud and identity theft.",
        type: "legal",
        category: "law-enforcement",
        url: "https://ic3.gov",
        contactInfo: {
          phone: "1-800-CALL-FBI",
          email: "ic3@fbi.gov",
          hours: "24/7"
        },
        location: "United States",
        priority: "high"
      },
      {
        id: "res_2",
        title: "Identity Theft Resource Center",
        description: "Comprehensive support for identity theft victims, including deepfake-related cases.",
        type: "victim-support",
        category: "identity-theft",
        url: "https://idtheftcenter.org",
        contactInfo: {
          phone: "1-888-400-5530",
          email: "support@idtheftcenter.org",
          hours: "Mon-Fri 9AM-5PM PST"
        },
        location: "United States",
        priority: "high"
      },
      {
        id: "res_3",
        title: "DeepShield Technical Documentation",
        description: "Complete technical documentation for using DeepShield's detection and analysis tools.",
        type: "technical",
        category: "documentation",
        url: "/docs/technical",
        priority: "medium"
      },
      {
        id: "res_4",
        title: "Cyber Civil Rights Initiative",
        description: "Support for victims of non-consensual deepfake content and image-based abuse.",
        type: "victim-support",
        category: "abuse-support",
        url: "https://cybercivilrights.org",
        contactInfo: {
          email: "info@cybercivilrights.org",
          hours: "Business hours"
        },
        priority: "high"
      },
      {
        id: "res_5",
        title: "Digital Forensics Training Center",
        description: "Professional training and certification programs for digital forensics and deepfake detection.",
        type: "educational",
        category: "professional-training",
        url: "/education/forensics",
        priority: "medium"
      }
    ];

    let filteredResources = mockResources;

    if (req.type) {
      filteredResources = filteredResources.filter(r => r.type === req.type);
    }

    if (req.category) {
      filteredResources = filteredResources.filter(r => r.category === req.category);
    }

    if (req.location) {
      filteredResources = filteredResources.filter(r => 
        r.location?.toLowerCase().includes(req.location!.toLowerCase())
      );
    }

    return {
      resources: filteredResources,
      total: filteredResources.length
    };
  }
);
