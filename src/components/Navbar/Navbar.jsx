import React, { useState, useEffect } from 'react';
import { Gift, BookOpen, HelpCircle, Mail, Award, Sparkles, Menu, X } from 'lucide-react';
import { soundManager } from '../../utils/audioSynth';
import { useEscapeKey } from '../../utils/useEscapeKey';

export const Navbar = ({ activeSection, onNavigate, isUnwrapped }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on Escape key
  useEscapeKey(() => setMobileMenuOpen(false), mobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'opening', label: 'Special Delivery', icon: Gift },
    { id: 'challenge', label: 'Commander Test', icon: HelpCircle },
    { id: 'envelopes', label: '10 Envelopes', icon: Mail },
    { id: 'letter', label: 'Final Letter', icon: Sparkles },
    { id: 'celebration', label: 'Celebration', icon: Award }
  ];

  const handleNav = (id) => {
    soundManager.playButtonClick();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 900,
        transition: 'all 0.3s ease',
        background: isScrolled
          ? 'rgba(255, 253, 249, 0.94)'
          : 'rgba(255, 253, 249, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isScrolled
          ? '1px solid rgba(212, 175, 55, 0.25)'
          : '1px solid rgba(123, 94, 153, 0.1)',
        boxShadow: isScrolled ? '0 4px 20px rgba(74, 53, 104, 0.08)' : 'none'
      }}
    >
      <div
        className="content-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px'
        }}
      >
        {/* Brand / Title */}
        <div
          onClick={() => handleNav('opening')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7B5E99 0%, #D4AF37 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFDF9',
              boxShadow: '0 4px 12px rgba(123, 94, 153, 0.25)'
            }}
          >
            <Gift size={20} />
          </div>
          <div>
            <span
              className="font-cinzel"
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#3B2A52',
                letterSpacing: '0.08em',
                display: 'block'
              }}
            >
              THE UNEXPECTED PACKAGE
            </span>
            <span
              style={{
                fontSize: '10.5px',
                color: '#8A7A9E',
                letterSpacing: '0.04em',
                display: 'block'
              }}
            >
              FOR COMMANDER ESTELLE • DAY 100
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '8px'
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                style={{
                  background: isActive ? 'rgba(123, 94, 153, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid transparent',
                  padding: '7px 14px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  color: isActive ? '#543670' : '#6A5C7E',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={14} color={isActive ? '#D4AF37' : 'currentColor'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Hamburger / Close button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="mobile-nav-trigger">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            style={{
              background: mobileMenuOpen ? 'rgba(123, 94, 153, 0.12)' : 'transparent',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              color: '#4A3568',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'rgba(255, 253, 249, 0.98)',
            borderTop: '1px solid rgba(212, 175, 55, 0.2)',
            padding: '16px 20px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  style={{
                    background: isActive ? 'rgba(123, 94, 153, 0.12)' : 'transparent',
                    border: 'none',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    textAlign: 'left',
                    color: isActive ? '#543670' : '#4E445E',
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={18} color={isActive ? '#D4AF37' : '#8A7A9E'} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav-trigger { display: none !important; }
        }
      `}</style>
    </header>
  );
};
