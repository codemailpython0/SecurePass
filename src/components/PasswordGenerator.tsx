import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

const PasswordGenerator = () => {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    setIsGenerating(true);
    
    // Character sets
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charset = "";
    let password = "";

    // Build character set based on options
    if (options.includeUppercase) charset += uppercase;
    if (options.includeLowercase) charset += lowercase;
    if (options.includeNumbers) charset += numbers;
    if (options.includeSymbols) charset += symbols;

    if (!charset) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
        duration: 3000,
      });
      setIsGenerating(false);
      return;
    }

    // Ensure at least one character from each selected type
    if (options.includeUppercase) {
      password += uppercase[Math.floor(Math.random() * uppercase.length)];
    }
    if (options.includeLowercase) {
      password += lowercase[Math.floor(Math.random() * lowercase.length)];
    }
    if (options.includeNumbers) {
      password += numbers[Math.floor(Math.random() * numbers.length)];
    }
    if (options.includeSymbols) {
      password += symbols[Math.floor(Math.random() * symbols.length)];
    }

    // Fill remaining length with random characters
    for (let i = password.length; i < options.length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password to avoid predictable patterns
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    setTimeout(() => {
      setGeneratedPassword(password);
      setIsGenerating(false);
    }, 500);
  };

  const copyToClipboard = async () => {
    if (!generatedPassword) return;
    
    try {
      await navigator.clipboard.writeText(generatedPassword);
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

  return (
    <Card className="glass-card animate-float">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl gradient-text">
          <Zap className="w-6 h-6" />
          Password Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Generated Password Display */}
        {generatedPassword && (
          <div className="relative">
            <Input
              readOnly
              value={generatedPassword}
              className="futuristic-btn text-lg h-14 pr-16 font-mono"
              placeholder="Your generated password will appear here..."
            />
            <Button
              onClick={copyToClipboard}
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary glow-cyan"
            >
              <Copy className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Length Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Password Length</label>
            <span className="text-primary font-mono text-lg">{options.length}</span>
          </div>
          <Slider
            value={[options.length]}
            onValueChange={(value) => setOptions(prev => ({ ...prev, length: value[0] }))}
            min={8}
            max={64}
            step={1}
            className="w-full"
          />
        </div>

        {/* Character Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="uppercase"
              checked={options.includeUppercase}
              onCheckedChange={(checked) => 
                setOptions(prev => ({ ...prev, includeUppercase: checked }))
              }
            />
            <label htmlFor="uppercase" className="text-sm font-medium">
              Uppercase (A-Z)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="lowercase"
              checked={options.includeLowercase}
              onCheckedChange={(checked) => 
                setOptions(prev => ({ ...prev, includeLowercase: checked }))
              }
            />
            <label htmlFor="lowercase" className="text-sm font-medium">
              Lowercase (a-z)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="numbers"
              checked={options.includeNumbers}
              onCheckedChange={(checked) => 
                setOptions(prev => ({ ...prev, includeNumbers: checked }))
              }
            />
            <label htmlFor="numbers" className="text-sm font-medium">
              Numbers (0-9)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="symbols"
              checked={options.includeSymbols}
              onCheckedChange={(checked) => 
                setOptions(prev => ({ ...prev, includeSymbols: checked }))
              }
            />
            <label htmlFor="symbols" className="text-sm font-medium">
              Symbols (!@#$...)
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generatePassword}
          disabled={isGenerating}
          className="w-full futuristic-btn h-12 text-lg font-semibold"
        >
          {isGenerating ? (
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Zap className="w-5 h-5 mr-2" />
          )}
          {isGenerating ? "Generating..." : "Generate Strong Password"}
        </Button>

        {/* Security Tip */}
        <div className="glass-card p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-medium">💡 Pro Tip:</span> Use unique passwords for each account and consider using a password manager for ultimate security.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordGenerator;