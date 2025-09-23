import Annonce from './Annonce';
import Logo from './Logo';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';

interface HeaderProps {
  showAnnonce?: boolean;
}

const Header = ({ showAnnonce = true }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-white flex justify-center border-b border-gray-200">
        <Logo />
      </div>
      {showAnnonce && <Annonce />}
      <Navbar />
      <MobileBottomNav />
    </header>
  );
};

export default Header;