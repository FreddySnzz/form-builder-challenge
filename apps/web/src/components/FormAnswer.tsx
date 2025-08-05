'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FormAnswer({
  perguntas,
  formularioId,
  condicionalidades,
  onSubmit,
}: {
  perguntas: any[];
  formularioId: string;
  condicionalidades: any[];
  onSubmit: () => void;
}) {
  const [respostas, setRespostas] = useState<Record<string, any>>({});

  const handleChange = (perguntaId: string, value: any) => {
    setRespostas((prev) => ({ ...prev, [perguntaId]: value }));
  };

  const isPerguntaVisivel = (perguntaId: string): boolean => {
    const regras = condicionalidades.filter((c) => c.id_pergunta_exibida === perguntaId);

    if (regras.length === 0) return true;

    return regras.some((regra) => respostas[regra.id_pergunta_condicional] === regra.id_opcao_ativa);
  };

  const salvarRespostas = async () => {
    const { data: respostaUsuario, error } = await supabase
      .from('resposta_usuario')
      .insert({ id_formulario: formularioId })
      .select()
      .single();

    if (error) return alert('Erro ao salvar respostas');

    const respostasArray = perguntas.map((p) => {
      const valor = respostas[p.id];
      if (!isPerguntaVisivel(p.id)) return null;

      if (p.tipo_pergunta === 'texto_livre' || p.tipo_pergunta === 'sim_nao') {
        return {
          id_resposta_usuario: respostaUsuario.id,
          id_pergunta: p.id,
          resposta_texto: valor,
        };
      }
      if (p.tipo_pergunta === 'inteiro' || p.tipo_pergunta === 'float') {
        return {
          id_resposta_usuario: respostaUsuario.id,
          id_pergunta: p.id,
          resposta_numero: Number(valor),
        };
      }
      if (p.tipo_pergunta === 'unica_escolha') {
        return {
          id_resposta_usuario: respostaUsuario.id,
          id_pergunta: p.id,
          id_opcao_escolhida: valor,
        };
      }
      if (p.tipo_pergunta === 'multipla_escolha') {
        return valor.map((id_opcao: string) => ({
          id_resposta_usuario: respostaUsuario.id,
          id_pergunta: p.id,
          id_opcao_escolhida: id_opcao,
        }));
      }
    });

    const flatRespostas = respostasArray.flat().filter(Boolean);

    const { error: erroInsert } = await supabase
      .from('resposta_pergunta')
      .insert(flatRespostas);

    if (erroInsert) return alert('Erro ao registrar perguntas');

    alert('Respostas enviadas!');
    onSubmit();
  };

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {perguntas.map((p) => {
        if (!isPerguntaVisivel(p.id)) return null;

        return (
          <div key={p.id}>
            <label className="block font-semibold mb-1">{p.titulo}</label>

            {p.tipo_pergunta === 'texto_livre' && (
              <input
                type="text"
                className="border px-2 py-1 w-full"
                onChange={(e) => handleChange(p.id, e.target.value)}
              />
            )}

            {p.tipo_pergunta === 'inteiro' && (
              <input
                type="number"
                step="1"
                className="border px-2 py-1 w-full"
                onChange={(e) => handleChange(p.id, e.target.value)}
              />
            )}

            {p.tipo_pergunta === 'float' && (
              <input
                type="number"
                step="any"
                className="border px-2 py-1 w-full"
                onChange={(e) => handleChange(p.id, e.target.value)}
              />
            )}

            {p.tipo_pergunta === 'sim_nao' && (
              <div className="space-x-4">
                <label>
                  <input
                    type="radio"
                    name={p.id}
                    value="Sim"
                    onChange={() => handleChange(p.id, 'Sim')}
                  />
                  Sim
                </label>
                <label>
                  <input
                    type="radio"
                    name={p.id}
                    value="Não"
                    onChange={() => handleChange(p.id, 'Não')}
                  />
                  Não
                </label>
              </div>
            )}

            {p.tipo_pergunta === 'unica_escolha' && (
              <div className="space-y-2">
                {p.opcoes_respostas.map((op: any) => (
                  <label key={op.id} className="block">
                    <input
                      type="radio"
                      name={p.id}
                      value={op.id}
                      onChange={() => handleChange(p.id, op.id)}
                      className="mr-2"
                    />
                    {op.resposta}
                  </label>
                ))}
              </div>
            )}

            {p.tipo_pergunta === 'multipla_escolha' && (
              <div className="space-y-2">
                {p.opcoes_respostas.map((op: any) => (
                  <label key={op.id} className="block">
                    <input
                      type="checkbox"
                      value={op.id}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setRespostas((prev) => {
                          const atual = prev[p.id] || [];
                          return {
                            ...prev,
                            [p.id]: checked
                              ? [...atual, op.id]
                              : atual.filter((id: string) => id !== op.id),
                          };
                        });
                      }}
                      className="mr-2"
                    />
                    {op.resposta}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="gap-4 flex justify-between">
        <Link
        href={`/`}
        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2.5 rounded text-sm"
      >
        Voltar
      </Link>

      <Button
        onClick={salvarRespostas}
        className="bg-green-600 text-white px-4 py-2 rounded text-sm"
      >
        Enviar Respostas
      </Button>
      </div>
    </form>
  );
}
