import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FaHome } from "react-icons/fa";

interface HomeButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function HomeButton({ className, children }: HomeButtonProps) {
  const router = useRouter();

  return (
    <Button 
      onClick={() => router.push('/')} 
      className={className}
    >
      <FaHome />
      {children || 'Página Inicial'}
    </Button>
  );
};