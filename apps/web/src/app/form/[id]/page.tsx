'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FiArrowLeft, FiClock, FiFileText } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PreviewFormPage() {
  const { id } = useParams();
  const [formulario, setFormulario] = useState<any>(null);
  const [perguntas, setPerguntas] = useState<any[]>([]);
  const [respostas, setRespostas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);

      const { data: form } = await supabase
        .from('formulario')
        .select()
        .eq('id', id)
        .single();
      setFormulario(form);

      const { data: perguntasData } = await supabase
        .from('pergunta')
        .select('*, opcoes_respostas(*)')
        .eq('id_formulario', id)
        .order('ordem', { ascending: true });

      setPerguntas(perguntasData || []);

      const { data: respostaUsuarios } = await supabase
        .from('resposta_usuario')
        .select('id, created_at, resposta_pergunta(*)')
        .eq('id_formulario', id)
        .order('created_at', { ascending: true });

      setRespostas(respostaUsuarios || []);
      setLoading(false);
    };

    fetchDados();
  }, [id]);

  if (loading || !formulario) 
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <p className="p-6 italic">Carregando...</p>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <FiFileText />
          {formulario.titulo}
        </h1>
        <p className="text-sm text-muted-foreground">{formulario.descricao}</p>
      </div>

      <Separator />

      {respostas.length === 0 ? (
        <p className="text-gray-500 italic">Nenhuma resposta enviada ainda.</p>
      ) : (
        <div className="space-y-6">
          {respostas.map((resposta, idx) => (
            <Card key={resposta.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  Resposta #{idx + 1}
                  <Badge variant="outline" className="ml-auto text-sm bg-gray-200">
                    {new Date(resposta.created_at).toLocaleString('pt-BR')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {perguntas.map((pergunta) => {
                    const respostaPergunta = resposta.resposta_pergunta.find(
                      (r: any) => r.id_pergunta === pergunta.id
                    );

                    if (!respostaPergunta) return null;

                    let valorExibido = '';
                    if (respostaPergunta.resposta_texto) {
                      valorExibido = respostaPergunta.resposta_texto;
                    } else if (respostaPergunta.resposta_numero !== null) {
                      valorExibido = respostaPergunta.resposta_numero;
                    } else if (respostaPergunta.id_opcao_escolhida) {
                      const opcao = pergunta.opcoes_respostas.find(
                        (op: any) => op.id === respostaPergunta.id_opcao_escolhida
                      );
                      valorExibido = opcao ? opcao.resposta : '[opção removida]';
                    }

                    return (
                      <li key={pergunta.id}>
                        <strong>{pergunta.titulo}</strong>{' '}
                        <span className="text-gray-800">{valorExibido}</span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Link href="/">
          <Button variant="secondary" className="flex items-center gap-2 hover:bg-gray-300">
            <FiArrowLeft />
            Voltar para início
          </Button>
        </Link>
      </div>
    </div>
  );
}
