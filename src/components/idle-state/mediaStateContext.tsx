// mediaStateContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface MediaStateContextProps {
  isMediaPlaying: boolean;
  setMediaPlaying: (isPlaying: boolean) => void;
}

const MediaStateContext = createContext<MediaStateContextProps>({
  isMediaPlaying: false,
  setMediaPlaying: () => {},
});

export const MediaStateProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isMediaPlaying, setIsMediaPlaying] = useState(false);

  return (
    <MediaStateContext.Provider value={{ isMediaPlaying, setMediaPlaying: setIsMediaPlaying }}>
      {children}
    </MediaStateContext.Provider>
  );
};

export const useMediaState = () => useContext(MediaStateContext);
