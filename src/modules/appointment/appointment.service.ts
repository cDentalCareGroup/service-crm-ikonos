import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { format, formatISO } from 'date-fns';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { async } from 'rxjs';
import { HandleException, NotFoundCustomException, NotFoundType, ValidationException, ValidationExceptionType } from 'src/common/exceptions/general.exception';
import { capitalizeAllCharacters, formatDateToWhatsapp, getDayName, getDiff, getRandomInt, getTodayDate, getTodayDateAndConvertToDate, getTodaySimpleDate, STATUS_ACTIVE, STATUS_CANCELLED, STATUS_FINISHED, STATUS_FINISHED_APPOINTMENT_OR_CALL, STATUS_NOT_ATTENDED, STATUS_PROCESS, STATUS_SOLVED } from 'src/utils/general.functions.utils';
import { IsNull, Not, Repository } from 'typeorm';
import { UserEntity } from '../auth/models/entities/user.entity';
import { branchOfficeScheduleToEntity } from '../branch_office/extensions/branch.office.extensions';
import { BranchOfficeEmployeeSchedule } from '../branch_office/models/branch.office.employee.entity';
import { BranchOfficeEntity } from '../branch_office/models/branch.office.entity';
import { BranchOfficeScheduleEntity } from '../branch_office/models/branch.office.schedule.entity';
import { CallCatalogEntity } from '../calls/models/call.catalog.entity';
import { CallEntity, CallResult } from '../calls/models/call.entity';
import { CallLogEntity } from '../calls/models/call.log.entity';
import { AppointmentTemplateMail, EmailService } from '../email/email.service';
import { EmployeeEntity } from '../employee/models/employee.entity';
import { EmployeeTypeEntity } from '../employee/models/employee.type.entity';
import { MessageService } from '../messages/message.service';
import { PadComponentUsedEntity } from '../pad/models/pad.component.used.entity';
import { PatientEntity } from '../patient/models/patient.entity';
import { PatientOriginEntity } from '../patient/models/patient.origin.entity';
import { MovementsTypeEntity } from '../payment/models/movements.type.entity';
import { PaymentEntity } from '../payment/models/payment.entity';
import { PaymentDetailEntity } from '../payment/payment.detail.entity';
import { AppointmentDetailEntity } from './models/appointment.detail.entity';
import { AppointmentAvailabilityDTO, AppointmentAvailbilityByDentistDTO, AppointmentDetailDTO, AvailableHoursDTO, CancelAppointmentDTO, GetAppointmentDetailDTO, GetAppointmentsByBranchOfficeDTO, GetAppointmentsByBranchOfficeStatusDTO, GetNextAppointmentDetailDTO, RegiserAppointmentPatientDTO, RegisterAppointmentDentistDTO, RegisterAppointmentDTO, RegisterCallCenterAppointmentDTO, RegisterExtendAppointmentDTO, RegisterNextAppointmentDTO, RescheduleAppointmentDTO, SendNotificationDTO, SendWhatsappConfirmationDTO, SendWhatsappSimpleTextDTO, ServiceDetail, UpdateAppointmentStatusDTO, UpdateHasCabinetAppointmentDTO, UpdateHasLabsAppointmentDTO } from './models/appointment.dto';
import { AppointmentEntity } from './models/appointment.entity';
import { AppointmentServiceEntity } from './models/appointment.service.entity';
import { AppointmentTimesEntity } from './models/appointment.times.entity';
import { PaymentMethodEntity } from './models/payment.method.entity';
import { ProspectEntity } from './models/prospect.entity';
import { ServiceEntity } from './models/service.entity';

@Injectable()
export class AppointmentService {

  constructor(
    @InjectRepository(AppointmentEntity) private appointmentRepository: Repository<AppointmentEntity>,
    @InjectRepository(BranchOfficeEntity) private branchOfficeRepository: Repository<BranchOfficeEntity>,
    @InjectRepository(BranchOfficeScheduleEntity) private branchOfficeScheduleRepository: Repository<BranchOfficeScheduleEntity>,
    @InjectRepository(PatientEntity) private patientRepository: Repository<PatientEntity>,
    @InjectRepository(ProspectEntity) private prospectRepository: Repository<ProspectEntity>,
    @InjectRepository(EmployeeEntity) private employeeRepository: Repository<EmployeeEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(BranchOfficeEmployeeSchedule) private branchOfficeEmployeeScheduleRepository: Repository<BranchOfficeEmployeeSchedule>,
    @InjectRepository(EmployeeTypeEntity) private employeeTypeRepository: Repository<EmployeeTypeEntity>,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    @InjectRepository(ServiceEntity) private serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(PaymentMethodEntity) private paymentMethodRepository: Repository<PaymentMethodEntity>,
    @InjectRepository(PaymentDetailEntity) private paymentDetailRepository: Repository<PaymentDetailEntity>,
    @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(CallEntity) private callRepository: Repository<CallEntity>,
    @InjectRepository(CallCatalogEntity) private callCatalogRepository: Repository<CallCatalogEntity>,
    @InjectRepository(AppointmentServiceEntity) private appointmentServiceRepository: Repository<AppointmentServiceEntity>,
    @InjectRepository(AppointmentTimesEntity) private appointmentTimesRepository: Repository<AppointmentTimesEntity>,
    @InjectRepository(AppointmentDetailEntity) private appointmentDetailRepository: Repository<AppointmentDetailEntity>,
    @InjectRepository(PadComponentUsedEntity) private padComponentUsedRepository: Repository<PadComponentUsedEntity>,
    @InjectRepository(PatientOriginEntity) private patientOriginRepository: Repository<PatientOriginEntity>,
    @InjectRepository(MovementsTypeEntity) private movementRepository: Repository<MovementsTypeEntity>,
    private readonly messageService: MessageService,
    @InjectRepository(CallLogEntity) private callLogRepository: Repository<CallLogEntity>,
  ) { }

  getAppointmentsAvailability = async ({ branchOfficeName, dayName, date, filterHours }: AppointmentAvailabilityDTO): Promise<AvailableHoursDTO[]> => {
    try {
      const branchOffice = await this.branchOfficeRepository.findOneBy({ name: branchOfficeName });
      const schedule = await this.branchOfficeScheduleRepository.find({ where: { branchId: branchOffice.id, status: STATUS_ACTIVE, dayName: dayName } });

      let availableHours: AvailableHoursDTO[] = [];
      let data: AvailableHoursDTO[] = [];
      const today = new Date();
      let currentDay = today.getDate();

      for await (const dayTime of schedule) {

        const startTime = dayTime.startTime.toString();
        const startTimeArray = startTime.split(":");
        const startHour = Number(startTimeArray[0]);
        const startMinutes = Number(startTimeArray[1]);
        const startSeconds = Number(startTimeArray[2]);
        const startDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), currentDay, startHour, startMinutes, startSeconds))

