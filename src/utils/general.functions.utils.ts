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

const capitalizeFirstLetter = (value: string | undefined): string => {
        if (value != undefined) {
                return value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase();
        }
        return '';
}

const capitalizeAllCharacters = (value: string | undefined): string => {
        if (value != undefined) {
                return value.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        }
        return ''
}

export { isNumber, addHours, getDiff, getRandomInt, getTodayDate, capitalizeFirstLetter,capitalizeAllCharacters };