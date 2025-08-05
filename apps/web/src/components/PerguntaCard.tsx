export default function PerguntaCard({ pergunta }: { pergunta: any }) {
  const { titulo, tipo_pergunta, opcoes_respostas } = pergunta;

  return (
    <div className="border rounded p-4">
      <label className="block font-semibold mb-2">{titulo}</label>

      {tipo_pergunta === 'texto_livre' && (
        <input type="text" className="border px-2 py-1 w-full" disabled />
      )}

      {tipo_pergunta === 'inteiro' && (
        <input type="number" step="1" className="border px-2 py-1 w-full" disabled />
      )}

      {tipo_pergunta === 'float' && (
        <input type="number" step="any" className="border px-2 py-1 w-full" disabled />
      )}

      {tipo_pergunta === 'sim_nao' && (
        <div className="space-x-4">
          <label>
            <input type="radio" name={pergunta.id} disabled /> Sim
          </label>
          <label>
            <input type="radio" name={pergunta.id} disabled /> Não
          </label>
        </div>
      )}

      {tipo_pergunta === 'unica_escolha' && (
        <div className="space-y-2">
          {opcoes_respostas.map((op: any) => (
            <label key={op.id} className="block">
              <input type="radio" name={pergunta.id} className="mr-2" disabled />
              {op.resposta}
            </label>
          ))}
        </div>
      )}

      {tipo_pergunta === 'multipla_escolha' && (
        <div className="space-y-2">
          {opcoes_respostas.map((op: any) => (
            <label key={op.id} className="block">
              <input type="checkbox" className="mr-2" disabled />
              {op.resposta}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
