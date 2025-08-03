
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolSuggestionFormProps {
  adminEmail: string;
}

const ToolSuggestionForm: React.FC<ToolSuggestionFormProps> = ({ adminEmail }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [toolType, setToolType] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !suggestion) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    
    try {
      // In a real implementation, this would send data to a backend
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      toast({
        title: "Suggestion Submitted",
        description: "Thank you for your feedback! We'll review your idea.",
      });
      
      // Reset form
      setName('');
      setEmail('');
      setToolType('');
      setSuggestion('');
      setSubmitted(true);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Create a mailto link with pre-filled content
  const getMailtoLink = () => {
    const subject = encodeURIComponent(`Tool Suggestion: ${toolType || 'New Music Tool'}`);
    const body = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n\n` +
      `Tool Type: ${toolType || 'Not specified'}\n\n` +
      `Suggestion: ${suggestion}\n\n` +
      `Submitted from: Saem's Tunes Music Tool Suggestion Form`
    );
    
    return `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {submitted ? (
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">Thank You!</h3>
          <p className="text-muted-foreground mb-4">
            Your suggestion has been submitted successfully.
            We appreciate your feedback and will consider your idea.
          </p>
          <Button 
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="mt-2"
          >
            Submit Another Suggestion
          </Button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toolType">Tool Type</Label>
              <Select value={toolType} onValueChange={setToolType}>
                <SelectTrigger id="toolType" className="w-full">
                  <SelectValue placeholder="Select type of tool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="practice">Practice Aid</SelectItem>
                  <SelectItem value="theory">Music Theory</SelectItem>
                  <SelectItem value="composition">Composition Helper</SelectItem>
                  <SelectItem value="recording">Recording Tool</SelectItem>
                  <SelectItem value="teaching">Teaching Aid</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="suggestion">Your Suggestion</Label>
              <Textarea 
                id="suggestion"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)} 
                placeholder="Describe the tool you'd like us to create..."
                className="min-h-[120px]"
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              type="submit" 
              className="w-full sm:flex-1 bg-gold hover:bg-gold/90"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Suggestion
                </>
              )}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              className="w-full sm:flex-1 border-gold/30 text-gold hover:bg-gold/10"
              onClick={() => window.open(getMailtoLink())}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Directly
            </Button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default ToolSuggestionForm;
