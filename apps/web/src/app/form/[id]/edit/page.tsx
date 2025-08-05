'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PerguntaEditor from '@/components/PerguntaEditor';
import CondicionalidadeEditor from '@/components/CondicionalidadeEditor';

type Formulario = {
  id: string;
  titulo: string;
  descricao: string;
};

export default function EditFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formulario, setFormulario] = useState<Formulario | null>(null);
  const [perguntas, setPerguntas] = useState<any[]>([]);

  useEffect(() => {
    const fetchFormulario = async () => {
      const { data } = await supabase
        .from('formulario')
        .select()
        .eq('id', id)
        .single();
      if (data) setFormulario(data);
    };
    fetchFormulario();
  }, [id]);

  const salvarFormulario = async () => {
    alert('Formulário salvo com sucesso!');
    router.push('/');
  };

  if (!formulario) return <p>Carregando...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">✏️ Editar: {formulario.titulo}</h1>

      <PerguntaEditor
        idFormulario={formulario.id}
        onPerguntasChange={(p: any) => setPerguntas(p)}
      />

      {perguntas.length > 0 && (
        <CondicionalidadeEditor
          perguntas={perguntas}
          formularioId={formulario.id}
        />
      )}

      <button
        onClick={salvarFormulario}
        className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded"
      >
        💾 Salvar e Voltar
      </button>
    </div>
  );
}
