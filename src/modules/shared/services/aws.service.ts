import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm';

export class AWSService {
  static getParameters = async (names: string[]): Promise<any> => {
    const input = {
      Names: names,
      WithDecryption: true,
    };
    const command = new GetParametersCommand(input);

    const ssmClient = new SSMClient();
    const response = await ssmClient.send(command);

    const { Parameters: parameters = [] } = response || {};

    return parameters.reduce((acc: any, cur: any) => {
      if (!cur.Name) return acc;

      if (!acc[cur.Name]) {
        acc[cur.Name] = cur.Value;
      }

      return acc;
    }, {});
  };
}
