import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const App = () => (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
    <header className="max-w-4xl text-center space-y-4">
      <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
        WalkManager Platform
      </h1>
      <p className="text-lg text-slate-300">
        Professional Dog Walking Marketplace — Verified Walkers, Real-time Tracking & Moderated Reviews.
      </p>
    </header>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
