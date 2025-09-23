"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const HomeSlider = () => {
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        className="h-[60vh] md:h-[70vh] text-white"
      >
        {/* Slide 1: Kiosque */}
        <SwiperSlide className="relative">
          {/* Background image layer */}
          <img
            src="/kiosque-langon.jpg"
            alt="Kiosque de Langon ou Podensac"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay */}  
          <div className="absolute inset-0 bg-black/50" />
          {/* Foreground content */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center p-4">
              <h2 className="text-lg md:text-xl font-semibold uppercase tracking-widest">Kiosque de Langon ou Podensac</h2>
              <p className="mt-2 text-2xl md:text-4xl font-bold">Ouvert 7j/7</p>
              <p className="text-md md:text-lg">11h - 13h30  |  18h00 - 21h30</p>
              <a 
                href="tel:+33000000000" // Replace with your actual phone number
                className="mt-6 inline-block bg-yellow-400 text-black font-bold uppercase px-8 py-3 rounded-full hover:bg-yellow-500 transition duration-300 transform hover:scale-105"
              >
                Commander
              </a>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2: Livraison Uber Eats */}
        <SwiperSlide className="relative">
          <img
            src="/ubereats.jpeg"
            alt="Livraison Uber Eats"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center p-4">
              <h2 className="text-lg md:text-xl font-semibold uppercase tracking-widest">Livraison à Domicile</h2>
              {/* You can add the Uber Eats logo here */}
              {/* <img src="/uber-eats-logo.svg" alt="Uber Eats" className="h-12 mx-auto mt-2" /> */}
              <p className="mt-2 text-2xl md:text-4xl font-bold">Avec Uber Eats</p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a 
                  href="https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 text-white font-bold uppercase px-6 py-3 rounded-full hover:bg-green-600 transition duration-300 transform hover:scale-105 w-full sm:w-auto text-center"
                >
                  Uber Eats Podensac
                </a>
                <a 
                  href="https://www.ubereats.com/fr/store/pizza-le-duc-langon/knYx33kaXLSOSaJVs7XyRg"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 text-white font-bold uppercase px-6 py-3 rounded-full hover:bg-green-600 transition duration-300 transform hover:scale-105 w-full sm:w-auto text-center"
                >
                  Uber Eats Langon
                </a>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3: Notre Carte */}
        <SwiperSlide className="relative">
          <img
            src="/patte.png"
            alt="Pâte à pizzas faite maison"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center p-4 max-w-lg">
              <h2 className="text-2xl md:text-4xl font-bold">Pâte à pizzas faite maison.</h2>
              <p className="mt-2 text-lg md:text-xl">Produits frais choisis avec noblesse pour des saveurs authentiques.</p>
              <Link 
                href="/notre-carte"
                className="mt-6 inline-block bg-red-600 text-white font-bold uppercase px-8 py-3 rounded-full hover:bg-red-700 transition duration-300 transform hover:scale-105"
              >
                Découvrir Notre Carte
              </Link>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HomeSlider;