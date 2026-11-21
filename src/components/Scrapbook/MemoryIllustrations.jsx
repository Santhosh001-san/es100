import React from 'react';

export const MemoryIllustration = ({ type, color = "#8B6FA9" }) => {
  switch (type) {
    case 'galaxy':
      return (
        <svg viewBox="0 0 400 320" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="spaceGlow" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#4A3B66" />
              <stop offset="50%" stopColor="#2A1E40" />
              <stop offset="100%" stopColor="#140E24" />
            </radialGradient>
            <linearGradient id="orbitGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D77F" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" rx="12" fill="url(#spaceGlow)" />
          
          {/* Orbital path rings */}
          <ellipse cx="200" cy="160" rx="140" ry="70" fill="none" stroke="url(#orbitGold)" strokeWidth="1.5" strokeDasharray="4 6" transform="rotate(-15 200 160)" />
          <ellipse cx="200" cy="160" rx="90" ry="45" fill="none" stroke="#E6DCF5" strokeWidth="1" opacity="0.4" transform="rotate(25 200 160)" />
          
          {/* Central Star / Sparkle Node */}
          <circle cx="200" cy="160" r="18" fill="#FBF5FF" filter="url(#glow)" />
          <circle cx="200" cy="160" r="28" fill="#D4AF37" opacity="0.25" filter="url(#glow)" />
          <path d="M 200 120 L 200 200 M 160 160 L 240 160" stroke="#FFF" strokeWidth="2" filter="url(#glow)" />
          <path d="M 175 135 L 225 185 M 225 135 L 175 185" stroke="#F5D77F" strokeWidth="1.2" opacity="0.7" />

          {/* Connected constellation dots */}
          <line x1="100" y1="90" x2="150" y2="120" stroke="#C9B5E8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
          <circle cx="100" cy="90" r="4" fill="#E6DCF5" />
          <circle cx="150" cy="120" r="5" fill="#F8D7E3" filter="url(#glow)" />
          
          <line x1="260" y1="130" x2="310" y2="100" stroke="#C9B5E8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
          <circle cx="260" cy="130" r="5" fill="#F5D77F" />
          <circle cx="310" cy="100" r="4" fill="#E6DCF5" />

          {/* Random background stars */}
          {[
            {x: 60, y: 190, r: 2}, {x: 80, y: 60, r: 1.5}, {x: 320, y: 220, r: 2.5},
            {x: 130, y: 250, r: 2}, {x: 280, y: 260, r: 1.5}, {x: 340, y: 70, r: 2}
          ].map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#FFFDF9" opacity="0.8" />
          ))}

          {/* Badge Tag */}
          <rect x="25" y="270" width="130" height="28" rx="14" fill="#2A1E40" stroke="#D4AF37" strokeWidth="1" opacity="0.9" />
          <text x="90" y="288" textAnchor="middle" fill="#F5D77F" fontSize="11" fontFamily="'Cinzel', serif" letterSpacing="1">TRANSMISSION 01</text>
        </svg>
      );

    case 'chat':
      return (
        <svg viewBox="0 0 400 320" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="chatBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F9F6FE" />
              <stop offset="100%" stopColor="#EDE4F5" />
            </linearGradient>
            <linearGradient id="bubbleGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2D6" />
              <stop offset="100%" stopColor="#FDE3B2" />
            </linearGradient>
            <linearGradient id="bubblePurple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7E5F9E" />
              <stop offset="100%" stopColor="#5F427D" />
            </linearGradient>
            <filter id="shadowBox">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#8B6FA9" floodOpacity="0.15" />
            </filter>
          </defs>
          <rect width="100%" height="100%" rx="12" fill="url(#chatBg)" />

          {/* Left Bubble (Commander) */}
          <g filter="url(#shadowBox)" transform="translate(45, 60)">
            <rect width="180" height="60" rx="16" fill="url(#bubblePurple)" />
            <path d="M 20 60 L 10 75 L 35 60 Z" fill="#5F427D" />
            <circle cx="35" cy="30" r="4" fill="#F8D7E3" />
            <line x1="50" y1="26" x2="135" y2="26" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="50" y1="36" x2="160" y2="36" stroke="#DCCDEE" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Right Bubble (Notification) */}
          <g filter="url(#shadowBox)" transform="translate(170, 145)">
            <rect width="185" height="65" rx="16" fill="url(#bubbleGold)" stroke="#D4AF37" strokeWidth="1" />
            <path d="M 155 65 L 175 80 L 140 65 Z" fill="#FDE3B2" />
            <circle cx="30" cy="32" r="5" fill="#D4AF37" />
            <line x1="48" y1="26" x2="155" y2="26" stroke="#725528" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="48" y1="38" x2="130" y2="38" stroke="#9E7841" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Floating topic sparks */}
          <g transform="translate(60, 230)">
            <rect width="90" height="26" rx="13" fill="#FFFFFF" stroke="#8B6FA9" strokeWidth="1" />
            <text x="45" y="17" textAnchor="middle" fill="#6A4D88" fontSize="10" fontFamily="sans-serif" fontWeight="600">Topic #4201 🚀</text>
          </g>
          <g transform="translate(230, 75)">
            <rect width="85" height="26" rx="13" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="1" />
            <text x="42" y="17" textAnchor="middle" fill="#8B6C24" fontSize="10" fontFamily="sans-serif" fontWeight="600">Zero context ☕</text>
          </g>
        </svg>
      );

    case 'laugh':
      return (
        <svg viewBox="0 0 400 320" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="laughBg" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#FFF0F5" />
              <stop offset="100%" stopColor="#F5DCE5" />
            </radialGradient>
            <filter id="laughGlow">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#D97D95" floodOpacity="0.25" />
            </filter>
          </defs>
          <rect width="100%" height="100%" rx="12" fill="url(#laughBg)" />

          {/* Joyful Center Burst */}
          <circle cx="200" cy="150" r="65" fill="#FFFFFF" filter="url(#laughGlow)" />
          <circle cx="200" cy="150" r="58" fill="#FCE9EE" />

          {/* Smiling curved eyes and broad grin */}
          <path d="M 170 135 Q 182 122 190 135" stroke="#9E4663" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 210 135 Q 218 122 230 135" stroke="#9E4663" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 172 155 Q 200 185 228 155 Z" fill="#9E4663" />
          <path d="M 185 168 Q 200 182 215 168" fill="#F28B9F" />

          {/* Confetti & Laugh sparks radiating */}
          {[
            {x: 100, y: 90, color: "#D4AF37", r: 4},
            {x: 130, y: 65, color: "#8B6FA9", r: 6},
            {x: 290, y: 80, color: "#D97D95", r: 5},
            {x: 310, y: 120, color: "#D4AF37", r: 4},
            {x: 90, y: 190, color: "#8B6FA9", r: 5},
            {x: 300, y: 220, color: "#F5B4C4", r: 6},
            {x: 130, y: 240, color: "#D4AF37", r: 4}
          ].map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={c.color} />
          ))}

          <path d="M 90 120 L 110 115 L 105 135 Z" fill="#D4AF37" transform="rotate(20 100 125)" />
          <path d="M 270 170 L 290 160 L 285 180 Z" fill="#8B6FA9" transform="rotate(-30 280 170)" />

          <text x="200" y="270" textAnchor="middle" fill="#9E4663" fontSize="13" fontFamily="'Cinzel', serif" letterSpacing="2">LAUGHTER LEVEL: DANGEROUS</text>
        </svg>
      );

    case 'coffee':
      return (
        <svg viewBox="0 0 400 320" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="warmIvory" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBF7EE" />
              <stop offset="100%" stopColor="#EFE8D8" />
            </linearGradient>
            <filter id="softCupShadow">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#705530" floodOpacity="0.12" />
            </filter>
          </defs>
          <rect width="100%" height="100%" rx="12" fill="url(#warmIvory)" />

          {/* Cozy Cup of Tea/Coffee */}
          <g filter="url(#softCupShadow)" transform="translate(145, 110)">
            {/* Saucer */}
            <ellipse cx="55" cy="95" rx="70" ry="16" fill="#DCD3C0" />
            <ellipse cx="55" cy="93" rx="60" ry="12" fill="#EAE3D4" />

            {/* Cup */}
            <path d="M 15 25 Q 20 85 55 85 Q 90 85 95 25 Z" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="1" />
            <ellipse cx="55" cy="25" rx="40" ry="12" fill="#CBB696" />
            <ellipse cx="55" cy="25" rx="36" ry="10" fill="#755233" />

            {/* Cup Handle */}
            <path d="M 90 35 Q 120 40 115 65 Q 105 75 85 68" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
            <path d="M 90 35 Q 120 40 115 65 Q 105 75 85 68" fill="none" stroke="#D4AF37" strokeWidth="1" />

            {/* Steam Trails */}
            <path d="M 45 10 Q 40 -5 48 -20 Q 55 -35 48 -45" fill="none" stroke="#B8A88E" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <path d="M 65 12 Q 72 -3 65 -18 Q 58 -32 66 -42" fill="none" stroke="#B8A88E" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          </g>

          {/* Delicate botanical sprig */}
          <path d="M 80 230 Q 95 190 120 170" fill="none" stroke="#8B6FA9" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="90" cy="210" rx="10" ry="5" fill="#C7B6DC" transform="rotate(-30 90 210)" />
          <ellipse cx="110" cy="185" rx="10" ry="5" fill="#E6DCF5" transform="rotate(20 110 185)" />

          <text x="200" y="275" textAnchor="middle" fill="#705530" fontSize="12" fontFamily="'Cinzel', serif" letterSpacing="1">THE NICE LITTLE MOMENTS</text>
        </svg>
      );

    case 'celebration':
      return (
        <svg viewBox="0 0 400 320" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldTrophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF1B0" />
              <stop offset="50%" stopColor="#E5C378" />
              <stop offset="100%" stopColor="#B38B29" />
            </linearGradient>
            <radialGradient id="centGrad" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="100%" stopColor="#F5E8C8" />
            </radialGradient>
            <filter id="goldGlow">
              <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#D4AF37" floodOpacity="0.35" />
            </filter>
          </defs>
          <rect width="100%" height="100%" rx="12" fill="url(#centGrad)" />

          {/* Trophy Graphic */}
          <g filter="url(#goldGlow)" transform="translate(130, 45)">
            {/* Trophy Cup */}
            <path d="M 25 35 Q 25 110 70 115 Q 115 110 115 35 Z" fill="url(#goldTrophyGrad)" />
            <ellipse cx="70" cy="35" rx="45" ry="12" fill="#FFE899" />
            
            {/* Handles */}
            <path d="M 25 45 Q -10 65 20 85" fill="none" stroke="url(#goldTrophyGrad)" strokeWidth="6" strokeLinecap="round" />
            <path d="M 115 45 Q 150 65 120 85" fill="none" stroke="url(#goldTrophyGrad)" strokeWidth="6" strokeLinecap="round" />

            {/* Stem & Base */}
            <path d="M 60 115 L 80 115 L 75 145 L 65 145 Z" fill="url(#goldTrophyGrad)" />
            <rect x="40" y="145" width="60" height="20" rx="4" fill="#8C6819" />
            <rect x="45" y="148" width="50" height="14" rx="2" fill="url(#goldTrophyGrad)" />
            
            {/* Star on trophy */}
            <text x="70" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="bold">100</text>
          </g>

          {/* Golden Laurels */}
          <path d="M 70 150 Q 80 200 140 220" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 330 150 Q 320 200 260 220" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />

          <text x="200" y="270" textAnchor="middle" fill="#8C6819" fontSize="13" fontFamily="'Cinzel', serif" letterSpacing="2">DAY 100 MILESTONE ACHIEVED</text>
        </svg>
      );

    default:
      return null;
  }
};
