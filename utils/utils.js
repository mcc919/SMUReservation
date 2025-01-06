export function getToday() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

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