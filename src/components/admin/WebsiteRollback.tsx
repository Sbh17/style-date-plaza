
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Loader2, History, AlertTriangle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { rollbackWebsiteToDate } from '@/utils/adminUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const WebsiteRollback: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeInput, setTimeInput] = useState<string>('00:00');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRollback = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    
    setIsLoading(true);
    try {
      // Create a date object with the selected date and time
      const [hours, minutes] = timeInput.split(':').map(Number);
      const rollbackDate = new Date(selectedDate);
      rollbackDate.setHours(hours, minutes);
      
      // Call the rollback function
      const success = await rollbackWebsiteToDate(rollbackDate);
      
      if (success) {
        toast.success(`Website successfully rolled back to ${format(rollbackDate, 'PPP')} at ${timeInput}`);
        setShowConfirmation(false);
      }
    } catch (error) {
      toast.error('Failed to rollback website');
      console.error('Rollback error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Website Rollback
        </CardTitle>
        <CardDescription>
          Restore the website to a previous version
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    {selectedDate ? format(selectedDate, 'PPP') : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="time">Select Time</Label>
              <Input
                id="time"
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          {showConfirmation && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning: This action cannot be undone</AlertTitle>
              <AlertDescription>
                Rolling back to {selectedDate && format(selectedDate, 'PPP')} at {timeInput} will restore 
                the website to that exact state. All changes made after this point will be lost.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        {showConfirmation ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRollback}
              disabled={isLoading || !selectedDate}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rolling back...
                </>
              ) : (
                'Confirm Rollback'
              )}
            </Button>
          </>
        ) : (
          <Button 
            variant="default"
            onClick={() => selectedDate && setShowConfirmation(true)}
            disabled={!selectedDate}
          >
            Proceed with Rollback
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WebsiteRollback;
