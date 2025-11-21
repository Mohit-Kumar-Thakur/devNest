import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface PollComponentProps {
  pollQuestion: string;
  pollOptions: string[];
  onQuestionChange: (question: string) => void;
  onOptionsChange: (options: string[]) => void;
}

export const PollComponent: React.FC<PollComponentProps> = ({
  pollQuestion,
  pollOptions,
  onQuestionChange,
  onOptionsChange
}) => {
  const updateOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    onOptionsChange(newOptions);
  };

  const removeOption = (index: number) => {
    onOptionsChange(pollOptions.filter((_, idx) => idx !== index));
  };

  const addOption = () => {
    if (pollOptions.length < 4) {
      onOptionsChange([...pollOptions, '']);
    }
  };

  return (
    <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
      <input
        type="text"
        placeholder="Poll question..."
        value={pollQuestion}
        onChange={(e) => onQuestionChange(e.target.value)}
        className="w-full px-3 py-2 bg-background border border-border rounded-md"
      />
      {pollOptions.map((opt, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
            className="flex-1 px-3 py-2 bg-background border border-border rounded-md"
          />
          {i >= 2 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeOption(i)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
      {pollOptions.length < 4 && (
        <Button
          variant="outline"
          size="sm"
          onClick={addOption}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add option
        </Button>
      )}
    </div>
  );
};