import React from 'react';
import { FiX } from 'react-icons/fi';

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SlideOver: React.FC<SlideOverProps> = ({ open, onClose, children }) => {
  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: open ? 'rgba(0,0,0,0.5)' : 'transparent',
          transition: 'background 0.3s',
          zIndex: 1000,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />
      {/* Slide-over card */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 480,
          background: '#23252B',
          color: '#fff',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.2)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#fff',
            margin: 0
          }}>
            Edit Variables
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => (e.target as HTMLElement).style.background = '#444'}
            onMouseLeave={e => (e.target as HTMLElement).style.background = 'transparent'}
          >
            <FiX size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '32px'
        }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default SlideOver; 