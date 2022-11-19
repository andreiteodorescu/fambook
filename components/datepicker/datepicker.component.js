import {getMonth, getYear} from "date-fns";
import range from "lodash/range";

export const datePickerSettings = {
    years: range(1900, getYear(new Date()) + 1, 1),
    months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]
};

export const renderDatePickerHeader = ({
                                       date,
                                       changeYear,
                                       changeMonth,
                                       decreaseMonth,
                                       increaseMonth,
                                       prevMonthButtonDisabled,
                                       nextMonthButtonDisabled,
                                   }) => (
    <div className="datepicker-month-flex">
        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            {"<"}
        </button>
        <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(value)}
        >
            {datePickerSettings.years.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>

        <select
            value={datePickerSettings.months[getMonth(date)]}
            onChange={({ target: { value } }) =>
                changeMonth(datePickerSettings.months.indexOf(value))
            }
        >
            {datePickerSettings.months.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>

        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            {">"}
        </button>
    </div>
);