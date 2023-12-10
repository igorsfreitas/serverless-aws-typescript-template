import { EStatusCodeType } from '@modules/http/enums/status-code.enum';
import { inject, injectable } from 'tsyringe';
import { Delete, Get, Patch } from '@decorators/methods.decorator';
import { ERequestType } from '@decorators/enum/request-validation.enum';
import { IHttpRequest } from '@modules/http/interfaces/requests.interface';
import { Validation } from '@decorators/request-validation.decorator';
import { HttpStatusCode } from '@decorators/http-status-code.decorator';
import { DeleteScheduleService } from './delete-schedule.service';
import { IDeleteScheduleController } from '../interfaces/delete-schedule.controller.interface';
import { IDeleteScheduleService } from '../interfaces/delete-schedule.service.interface';
import { UpdateDeleteScheduleDto } from '../dtos/update-delete-schedule.dto';
import { DeleteSchedulePaymentDto } from '../dtos/delete-schedule-payments.dto';

@injectable()
export class DeleteScheduleController implements IDeleteScheduleController {
  constructor(
    @inject(DeleteScheduleService.name)
    private readonly deleteScheduleService: IDeleteScheduleService,
  ) {}

  @HttpStatusCode(EStatusCodeType.CREATED)
  @Get(':id')
  async findOne(request: IHttpRequest) {
    const { id } = request.pathParameters as { id: string };

    const response = await this.deleteScheduleService.findOne(id);

    return response;
  }

  @Validation(UpdateDeleteScheduleDto, ERequestType.BODY, { whitelist: true })
  @Patch(':id')
  async update(request: IHttpRequest) {
    const updateScheduleDto: UpdateDeleteScheduleDto = request.body;

    const response = await this.deleteScheduleService.update(updateScheduleDto);

    return response;
  }

  @Delete()
  async remove(request: IHttpRequest) {
    const deleteScheduledDto: DeleteSchedulePaymentDto = request.body;

    const response = await this.deleteScheduleService.remove(
      deleteScheduledDto,
    );

    return response;
  }

  @HttpStatusCode(EStatusCodeType.OK)
  @Get(':id')
  async teste(request: IHttpRequest) {
    const { id } = request.pathParameters as { id: string };

    const response = {
      message: 'teste',
      id,
    };

    return response;
  }
}
