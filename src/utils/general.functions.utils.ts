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


export { isNumber, addHours, getDiff,getRandomInt };