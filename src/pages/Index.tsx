import PasswordChecker from "@/components/PasswordChecker";
import PasswordGenerator from "@/components/PasswordGenerator";
import { Shield, Lock, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-card text-sm font-medium animate-pulse-glow">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              Next-Gen Security Tool
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              <span className="gradient-text">SecurePass</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/80 font-light max-w-2xl mx-auto">
              Check & Generate Your Passwords with Ease
            </p>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Smart, Secure, and Futuristic Password Tool for Everyone
            </p>

            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-neon-cyan" />
                Real-time Analysis
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-5 h-5 text-neon-purple" />
                Secure Generation
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-5 h-5 text-neon-green" />
                Futuristic UI
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <PasswordChecker />
          <PasswordGenerator />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built with modern web technologies for maximum security and user experience.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
