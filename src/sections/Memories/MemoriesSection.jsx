import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Image, RefreshCw, Upload } from 'lucide-react';
import { memoriesData } from '../../data/memories';
import { ScrapbookCard } from '../../components/Scrapbook/ScrapbookCard';
import {
  getInitialScrapbookPhotos,
  loadAllScrapbookPhotos,
  saveScrapbookPhoto,
  deleteScrapbookPhoto
} from '../../utils/photoStorage';

export const MemoriesSection = () => {
  // Store custom uploaded photos in IndexedDB + localStorage for permanent persistence
  const [customPhotos, setCustomPhotos] = useState(getInitialScrapbookPhotos);

  // Sync from IndexedDB on mount to guarantee photos remain even if localStorage was trimmed
  useEffect(() => {
    loadAllScrapbookPhotos().then((stored) => {
      if (stored && Object.keys(stored).length > 0) {
        setCustomPhotos((prev) => ({ ...prev, ...stored }));
      }
    });
  }, []);

  const handleCustomPhotoChange = async (cardId, fileOrBase64) => {
    try {
      const saved = await saveScrapbookPhoto(cardId, fileOrBase64);
      setCustomPhotos((prev) => ({ ...prev, [cardId]: saved }));
    } catch (err) {
      console.error('Error saving photo:', err);
    }
  };

  const handleDeletePhoto = async (cardId) => {
    try {
      await deleteScrapbookPhoto(cardId);
      setCustomPhotos((prev) => {
        const updated = { ...prev };
        delete updated[cardId];
        return updated;
      });
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  const handleResetPhotos = async () => {
    if (window.confirm('Reset all photos to default aesthetic illustrations?')) {
      for (const memory of memoriesData) {
        await deleteScrapbookPhoto(memory.id);
      }
      setCustomPhotos({});
    }
  };

  return (
    <section id="memories" className="section-wrapper" style={{ position: 'relative' }}>
      <div className="content-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(230, 215, 250, 0.65)',
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(123, 94, 153, 0.25)',
              marginBottom: '14px'
            }}
          >
            <BookOpen size={14} color="#7B5E99" />
            <span
              className="font-cinzel"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#5C3E78',
                letterSpacing: '0.12em'
              }}
            >
              CHAPTER ONE • MEMORY SCRAPBOOK
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif-luxury"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 700,
              color: '#34224C',
              lineHeight: 1.2,
              marginBottom: '14px'
            }}
          >
            100 Days. A Lot of Little Moments.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: '16px',
              color: '#6E5D84',
              lineHeight: 1.6
            }}
          >
            Five little snapshots from the past 100 days. Click any polaroid to open its full story,
            or replace any photo with your own local memories!
          </motion.p>

          {/* Quick Photo Customizer Notice */}
          {Object.keys(customPhotos).length > 0 && (
            <div style={{ marginTop: '14px' }}>
              <button
                onClick={handleResetPhotos}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9E4663',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'underline'
                }}
              >
                <RefreshCw size={12} />
                Reset custom photos to default art
              </button>
            </div>
          )}
        </div>

        {/* 5 Polaroid Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
            position: 'relative',
            zIndex: 2
          }}
        >
          {memoriesData.map((memory, index) => (
            <ScrapbookCard
              key={memory.id}
              memory={memory}
              index={index}
              customPhoto={customPhotos[memory.id]}
              onCustomPhotoChange={handleCustomPhotoChange}
              onDeletePhoto={handleDeletePhoto}
            />
          ))}
        </div>

        {/* Developer / Owner Note for Local Asset Replacement */}
        <div
          style={{
            marginTop: '45px',
            textAlign: 'center',
            fontSize: '12.5px',
            color: '#8A7A9E',
            background: 'rgba(255, 253, 249, 0.75)',
            border: '1px dashed rgba(212, 175, 55, 0.35)',
            borderRadius: '16px',
            padding: '14px 20px',
            maxWidth: '680px',
            margin: '45px auto 0'
          }}
        >
          <span style={{ fontWeight: 600, color: '#5C3E78' }}>
            💡 Easy Photo Personalization:
          </span>{' '}
          Click any card and tap <em>"Upload Photo"</em> to upload directly from your device, or place your own images in{' '}
          <code style={{ background: '#ECE4F7', padding: '2px 6px', borderRadius: '4px', color: '#4A3568' }}>
            src/assets/images/photo1.jpg ... photo5.jpg
          </code>
        </div>
      </div>
    </section>
  );
};
