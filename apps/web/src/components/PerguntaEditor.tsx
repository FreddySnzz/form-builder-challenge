'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import OpcaoEditor from './OpcaoEditor';
import { v4 as uuidv4 } from 'uuid';

const TIPOS = [
  'sim_nao',
  'multipla_escolha',
  'unica_escolha',
  'texto_livre',
  'inteiro',
  'float',
];

export default function PerguntaEditor({
  idFormulario,
  onPerguntasChange,
}: {
  idFormulario: string;
  onPerguntasChange?: (perguntas: any[]) => void;
}) {
  const [perguntas, setPerguntas] = useState<any[]>([]);

  const fetchPerguntas = async () => {
    const { data } = await supabase
      .from('pergunta')
      .select('*, opcoes_respostas(*)')
      .eq('id_formulario', idFormulario)
      .order('ordem', { ascending: true });
    if (data) {
      setPerguntas(data);
      onPerguntasChange?.(data);
    }
  };

  useEffect(() => {
    fetchPerguntas();
  }, [idFormulario]);

  const adicionarPergunta = async () => {
    const nova = {
      id_formulario: idFormulario,
      titulo: 'Nova Pergunta',
      codigo: uuidv4().slice(0, 6),
      tipo_pergunta: 'texto_livre',
      ordem: perguntas.length,
    };
    const { data } = await supabase.from('pergunta').insert(nova).select().single();
    if (data) {
      const atualizadas = [...perguntas, { ...data, opcoes_respostas: [] }];
      setPerguntas(atualizadas);
      onPerguntasChange?.(atualizadas);
    }
  };

  const atualizarPergunta = async (id: string, campo: string, valor: any) => {
    await supabase.from('pergunta').update({ [campo]: valor }).eq('id', id);
    const atualizadas = perguntas.map((p) => (p.id === id ? { ...p, [campo]: valor } : p));
    setPerguntas(atualizadas);
    onPerguntasChange?.(atualizadas);
  };

  const removerPergunta = async (id: string) => {
    await supabase.from('pergunta').delete().eq('id', id);
    const atualizadas = perguntas.filter((p) => p.id !== id);
    setPerguntas(atualizadas);
    onPerguntasChange?.(atualizadas);
  };

  return (
    <div className="mt-6">
      {perguntas.map((p) => (
        <div key={p.id} className="border rounded p-4 mb-4 relative">
          <button
            onClick={() => removerPergunta(p.id)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
          >
            ✖
          </button>

          <input
            className="w-full mb-2 border px-2 py-1"
            value={p.titulo}
            onChange={(e) => atualizarPergunta(p.id, 'titulo', e.target.value)}
          />
          <select
            className="w-full mb-2 border px-2 py-1"
            value={p.tipo_pergunta}
            onChange={(e) => atualizarPergunta(p.id, 'tipo_pergunta', e.target.value)}
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {['multipla_escolha', 'unica_escolha', 'sim_nao'].includes(p.tipo_pergunta) && (
            <OpcaoEditor idPergunta={p.id} opcoes={p.opcoes_respostas} />
          )}
        </div>
      ))}

      <button
        onClick={adicionarPergunta}
        className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
      >
        + Adicionar Pergunta
      </button>
    </div>
  );
}