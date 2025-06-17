import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function LocationPermissionModal({ isOpen, onAccept, onDecline }: LocationPermissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg mx-auto shadow-2xl">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-full">
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
            <CardTitle className="text-2xl">Welcome to Selectaraunt!</CardTitle>
          </div>
          <CardDescription className="text-base">
            To help you find the perfect restaurant, we need access to your location. This will allow us to show you restaurants near you.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-700">
              Your location will only be used to find nearby restaurants and will not be stored permanently. You can always change this permission in your browser settings.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={onDecline}
            className="w-full sm:w-auto"
          >
            Continue Without Location
          </Button>
          <Button 
            onClick={onAccept}
            className="w-full sm:w-auto"
          >
            Allow Location Access
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 