import { format, isValid, parse } from "date-fns";
import { toast } from "react-toastify";

export const isValidDate = (date: string, formatStr: string = "dd-MM-yyyy") => {
    const parsedDate = parse(date, formatStr, new Date());
    return !(isValid(parsedDate) && format(parsedDate, formatStr) === date);
};

export const formatDate = (date: Date, formatType = "dd-MM-yyyy") => {
    return format(date, formatType)
};