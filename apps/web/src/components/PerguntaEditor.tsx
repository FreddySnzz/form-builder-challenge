'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { FiTrash } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OpcaoEditor from './OpcaoEditor';

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
    const atualizadas = perguntas.map((p) => (p.id === id ? { ...p, [campo]: valor } : p));
    setPerguntas(atualizadas);
    onPerguntasChange?.(atualizadas);
    await supabase.from('pergunta').update({ [campo]: valor }).eq('id', id);
  };

  const removerPergunta = async (id: string) => {
    await supabase.from('pergunta').delete().eq('id', id);
    const atualizadas = perguntas.filter((p) => p.id !== id);
    setPerguntas(atualizadas);
    onPerguntasChange?.(atualizadas);
  };

  return (
    <div className="space-y-6">
      {perguntas.map((p) => (
        <Card key={p.id} className='border-0 shadow-white'>
          <CardContent className="space-y-4">
            <Input
              value={p.titulo}
              onChange={(e) => atualizarPergunta(p.id, 'titulo', e.target.value)}
              placeholder="Título da pergunta"
            />

            <Select
              value={p.tipo_pergunta}
              onValueChange={(value) => atualizarPergunta(p.id, 'tipo_pergunta', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tipo da pergunta" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {['multipla_escolha', 'unica_escolha', 'sim_nao'].includes(p.tipo_pergunta) && (
              <OpcaoEditor idPergunta={p.id} opcoes={p.opcoes_respostas} />
            )}

            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={() => removerPergunta(p.id)}
                className="flex items-center gap-2"
              >
                <FiTrash />
                Excluir pergunta
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center">
        <Button 
          onClick={adicionarPergunta} 
          className="bg-green-600 hover:bg-green-700"
        >
          + Adicionar Pergunta
        </Button>
      </div>
    </div>
  );
}
