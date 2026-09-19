import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { OverviewPage } from './pages/OverviewPage';
import { PredictPage } from './pages/PredictPage';
import { RecipientMatchingPage } from './pages/RecipientMatchingPage';
import { RescueMissionPage } from './pages/RescueMissionPage';
import { RecipientsPage } from './pages/RecipientsPage';
import { MissionsListPage } from './pages/MissionsListPage';
import { ImpactPage } from './pages/ImpactPage';
import { api } from './api';

export const App: React.FC = () => {
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoLogs, setDemoLogs] = useState<{ step: string; text: string }[]>([]);

  const handleRunDemo = async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setDemoLogs([{ step: 'Step 1/5', text: '> Initializing simulated wedding variables (500 guests @ Grand Palace Pavilion)...' }]);

    try {
      const result = await api.runAutonomousDemo();
      const steps = result.steps || [];

      // Animate steps
      for (let i = 0; i < steps.length; i++) {
        await new Promise((res) => setTimeout(res, 800));
        setDemoLogs((prev) => [...prev, steps[i]]);
      }
    } catch (err) {
      console.error('Demo simulation failed:', err);
      setDemoLogs((prev) => [...prev, { step: 'Error', text: '> Simulation encountered an issue. Check backend logs.' }]);
    } finally {
      setIsDemoRunning(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background flex flex-col antialiased selection:bg-secondary selection:text-white">
        <Header onRunDemo={handleRunDemo} isDemoRunning={isDemoRunning} />
        
        <main className="flex-1 w-full flex flex-col">
          <Routes>
            <Route
              path="/"
              element={
                <OverviewPage
                  onRunDemo={handleRunDemo}
                  isDemoRunning={isDemoRunning}
                  demoLogs={demoLogs}
                />
              }
            />
            <Route path="/predict" element={<PredictPage />} />
            <Route path="/matches" element={<RecipientMatchingPage />} />
            <Route path="/rescue/:id" element={<RescueMissionPage />} />
            <Route path="/missions" element={<MissionsListPage />} />
            <Route path="/recipients" element={<RecipientsPage />} />
            <Route path="/impact" element={<ImpactPage />} />
          </Routes>
        </main>

        <Footer />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
};

export default App;
