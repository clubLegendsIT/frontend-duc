import Link from 'next/link';

const Logo = () => {
  return (
    <div className="px-8 py-4 bg-white rounded-md">
      <Link href="/" className="text-3xl font-extrabold text-gray-800 tracking-wider uppercase">
        {/* Replace this text with your logo image if you have one */}
        <img src="/LOGO.png" alt="Pizza Le Duc" className="h-20 w-auto" /> 
      </Link>
    </div>
  );
};

export default Logo;