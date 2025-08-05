'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card>
      <CardHeader>
        <CardTitle>Condicionalidades</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="space-y-2 pt-4">
          <div>
            <Label className="my-4">Pergunta condicional</Label>
            <Select
              value={nova.id_pergunta_condicional}
              onValueChange={(value) =>
                setNova({ ...nova, id_pergunta_condicional: value, id_opcao_ativa: '' })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a pergunta condicional" />
              </SelectTrigger>
              <SelectContent>
                {perguntas
                  .filter((p) => p.opcoes_respostas.length > 0)
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.titulo}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="my-4">Opção que ativa</Label>
            <Select
              disabled={!nova.id_pergunta_condicional}
              value={nova.id_opcao_ativa}
              onValueChange={(value) => setNova({ ...nova, id_opcao_ativa: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a opção" />
              </SelectTrigger>
              <SelectContent>
                {getOpcoes(nova.id_pergunta_condicional).map((op: any) => (
                  <SelectItem key={op.id} value={op.id}>
                    {op.resposta}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="my-4">Pergunta a exibir</Label>
            <Select
              value={nova.id_pergunta_exibida}
              onValueChange={(value) => setNova({ ...nova, id_pergunta_exibida: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a pergunta a exibir" />
              </SelectTrigger>
              <SelectContent>
                {perguntas.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.titulo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="mt-2" onClick={salvarCondicionalidade}>
            + Adicionar condicionalidade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
