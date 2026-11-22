import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { soundManager } from '../../utils/audioSynth';
import { useEscapeKey } from '../../utils/useEscapeKey';
import { InteractiveEnvelopeCard } from './InteractiveEnvelopeCard';

// 10 Distinct, Rich Inner Experiences
import { Envelope01_GoldenArrival } from './inner/Envelope01_GoldenArrival';
import { Envelope02_FloatingSurprise } from './inner/Envelope02_FloatingSurprise';
import { Envelope03_LightWithin } from './inner/Envelope03_LightWithin';
import { Envelope04_UnfoldingStory } from './inner/Envelope04_UnfoldingStory';
import { Envelope05_StardustMoment } from './inner/Envelope05_StardustMoment';
import { Envelope06_PetalReveal } from './inner/Envelope06_PetalReveal';
import { Envelope07_SecretDispatch } from './inner/Envelope07_SecretDispatch';
import { Envelope08_MagicRipple } from './inner/Envelope08_MagicRipple';
import { Envelope09_MemoryUnlocked } from './inner/Envelope09_MemoryUnlocked';
import { Envelope10_FinalCelebration } from './inner/Envelope10_FinalCelebration';

export const SurpriseEnvelope = ({ envelope, isOpened, onOpen, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (!isOpened) {
      soundManager.playEnvelopeOpen();
      onOpen(envelope.id);
    } else {
      soundManager.playButtonClick();
    }
    setIsModalOpen(true);
  };

  const handleClose = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    soundManager.playButtonClick();
    setIsModalOpen(false);
  };

  useEscapeKey(handleClose, isModalOpen);

  return (
    <>
      {/* 3D Individually Interactive Envelope Card on the Grid */}
      <InteractiveEnvelopeCard
        envelope={envelope}
        isOpened={isOpened}
        index={index}
        onTriggerOpen={handleClick}
      />

      {/* Expanded Modal: Each Envelope Reveals its Own Unique Interactive World */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(16, 8, 24, 0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              zIndex: 1300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              overflowY: 'auto'
            }}
            onClick={handleClose}
          >
            {(() => {
              switch (envelope.id) {
                case 1:
                  return <Envelope01_GoldenArrival envelope={envelope} onClose={handleClose} />;
                case 2:
                  return <Envelope02_FloatingSurprise envelope={envelope} onClose={handleClose} />;
                case 3:
                  return <Envelope03_LightWithin envelope={envelope} onClose={handleClose} />;
                case 4:
                  return <Envelope04_UnfoldingStory envelope={envelope} onClose={handleClose} />;
                case 5:
                  return <Envelope05_StardustMoment envelope={envelope} onClose={handleClose} />;
                case 6:
                  return <Envelope06_PetalReveal envelope={envelope} onClose={handleClose} />;
                case 7:
                  return <Envelope07_SecretDispatch envelope={envelope} onClose={handleClose} />;
                case 8:
                  return <Envelope08_MagicRipple envelope={envelope} onClose={handleClose} />;
                case 9:
                  return <Envelope09_MemoryUnlocked envelope={envelope} onClose={handleClose} />;
                case 10:
                default:
                  return (
                    <Envelope10_FinalCelebration
                      envelope={envelope}
                      onClose={handleClose}
                      onLetterRead={() => onOpen(10)}
                    />
                  );
              }
            })()}
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
