'use client';

import { cn } from '@garageos/ui/utils';

const STEPS = ['customer', 'vehicle', 'details'] as const;
type Step = typeof STEPS[number];

interface ProgressStepsProps {
  currentStep: Step;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              currentStep === s
                ? 'bg-primary text-primary-foreground'
                : i < STEPS.indexOf(currentStep)
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {i + 1}
          </div>
          {i < 2 && (
            <div
              className={cn(
                'w-16 h-0.5 mx-2',
                i < STEPS.indexOf(currentStep)
                  ? 'bg-primary'
                  : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
