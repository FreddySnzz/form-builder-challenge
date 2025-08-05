import PerguntaCard from './PerguntaCard';

export default function FormViewer({ perguntas }: { perguntas: any[] }) {
  return (
    <form className="space-y-4">
      {perguntas.map((pergunta) => (
        <PerguntaCard key={pergunta.id} pergunta={pergunta} />
      ))}
    </form>
  );
}
