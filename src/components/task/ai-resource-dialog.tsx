"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { suggestResources, type SuggestResourcesOutput } from "@/ai/flows/suggest-resources";
import type { Task } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, ExternalLink, Loader2 } from "lucide-react";

interface AIResourceDialogProps {
  task: Task | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AIResourceDialog({ task, isOpen, onOpenChange }: AIResourceDialogProps) {
  const [suggestions, setSuggestions] = useState<SuggestResourcesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && task) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        setError(null);
        setSuggestions(null);
        try {
          const result = await suggestResources({ taskDescription: `${task.title}: ${task.description}` });
          setSuggestions(result);
        } catch (err) {
          setError("Failed to fetch suggestions. Please try again.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSuggestions();
    }
  }, [isOpen, task]);

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
            AI Resource Suggestions
          </DialogTitle>
          <DialogDescription>
            For task: <span className="font-semibold text-primary">{task.title}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Finding resources...</p>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {suggestions && suggestions.suggestedResources.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Suggested Resources:</h4>
              <ul className="list-inside list-disc space-y-2 rounded-md border bg-muted/50 p-4">
                {suggestions.suggestedResources.map((resource, index) => (
                  <li key={index} className="text-sm text-foreground">
                    <a
                      href={resource.startsWith('http') ? resource : `https://www.google.com/search?q=${encodeURIComponent(resource)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      {resource}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {suggestions && suggestions.suggestedResources.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground">No specific resources found for this task.</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
