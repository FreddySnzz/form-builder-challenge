'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function OpcaoEditor({
  idPergunta,
  opcoes,
}: {
  idPergunta: string;
  opcoes: any[];
}) {
  const [resposta, setResposta] = useState('');

  const adicionarOpcao = async () => {
    const { data } = await supabase
      .from('opcoes_respostas')
      .insert({
        id_pergunta: idPergunta,
        resposta,
        ordem: opcoes.length,
      })
      .select()
      .single();
    if (data) {
      window.location.reload();
    }
  };

  return (
    <div className="mt-2">
      <h4 className="font-semibold mb-2">Opções:</h4>
      <ul>
        {opcoes.map((o) => (
          <li key={o.id} className="mb-1">{o.resposta}</li>
        ))}
      </ul>
      <input
        className="border px-2 py-1 w-full mt-2"
        value={resposta}
        onChange={(e) => setResposta(e.target.value)}
        placeholder="Nova opção"
      />
      <Button
        className="bg-blue-500 text-white px-3 py-1 mt-2"
        onClick={adicionarOpcao}
      >
        + Adicionar Opção
      </Button>
    </div>
  );
}
