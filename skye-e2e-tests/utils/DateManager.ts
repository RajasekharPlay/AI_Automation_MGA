import { DateTime } from 'luxon';

export class DateManager {
    static increaseCurrDateWithDays(dayIncrement: number, dateFormat: string = 'ddMMyyyy'): string {
        return DateTime.now().plus({ days: dayIncrement }).toFormat(dateFormat);
    }

    static getCurrentDateFormatted(
        format: string = 'yyyy.MM.dd'
    ): string {
        const now = DateTime.now();
        return now.toFormat(format);
    }

    static formatDate(
        dateStr: string,
        inputFormat: string,
        outputFormat: string
    ): string | null {
        try {
            const parsedDate = DateTime.fromFormat(dateStr, inputFormat);
            return parsedDate.toFormat(outputFormat);
        } catch (error) {
            throw new Error(`Error formatting ${dateStr} from ${inputFormat} to ${outputFormat}. Error: ${error}`);
        }
    }

    static calculateDateSuffix(day: number): string {
            if (day >= 11 && day <= 13) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
    }
}
