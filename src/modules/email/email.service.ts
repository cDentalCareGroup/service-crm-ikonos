import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { getAppointmentConfirmationTemplate, getAppointmentRescheduleTemplate, getAppointmentTemplate } from './templates';

@Injectable()
export class EmailService {
    constructor(private mailService: MailerService) { }



    sendAppointmentEmail = async (data: AppointmentTemplateMail, email: string): Promise<number> => {
        try {

            const template = getAppointmentTemplate(data);
            await this.mailService.sendMail({
                to: email,
                from: process.env.MAIL,
                subject: `C Dental Care Group - Cita Folio: ${data.folio}`,
                html: template
            });

            return 1
        } catch (error) {
            console.log("error", error);
            return 0;
        }
    }



    sendAppointmentConfirmationEmail = async (data: AppointmentTemplateMail, email: string): Promise<number> => {
        try {

            const template = getAppointmentConfirmationTemplate(data);
            await this.mailService.sendMail({
                to: email,
                from: process.env.MAIL,
                subject: `C Dental Care Group - Confirmación de cita`,
                html: template
            });

            return 1
        } catch (error) {
            console.log("error", error);
            return 0;
        }
    }

    sendAppointmentRescheduleEmail = async (data: AppointmentTemplateMail, email: string): Promise<number> => {
        try {

            const template = getAppointmentRescheduleTemplate(data);
            await this.mailService.sendMail({
                to: email,
                from: process.env.MAIL,
                subject: `C Dental Care Group - Cita Reagendada`,
                html: template
            });

            return 1
        } catch (error) {
            console.log("error", error);
            return 0;
        }
    }

    test = async (): Promise<number> => {
        try {

            const data = new AppointmentTemplateMail('Immanuel','2022-12-19','Calle 15 de Agosto','Palmas','77712312312','asdasdasdasd','777123123');
            const template = getAppointmentTemplate(data);
            await this.mailService.sendMail({
                to: 'imanueld22@gmail.com',
                from: process.env.MAIL,
                subject: `C Dental Care Group - Cita Folio: ${data.folio}`,
                html: template
            });

            return 1


        } catch (error) {
            console.log("error", error);
            return 0;
        }
    }
}

export class AppointmentTemplateMail {
    name: string;
    date: string;
    address: string;
    branchoffice: string;
    phoneNumber: string;
    folio: string;
    primaryContact: string;

    constructor(
        name: string,
        date: string,
        address: string,
        branchoffice: string,
        phoneNumber: string,
        folio: string,
        primaryContact: string,
    ) {
        this.name = name;
        this.date = date;
        this.address = address;
        this.branchoffice = branchoffice;
        this.phoneNumber = phoneNumber;
        this.folio = folio;
        this.primaryContact = primaryContact;

    }

}
