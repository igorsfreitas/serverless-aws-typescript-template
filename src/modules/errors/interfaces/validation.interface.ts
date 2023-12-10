export interface IErrorDetail {
  message: string;
  key: string | null;
  path: (string | number)[];
}

export interface IError {
  original: unknown;
  details: IErrorDetail[];
}
