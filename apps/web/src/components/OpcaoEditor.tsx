'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FiPlus } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function OpcaoEditor({
  idPergunta,
  opcoes,
}: {
  idPergunta: string;
  opcoes: any[];
}) {
  const [resposta, setResposta] = useState('');

  const adicionarOpcao = async () => {
    if (!resposta.trim()) return;

    const { data, error } = await supabase
      .from('opcoes_respostas')
      .insert({
        id_pergunta: idPergunta,
        resposta,
        ordem: opcoes.length,
      })
      .select()
      .single();

    if (error) return alert('Erro ao adicionar opção: ' + error.message);

    if (data) window.location.reload();
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Opções da Pergunta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="max-h-40 pr-2">
          <ul className="space-y-1 text-sm text-muted-foreground">
            {opcoes.map((o) => (
              <li key={o.id}>• {o.resposta}</li>
            ))}
          </ul>
        </ScrollArea>

        <Input
          value={resposta}
          onChange={(e) => setResposta(e.target.value)}
          placeholder="Nova opção de resposta"
        />

        <Button
          onClick={adicionarOpcao}
          className="flex items-center gap-2"
        >
          <FiPlus />
          Adicionar Opção
        </Button>
      </CardContent>
    </Card>
  );
}
