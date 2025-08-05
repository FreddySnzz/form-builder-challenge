export type TipoPergunta =
  | "sim_nao"
  | "multipla_escolha"
  | "unica_escolha"
  | "texto_livre"
  | "inteiro"
  | "float";

export interface Formulario {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
}

export interface Pergunta {
  id: string;
  id_formulario: string;
  titulo: string;
  codigo: string;
  orientacao_resposta?: string;
  ordem: number;
  obrigatoria: boolean;
  sub_pergunta: boolean;
  tipo_pergunta: TipoPergunta;
  condicional?: {
    pergunta_id: string;
    valor_condicional: string;
  };
}

export interface OpcaoResposta {
  id: string;
  id_pergunta: string;
  resposta: string;
  ordem: number;
  resposta_aberta: boolean;
}