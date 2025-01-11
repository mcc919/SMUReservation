import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isLeapYear from 'dayjs/plugin/isLeapYear';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");
dayjs.extend(isLeapYear);

export function getReservationDay(openHour) {
    let date = getKoreanTime();
    if (date.hour() >= openHour)
        date = date.add(1, 'day');
    
    const year = date.year();
    const month = String(date.month() + 1).padStart(2, '0');
    const day = String(date.date()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getDateTime(day, option) {
    const _day = day.split('-');

    if (option === 'ko') {
        return `${_day[0]}년 ${_day[1]}월 ${_day[2]}일 ${_day[3]}:${_day[4]}:${_day[5]}`;
    } else {
        return `${_day[0]}-${_day[1]}-${_day[2]} ${_day[3]}:${_day[4]}:${_day[5]}`;
    }
}

export function getDate(day, option) {
    const _day = day.split('-');
    if (option === 'ko') {
        return `${_day[0]}년 ${_day[1]}월 ${_day[2]}일`
    } else {
        return `${_day[0]}-${_day[1]}-${_day[2]}`
    }
    
}

export function getTime(day) {
    const _day = day.split('-');
    return `${_day[3]}:${_day[4]}:${_day[5]}`
}

export function getKoreanTime() {
    const koreanTime = dayjs().tz().add(9, 'hour');

    console.log('한국 시간: ', koreanTime);
    console.log('한국 시간의 시간 (hour): ', koreanTime.hour());

    return koreanTime;
}