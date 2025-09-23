import Header from '@/components/Header/Header';
import HomeSlider from '@/components/Home-Slider/HomeSlider';

export default function Home() {
  return (
    <main>
      {/* Set showAnnonce to true or false depending on your needs */}
      <Header showAnnonce={true} />
      <HomeSlider /> 
      
    </main>
  );
}