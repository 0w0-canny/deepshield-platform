import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Eye, 
  BookOpen, 
  MessageSquare, 
  Radio, 
  Zap, 
  Globe, 
  Award,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Users,
  TrendingUp
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms detect deepfakes with 99.7% accuracy across video, audio, and images."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Tamper-Proof Reports",
      description: "Generate legally admissible authenticity reports with blockchain verification and identity theft risk scores."
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Educational Resources",
      description: "Comprehensive tutorials, case studies, and training materials to build awareness and expertise."
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Legal Support",
      description: "AI-powered legal chatbot and victim support portal with access to specialized attorneys."
    },
    {
      icon: <Radio className="h-6 w-6" />,
      title: "Real-Time Analysis",
      description: "Live stream monitoring and browser extension for immediate deepfake detection and alerts."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Enterprise Solutions",
      description: "Organizational resilience assessment against misinformation and social engineering attacks."
    }
  ];

  const stats = [
    { value: "99.7%", label: "Detection Accuracy" },
    { value: "50M+", label: "Files Analyzed" },
    { value: "24/7", label: "Real-Time Monitoring" },
    { value: "150+", label: "Organizations Protected" }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background via-background to-blue-950/10">
        <div className="container max-w-screen-xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 mb-8">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Deepfake Detection
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-6">
            Protect Against Digital<br />
            Misinformation & Deepfakes
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            DeepShield is the most advanced AI platform for detecting fake videos, images, and voices. 
            Get tamper-proof authenticity reports, access educational resources, and protect your organization 
            from sophisticated digital threats.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8">
              <Link to="/detection">
                Start Free Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/education">
                Learn More
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-400">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Protection Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to detect, analyze, and protect against deepfake threats in one powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How DeepShield Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI analyzes multiple layers of digital media to detect manipulation with unprecedented accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-card/50">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  1
                </div>
                <CardTitle>Upload & Analyze</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload your media files or provide URLs. Our AI analyzes facial landmarks, audio patterns, and metadata in real-time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-card/50">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  2
                </div>
                <CardTitle>AI Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced machine learning models examine technical markers, temporal inconsistencies, and manipulation artifacts.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-card/50">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  3
                </div>
                <CardTitle>Verified Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive tamper-proof reports with confidence scores, risk assessments, and legally admissible documentation.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-20 px-4">
        <div className="container max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Award className="h-4 w-4 mr-2" />
                Industry Leading
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Trusted by Organizations Worldwide
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                DeepShield is the preferred choice for law enforcement, media organizations, 
                and enterprises who need reliable deepfake detection and legal-grade documentation.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>SOC 2 Type II Certified</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Blockchain-Verified Reports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>24/7 Expert Support</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                <CardHeader className="pb-3">
                  <Users className="h-8 w-8 text-blue-400 mb-2" />
                  <CardTitle className="text-2xl">500K+</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Users Protected Daily</CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-emerald-500/10">
                <CardHeader className="pb-3">
                  <TrendingUp className="h-8 w-8 text-purple-400 mb-2" />
                  <CardTitle className="text-2xl">99.7%</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Detection Accuracy Rate</CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10">
                <CardHeader className="pb-3">
                  <Shield className="h-8 w-8 text-emerald-400 mb-2" />
                  <CardTitle className="text-2xl">150+</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Enterprise Clients</CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-orange-500/10 to-red-500/10">
                <CardHeader className="pb-3">
                  <AlertTriangle className="h-8 w-8 text-orange-400 mb-2" />
                  <CardTitle className="text-2xl">$50M+</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Fraud Prevented</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10">
        <div className="container max-w-screen-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Protect Against Deepfakes?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start with our free analysis tool or explore our educational resources to learn more about digital authenticity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8">
              <Link to="/detection">
                Start Free Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/education">
                Explore Resources
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
