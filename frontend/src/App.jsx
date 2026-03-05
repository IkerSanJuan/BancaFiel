import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, CreditCard, Banknote } from 'lucide-react';
import Wizard from './components/Wizard';
import CreditWizard from './components/CreditWizard';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="glass-panel" style={{ margin: '20px 24px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', fontWeight: 'bold' }}>
            <ShieldCheck size={32} color="var(--primary)" />
            BancaFiel
          </Link>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/solicitud-tarjeta" className="btn btn-primary" style={{ padding: '10px 15px', fontSize: '0.85rem', display: 'flex', gap: '5px' }}>
              <CreditCard size={16} /> Tarjetas
            </Link>
            <Link to="/solicitud-credito" className="btn btn-primary" style={{ padding: '10px 15px', fontSize: '0.85rem', display: 'flex', gap: '5px' }}>
              <Banknote size={16} /> Créditos
            </Link>
            <Link to="/admin" className="btn btn-secondary" style={{ padding: '10px 15px', fontSize: '0.85rem', display: 'flex', gap: '5px' }}>
              <LayoutDashboard size={16} /> Admin
            </Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="container" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/solicitud-tarjeta" element={<Wizard />} />
            <Route path="/solicitud-credito" element={<CreditWizard />} />
            <Route path="/admin" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const Home = () => {
  return (
    <div className="flex-center animate-fade-in" style={{ flexDirection: 'column', minHeight: '60vh', textAlign: 'center' }}>
      <ShieldCheck size={80} color="var(--primary)" style={{ marginBottom: '20px', filter: 'drop-shadow(0 0 15px var(--primary-glow))' }} />
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Financiamiento Inteligente</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6' }}>
        Con la tecnología de IA de BancaFiel, procesamos y evaluamos tus solicitudes en menos de 45 segundos.
      </p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <Link to="/solicitud-tarjeta" className="btn btn-primary" style={{ padding: '16px 30px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CreditCard size={24} /> Solicitar Tarjeta
        </Link>
        <Link to="/solicitud-credito" className="btn btn-secondary" style={{ padding: '16px 30px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Banknote size={24} /> Solicitar Préstamo
        </Link>
      </div>
    </div>
  )
}

export default App;
