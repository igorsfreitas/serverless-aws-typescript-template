export interface IBoleto {
  typeableLine: string;
  dueDate: Date;
  historyCode: string;
}

export interface IWithdrawInfo {
  withdrawType: string;
  boleto: IBoleto;
}

export interface IPostBoleto {
  currency: string;
  externalIdentifier: string | null;
  totalAmount: number;
  transactionDate: Date;
  withdrawInfo: IWithdrawInfo;
}

export interface IBankPaymentSlip {
  // Propriedades específicas do primeiro cenário, definidas como opcionais
  totalAmount?: number;
  currency?: string;
  transactionDate?: Date;
  withdrawInfo?: IWithdrawInfo;
  externalIdentifier?: string;
  // Propriedade do segundo cenário
  postBoleto?: IPostBoleto;
}

export interface IScheduledPaymentEntity {
  Id: string;

  IdAccount: string;

  ScheduledDate: Date;

  BankPaymentSlip: IBankPaymentSlip;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}
