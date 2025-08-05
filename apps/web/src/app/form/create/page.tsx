'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import HomeButton from '@/components/template/HomeButton';

export default function CreateFormPage() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  const criarFormulario = async () => {
    const { data, error } = await supabase
      .from('formulario')
      .insert({ titulo, descricao })
      .select()
      .single();

    if (error) return alert(error.message);

    window.location.href = `/`;
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            Criar Novo Formulário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título do formulário"
          />
          <Textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição do formulário"
          />
          <Button
            onClick={criarFormulario}
            className="w-full bg-gray-600 hover:bg-gray-700"
            disabled={!titulo.trim()}
          >
            Criar Formulário
          </Button>
          <HomeButton className='w-full'>Voltar para Página Inicial</HomeButton>
        </CardContent>
      </Card>
    </main>
  );
}
