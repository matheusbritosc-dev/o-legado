import HeroSection from '../components/HeroSection';
import TrustBadges from '../components/TrustBadges';
import SecureForm from '../components/SecureForm';
import ShareModule from '../components/ShareModule';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <TrustBadges />
      <SecureForm />
      <ShareModule />
      
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-4">© 2026 Ecossistema Legado. Protegendo vidas com tecnologia de ponta.</p>
          <div className="flex justify-center gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">Termos de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Auditoria e LGPD</a>
            <a href="/manifesto" className="hover:text-white transition-colors">O Manifesto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
