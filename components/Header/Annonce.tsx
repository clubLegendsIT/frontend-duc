"use client";

import React from 'react';

const Annonce = () => {
  const annonces = [
    "🎉 Offre spéciale : -20% sur toutes les commandes de plus de 30€ ce week-end !",
    "🍕 Nouvelle pizza du mois : La Forestière avec sa crème de cèpes.",
    " Fermeture exceptionnelle le 25 Décembre.",
    "🛵 Livraison désormais disponible à Podensac !"
  ];

  const scrollingText = annonces.join('   -   ');

  return (
    <div className="bg-yellow-400 text-black py-2 overflow-hidden">
      <div className="duc-marquee-track">
        <span className="font-medium text-sm mx-8">{scrollingText}</span>
        <span className="font-medium text-sm mx-8" aria-hidden="true">{scrollingText}</span>
      </div>
      <style jsx global>{`
        @keyframes duc-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .duc-marquee-track {
          display: inline-block;
          white-space: nowrap;
          animation: duc-marquee 30s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default Annonce;