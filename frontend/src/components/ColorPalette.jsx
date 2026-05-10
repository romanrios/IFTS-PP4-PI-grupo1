import React from 'react';

const ColorGroup = ({ title, colors }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h3 style={{ 
      fontFamily: 'var(--font-secondary)', 
      color: 'var(--color-text)',
      borderBottom: '2px solid var(--color-border)',
      paddingBottom: '0.5rem',
      marginBottom: '1rem'
    }}>
      {title}
    </h3>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
      gap: '1rem' 
    }}>
      {colors.map((color) => (
        <div key={color} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{
            backgroundColor: `var(${color})`,
            height: '80px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }} />
          <span style={{ 
            fontSize: '0.8rem', 
            fontFamily: 'var(--font-primary)', 
            color: 'var(--color-text-muted)',
            wordBreak: 'break-all'
          }}>
            {color.replace('--color-', '')}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ColorPalette = () => {
  const palette = {
    "Primary": [
      "--color-primary-lightest", "--color-primary-lighter", "--color-primary-light",
      "--color-primary",
      "--color-primary-dark", "--color-primary-darker", "--color-primary-darkest"
    ],
    "Secondary": [
      "--color-secondary-lightest", "--color-secondary-lighter", "--color-secondary-light",
      "--color-secondary",
      "--color-secondary-dark", "--color-secondary-darker", "--color-secondary-darkest"
    ],
    "Auxiliary": [
      "--color-aux-lightest", "--color-aux-lighter", "--color-aux-light",
      "--color-aux",
      "--color-aux-dark", "--color-aux-darker", "--color-aux-darkest"
    ],
    "Semantic": ["--color-success", "--color-warning", "--color-danger", "--color-info"],
    "Neutrals": [
      "--color-white", "--color-gray-100", "--color-gray-200", "--color-gray-300", 
      "--color-gray-400", "--color-gray-500", "--color-gray-600", "--color-gray-700", 
      "--color-gray-800", "--color-gray-900", "--color-black"
    ],
    "Interface": ["--color-background", "--color-text", "--color-text-muted", "--color-border"]
  };

  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: 'var(--color-background)', 
      minHeight: '100vh' 
    }}>
      <h1 style={{ fontFamily: 'var(--font-secondary)', color: 'var(--color-text)' }}>
        Style Guide Palette
      </h1>
      <p style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
        Visualización de variables CSS para el proyecto MERN.
      </p>
      
      {Object.entries(palette).map(([group, colors]) => (
        <ColorGroup key={group} title={group} colors={colors} />
      ))}
    </div>
  );
};

export default ColorPalette;