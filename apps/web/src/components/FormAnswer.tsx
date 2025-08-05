'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaCheckCircle } from 'react-icons/fa';

export default function FormAnswer({
  perguntas,
  formularioId,
  condicionalidades,
  onSubmit,
}: {
  perguntas: any[];
  formularioId: string;
  condicionalidades: any[];
  onSubmit: () => void;
}) {
  const [respostas, setRespostas] = useState<Record<string, any>>({});
  const [perguntaAtual, setPerguntaAtual] = useState(0);

  const handleChange = (perguntaId: string, value: any) => {
    setRespostas((prev) => ({ ...prev, [perguntaId]: value }));
  };

  const isCondicaoAtendida = (perguntaId: string) => {
    const regras = condicionalidades.filter((c) => c.id_pergunta_exibida === perguntaId);
    if (regras.length === 0) return true;
    return regras.some((regra) => respostas[regra.id_pergunta_condicional] === regra.id_opcao_ativa);
  };

  const avancarParaProxima = () => {
    let proxima = perguntaAtual + 1;
    while (proxima < perguntas.length) {
      const idProxima = perguntas[proxima].id;
      if (isCondicaoAtendida(idProxima)) {
        setPerguntaAtual(proxima);
        return;
      }
      proxima++;
    }
    setPerguntaAtual(perguntas.length); // Finaliza
  };

  const salvarRespostas = async () => {
    const { data: respostaUsuario, error } = await supabase
      .from('resposta_usuario')
      .insert({ id_formulario: formularioId })
      .select()
      .single();

    if (error) return alert('Erro ao salvar respostas');

    const respostasArray = perguntas.map((p) => {
      const valor = respostas[p.id];
      if (!isCondicaoAtendida(p.id)) return null;

      if (p.tipo_pergunta === 'texto_livre' || p.tipo_pergunta === 'sim_nao') {
        return {
          id_resposta_usuario: respostaUsuario.id,
          id_pergunta: p.id,
          resposta_texto: valor,
        };
      }
      if (p.tipo_pergunta === 'inteiro' || p.tipo_pergunta === 'float') {
        return {
          id_resposta_usuario: respostaUsuario.id,
          id_pergunta: p.id,
          resposta_numero: Number(valor),
        };
      }
      if (p.tipo_pergunta === 'unica_escolha') {
        return {
          id_resposta_usuario: respostaUsuario.id,
          id_pergunta: p.id,
          id_opcao_escolhida: valor,
        };
      }
      if (p.tipo_pergunta === 'multipla_escolha') {
        return valor.map((id_opcao: string) => ({
          id_resposta_usuario: respostaUsuario.id,
          id_pergunta: p.id,
          id_opcao_escolhida: id_opcao,
        }));
      }
    });

    const flatRespostas = respostasArray.flat().filter(Boolean);
    const { error: erroInsert } = await supabase.from('resposta_pergunta').insert(flatRespostas);

    if (erroInsert) return alert('Erro ao registrar perguntas');

    alert('Respostas enviadas!');
    onSubmit();
  };

  if (perguntaAtual >= perguntas.length) {
    return (
      <Card className="text-center mt-8 max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-green-600 text-lg">
            <FaCheckCircle /> Você respondeu todas as perguntas.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={salvarRespostas} className="w-full">
            Enviar Respostas
          </Button>
        </CardContent>
      </Card>
    );
  }

  const p = perguntas[perguntaAtual];

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <Card className="p-6">
        <CardHeader>
          <CardTitle>{p.titulo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {p.tipo_pergunta === 'texto_livre' && (
            <Input
              placeholder="Digite sua resposta"
              onChange={(e) => handleChange(p.id, e.target.value)}
            />
          )}

          {p.tipo_pergunta === 'inteiro' && (
            <Input
              type="number"
              step="1"
              onChange={(e) => handleChange(p.id, e.target.value)}
            />
          )}

          {p.tipo_pergunta === 'float' && (
            <Input
              type="number"
              step="any"
              onChange={(e) => handleChange(p.id, e.target.value)}
            />
          )}

          {p.tipo_pergunta === 'sim_nao' && (
            <RadioGroup onValueChange={(val) => handleChange(p.id, val)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Sim" id={`sim-${p.id}`} />
                <label htmlFor={`sim-${p.id}`}>Sim</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Não" id={`nao-${p.id}`} />
                <label htmlFor={`nao-${p.id}`}>Não</label>
              </div>
            </RadioGroup>
          )}

          {p.tipo_pergunta === 'unica_escolha' && (
            <RadioGroup onValueChange={(val) => handleChange(p.id, val)}>
              {p.opcoes_respostas.map((op: any) => (
                <div key={op.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={op.id} id={`op-${op.id}`} />
                  <label htmlFor={`op-${op.id}`}>{op.resposta}</label>
                </div>
              ))}
            </RadioGroup>
          )}

          {p.tipo_pergunta === 'multipla_escolha' && (
            <div className="space-y-2">
              {p.opcoes_respostas.map((op: any) => (
                <div key={op.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`chk-${op.id}`}
                    onCheckedChange={(checked) => {
                      setRespostas((prev) => {
                        const atual = prev[p.id] || [];
                        return {
                          ...prev,
                          [p.id]: checked
                            ? [...atual, op.id]
                            : atual.filter((id: string) => id !== op.id),
                        };
                      });
                    }}
                  />
                  <label htmlFor={`chk-${op.id}`}>{op.resposta}</label>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Link href="/" className="text-sm text-gray-600 hover:underline">
              Voltar
            </Link>
            <Button type="button" onClick={avancarParaProxima}>
              Responder
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
