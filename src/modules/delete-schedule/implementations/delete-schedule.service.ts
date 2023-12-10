import { inject, injectable } from 'tsyringe';
import { IDeleteScheduleService } from '../interfaces/delete-schedule.service.interface';
import { ScheduledPaymentEntity } from '../entities/scheduled-payment.entity';
import { IScheduledPaymentEntity } from '../interfaces/scheduled-payment.entity.interface';
import { IAccountEntity } from '../interfaces/account.entity.interface';
import { IPostgreSQLRepository } from '@modules/shared/repositories/interfaces/postgre.repository.interface';
import { DeleteSchedulePaymentDto } from '../dtos/delete-schedule-payments.dto';
import { UpdateDeleteScheduleDto } from '../dtos/update-delete-schedule.dto';
import { AccountEntity } from '../entities/account.entity';
import { IScheduledPixEntity } from '../interfaces/scheduled-pix.entity.interface';
import { ScheduledPixEntity } from '../entities/scheduled-pix.entity';
import { NotFoundError } from '@modules/errors/not-found.error.service';
import { ConflictError } from '@modules/errors/conflict-request-error.service';
import { ILoggerService } from '@modules/logger/interfaces/logger.service.interface';
import { LoggerService } from '@modules/logger/implementations/logger.service';
import { MateraIbkService } from '@modules/shared/matera/implementations/materaIbk.service';
import { IMateraIbkService } from '@modules/shared/matera/interfaces/materaIbk.interface';
import { BadRequestError } from '@modules/errors/bad-request-error.service';

@injectable()
export class DeleteScheduleService implements IDeleteScheduleService {
  constructor(
    @inject(AccountEntity.name)
    private readonly accountRepository: IPostgreSQLRepository<IAccountEntity>,
    @inject(ScheduledPaymentEntity.name)
    private readonly scheduledRepository: IPostgreSQLRepository<IScheduledPaymentEntity>,
    @inject(ScheduledPixEntity.name)
    private readonly scheduledPixRepository: IPostgreSQLRepository<IScheduledPixEntity>,
    @inject(LoggerService.name)
    public readonly loggerService: ILoggerService,
    @inject(MateraIbkService.name)
    private readonly materaIbk: IMateraIbkService,
  ) {}

  async findOne(id: string): Promise<IScheduledPaymentEntity | null> {
    const scheduled = await this.scheduledRepository
      .find({
        where: {
          Id: id,
        },
      })
      .getOne();

    return scheduled;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(request: UpdateDeleteScheduleDto): Promise<void> {
    await this.scheduledRepository.create(request);
  }

  async remove(request: DeleteSchedulePaymentDto): Promise<boolean> {
    const account = await this.accountRepository
      .find({
        where: {
          Branch: request.conta.agencia,
          Number: request.conta.conta,
        },
      })
      .getOne();

    if (!account) {
      throw new NotFoundError('Conta não encontrada');
    }

    this.loggerService.info('retorno consulta account: ', account);

    if (request.tipo === 'BOLETO') {
      const scheduled = await this.scheduledRepository
        .find({
          where: {
            IdAccount: account.Id,
            ScheduledDate: request.data,
          },
        })
        .getOne();

      this.loggerService.info(
        'retorno consulta scheduled payment: ',
        scheduled,
      );

      if (!scheduled) {
        throw new NotFoundError('Boleto agendado não encontrado');
      }

      let typeableLine: string | undefined;

      if (scheduled.BankPaymentSlip.postBoleto) {
        typeableLine =
          scheduled.BankPaymentSlip.postBoleto.withdrawInfo.boleto.typeableLine;
      } else {
        typeableLine =
          scheduled.BankPaymentSlip.withdrawInfo?.boleto.typeableLine;
      }

      if (typeableLine !== request.documento) {
        throw new ConflictError(
          'Linha digitável não corresponde ao boleto agendado',
        );
      }

      try {
        await this.scheduledRepository.delete({ Id: scheduled.Id });
      } catch (error) {
        throw new BadRequestError('Erro desconhecido', error);
      }
    } else if (request.tipo === 'PIX') {
      const scheduledPixList = await this.scheduledPixRepository
        .find({
          where: {
            IdAccount: account.Id,
            ScheduledDate: request.data,
          },
        })
        .getAll();

      this.loggerService.info(
        'retorno consulta scheduled pix: ',
        scheduledPixList,
      );
      if (!scheduledPixList || scheduledPixList.length === 0) {
        throw new NotFoundError('Pix agendado não encontrado');
      }

      const matchingScheduledPix = scheduledPixList.find((scheduledPix) => {
        return scheduledPix.Pix.Valor === request.valor;
      });

      if (!matchingScheduledPix) {
        throw new ConflictError(
          'Valor do pix não corresponde ao do pix agendado',
        );
      }

      try {
        await this.scheduledPixRepository.delete({
          Id: matchingScheduledPix.Id,
        });
      } catch (error) {
        throw new BadRequestError('Erro desconhecido', error);
      }
    } else if (request.tipo === 'TED') {
      try {
        await this.materaIbk.postDeleteTed(request.idTed);
        return true;
      } catch (error) {
        throw new BadRequestError('Erro desconhecido', error);
      }
    } else {
      throw new BadRequestError('Tipo de pagamento inválido');
    }

    return true; // Indica que a remoção foi bem-sucedida
  }
}
