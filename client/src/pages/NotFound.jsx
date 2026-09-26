import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { HelpCircle, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="max-w-md mx-auto py-16 text-center text-white">
      <Card className="p-8 space-y-4 bg-slate-900/65 border border-white/20 backdrop-blur-2xl shadow-2xl rounded-3xl text-white">
        <HelpCircle className="w-16 h-16 text-amber-400 mx-auto" />
        <h1 className="text-4xl font-black text-white">404</h1>
        <h2 className="text-lg font-bold text-slate-200">Page Not Found</h2>
        <p className="text-sm text-slate-300">
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
