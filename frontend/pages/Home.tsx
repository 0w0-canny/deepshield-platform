import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, GraduationCap, HeartHandshake, Zap, Lock, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Search,
    title: 'AI-Powered Detection',
    description: 'Advanced algorithms detect deepfakes in videos, images, and audio with high accuracy',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Lock,
    title: 'Tamper-Proof Reports',
    description: 'Blockchain-secured proof reports with identity theft scores for legal proceedings',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: GraduationCap,
    title: 'Educational Resources',
    description: 'Comprehensive tutorials and real-world case studies to build awareness',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: HeartHandshake,
    title: 'Victim Support',
    description: 'Legal chatbot assistance and comprehensive victim resource portal',
    color: 'from-orange-500 to-red-500'
  }
];

const stats = [
  { label: 'Deepfakes Detected', value: '150K+', icon: Zap },
  { label: 'Users Protected', value: '50K+', icon: Users },
  { label: 'Cases Resolved', value: '2.3K+', icon: Shield },
  { label: 'Countries Served', value: '45+', icon: Globe }
];

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              <span>Protecting Digital Truth</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Deepfake Detection
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Protect yourself and your organization from sophisticated AI-generated fake media. 
            Detect, educate, and respond to deepfake threats with our comprehensive platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/detection">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                Start Detection
              </Button>
            </Link>
            <Link to="/education">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-2 border-blue-200 hover:bg-blue-50">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Protection Against Digital Deception
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI detection with education and support 
              to create a complete defense against deepfake threats.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Protect Your Digital Identity?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust DeepShield to detect and prevent 
            deepfake attacks. Start with a free analysis today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/detection">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg bg-white text-blue-600 hover:bg-gray-100">
                Try Free Detection
              </Button>
            </Link>
            <Link to="/support">
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-2 border-white text-white hover:bg-white/10">
                Get Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
