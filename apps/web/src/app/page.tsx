'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FiEye,
  FiEdit2,
  FiTrash,
  FiPlus,
  FiClipboard,
  FiSend,
} from 'react-icons/fi';

type Formulario = {
  id: string;
  titulo: string;
  descricao: string;
};

export default function HomePage() {
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFormularios = async () => {
      const { data, error } = await supabase
        .from('formulario')
        .select()
        .order('ordem', { ascending: true });

      if (error) {
        console.error(error);
        setFormularios([]);
      } else {
        setFormularios(data || []);
      }

      setLoading(false);
    };

    fetchFormularios();
  }, []);

  const excluirFormulario = async (id: string, titulo: string) => {
    const confirmed = window.confirm(`Tem certeza que deseja excluir "${titulo}"?`);
    if (!confirmed) return;

    const { error } = await supabase.from('formulario').delete().eq('id', id);
    if (!error) {
      setFormularios((prev) => prev.filter((f) => f.id !== id));
    } else {
      alert('Erro ao excluir formulário.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <p className="p-6 italic">Carregando formulários...</p>
      </div>
    )
  }

  return (
    <main className="p-8 max-w-full mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-3xl font-bold flex items-center gap-2">
          Formulários Disponíveis
        </h1>
        <Button onClick={() => router.push('/form/create')}>
          <FiPlus className="mr-2" />
          Novo Formulário
        </Button>
      </div>

      {formularios.length === 0 ? (
        <p className="text-gray-500 italic">Nenhum formulário encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {formularios.map((form) => (
            <Card key={form.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{form.titulo}</CardTitle>
                <p className="text-sm text-muted-foreground">{form.descricao}</p>
              </CardHeader>
              <CardContent className="flex gap-2 flex-wrap mt-2 items-center justify-center">
                <Link href={`/form/${form.id}`}>
                  <Button variant="secondary" size="sm" className='hover:bg-gray-200'>
                    <FiEye className="mr-2" />
                    Visualizar
                  </Button>
                </Link>
                <Link href={`/form/${form.id}/answer`}>
                  <Button variant="default" size="sm">
                    <FiSend className="mr-2" />
                    Responder
                  </Button>
                </Link>
                <Link href={`/form/${form.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <FiEdit2 className="mr-2" />
                    Editar
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => excluirFormulario(form.id, form.titulo)}
                >
                  <FiTrash className="mr-2" />
                  Excluir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
