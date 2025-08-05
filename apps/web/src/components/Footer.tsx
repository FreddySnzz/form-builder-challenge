'use client';

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={`fixed bottom-0 left-0 w-full text-sm text-white bg-gray-800 p-6 text-center ${className}`}>
      <p>Copyright &copy; {new Date().getFullYear()} - All rights reserved</p>
      <div>
        <span>Desenvolvido por </span>
        <a href="https://github.com/FreddySnzz">
          <span className="font-bold">FreddySnzz</span>
        </a>
      </div>
    </footer>
  );
}