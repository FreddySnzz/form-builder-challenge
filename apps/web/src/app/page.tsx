'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

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

  if (loading) return <p className="p-6">Carregando formulários...</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📋 Formulários Disponíveis</h1>
        <Button
          onClick={() => router.push(`/form/create`)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Novo Formulário
        </Button>
      </div>

      {formularios.length === 0 ? (
        <p className="text-gray-600">Nenhum formulário encontrado.</p>
      ) : (
        <ul className="space-y-6">
          {formularios.map((form) => (
            <li
              key={form.id}
              className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl font-semibold">{form.titulo}</h2>
                <p className="text-gray-600">{form.descricao}</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Link
                  href={`/form/${form.id}`}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm"
                >
                  👁️ Visualizar
                </Link>
                <Link
                  href={`/form/${form.id}/answer`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  📝 Responder
                </Link>
                <Link
                  href={`/form/${form.id}/edit`}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm"
                >
                  ✏️ Editar
                </Link>
                <Button
                  onClick={async () => {
                    const confirm = window.confirm(`Tem certeza que deseja excluir "${form.titulo}"?`);
                    if (!confirm) return;

                    const { error } = await supabase.from('formulario').delete().eq('id', form.id);
                    if (!error) {
                      setFormularios((prev) => prev.filter((f) => f.id !== form.id));
                    } else {
                      alert('Erro ao excluir formulário.');
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                >
                  🗑️ Excluir
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
