
import React, { useState, useEffect } from 'react';
import { getRollbackHistory, rollbackAction, RollbackAction, clearRollbackHistory } from '@/utils/adminUtils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const RollbackHistory: React.FC = () => {
  const [history, setHistory] = useState<RollbackAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState<string | null>(null);

  // Load history
  const loadHistory = () => {
    setHistory(getRollbackHistory());
  };

  useEffect(() => {
    loadHistory();
    
    // Refresh history every 5 seconds
    const interval = setInterval(loadHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRollback = async (actionId: string) => {
    setIsRollingBack(actionId);
    try {
      const success = await rollbackAction(actionId);
      if (success) {
        loadHistory();
      }
    } finally {
      setIsRollingBack(null);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear the entire rollback history? This cannot be undone.')) {
      clearRollbackHistory();
      loadHistory();
      toast.success('Rollback history cleared');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Rollback History
        </CardTitle>
        <CardDescription>
          View and rollback recent changes made to the system
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No actions to rollback</p>
            <p className="text-sm mt-2">Actions will appear here when changes are made</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((action) => (
              <div 
                key={action.id} 
                className="border rounded-md p-3 bg-muted/40"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium">{action.description}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRollback(action.id)}
                    disabled={!!isRollingBack}
                    className="h-7 px-2"
                  >
                    {isRollingBack === action.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="capitalize">{action.type}</span> in {action.table} • {formatDistanceToNow(action.timestamp, { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadHistory}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Refresh'
          )}
        </Button>
        
        {history.length > 0 && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleClearHistory}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear History
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RollbackHistory;

