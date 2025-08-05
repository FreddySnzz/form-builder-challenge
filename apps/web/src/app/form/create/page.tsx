'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';

export default function Home() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  const criarFormulario = async () => {
    const { data, error } = await supabase
      .from('formulario')
      .insert({ titulo, descricao })
      .select()
      .single();
    if (error) return alert(error.message);
    window.location.href = `/form/${data.id}/edit`;
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Criar Formulário</h1>
      <Input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título"
        className="border p-2 mb-2 w-full"
      />
      <Input
        type="text"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descrição"
        className="border p-2 w-full"
      />
      <Button onClick={criarFormulario} className="bg-blue-600 text-white px-4 py-2 mt-4">
        Criar
      </Button>
    </main>
  );
}
