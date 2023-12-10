import { CreateCustomerDto } from '@modules/onidata/dtos/create-customer.dto';
import {
  EMaritalStatus,
  EOnidataDocumentType,
  EOnidataGenderType,
  EOnidataProfessionalType,
  EOnidataResidenceType,
} from '@modules/onidata/enum';

export const createCustomerDto: CreateCustomerDto = {
  canal: 'canalId',
  dadosPessoais: {
    cpf: '363.675.743-10',
    nome: 'André',
    email: '{{employeeCpEmail}}',
    sobrenome: 'Machado de Vargas',
    naturalidade: 'Brasileira',
    nacionalidade: 'Gravataí',
    nomeMae: 'Marli Teresinha Machado',
    dataNascimento: '21/03/1991',
    documento: {
      tipo: EOnidataDocumentType.CNH,
      numero: '{{clientRG}}',
      dataEmissao: '21/03/1991',
      emissor: '123',
      uf: '123',
    },
    sexo: EOnidataGenderType.MALE,
    telefone: '51993941176',
    estadoCivil: EMaritalStatus.SINGLE,
  },
  endereco: {
    residenciaTipo: EOnidataResidenceType.NOT_INFORMED,
    cep: '93046480',
    logradouro: 'Rua Paulo Uebel',
    complemento: 'complemento teste',
    numero: '652',
    bairro: 'Vila Nova',
    uf: 'RS',
    cidade: 'São Leopoldo',
  },
  dadosProfissionais: {
    profissao: 'desenvolvedor',
    renda: '1000',
    tipo: EOnidataProfessionalType.CLT,
    empresa: {
      cnpj: '05.096.486/0001-27',
      nomeFantasia: '123456789',
      razaoSocial: 'razao social',
    },
  },
  dadosBancarios: {
    banco: '341',
    agencia: '0295',
    conta: '358014',
  },
};
