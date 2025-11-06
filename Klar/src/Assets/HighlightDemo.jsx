import React from 'react';
import Highlight, { COLOR_PALETTES } from './Highlight';

const HighlightDemo = () => {
  // Custom color palette example
  const customPalette = {
    background: '#ff6b6b',
    color: '#ffffff',
    border: '#ee5a52'
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Highlight Component Demo</h1>

      {/* Basic Text Highlighting */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Text Highlighting</h2>
        <div className="space-y-2">
          <p>
            This is a sentence with <Highlight text="highlighted text" palette="primary" /> in it.
          </p>
          <p>
            Here's another example with <Highlight palette="success">inline highlighted content</Highlight>.
          </p>
        </div>
      </section>

      {/* Color Palettes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Color Palettes</h2>
        <div className="flex flex-wrap gap-2">
          {Object.keys(COLOR_PALETTES).map((palette) => (
            <Highlight key={palette} text={palette} palette={palette} />
          ))}
        </div>
      </section>

      {/* Variants */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Variants</h2>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Highlight text="Filled" variant="filled" palette="primary" />
            <Highlight text="Outlined" variant="outlined" palette="primary" />
            <Highlight text="Ghost" variant="ghost" palette="primary" />
            <Highlight text="Subtle" variant="subtle" palette="primary" />
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Sizes</h2>
        <div className="flex items-center gap-2">
          <Highlight text="Small" size="small" palette="info" />
          <Highlight text="Medium" size="medium" palette="info" />
          <Highlight text="Large" size="large" palette="info" />
          <Highlight text="XLarge" size="xlarge" palette="info" />
        </div>
      </section>

      {/* Rounded Corners */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Rounded Variants</h2>
        <div className="flex gap-2">
          <Highlight text="None" rounded="none" palette="warning" />
          <Highlight text="Small" rounded="small" palette="warning" />
          <Highlight text="Medium" rounded="medium" palette="warning" />
          <Highlight text="Large" rounded="large" palette="warning" />
          <Highlight text="Full" rounded="full" palette="warning" />
        </div>
      </section>

      {/* Custom Colors */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Custom Colors</h2>
        <div className="space-y-2">
          <p>
            Custom color example: <Highlight text="Custom Pink" customColors={customPalette} />
          </p>
          <p>
            Another custom: <Highlight
              text="Purple Magic"
              customColors={{
                background: '#8b5cf6',
                color: '#ffffff',
                border: '#7c3aed'
              }}
            />
          </p>
        </div>
      </section>

      {/* Interactive Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Interactive Highlights</h2>
        <div className="space-y-2">
          <p>
            Click me: <Highlight
              text="Clickable"
              palette="primary"
              id="clickable-highlight"
              onClick={() => alert('Highlight clicked!')}
              title="Click to see alert"
            />
          </p>
          <p>
            With ID: <Highlight
              text="Has ID"
              palette="info"
              id="info-highlight"
              title="This highlight has id='info-highlight'"
            />
          </p>
        </div>
      </section>      {/* Wrapping Components */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Wrapping Components</h2>
        <div className="space-y-4">
          <Highlight palette="lightSuccess" className="block p-4">
            <div>
              <h3 className="font-bold">Card Content</h3>
              <p>This entire div is wrapped in a highlight component.</p>
            </div>
          </Highlight>

          <Highlight palette="gradientPurple" variant="filled" className="block p-4">
            <div className="text-center">
              <h3 className="text-lg font-bold">Gradient Highlight</h3>
              <p>Beautiful gradient background</p>
            </div>
          </Highlight>
        </div>
      </section>

      {/* Status Indicators */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Status Indicators</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Highlight text="Success" palette="success" size="small" />
            <span>Operation completed successfully</span>
          </div>
          <div className="flex items-center gap-2">
            <Highlight text="Warning" palette="warning" size="small" />
            <span>Please review this item</span>
          </div>
          <div className="flex items-center gap-2">
            <Highlight text="Error" palette="error" size="small" />
            <span>Something went wrong</span>
          </div>
          <div className="flex items-center gap-2">
            <Highlight text="Info" palette="info" size="small" />
            <span>Additional information available</span>
          </div>
        </div>
      </section>

      {/* Tags/Labels */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Tags & Labels</h2>
        <div className="flex flex-wrap gap-2">
          <Highlight text="React" palette="lightPrimary" rounded="full" size="small" />
          <Highlight text="JavaScript" palette="lightWarning" rounded="full" size="small" />
          <Highlight text="CSS" palette="lightInfo" rounded="full" size="small" />
          <Highlight text="Frontend" palette="lightSuccess" rounded="full" size="small" />
          <Highlight text="UI/UX" palette="lightError" rounded="full" size="small" />
        </div>
      </section>
    </div>
  );
};

export default HighlightDemo;