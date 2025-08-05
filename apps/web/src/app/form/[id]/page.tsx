'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import HomeButton from '@/components/template/HomeButton';

export default function PreviewFormPage() {
  const { id } = useParams();
  const [formulario, setFormulario] = useState<any>(null);
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [respostas, setRespostas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);

      const { data: form } = await supabase
        .from('formulario')
        .select()
        .eq('id', id)
        .single();
      setFormulario(form);

      const { data: perguntasData } = await supabase
        .from('pergunta')
        .select('*, opcoes_respostas(*)')
        .eq('id_formulario', id)
        .order('ordem', { ascending: true });

      setPerguntas(perguntasData || []);

      const { data: respostaUsuarios } = await supabase
        .from('resposta_usuario')
        .select('id, created_at, resposta_pergunta(*)')
        .eq('id_formulario', id)
        .order('created_at', { ascending: true });

      setRespostas(respostaUsuarios || []);
      setLoading(false);
    };

    fetchDados();
  }, [id]);

  if (loading || !formulario) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{formulario.titulo}</h1>
      <p className="text-gray-600 mb-4">{formulario.descricao}</p>

      {respostas.length === 0 ? (
        <p className="text-gray-500 italic">Nenhuma resposta enviada ainda.</p>
      ) : (
        <div className="space-y-8">
          {respostas.map((resposta, idx) => (
            <div key={resposta.id} className="border rounded p-4">
              <h2 className="font-semibold text-lg mb-2">
                📄 Resposta #{idx + 1} — {new Date(resposta.created_at).toLocaleString()}
              </h2>
              <ul className="space-y-3">
                {perguntas.map((pergunta) => {
                  const respostaPergunta = resposta.resposta_pergunta.find(
                    (r: any) => r.id_pergunta === pergunta.id
                  );

                  if (!respostaPergunta) return null;

                  let valorExibido = '';
                  if (respostaPergunta.resposta_texto) {
                    valorExibido = respostaPergunta.resposta_texto;
                  } else if (respostaPergunta.resposta_numero !== null) {
                    valorExibido = respostaPergunta.resposta_numero;
                  } else if (respostaPergunta.id_opcao_escolhida) {
                    const opcao = pergunta.opcoes_respostas.find(
                      (op: any) => op.id === respostaPergunta.id_opcao_escolhida
                    );
                    valorExibido = opcao ? opcao.resposta : '[opção removida]';
                  }

                  return (
                    <li key={pergunta.id}>
                      <strong>{pergunta.titulo}</strong>{' '}
                      <span className="text-gray-800">{valorExibido}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          
        </div>
      )}
      <div className='flex justify-end mt-8'>
        <HomeButton />
      </div>
    </div>
  );
}