        const endTime = dayTime.endTime.toString();
        const endTimeArray = endTime.split(":");
        const endHour = Number(endTimeArray[0]);
        const endMinutes = Number(endTimeArray[1]);
        const endSeconds = Number(endTimeArray[2]);
        const endDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), currentDay, endHour, endMinutes, endSeconds))

        const dif = getDiff(startDate, endDate) + 1;


        for (let index = 0; index < Number(dif.toFixed()); index++) {
          let hourToAdd = (startHour + index);
          let hourResult = hourToAdd < 10 ? `0${hourToAdd}` : hourToAdd;
          let amOrPm = hourToAdd < 12 ? 'AM' : 'PM';
          if (hourToAdd <= endHour && endMinutes < 59) {
            if (startMinutes == 0) {
              availableHours.push(
                new AvailableHoursDTO(
                  dayTime.id,
                  `${hourResult}:00 ${amOrPm}`,
                  `${hourResult}:00:00`,
                  dayTime.seat,
                  dayTime.id
                ));
              availableHours.push(
                new AvailableHoursDTO(
                  dayTime.id,
                  `${hourResult}:30 ${amOrPm}`,
                  `${hourResult}:30:00`,
                  dayTime.seat,
                  dayTime.id
                ));
            } else {
              availableHours.push(
                new AvailableHoursDTO(
                  dayTime.id,
                  `${hourResult}:${startMinutes}0 ${amOrPm}`,
                  `${hourResult}:${startMinutes}0:00`,
                  dayTime.seat,
                  dayTime.id
                ));
            }
          }
        }

      }
      //console.log(`Filtering ${filterHours}`)
      const dateSended = date.split("T")[0];
      if (filterHours == true) {
        for await (const hour of availableHours) {
          const appointments = await this.appointmentRepository.findBy({
            branchId: branchOffice.id,
            appointment: dateSended,
            time: hour.simpleTime,
            status: STATUS_ACTIVE
          });
          const appointmentsProccess = await this.appointmentRepository.findBy({
            branchId: branchOffice.id,
            appointment: dateSended,
            time: hour.simpleTime,
            status: STATUS_PROCESS
          });
          const extendedAppointments = await this.appointmentTimesRepository.findBy({
            appointment: dateSended,
            time: hour.simpleTime,
            status: STATUS_ACTIVE,
            branchOfficeId: branchOffice.id
          });
          //  console.log(`D ${dateSended} H ${hour.simpleTime}, sta ${STATUS_ACTIVE} BU ${branchOffice.id} ${extendedAppointments.length}`)
          const allAppointments = appointments.length + extendedAppointments.length + appointmentsProccess.length;
          // console.log(`${allAppointments} + ${ hour.seat} `)
          if (allAppointments < hour.seat) {
            data.push(hour);
          }
        }
      } else {
        data = availableHours;
      }
      return data;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }

  registerAppointment = async ({ date, branchName, time, phone, email, name, referal }: RegisterAppointmentDTO): Promise<string> => {
    try {
      if (name == null || name == undefined || name == '' ||
        phone == null || phone == undefined || phone == '') throw new ValidationException(ValidationExceptionType.MISSING_VALUES);

      const branchOffice = await this.branchOfficeRepository.findOneBy({ name: branchName });
      const newProspect = new ProspectEntity();
      newProspect.name = capitalizeAllCharacters(name);
      newProspect.email = email;
      newProspect.primaryContact = phone;
      const prospect = await this.prospectRepository.save(newProspect);

      const entity = new AppointmentEntity();
      entity.appointment = date.toString().split("T")[0]
      entity.branchId = branchOffice.id;
      entity.branchName = branchOffice.name;
      entity.scheduleBranchOfficeId = time.scheduleBranchOfficeId;
      entity.time = time.simpleTime;
      entity.scheduledAt = getTodayDate()
      const folio = randomUUID().replace(/-/g, getRandomInt()).substring(0, 20).toUpperCase()
      entity.folio = folio;
      entity.prospectId = prospect.id;
      entity.comments = `Cita registrada ${date.toString().split("T")[0]} ${time.simpleTime}`;
      entity.hasCabinet = 0;
      entity.hasLabs = 0;
      entity.status = STATUS_ACTIVE;

      if (referal != null && referal != undefined && referal != '') {
        entity.referralCode = referal;
      }

      const response = await this.appointmentRepository.save(entity);
      await this.messageService.sendWhatsAppConfirmation(
        new SendWhatsappConfirmationDTO(
          phone, branchName, `${formatDateToWhatsapp(response.appointment)} - ${time.time}`
        )
      );

      return response.folio;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }


  getAppointmentDetail = async (body: AppointmentDetailDTO): Promise<any> => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ folio: body.folio });
      if (appointment == null) throw new NotFoundCustomException(NotFoundType.APPOINTMENT_NOT_FOUND);
      const updatedAppointment = await this.getAppointment(appointment);

      const appointmentDetail = await this.appointmentDetailRepository.findBy({ appointmentId: appointment.id });

      const serviceDetail = [];
      for await (const detial of appointmentDetail) {
        const service = await this.serviceRepository.findOneBy({ id: detial.serviceId });
        serviceDetail.push(new ServiceDetail(service, detial));
      }
      return new GetNextAppointmentDetailDTO(updatedAppointment, serviceDetail);
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }



  getNextAppointments = async (patientId: number): Promise<GetAppointmentDetailDTO[]> => {
    try {
      const appointments = await this.appointmentRepository.findBy({ status: STATUS_ACTIVE, patientId: patientId });
      let nextAppointments: GetAppointmentDetailDTO[] = [];

      for await (const item of appointments) {
        const result = await this.getAppointment(item);
        nextAppointments.push(result);
      }
      return nextAppointments;
    } catch (error) {
      console.log('Error getting next appointment');
      return [];
    }
  }
  getAppointmentDetailPatient = async (body: AppointmentDetailDTO): Promise<GetAppointmentDetailDTO> => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ folio: body.folio, status: STATUS_ACTIVE });
      if (appointment == null) throw new NotFoundCustomException(NotFoundType.APPOINTMENT_NOT_FOUND);
      return this.getAppointment(appointment);
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }


  getAllAppointmentByBranchOffice = async (body: GetAppointmentsByBranchOfficeDTO): Promise<GetAppointmentDetailDTO[]> => {
    try {
    
      const data: GetAppointmentDetailDTO[] = [];
      if (body.status != null && body.status != '' && body.date != null && body.date != '') {
        if (body.status == STATUS_FINISHED_APPOINTMENT_OR_CALL) {
          const appointments = await this.appointmentRepository.findBy({ branchId: Number(body.id), status: STATUS_FINISHED });
          const activeCalls = await this.callRepository.findBy({ status: STATUS_ACTIVE, appointmentId: Not(IsNull()) });

          for await (const item of activeCalls) {
            const appointment = await this.appointmentRepository.findOneBy({ id: item.appointmentId, branchId: Number(body.id) });
            if (appointment != null) {
              const newAppointment = appointment;
              newAppointment.call = item;
              const result = await this.getAppointment(newAppointment);
              data.push(result);
            }
          }

          for await (const appointment of appointments) {
            const existsNext = appointments.find((value, _) => value.id == appointment.nextAppointmentId);
            if (existsNext == null || existsNext == undefined) {
              const result = await this.getAppointment(appointment);
              data.push(result);
            }
          }
        } else if (body.status == STATUS_FINISHED) {
          const appointments = await this.appointmentRepository.findBy({ branchId: Number(body.id), status: STATUS_FINISHED, nextAppointmentId: IsNull() });
          for await (const appointment of appointments) {
            const calls = await this.callRepository.findBy({ patientId: appointment.patientId, status: STATUS_ACTIVE });
            if (calls.length == 0) {
              const result = await this.getAppointment(appointment);
              data.push(result);
            }
          }
        } else if (body.status == STATUS_NOT_ATTENDED) {
          const appointments = await this.appointmentRepository.findBy({ branchId: Number(body.id), status: STATUS_NOT_ATTENDED });
          for await (const appointment of appointments) {
            const result = await this.getAppointment(appointment);
            data.push(result);
          }
        } else {
          const appointments = await this.appointmentRepository.findBy({ branchId: Number(body.id), status: body.status, appointment: body.date });
          for await (const appointment of appointments) {
            const result = await this.getAppointment(appointment);
            data.push(result);
          }
        }
      } else if (body.status != null && body.status != '') {
        const appointments = await this.appointmentRepository.findBy({ branchId: Number(body.id), status: body.status });
        for await (const appointment of appointments) {
          const result = await this.getAppointment(appointment);
          data.push(result);
        }
      } else {
        const appointments = await this.appointmentRepository.findBy({ branchId: Number(body.id) });
        for await (const appointment of appointments) {
          const result = await this.getAppointment(appointment);
          data.push(result);
        }
      }
      return data;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }

  getAllAppointmentByBranchOfficeStatus = async (body: GetAppointmentsByBranchOfficeStatusDTO): Promise<GetAppointmentDetailDTO[]> => {
    try {
      const data: GetAppointmentDetailDTO[] = [];
      const appointments = await this.appointmentRepository.findBy({ branchId: Number(body.id), });
      for await (const appointment of appointments) {
        const result = await this.getAppointment(appointment);
        data.push(result);
      }
      return data;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }




  registerAppointmentDentist = async ({ id, appointmentId, username, patientId }: RegisterAppointmentDentistDTO) => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ id: Number(appointmentId) });
      const receptionist = await this.userRepository.findOneBy({ username: username });
      appointment.dentistId = Number(id);
      appointment.receptionistId = receptionist.id;
      appointment.comments = `${appointment.comments} \n Dentista asignado ${id} \n Recepcionista ${receptionist.name}`;
      appointment.patientId = Number(patientId);
      appointment.startedVisitAt = getTodayDate();
      const updatedAppointment = await this.appointmentRepository.save(appointment);
      return this.getAppointment(updatedAppointment);
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }

  updateAppointmentStatus = async (body: UpdateAppointmentStatusDTO) => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ id: Number(body.id) });
      if (body.status == STATUS_PROCESS) {
        appointment.startedAt = formatISO(new Date())
        appointment.status = STATUS_PROCESS;
        appointment.comments = `${appointment.comments} \n Estatus: ${STATUS_PROCESS} ${getTodayDate()}`;
      }
      if (body.status == STATUS_FINISHED) {
        appointment.finishedAt = formatISO(new Date());
        appointment.status = STATUS_FINISHED;
        appointment.comments = `${appointment.comments} \n Estatus: ${STATUS_FINISHED} ${getTodayDate()}`;
        appointment.priceAmount = Number(body.amount);

        const extendedTimes = await this.appointmentTimesRepository.findBy({
          appointmentId: appointment.id,
          appointment: appointment.appointment,
          status: STATUS_ACTIVE
        });

        for await (const time of extendedTimes) {
          const item = time;
          item.status = STATUS_FINISHED;
          await this.appointmentTimesRepository.save(item);
        }

        //(body);
        await this.addAppointmentServices(body, appointment);
        await this.addAppointmentPayment(body, appointment);

        //console.log(body.shouldAddAmount && Number(body.paid) >= Number(body.amount) && (Number(body.paid) - Number(body.amount)) > 0)

        //   console.log(`Should add ${body.shouldAddAmount}, Amount ${body.amount}, Paid ${body.paid}`);
        if (body.shouldAddAmount && Number(body.paid) >= Number(body.amount) && (Number(body.paid) - Number(body.amount)) > 0) {
          await this.processAppointmentDeposits(body, appointment);
        }
      }
      await this.processAppointmentDebts(body, appointment);
      await this.processAppointmentUpdateDeposits(body, appointment);

      const updatedAppointment = await this.appointmentRepository.save(appointment);
      return this.getAppointment(updatedAppointment);
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }

  private addAppointmentServices = async (body: UpdateAppointmentStatusDTO, appointment: AppointmentEntity) => {
    for await (const service of body.services) {
      const appointmentDetail = new AppointmentDetailEntity();
      appointmentDetail.appointmentId = appointment.id;
      appointmentDetail.patientId = appointment.patientId;
      appointmentDetail.dentistId = appointment.dentistId;
      appointmentDetail.serviceId = Number(service.serviceId);
      appointmentDetail.quantity = Number(service.quantity);
      appointmentDetail.unitPrice = Number(service.unitPrice);
      appointmentDetail.discount = Number(service.disscount);
      appointmentDetail.price = Number(service.price);
      appointmentDetail.subTotal = Number(service.subtotal);
      appointmentDetail.comments = `Servicio registrado ${getTodayDate()}`;
      appointmentDetail.labCost = service.labCost;
      appointmentDetail.branchOfficeId = appointment.branchId;
      const category = await this.serviceRepository.findOneBy({ id: Number(service.serviceId) });
      if (category != null) {
        appointmentDetail.serviceCategoryId = category.categoryId;
      }
      await this.appointmentDetailRepository.save(appointmentDetail);

      if (body.padId != null && body.padId != 0 && Number(service.disscount) > 0) {
        for (let i = 0; i < Number(service.quantity); i++) {
          const padComponent = new PadComponentUsedEntity();
          padComponent.patientId = appointment.patientId;
          padComponent.serviceId = Number(service.serviceId);
          padComponent.padId = body.padId;
          await this.padComponentUsedRepository.save(padComponent);
        }
      }
    }
  }

  private addAppointmentPayment = async (body: UpdateAppointmentStatusDTO, appointment: AppointmentEntity) => {
    const movement = await this.movementRepository.findOneBy({ name: 'Cita' });
    const deposits = this.getPatientDeposits(body);
    //(deposits)
    //console.log(`Amount ${body.amount} - Paid ${body.paid}`);
    let status = 'A';
    if (Number(body.paid) >= Number(body.amount)) {
      status = 'C'
    }
    const payment = new PaymentEntity();
    payment.patientId = appointment.patientId;
    payment.referenceId = appointment.id;
    payment.movementTypeId = movement?.id ?? 2;
    payment.amount = Number(body.amount);
    payment.movementType = movement?.type ?? 'C';
    payment.movementSign = '1';
    payment.status = status;
    payment.branchOfficeId = appointment.branchId;
    payment.dentistId = appointment.dentistId;
    //(`Cita payment`, payment);

    const newPayment = await this.paymentRepository.save(payment);

    let index = 1;
    for await (const paymentDetail of body.payments) {
      let payAmount = 0;
      if (Number(paymentDetail.amount) >= Number(body.amount)) {
        payAmount = Number(body.amount);
      } else {
        payAmount = Number(paymentDetail.amount) + deposits;
      }
      const paymentItem = new PaymentDetailEntity();
      paymentItem.patientId = appointment.patientId;
      paymentItem.paymentId = newPayment.id;
      paymentItem.referenceId = appointment.id;
      paymentItem.movementTypeApplicationId = movement?.id ?? 2;
      paymentItem.movementType = 'A'
      paymentItem.amount = payAmount;
      paymentItem.paymentMethodId = paymentDetail.key;
      paymentItem.sign = '-1'
      paymentItem.order = index;
      paymentItem.branchOfficeId = appointment.branchId;
      paymentItem.dentistId = appointment.dentistId;
      index += 1;
      //(`Detail`, paymentItem)
      await this.paymentDetailRepository.save(paymentItem);
    }
  }

  private processAppointmentDeposits = async (body: UpdateAppointmentStatusDTO, appointment: AppointmentEntity) => {
    const totalDebts = await this.getPatientDebts(body);
    const movementPay = await this.movementRepository.findOneBy({ name: 'Anticipo' });
    const paymentDeposit = new PaymentEntity();
    paymentDeposit.patientId = appointment.patientId;
    paymentDeposit.referenceId = appointment.id;
    paymentDeposit.movementTypeId = movementPay?.id ?? 3;
    paymentDeposit.amount = Number(body.paid) - Number(body.amount) - totalDebts;
    paymentDeposit.movementType = movementPay?.type ?? 'A';
    paymentDeposit.movementSign = '1';
    paymentDeposit.status = 'A';
    paymentDeposit.branchOfficeId = appointment.branchId;
    paymentDeposit.dentistId = appointment.dentistId;
    //('Registramos abono', paymentDeposit)
    await this.paymentRepository.save(paymentDeposit);
  }


  private processAppointmentUpdateDeposits = async (body: UpdateAppointmentStatusDTO, appointment: AppointmentEntity) => {
    //console.log('process deposits');
    for await (const deposit of body.deposits) {
      const activeDeposit = await this.paymentRepository.findOneBy({ id: deposit.id });
      const activeDepositDetails = await this.paymentDetailRepository.findBy({ paymentId: deposit.id });
      const totalActiveDeposits = activeDepositDetails.map((value, _) => Number(value.amount)).reduce((a, b) => a + b, 0);
      if (activeDeposit != null) {

        if (Number(deposit.amount) == Number(body.paid) && Number(body.paid) >= Number(body.amount)) {
          activeDeposit.status = 'A';
        } else {
          activeDeposit.status = 'C';
        }
        activeDeposit.dueDate = getTodayDateAndConvertToDate();
        //activeDeposit.referenceId = appointment.id;
        await this.paymentRepository.save(activeDeposit);



        const paymentItemDeposit = new PaymentDetailEntity();
        paymentItemDeposit.patientId = activeDeposit.patientId;
        paymentItemDeposit.paymentId = activeDeposit.id;
        paymentItemDeposit.referenceId = appointment.id;
        paymentItemDeposit.movementTypeApplicationId = 4;
        paymentItemDeposit.movementType = 'A'

        if (Number(deposit.amount) == Number(body.paid) && Number(body.paid) >= Number(body.amount)) {
          paymentItemDeposit.amount = Number(body.amount);
        } else {
          paymentItemDeposit.amount = deposit.amount - totalActiveDeposits;
        }

        paymentItemDeposit.paymentMethodId = deposit.paymentMethodId;
        paymentItemDeposit.sign = '-1'
        paymentItemDeposit.order = 1;
        paymentItemDeposit.branchOfficeId = appointment.branchId;
        paymentItemDeposit.dentistId = appointment.dentistId;
        // console.log(paymentItemDeposit);
        // console.log(activeDeposit)
        await this.paymentDetailRepository.save(paymentItemDeposit);
      }
    }
  }

  private getPatientDebts = async (body: UpdateAppointmentStatusDTO): Promise<number> => {
    let total = 0;
    for await (const debt of body.debts) {
      let totalDebt = 0;
      const debtDetail = await this.paymentDetailRepository.findBy({ paymentId: debt.id });
      for await (const item of debtDetail) {
        totalDebt += Number(item.amount);
      }
      total += Number(debt.amount) - totalDebt;
    }
    return Promise.resolve(total);
  }

  private getPatientDeposits = (body: UpdateAppointmentStatusDTO): number => {
    return body.deposits.map((value, _) => Number(value.amount)).reduce((a, b) => a + b, 0);
  }

  private processAppointmentDebts = async (body: UpdateAppointmentStatusDTO, appointment: AppointmentEntity) => {
    const patientPaid = Number(body.paid) - Number(body.amount);
    for await (const debt of body.debts) {
      let totalDebt = 0;
      const debtDetail = await this.paymentDetailRepository.findBy({ paymentId: debt.id });
      for await (const item of debtDetail) {
        totalDebt += Number(item.amount);
      }

      const toPaid = Number(debt.amount) - totalDebt;
      if (patientPaid >= toPaid) {
        debt.status = 'C';
        debt.dueDate = getTodayDateAndConvertToDate();
        //console.log(debt);
        await this.paymentRepository.save(debt);
        const paymentItemPaid = new PaymentDetailEntity();
        paymentItemPaid.patientId = debt.patientId;
        paymentItemPaid.paymentId = debt.id;
        paymentItemPaid.referenceId = debt.id;
        paymentItemPaid.movementTypeApplicationId = 1;
        paymentItemPaid.movementType = 'C'
        paymentItemPaid.amount = toPaid;
        paymentItemPaid.paymentMethodId = body.payments[body.payments.length - 1].key;
        paymentItemPaid.sign = '1'
        paymentItemPaid.order = debtDetail.length + 1;
        paymentItemPaid.branchOfficeId = appointment.branchId;
        paymentItemPaid.dentistId = appointment.dentistId;
        // console.log(paymentItemPaid);
        await this.paymentDetailRepository.save(paymentItemPaid);
      } else {
        console.log('Nothing in debts updated')
      }
    }
  }

  rescheduleAppointmentDentist = async ({ id, date, time, branchName }: RescheduleAppointmentDTO): Promise<GetAppointmentDetailDTO> => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ id: Number(id) });

      if (appointment == null || appointment == undefined) throw new NotFoundCustomException(NotFoundType.APPOINTMENT_NOT_FOUND);

      const branchOffice = await this.branchOfficeRepository.findOneBy({ name: branchName });

      appointment.appointment = date.toString().split("T")[0];
      appointment.time = time.simpleTime;
      appointment.branchId = branchOffice.id;
      appointment.branchName = branchOffice.name;
      appointment.status = STATUS_ACTIVE;
      appointment.dentistId = null;
      appointment.receptionistId = null;
      appointment.comments = `${appointment.comments} \n Cita reagendada a las ${getTodayDate()} - De ${appointment.appointment} ${appointment.time} para ${date.toString().split("T")[0]} ${time.time}`
      const updatedAppointment = await this.appointmentRepository.save(appointment);

      const response = await this.getAppointment(updatedAppointment);
      const appointmentFound = await this.appointmentTimesRepository.findBy({ appointmentId: appointment.id });

      for await (const time of appointmentFound) {
        const item = time;
        item.status = STATUS_FINISHED;
        await this.appointmentTimesRepository.save(item);
      }

      if (response.patient != null && response.patient != undefined) {
        await this.messageService.sendWhatsAppRescheduleAppointment(
          new SendWhatsappConfirmationDTO(
            response.patient.primaryContact, branchOffice.name, `${formatDateToWhatsapp(updatedAppointment.appointment)} - ${time.time}`
          )
        );
      } else {
        await this.messageService.sendWhatsAppRescheduleAppointment(
          new SendWhatsappConfirmationDTO(
            response.prospect.primaryContact, branchOffice.name, `${formatDateToWhatsapp(updatedAppointment.appointment)} - ${time.time}`
          )
        );
      }

      return response;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }


  cancelAppointment = async ({ reason, folio }: CancelAppointmentDTO) => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ folio: folio });
      if (appointment != null && appointment.status == STATUS_ACTIVE) {
        appointment.status = STATUS_CANCELLED;
        appointment.comments = `${appointment.comments} \n Cita cancelada por usuario ${getTodayDate()} \n Motivo ${reason}`
        const updatedAppointment = await this.appointmentRepository.save(appointment);
        const response = await this.getAppointment(updatedAppointment);

        if (response.patient != null && response.patient != undefined) {
          await this.messageService.sendWhatsAppCancelAppointment(
            new SendWhatsappConfirmationDTO(
              response.patient.primaryContact, ``, ``
            )
          );

        } else {
          await this.messageService.sendWhatsAppCancelAppointment(
            new SendWhatsappConfirmationDTO(
              response.prospect.primaryContact, ``, ``
            )
          );

        }
      }
      return 200;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }


  getAppointmentAvailbilityByDentist = async (
    { dentistId, dayname, branchOfficeId, date }: AppointmentAvailbilityByDentistDTO): Promise<any> => {
    try {

      const employeeSchedules = await this.branchOfficeEmployeeScheduleRepository.createQueryBuilder('branch_schedule_dentist')
        .innerJoinAndSelect('branch_schedule', 'bs', 'branch_schedule_dentist.branch_schedule_id = bs.ID')
        .where('branch_schedule_dentist.branch_id = :branchId', { branchId: Number(branchOfficeId) })
        .andWhere('branch_schedule_dentist.dentist_id = :dentistId', { dentistId: Number(dentistId) })
        .andWhere('bs.day_name = :dayName', { dayName: dayname })
        .getRawMany();


      const today = new Date();
      let currentDay = today.getDate();
      let availableHours: AvailableHoursDTO[] = [];


      for await (const dayTime of branchOfficeScheduleToEntity(employeeSchedules)) {

        const startTime = dayTime.startTime.toString();
        const startTimeArray = startTime.split(":");
        const startHour = Number(startTimeArray[0]);
        const startMinutes = Number(startTimeArray[1]);
        const startSeconds = Number(startTimeArray[2]);
        const startDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), currentDay, startHour, startMinutes, startSeconds))

        const endTime = dayTime.endTime.toString();
        const endTimeArray = endTime.split(":");
        const endHour = Number(endTimeArray[0]);
        const endMinutes = Number(endTimeArray[1]);
        const endSeconds = Number(endTimeArray[2]);
        const endDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), currentDay, endHour, endMinutes, endSeconds))

        const dif = getDiff(startDate, endDate) + 1;

        for (let index = 0; index < dif; index++) {
          let hourToAdd = (startHour + index);
          let hourResult = hourToAdd < 10 ? `0${hourToAdd}` : hourToAdd;
          let amOrPm = hourToAdd < 12 ? 'AM' : 'PM';
          if (hourToAdd <= endHour && endMinutes < 59) {
            if (startMinutes == 0) {
              availableHours.push(
                new AvailableHoursDTO(
                  dayTime.id,
                  `${hourResult}:00 ${amOrPm}`,
                  `${hourResult}:00:00`,
                  dayTime.seat,
                  dayTime.id
                ));
              availableHours.push(
                new AvailableHoursDTO(
                  dayTime.id,
                  `${hourResult}:30 ${amOrPm}`,
                  `${hourResult}:30:00`,
                  dayTime.seat,
                  dayTime.id
                ));
            } else {
              availableHours.push(
                new AvailableHoursDTO(
                  dayTime.id,
                  `${hourResult}:${startMinutes}0 ${amOrPm}`,
                  `${hourResult}:${startMinutes}0:00`,
                  dayTime.seat,
                  dayTime.id
                ));
            }
          }
        }
      }

      return availableHours;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }

  }

  registerNextAppointment = async ({ branchOfficeId, date, time, patientId, dentistId, hasLabs, hasCabinet, services, nextAppointmentId }: RegisterNextAppointmentDTO) => {
    try {

      const branchOffice = await this.branchOfficeRepository.findOneBy({ id: Number(branchOfficeId) });
      const patient = await this.patientRepository.findOneBy({ id: Number(patientId) });

      const exists = await this.appointmentRepository.findOneBy({
        branchId: branchOffice.id,
        branchName: branchOffice.name,
        appointment: date.toString().split("T")[0],
        time: time.simpleTime,
        patientId: Number(patientId),
      });

      if (exists != null) throw new ValidationException(ValidationExceptionType.APPOINTMENT_EXISTS);
      if (patientId == null || patientId == 0) throw new ValidationException(ValidationExceptionType.EMPTY_PATIENT);


      const entity = new AppointmentEntity();
      entity.appointment = date.toString().split("T")[0]
      entity.branchId = branchOffice.id;
      entity.branchName = branchOffice.name;
      entity.scheduleBranchOfficeId = time.scheduleBranchOfficeId;
      entity.time = time.simpleTime;
      entity.scheduledAt = getTodayDate()
      const folio = randomUUID().replace(/-/g, getRandomInt()).substring(0, 20).toUpperCase()
      entity.folio = folio;
      entity.patientId = patientId;
      entity.dentistId = Number(dentistId)
      entity.comments = `Cita Agendada por Recepcionista ${date.toString().split("T")[0]} ${time.simpleTime}`
      entity.hasLabs = hasLabs;
      entity.hasCabinet = hasCabinet;
      entity.status = STATUS_ACTIVE;

      const response = await this.appointmentRepository.save(entity);

      const previousAppointment = await this.appointmentRepository.findOneBy({ id: nextAppointmentId });
      previousAppointment.nextAppointmentId = response.id;
      previousAppointment.nextAppointmentDate = date.toString().split("T")[0];
      await this.appointmentRepository.save(previousAppointment);

      for await (const serviceId of services) {
        const service = new AppointmentServiceEntity();
        service.appointmentId = response.id;
        service.serviceId = serviceId;
        await this.appointmentServiceRepository.save(service);
      }

      await this.messageService.sendWhatsAppNextAppointment(
        new SendWhatsappConfirmationDTO(
          patient.primaryContact, branchOffice.name, `${formatDateToWhatsapp(response.appointment)} - ${time.time}`
        )
      );

      let updatedAppointment = await this.getAppointment(response);
      return updatedAppointment;
    } catch (exception) {
      HandleException.exception(exception);
    }
  }


  updateHasLabs = async ({ id, hasLabs }: UpdateHasLabsAppointmentDTO) => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ id: Number(id) });
      appointment.hasLabs = hasLabs;
      const newAppointment = await this.appointmentRepository.save(appointment);
      return await this.getAppointment(newAppointment);
    } catch (exception) {
      HandleException.exception(exception);
    }
  }

  updateHasCabinet = async ({ id, hasCabinet }: UpdateHasCabinetAppointmentDTO) => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ id: Number(id) });
      appointment.hasCabinet = hasCabinet;
      const newAppointment = await this.appointmentRepository.save(appointment);
      return await this.getAppointment(newAppointment);
    } catch (exception) {
      HandleException.exception(exception);
    }
  }


  sendAppointmentNotification = async ({ folio }: SendNotificationDTO) => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ folio: folio });
      const employee = await this.employeeRepository.findOneBy({ branchOfficeId: appointment.branchId, typeId: 10 });
      //   const employee = await this.employeeRepository.findOneBy({ id: 21 });
      const message = {
        notification: {
          title: `Cita Folio: ${appointment.folio}`,
          body: 'Cita recibida.'
        },
        data: {
          type: 'QR',
          folio: appointment.folio
        },
        token: employee.token
      };
      await this.firebase.messaging.send(message);
      console.log(`Notification sent`);
      return 200;
    } catch (exception) {
      console.log(`Error sending notification ${exception}`);
      HandleException.exception(exception);
    }
  }

  getAppointment = async (appointment: AppointmentEntity): Promise<GetAppointmentDetailDTO> => {
    const branchOffice = await this.branchOfficeRepository.findOneBy({ id: appointment.branchId });

    let prospect: ProspectEntity;
    let patient: PatientEntity;
    let dentist: EmployeeEntity;
    let services: ServiceEntity[] = [];

    if (appointment.patientId == null || appointment.patientId == undefined) {
      prospect = await this.prospectRepository.findOneBy({ id: appointment.prospectId });
    } else {
      patient = await this.patientRepository.findOneBy({ id: appointment.patientId });
    }

    if (appointment.dentistId != null && appointment.dentistId != undefined && appointment.dentistId != 0) {
      const previewDentist = await this.employeeRepository.findOneBy({ id: appointment.dentistId });
      const type = await this.employeeTypeRepository.findOneBy({ id: previewDentist.typeId });
      previewDentist.typeName = type.name;
      dentist = previewDentist;
    }

    const appointmentDetail = await this.appointmentDetailRepository.findBy({ appointmentId: appointment.id });
    if (appointmentDetail.length > 0) {
      for await (const service of appointmentDetail) {
        const response = await this.serviceRepository.findOneBy({ id: service.serviceId });
        if (response) services.push(response);
      }
    } else {
      const appointmentServices = await this.appointmentServiceRepository.findBy({ appointmentId: appointment.id });
      for await (const service of appointmentServices) {
        const response = await this.serviceRepository.findOneBy({ id: service.serviceId });
        if (response) services.push(response);
      }
    }

    const extendedTimes = await this.appointmentTimesRepository.findBy({ appointmentId: appointment.id });

    if (appointment.referralCode != null && appointment.referralCode != '') {
      const origin = await this.patientOriginRepository.findOneBy({ referralCode: appointment.referralCode });
      appointment.referralName = origin?.name ?? '';
      appointment.referralId = origin?.id ?? 0;
    }

    return new GetAppointmentDetailDTO(appointment, branchOffice, patient, prospect, dentist, services, extendedTimes);
  }



  appointmentReminders = async () => {
    try {
      const date = new Date();
      date.setDate(date.getDate() + 1);

      const nextDate = date.toISOString().split("T")[0];
      const result = await this.appointmentRepository.find({ where: { appointment: nextDate, status: STATUS_ACTIVE } });
      let failureEmails = [];
      for await (const appointment of result) {
        let prospect: ProspectEntity;
        let patient: PatientEntity;

        if (appointment.patientId == null) {
          prospect = await this.prospectRepository.findOneBy({ id: appointment.prospectId });
        } else {
          patient = await this.patientRepository.findOneBy({ id: appointment.patientId });
        }
        const branchOffice = await this.branchOfficeRepository.findOneBy({ id: appointment.branchId });

        if (patient != null && patient != undefined) {
          await this.messageService.sendWhatsAppConfirmation(
            new SendWhatsappConfirmationDTO(
              patient.primaryContact, branchOffice.name, `${formatDateToWhatsapp(appointment.appointment)} - ${appointment.time}`
            )
          );

        } else {
          await this.messageService.sendWhatsAppConfirmation(
            new SendWhatsappConfirmationDTO(
              prospect.primaryContact, branchOffice.name, `${formatDateToWhatsapp(appointment.appointment)} - ${appointment.time}`
            )
          );

        }
      }
      return failureEmails;
    } catch (exception) {
      console.log(exception);
    }
  }

  appointmentNotAttended = async () => {
    try {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const nextDate = date.toISOString().split("T")[0];
      const result = await this.appointmentRepository.find({ where: { appointment: nextDate, status: STATUS_ACTIVE } });
      let failureEmails = [];

      for await (const appointment of result) {
        const item = appointment;
        item.status = STATUS_NOT_ATTENDED;
        item.comments = `${item.comments} \n Cita no atendida ${getTodayDate()}`
        await this.appointmentRepository.save(item);

        const appointmentFound = await this.appointmentTimesRepository.findBy({ appointmentId: appointment.id });

        for await (const time of appointmentFound) {
          const item = time;
          item.status = STATUS_FINISHED;
          await this.appointmentTimesRepository.save(item);
        }

        await this.callFromAppointmentNotAttended(appointment);
      }
      return failureEmails;
    } catch (exception) {
      console.log(`Exception main method cancel appoitnments ${exception}`);
    }
  }



  callFromAppointmentNotAttended = async (appointment: AppointmentEntity) => {
    try {
      const catalog = await this.callCatalogRepository.findOneBy({ name: 'No-show' });
      const call = new CallEntity();
      call.appointmentId = appointment.id;
      if (appointment.patientId != null && appointment.patientId != undefined && appointment.patientId != 0) {
        call.patientId = appointment.patientId;
      } else {
        call.prospectId = appointment.prospectId;
      }
      call.status = STATUS_ACTIVE;
      call.result = CallResult.APPOINTMENT;
      call.caltalogId = catalog.id;
      if (call.comments != null && call.comments != '') {
        call.comments = `${call.comments} \n Registro de llamada automatico ${getTodayDate()}`;
      } else {
        call.comments = `Registro de llamada automatico ${getTodayDate()}`;
      }
      call.branchId = appointment.branchId;
      call.branchName = appointment.branchName;

      const today = new Date();
      today.setDate(today.getDate() + 1);
      call.dueDate = getTodaySimpleDate();
      return await this.callRepository.save(call);
    } catch (exception) {
      console.log(exception);
      return;
    }
  }


  reminderPad = async () => {
    try {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const nextDate = date.toISOString().split("T")[0];
      const patients = await this.patientRepository.findBy({ padExpirationDate: nextDate });
      const callPad = await this.callCatalogRepository.findOneBy({ name: 'PAD vencido' });
      for await (const patient of patients) {
        const exits = await this.callRepository.findOneBy({ patientId: patient.id, caltalogId: callPad.id });
        if (!exits) {
          const today = new Date();
          today.setDate(today.getDate() + 1);
          const call = new CallEntity();
          call.patientId = patient.id;
          call.comments = `Registro de llamada automatico pad vencido ${getTodayDate()}`;
          call.caltalogId = callPad.id;
          call.dueDate = getTodaySimpleDate();
          call.result = CallResult.CALL;
          await this.callRepository.save(call);
          //  console.log(`Llamada registrada`);
        }
      }
    } catch (error) {
      console.log(`Error remindier pad ${error}`);
    }
  }


  getServices = async () => {
    try {
      const result = await this.serviceRepository.findBy({ status: STATUS_ACTIVE });
      return result;
    } catch (error) {
      HandleException.exception(error);
    }
  }

  getPaymentMethods = async () => {
    try {
      const result = await this.paymentMethodRepository.find();
      return result;
    } catch (error) {
      HandleException.exception(error);
    }
  }


  extendAppointment = async (body: RegisterExtendAppointmentDTO) => {
    try {

      for await (const time of body.times) {
        const exist = await this.appointmentTimesRepository.findBy({
          appointmentId: body.id,
          time: time,
          appointment: body.appointment
        });
        if (exist == null || exist.length == 0) {
          const appointmentFound = await this.appointmentRepository.findOneBy({ id: Number(body.id) });

          const appointmentTime = new AppointmentTimesEntity();
          appointmentTime.appointmentId = body.id;
          appointmentTime.appointment = body.appointment;
          appointmentTime.status = STATUS_ACTIVE;
          appointmentTime.time = time;
          appointmentTime.branchOfficeId = appointmentFound.branchId;
          await this.appointmentTimesRepository.save(appointmentTime);
        }
      }
      const appointment = await this.appointmentRepository.findOneBy({ id: body.id });
      return this.getAppointment(appointment);
    } catch (error) {
      HandleException.exception(error);
    }
  }


  testWhatsappMessage = async (body: SendWhatsappConfirmationDTO) => {
    try {
      await this.messageService.sendWhatsAppConfirmation(body);
    } catch (error) {
      console.log(`Error sending whatsapp message : ${error}`);
      return {};
    }
  }



  registerAppointmentCallCenter = async (body: RegisterCallCenterAppointmentDTO): Promise<string> => {
    try {
      //console.log(body);
      const branchOffice = await this.branchOfficeRepository.findOneBy({ id: body.branchId });
      let prospect: ProspectEntity;
      if (body.name != '' && body.name != null && body.name != undefined && body.name != " " && body.phone != '') {
        const newProspect = new ProspectEntity();
        newProspect.name = capitalizeAllCharacters(body.name);
        newProspect.email = body.email;
        newProspect.primaryContact = body.phone;
        prospect = await this.prospectRepository.save(newProspect);
      } else if (body.prospectId != null && body.prospectId != 0) {
        prospect = await this.prospectRepository.findOneBy({ id: body.prospectId });
      }

      const entity = new AppointmentEntity();
      entity.appointment = body.date.toString().split("T")[0]
      entity.branchId = branchOffice.id;
      entity.branchName = branchOffice.name;
      entity.scheduleBranchOfficeId = body.time.scheduleBranchOfficeId;
      entity.time = body.time.simpleTime;
      entity.scheduledAt = getTodayDate()
      const folio = randomUUID().replace(/-/g, getRandomInt()).substring(0, 20).toUpperCase()
      entity.folio = folio;
      if (prospect != null && prospect != undefined) {
        entity.prospectId = prospect.id;
      } else {
        entity.patientId = body.patientId;
      }
      entity.comments = `Cita registrada ${getTodayDate()} por call center para el ${body.date.toString().split("T")[0]} ${body.time.simpleTime}`;
      entity.hasCabinet = 0;
      entity.hasLabs = 0;
      entity.status = STATUS_ACTIVE;

      if (body.isCallCenter == true) {
        const origin = await this.patientOriginRepository.findOneBy({ name: 'callCenter' })
        if (origin != null) {
          entity.referralCode = origin.referralCode;
        }
      }
      entity.notesCallCenter = body.comments;
      const response = await this.appointmentRepository.save(entity);

      if (body.nofity != null && body.nofity == true) {
        if (prospect != null && prospect != undefined) {
          await this.messageService.sendWhatsAppConfirmation(
            new SendWhatsappConfirmationDTO(
              prospect.primaryContact, branchOffice.name, `${formatDateToWhatsapp(response.appointment)} - ${body.time.time}`
            )
          );
        } else {
          const patient = await this.patientRepository.findOneBy({ id: body.patientId });
          await this.messageService.sendWhatsAppConfirmation(
            new SendWhatsappConfirmationDTO(
              patient.primaryContact, branchOffice.name, `${formatDateToWhatsapp(response.appointment)} - ${body.time.time}`
            )
          );
        }
      }

      if (body.callId != null && body.callId > 0) {
        const call = await this.callRepository.findOneBy({ id: body.callId });
        if (call != null && call != undefined) {
          call.status = STATUS_SOLVED;
          call.effectiveDate = getTodayDate()
          call.comments = `${call?.comments ?? '-'} \n Llamada resuelta  ${getTodayDate()} terminada con cita ${response.folio}`;
          await this.callRepository.save(call);
          await this.updateCallLog(call.id, 'appointment');
        }
      }
      return response.folio;
    } catch (exception) {
      console.log(exception);
      HandleException.exception(exception);
    }
  }


  processWhatsappMessages = async (body: any) => {
    try {
      // console.log(`Data`, body)
      if (body != null && body.type == 'text' && body.client_name == 'SMSMasivos') {
        console.log(`Webhook test`)
        return;
      }
      if (body != null && body.type == 'text') {
        this.messageService.checkTextMessages(body);
      }
    } catch (error) {
      console.log(error);
    }
  }


  getAppointmentByPatient = async (body: any) => {
    try {
      return await this.appointmentRepository.findBy({ patientId: body.patientId, status: STATUS_FINISHED });
    } catch (error) {
      HandleException.exception(error);
    }
  }

  private updateCallLog = async (id: number, type: string) => {
    try {
      const logs = await this.callLogRepository.find({
        order: { id: 'DESC' },
        where: { callId: id },
        take: 1
      });

      if (logs.length > 0) {
        const lastlog = await this.callLogRepository.findOneBy({ id: logs[0].id });
        if (lastlog) {
          lastlog.finishedAt = getTodayDate();
          lastlog.result = type;
          await this.callLogRepository.save(lastlog);
        }
      }
      return 200;
    } catch (error) {
      console.log(`updateCallLog`, error);
    }
  }

  testWhatsapp = async () => {
    try {
      const res = await this.messageService.sendWhatsAppCancelAppointment(
        new SendWhatsappConfirmationDTO('7773510031', 'Cuernavaca Plan de Ayala Plaza Ikonos', 'Lunes 6, Marzo 2023 - 08:00 AM ')
      );
      return res;
    } catch (error) {
      HandleException.exception(error);
    }
  }

  registerAppointmentPatient = async (body: RegiserAppointmentPatientDTO) => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ id: body.appointmentId });
      if (appointment != null) {
        appointment.patientId = body.patientId;
        const updatedAppointment = await this.appointmentRepository.save(appointment);
        return await this.getAppointment(updatedAppointment);
      }
      return null;
    } catch (error) {
      HandleException.exception(error);
    }
  }

  updateNotShowAppointmentStatus = async (body: any) => {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ id: body.appointmentId });

      if (appointment != null) {
        appointment.status = STATUS_NOT_ATTENDED;
        appointment.comments = `${appointment.comments} \n Recepcionista cita no atendida ${getTodayDate()}`
        await this.appointmentRepository.save(appointment);
        const appointmentFound = await this.appointmentTimesRepository.findBy({ appointmentId: appointment.id });

        for await (const time of appointmentFound) {
          const item = time;
          item.status = STATUS_FINISHED;
          await this.appointmentTimesRepository.save(item);
        }
        await this.callFromAppointmentNotAttended(appointment);
      }
    } catch (error) {
      HandleException.exception(error);
    }
  }



  getAppointmentServices = async (appointmentId: number) => {
    try {
      const data = [];
      const details = await this.appointmentDetailRepository.findBy({ appointmentId: appointmentId });
      for await (const item of details) {
        const service = await this.serviceRepository.findOneBy({ id: item.serviceId });

        data.push({
          'service': service,
          'detail': item

        });
      }
      return data
    } catch (error) {
      return []
    }
  }


  getAppointmentsHistoryByPatient = async (body: any) => {
    try {
      if (body.patientId != null && body.patientId != undefined && body.patientId != '' && body.patientId != 0) {
        const appointments = await this.appointmentRepository.findBy({ patientId: body.patientId });
        return appointments;
      } else if (body.prospectId != null && body.prospectId != undefined && body.prospectId != '' && body.prospectId != 0) {
        const appointments = await this.appointmentRepository.findBy({ prospectId: body.prospectId });
        return appointments;
      }
      return [];
    } catch (error) {
      HandleException.exception(error);
    }
  }

  getAllAppointmentByBranchOfficeTest = async (body: GetAppointmentsByBranchOfficeDTO) => {
    try {
      const data = [];
      const appointments = await this.appointmentRepository.findBy({ branchId: Number(body.id), status: body.status, appointment: '2023-05-11' });
      // for await (const appointment of appointments) {
      //   const result = await this.getAppointment(appointment);
      //  // data.push(result);
      // }      
      return appointments;
    } catch (error) {
      HandleException.exception(error);
    }
  }
}