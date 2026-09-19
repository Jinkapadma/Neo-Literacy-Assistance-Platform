import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { HelpCircle, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="max-w-md mx-auto py-16 text-center">
      <Card className="p-8 space-y-4">
        <HelpCircle className="w-16 h-16 text-brand-600 mx-auto" />
        <h1 className="text-3xl font-black text-slate-900">404</h1>
        <h2 className="text-lg font-bold text-slate-700">Page Not Found</h2>
        <p className="text-sm text-slate-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="inline-block pt-2">
          <Button variant="primary" icon={Home}>
            Return Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};
