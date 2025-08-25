import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Eye, EyeOff, Shield, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  suggestions: string[];
}

const PasswordChecker = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    label: "Enter a password",
    color: "text-muted-foreground", 
    suggestions: []
  });
  const { toast } = useToast();

  const analyzePassword = (pwd: string): PasswordStrength => {
    if (!pwd) {
      return {
        score: 0,
        label: "Enter a password",
        color: "text-muted-foreground",
        suggestions: []
      };
    }

    let score = 0;
    const suggestions: string[] = [];

    // Length check
    if (pwd.length >= 12) score += 25;
    else if (pwd.length >= 8) score += 15;
    else suggestions.push("Use at least 8 characters (12+ recommended)");

    // Uppercase check
    if (/[A-Z]/.test(pwd)) score += 20;
    else suggestions.push("Add uppercase letters (A-Z)");

    // Lowercase check  
    if (/[a-z]/.test(pwd)) score += 20;
    else suggestions.push("Add lowercase letters (a-z)");

    // Numbers check
    if (/\d/.test(pwd)) score += 20;
    else suggestions.push("Add numbers (0-9)");

    // Special characters check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 15;
    else suggestions.push("Add special characters (!@#$%^&*)");

    // Common patterns penalty
    if (/(.)\1{2,}/.test(pwd)) {
      score -= 10;
      suggestions.push("Avoid repeating characters");
    }

    let label: string;
    let color: string;

    if (score >= 80) {
      label = "Very Strong";
      color = "text-neon-green";
    } else if (score >= 60) {
      label = "Strong"; 
      color = "text-neon-cyan";
    } else if (score >= 40) {
      label = "Medium";
      color = "text-neon-orange";
    } else if (score >= 20) {
      label = "Weak";
      color = "text-neon-red";
    } else {
      label = "Very Weak";
      color = "text-destructive";
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      label,
      color,
      suggestions: suggestions.slice(0, 3) // Show max 3 suggestions
    };
  };

  useEffect(() => {
    setStrength(analyzePassword(password));
  }, [password]);

  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy password to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const getStrengthIcon = () => {
    if (strength.score >= 80) return <CheckCircle className="w-5 h-5 text-neon-green" />;
    if (strength.score >= 60) return <Shield className="w-5 h-5 text-neon-cyan" />;
    if (strength.score >= 40) return <AlertCircle className="w-5 h-5 text-neon-orange" />;
    return <XCircle className="w-5 h-5 text-neon-red" />;
  };

  const getProgressColor = () => {
    if (strength.score >= 80) return "bg-neon-green glow-cyan";
    if (strength.score >= 60) return "bg-neon-cyan glow-cyan";
    if (strength.score >= 40) return "bg-neon-orange";
    return "bg-neon-red";
  };

  return (
    <Card className="glass-card animate-float">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl gradient-text">
          <Shield className="w-6 h-6" />
          Password Strength Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="futuristic-btn text-lg h-14 pr-20"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
            <Button
              type="button" 
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-primary"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
            {password && (
              <Button
                type="button"
                variant="ghost" 
                size="icon"
                onClick={copyToClipboard}
                className="text-muted-foreground hover:text-primary"
              >
                <Copy className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStrengthIcon()}
              <span className={`font-semibold ${strength.color}`}>
                {strength.label}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {strength.score}%
            </span>
          </div>
          
          <div className="relative">
            <Progress value={strength.score} className="h-3" />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${strength.score}%` }}
            />
          </div>
        </div>

        {strength.suggestions.length > 0 && (
          <div className="glass-card p-4 rounded-lg">
            <h4 className="font-medium text-primary mb-2">Suggestions to improve:</h4>
            <ul className="space-y-1">
              {strength.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordChecker;