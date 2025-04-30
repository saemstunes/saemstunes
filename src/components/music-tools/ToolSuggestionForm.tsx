
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send } from 'lucide-react';

interface ToolSuggestionFormProps {
  adminEmail?: string;
}

interface FormData {
  toolName: string;
  description: string;
}

const ToolSuggestionForm = ({ adminEmail = 'saemstunes@gmail.com' }: ToolSuggestionFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mailtoLink, setMailtoLink] = useState('');
  
  const { register, handleSubmit, watch, reset, formState: { isValid, errors } } = useForm<FormData>({
    defaultValues: {
      toolName: '',
      description: '',
    },
    mode: 'onChange'
  });
  
  const toolName = watch('toolName');
  const description = watch('description');
  
  // Update mailto link whenever form data changes
  useEffect(() => {
    const subject = encodeURIComponent(`Tool Suggestion: ${toolName || '[Tool Name]'}`);
    const body = encodeURIComponent(
      `New Tool Suggestion\n\nTool Name: ${toolName || '[Not specified]'}\n\nDescription: ${description || '[Not provided]'}\n\n`
    );
    
    setMailtoLink(`mailto:${adminEmail}?subject=${subject}&body=${body}`);
  }, [toolName, description, adminEmail]);
  
  // Form submission handler
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Show success message
    toast({
      title: "Suggestion submitted!",
      description: "Thank you for your input. We'll consider it for future updates.",
    });
    
    // Reset form
    reset();
    setIsSubmitting(false);
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="toolName" className="text-sm font-medium">Tool Name</label>
          <Input
            id="toolName"
            placeholder="E.g., Scale Practice Helper"
            {...register("toolName", { required: "Tool name is required" })}
          />
          {errors.toolName && (
            <p className="text-sm text-destructive">{errors.toolName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <Textarea
            id="description"
            placeholder="Tell us what you'd like this tool to do..."
            rows={4}
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            type="submit" 
            disabled={isSubmitting || !isValid} 
            className="flex-1 bg-gold hover:bg-gold/90"
          >
            {isSubmitting ? "Submitting..." : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Suggestion
              </>
            )}
          </Button>
          
          <Button 
            type="button"
            variant="outline"
            className="flex-1"
            asChild
          >
            <a href={mailtoLink} target="_blank" rel="noopener noreferrer">
              <Mail className="h-4 w-4 mr-2" />
              Email Directly
            </a>
          </Button>
        </div>
      </form>
      
      <div className="text-xs text-muted-foreground mt-2 text-center">
        Your suggestions help us improve Saem's Tunes. Thank you!
      </div>
    </div>
  );
};

export default ToolSuggestionForm;
