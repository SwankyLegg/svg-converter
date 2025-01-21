import { useState, useEffect } from 'react';

export default function Accordion({ children, title, open = false }) {
  const [isOpen, setIsOpen] = useState(open);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClick = (e) => {
    e.preventDefault();
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 300); // match transition duration
    } else {
      setIsOpen(true);
    }
  };

  return (
    <details open={isOpen} onClick={handleClick} style={{
      marginBottom: '24px',
      borderRadius: '8px',
      border: '1px solid #eee',
      background: 'white'
    }}>
      <style global jsx>{`
        details {
          transition: all 0.3s ease;
        }
        
        .chevron {
          transform: rotate(-90deg);
          transition: transform 0.3s ease;
        }
        
        details[open] .chevron {
          transform: rotate(0deg);
        }
        
        .accordion-content {
          box-sizing: border-box;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out;
        }
        
        details[open] .accordion-content {
          max-height: 500px;
        }
        
        details[open] .accordion-content.closing {
          max-height: 0;
        }
      `}</style>
      <summary style={{
        cursor: 'pointer',
        listStyle: 'none',
        padding: '12px 16px',
        position: 'relative',
        borderRadius: '8px',
        userSelect: 'none',
        ':hover': {
          backgroundColor: '#f9f9f9'
        }
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {title}
          <div style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 'auto'
          }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="chevron"
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </summary>
      <div className={`accordion-content ${isClosing ? 'closing' : ''}`} style={{
        borderTop: '1px solid #eee'
      }}>
        <div style={{
          paddingBlock: '32px'
        }}>
          {children}
        </div>
      </div>
    </details>
  );
} 