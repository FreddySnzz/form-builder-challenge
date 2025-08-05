'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import FormAnswer from '@/components/FormAnswer';

export default function AnswerFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formulario, setFormulario] = useState<any>(null);
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [condicionalidades, setCondicionalidades] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: form } = await supabase.from('formulario').select().eq('id', id).single();
      setFormulario(form);

      const { data: perguntas } = await supabase
        .from('pergunta')
        .select('*, opcoes_respostas(*)')
        .eq('id_formulario', id)
        .order('ordem', { ascending: true });

      const { data: conds } = await supabase.from('condicionalidade').select();

      setPerguntas(perguntas || []);
      setCondicionalidades(conds || []);
    };
    fetchData();
  }, [id]);

  if (!formulario) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{formulario.titulo}</h1>
      <p className="text-muted-foreground">{formulario.descricao}</p>
      <FormAnswer
        formularioId={id as string}
        perguntas={perguntas}
        condicionalidades={condicionalidades}
        onSubmit={() => router.push('/')}
      />
    </div>
  );
}
