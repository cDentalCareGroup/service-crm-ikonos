import { formatInTimeZone } from "date-fns-tz";

const isNumber = (value: string | number): boolean => {
        return ((value != null) &&
                (value !== '') &&
                !isNaN(Number(value.toString())));
}



const addHours = (date: Date, hour: number): Date => {
        date.setTime(date.getTime() + (hour * 60 * 60 * 1000));
        return date;
}

const getDiff = (startDate: Date, endDate: Date): number => {
        return Math.abs(startDate.getTime() - endDate.getTime()) / 36e5;
}

const getRandomInt = (): string => {
        try {
                return (Math.random() * (10000 - 0) + 1000).toFixed();
        } catch (error) {
                return '0';
        }
}

// const getDate = () => {
//   const result = formatInTimeZone(new Date(), 'America/Mexico_City', 'yyyy-MM-dd HH:mm:ss');
//   const arrayResult = result.split(" ");
//   const arrayDate = arrayResult[0].split("-");
//   const year = Number(arrayDate[0]);
//   const month = Number(arrayDate[1]);
//   const day = Number(arrayDate[2]);

//   const arrayTime = arrayResult[1].split(":");
//   const hour = Number(arrayTime[0]);
//   const minute = Number(arrayTime[1]);
//   const second = Number(arrayTime[2]);
//   return new Date(year,month - 1, day, hour, minute, second);
// }


const getTodayDate = (): string => {
        return formatInTimeZone(new Date(), 'America/Mexico_city', 'yyyy-MM-dd HH:mm:ss') // 2014-10-25 06:46:20-04:00

}

const getTodaySimpleDate = (): string => {
        return formatInTimeZone(new Date(), 'America/Mexico_city', 'yyyy-MM-dd') // 2014-10-25 06:46:20-04:00
}

const formatDate = (date: Date): string => {
        return formatInTimeZone(date, 'America/Mexico_city', 'yyyy-MM-dd') // 2014-10-25 06:46:20-04:00
}

const getSimpleTodayDate = (): string => {
        return formatInTimeZone(new Date(), 'America/Mexico_city', 'yyyy-MM-dd') // 2014-10-25 06:46:20-04:00
}

const getTodayDateAndConvertToDate = () => {
        return new Date(formatInTimeZone(new Date(), 'America/Mexico_city', 'yyyy-MM-dd HH:mm:ss'));
}


const capitalizeFirstLetter = (value: string | undefined): string => {
        if (value != undefined) {
                return value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase();
        }
        return '';
}

const capitalizeAllCharacters = (value: string | undefined): string => {
        if (value != undefined) {
                //return value.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
                return value.toLocaleLowerCase().replace(/(^|\s)\S/g, function (match) {
                        return match.toUpperCase();
                });
        }
        return ''
}

const getDayName = (date: Date): string => {
        var days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return days[date.getDay() + 1];
}

const getMonthName = (date: Date): string => {
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        return monthNames[date.getMonth()];
}


const formatDateToWhatsapp = (date: string): string => {
        const newDate = new Date(date);
        const dayDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1)
        const dayOfMonth = newDate.getDate();
        const dayName = getDayName(dayDate);
        const monthName = getMonthName(newDate);
        const year = newDate.getFullYear();
        return `${dayName} ${dayOfMonth}, ${monthName} ${year}`;
}

const STATUS_ACTIVE = 'active'
const STATUS_PROCESS = 'process'
const STATUS_INACTIVE = 'inactive'
const STATUS_FINISHED = 'finished'
const STATUS_NOT_ATTENDED = 'not-attended'
const STATUS_CANCELLED = 'cancelled'
const STATUS_FINISHED_APPOINTMENT_OR_CALL = 'finished-appointment-or-call'
const STATUS_SOLVED = 'solved'
const STATUS_ABANDOMENT = 'abandonment'
const STATUS_MANUAL = 'manual'
const STATUS_AUTOMATIC = 'automatic'

const BLOCK_CALENDAR = 1
const UNBLOCK_CALENDAR = 0

const ACTIVE_PAYMENT = "A"
const CLOSE_PAYMENT = "C"

export {
        ACTIVE_PAYMENT,
        CLOSE_PAYMENT,
        STATUS_MANUAL,
        STATUS_AUTOMATIC,
        isNumber,
        addHours,
        getDiff,
        getRandomInt,
        getTodayDate,
        capitalizeFirstLetter,
        capitalizeAllCharacters,
        getDayName,
        formatDateToWhatsapp,
        STATUS_ACTIVE,
        STATUS_INACTIVE,
        STATUS_FINISHED,
        STATUS_NOT_ATTENDED,
        STATUS_CANCELLED,
        STATUS_PROCESS,
        STATUS_FINISHED_APPOINTMENT_OR_CALL,
        STATUS_SOLVED,
        STATUS_ABANDOMENT,
        getTodaySimpleDate,
        getSimpleTodayDate,getTodayDateAndConvertToDate,
        BLOCK_CALENDAR,
        UNBLOCK_CALENDAR,
        formatDate
};