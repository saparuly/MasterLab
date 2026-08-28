import React from 'react';
import { Info, Lightbulb, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function Callout({ variant = 'info', title = '', text = '', children }) {
  const getIcon = () => {
    switch (variant) {
      case 'tip':
        return <Lightbulb size={22} color="var(--primary)" className="callout-icon" />;
      case 'warning':
        return <AlertTriangle size={22} color="var(--warning)" className="callout-icon" />;
      case 'danger':
        return <AlertOctagon size={22} color="var(--danger)" className="callout-icon" />;
      case 'info':
      default:
        return <Info size={22} color="var(--info)" className="callout-icon" />;
    }
  };

  return (
    <div className={`callout callout-${variant}`}>
      {getIcon()}
      <div className="callout-content">
        {title && <h4>{title}</h4>}
        {text && <p>{text}</p>}
        {children}
      </div>
    </div>
  );
}
