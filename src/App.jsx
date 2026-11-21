import React, { useState, useEffect } from 'react';
import { AmbientBackground } from './components/Particles/AmbientBackground';
import { Navbar } from './components/Navbar/Navbar';
import { MusicController } from './components/MusicController/MusicController';
import { OpeningSection } from './sections/Opening/OpeningSection';
import { QuizSection } from './sections/FunChallenge/QuizSection';
import { EnvelopesSection } from './sections/LittleSurprises/EnvelopesSection';
import { LetterSection } from './sections/FinalLetter/LetterSection';
import { CelebrationSection } from './sections/Celebration/CelebrationSection';
import './styles/global.css';
import './styles/animations.css';

export function App() {
  const [activeSection, setActiveSection] = useState('opening');
  const [isUnwrapped, setIsUnwrapped] = useState(false);
  const [showEnvelopes, setShowEnvelopes] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  // Scrollspy to detect active section with rAF throttling (eliminates scroll stutter & layout thrashing)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = ['opening', 'challenge', 'envelopes', 'letter', 'celebration'];
          const scrollPos = window.scrollY + 250;

          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i]);
            if (el && el.offsetTop <= scrollPos) {
              setActiveSection((prev) => (prev !== sections[i] ? sections[i] : prev));
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (id) => {
    if (id === 'envelopes') {
      setShowEnvelopes(true);
      setTimeout(() => {
        scrollToSection(id);
      }, 70);
    } else if (id === 'letter' || id === 'celebration') {
      setShowEnvelopes(true);
      setShowLetter(true);
      setTimeout(() => {
        scrollToSection(id);
      }, 70);
    } else {
      scrollToSection(id);
    }
  };

  const handleUnwrapComplete = () => {
    setIsUnwrapped(true);
    scrollToSection('challenge');
  };

  const handleProceedToEnvelopes = () => {
    setShowEnvelopes(true);
    setTimeout(() => {
      scrollToSection('envelopes');
    }, 70);
  };

  const handleProceedToFinalLetter = () => {
    setShowLetter(true);
    setTimeout(() => {
      scrollToSection('letter');
    }, 70);
  };

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-[#4E445E]">
      {/* Delicate floating sparkles and soft ambient flower petals background */}
      <AmbientBackground />

      {/* Persistent floating audio controller (soundtrack + sound effects) */}
      <MusicController />

      {/* Top Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isUnwrapped={isUnwrapped}
      />

      <main style={{ position: 'relative' }}>
        {/* 1. Opening Screen - Special Delivery 3D Gift Box & 100 Little Stars */}
        <OpeningSection onUnwrapComplete={handleUnwrapComplete} />

        {/* 2. Chapter 1 - The Fun Challenge (5-Question Commander Quiz) */}
        <QuizSection onProceedToEnvelopes={handleProceedToEnvelopes} />

        {/* 3. Chapter 2 - Ten Little Surprise Envelopes (Rendered ONLY when Proceed to 10 Envelopes is clicked) */}
        {showEnvelopes && (
          <EnvelopesSection onProceedToFinalLetter={handleProceedToFinalLetter} />
        )}

        {/* 4. Chapter 3 - The Final Letter & Secret Bonus Gift (Rendered ONLY when Proceed to The Final Letter is clicked) */}
        {showLetter && (
          <>
            <LetterSection />

            {/* 5. Chapter 4 - Mission 100 Completed Celebration */}
            <CelebrationSection onReplay={handleReplay} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
