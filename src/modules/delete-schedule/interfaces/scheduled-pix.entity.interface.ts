export interface IContaPix {
  Agencia: string;
  Numero: string;
  Tipo: string;
}

export interface IRecebedor {
  Chave: string;
  Conta: IContaPix;
  DocId: string;
  ISPB: string;
  Nome: string;
}

export interface IPagador {
  Conta: IContaPix;
  DocId: string;
  Nome: string;
  TipoPessoa: string;
}

export interface IPix {
  FormularioPagamento: string;
  InformacaoAdicional?: string;
  Pagador: IPagador;
  Recebedor: IRecebedor;
  SistemaOrigem: string;
  Valor: number;
}

export interface IScheduledPixEntity {
  Id: string;

  IdAccount: string;

  ScheduledDate: Date;

  Pix: IPix;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}
