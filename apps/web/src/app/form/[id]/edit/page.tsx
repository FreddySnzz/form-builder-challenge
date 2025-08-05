'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FiEdit, FiSave } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PerguntaEditor from '@/components/PerguntaEditor';
import CondicionalidadeEditor from '@/components/CondicionalidadeEditor';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import HomeButton from '@/components/template/HomeButton';

type Formulario = {
  id: string;
  titulo: string;
  descricao: string;
};

export default function EditFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formulario, setFormulario] = useState<Formulario | null>(null);
  const [perguntas, setPerguntas] = useState<any[]>([]);

  useEffect(() => {
    const fetchFormulario = async () => {
      const { data } = await supabase
        .from('formulario')
        .select()
        .eq('id', id)
        .single();
      if (data) setFormulario(data);
    };
    fetchFormulario();
  }, [id]);

  const salvarFormulario = async () => {
    alert('Formulário salvo com sucesso!');
    router.push('/');
  };

  if (!formulario) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <FiEdit />
            Editar
          </CardTitle>
          <CardTitle className='text-muted-foreground font-light italic'>
            {formulario.titulo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PerguntaEditor
            idFormulario={formulario.id}
            onPerguntasChange={(p: any) => setPerguntas(p)}
          />

          {perguntas.length > 0 && (
            <>
              <Separator />
              <CondicionalidadeEditor
                perguntas={perguntas}
                formularioId={formulario.id}
              />
            </>
          )}

          <div className="pt-4 flex justify-end gap-6">
            <HomeButton className="bg-gray-200 hover:bg-gray-300 text-gray-900">
              Sair sem Salvar
            </HomeButton>
            <Button
              onClick={salvarFormulario}
              className="bg-blue-700 hover:bg-blue-800 text-white flex items-center gap-2"
            >
              <FiSave />
              Salvar e Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
