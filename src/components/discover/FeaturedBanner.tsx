
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturedBanner = () => {
  const navigate = useNavigate();
  
  const handleFeaturedClick = () => {
    navigate("/learning-hub/advanced-guitar-techniques");
  };

  return (
    <div 
      className="relative rounded-lg overflow-hidden h-48 md:h-64 bg-gradient-to-r from-gold/30 to-gold-dark/30 mb-8 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleFeaturedClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10"></div>
      <img 
        src="https://i.imgur.com/CezScCW.jpeg" 
        alt="Featured content" 
        className="absolute inset-0 w-full h-full object-cover" 
      />
      <div className="relative z-20 p-6 flex flex-col h-full justify-end">
        <div className="inline-block bg-gold text-white px-2 py-1 rounded-md text-xs mb-2 w-fit">
          FEATURED
        </div>
        <h3 className="text-xl md:text-2xl font-proxima text-white font-bold mb-1">
          How 'Salama' Was Written
        </h3>
        <p className="text-white/80 text-sm md:text-base max-w-lg">
          Explore the intricacy of a song heard in Machakos, written in Eldoret and recorded in Nairobi
        </p>
      </div>
    </div>
  );
};

export default FeaturedBanner;
