export interface IMateraIbkService {
  getToken(): Promise<string>;
  postDeleteTed(id: string): Promise<string>;
}
