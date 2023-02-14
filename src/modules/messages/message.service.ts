import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { SendWhatsappConfirmationDTO } from "../appointment/models/appointment.dto";


@Injectable()
export class MessageService {

    constructor(
        private readonly httpService: HttpService
    ) {

    }
    sendWhatsAppConfirmation = async (body: SendWhatsappConfirmationDTO) => {
        try {

            let whatsappNumber: string = '';
            if (body.number.startsWith('777')) {
                whatsappNumber = `52${body.number}`;
            } else {
                whatsappNumber = body.number;
            }

            const payload = {
                "messaging_product": "whatsapp",
                "to": whatsappNumber,
                "type": "template",
                "template": {
                    "name": "confirmation_appointment",
                    "language": {
                        "code": "es_MX"
                    },
                    "components": [
                        {
                            "type": "body",
                            "parameters": [
                                {
                                    "type": "text",
                                    "text": "CDental Care Group"
                                },
                                {
                                    "type": "text",
                                    "text": body.time
                                },
                                {
                                    "type": "text",
                                    "text": body.branchOffice
                                }
                            ]
                        }
                    ]
                }
            }

            const request = this.httpService.post('https://graph.facebook.com/v15.0/114901764850906/messages', payload, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.WTS_TOKEN}`
                }
            });
            await lastValueFrom(request);
            return 200;
        } catch (error) {
            console.log(`Error sending whatsapp message : ${error}`);
            return {};
        }
    }


    sendMsjConfirmation = async (body: SendWhatsappConfirmationDTO) => {
        try {

            let message = `CDental Care Group. Tu cita ha sido confirmada. Fecha y Hora: ${body.time}`
            // let message = `🏥 Bienvenido(a) Dental Care Group
            // 📎 Tu cita ha sido confirmada. 
            // 🗓 Fecha y Hora: Lunes 18, Febrero 2023
            // 📍Sucursal: Plaza Ayala
            // Por favor llega 10 minutos antes de la hora indicada.`
            var payload = {
                "message": message,
                "numbers": body.number,
                "country_code": "52"
            }
            const request = this.httpService.post('https://api.smsmasivos.com.mx/sms/send', payload, {
                method: 'POST',
                headers: {
                    'apikey': ` ${process.env.MSJ_TOKEN}`,
                },
            });
            const res = await lastValueFrom(request);
            console.log(res);
            return 200;
        } catch (error) {
            console.log(`Error sending msj message : ${error}`);
            return {};
        }
    }
}