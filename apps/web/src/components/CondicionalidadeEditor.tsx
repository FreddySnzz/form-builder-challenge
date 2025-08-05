'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Condicionalidade = {
  id?: string;
  id_pergunta_condicional: string;
  id_opcao_ativa: string;
  id_pergunta_exibida: string;
};

export default function CondicionalidadeEditor({
  perguntas,
  formularioId,
}: {
  perguntas: any[];
  formularioId: string;
}) {
  const [condicionalidades, setCondicionalidades] = useState<Condicionalidade[]>([]);
  const [nova, setNova] = useState<Condicionalidade>({
    id_pergunta_condicional: '',
    id_opcao_ativa: '',
    id_pergunta_exibida: '',
  });

  useEffect(() => {
    const fetchConds = async () => {
      const { data } = await supabase
        .from('condicionalidade')
        .select()
        .in('id_pergunta_exibida', perguntas.map((p) => p.id));
      setCondicionalidades(data || []);
    };
    fetchConds();
  }, [formularioId]);

  const salvarCondicionalidade = async () => {
    if (!nova.id_pergunta_condicional || !nova.id_opcao_ativa || !nova.id_pergunta_exibida)
      return alert('Preencha todos os campos.');

    const { data, error } = await supabase
      .from('condicionalidade')
      .insert([nova])
      .select()
      .single();

    if (error) return alert('Erro ao salvar: ' + error.message);
    setCondicionalidades((prev) => [...prev, data]);
    setNova({ id_pergunta_condicional: '', id_opcao_ativa: '', id_pergunta_exibida: '' });
  };

  const getOpcoes = (idPergunta: string) => {
    const pergunta = perguntas.find((p) => p.id === idPergunta);
    return pergunta?.opcoes_respostas || [];
  };

  return (
    <div className="border p-4 mt-6 rounded">
      <h2 className="text-lg font-semibold mb-4">Condicionalidades</h2>

      <div className="space-y-4">
        {condicionalidades.map((c, i) => {
          const perguntaCond = perguntas.find((p) => p.id === c.id_pergunta_condicional);
          const opcaoCond = perguntaCond?.opcoes_respostas.find((op: any) => op.id === c.id_opcao_ativa);
          const perguntaExibe = perguntas.find((p) => p.id === c.id_pergunta_exibida);

          return (
            <div key={i} className="text-sm">
              Se responder <strong>"{opcaoCond?.resposta}"</strong> à pergunta{' '}
              <strong>{perguntaCond?.titulo}</strong>, mostrar{' '}
              <strong>{perguntaExibe?.titulo}</strong>
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-2">
        <div>
          <label className="block font-medium">Pergunta condicional</label>
          <select
            className="w-full border px-2 py-1"
            value={nova.id_pergunta_condicional}
            onChange={(e) =>
              setNova({ ...nova, id_pergunta_condicional: e.target.value, id_opcao_ativa: '' })
            }
          >
            <option value="">Selecione...</option>
            {perguntas
              .filter((p) => p.opcoes_respostas.length > 0)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.titulo}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Opção que ativa</label>
          <select
            className="w-full border px-2 py-1"
            value={nova.id_opcao_ativa}
            onChange={(e) => setNova({ ...nova, id_opcao_ativa: e.target.value })}
            disabled={!nova.id_pergunta_condicional}
          >
            <option value="">Selecione...</option>
            {getOpcoes(nova.id_pergunta_condicional).map((op: any) => (
              <option key={op.id} value={op.id}>
                {op.resposta}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Pergunta a exibir</label>
          <select
            className="w-full border px-2 py-1"
            value={nova.id_pergunta_exibida}
            onChange={(e) => setNova({ ...nova, id_pergunta_exibida: e.target.value })}
          >
            <option value="">Selecione...</option>
            {perguntas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.titulo}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={salvarCondicionalidade}
        >
          Adicionar condicionalidade
        </button>
      </div>
    </div>
  );
}
