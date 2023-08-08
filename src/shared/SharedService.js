const formatTime = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours.toString().padStart(2, '0')
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

const formatDate = (date) => {
    const yr = new Date(date).getFullYear().toString();
    const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0');
    const day = new Date(date).getDate().toString().padStart(2, '0');
    var strDate = day + '/' + month + '/' + yr;
    return strDate;
}

const formatFilterDate = (date) => {
    const yr = new Date(date).getFullYear().toString();
    const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0');
    const day = new Date(date).getDate().toString().padStart(2, '0');
    var strDate = day + '-' + month + '-' + yr;
    return strDate;
}

const formatDateForBackEnd = (date) => {
    const yr = new Date(date).getFullYear().toString();
    const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0');
    const day = new Date(date).getDate().toString().padStart(2, '0');
    var strDate = yr + '-' + month + '-' + day;
    return strDate;
}

const AmPmToISO = (time) => {
    const yr = new Date().getFullYear().toString();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');

    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === "PM" && hours < 12) hours = hours + 12;
    if (AMPM === "AM" && hours === 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    const _24Hrs = sHours + ":" + sMinutes + ":00";
    const dt = `${yr}-${month}-${day}T${_24Hrs}`;
    return dt;
}

const getMonthNumber = (date) => {
    const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0');
    return month;
}

const clearModalBackdrop = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
        collections[i].remove();
    }
}


const eepFormatDateTime = (date, isShort) => {
    const inComingDate = new Date(date);
    const currentDate = new Date();

    let diffInMilliSeconds = Math.abs(currentDate - inComingDate) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    if (days === 0) {
        if (hours === 0) {
            if (minutes < 1) {
                return "Just now"
            }
            else if (minutes >= 1 && minutes <= 59) {
                return minutes + ((minutes === 1) ? (isShort ? "m ago" : " minute ago") : (isShort ? "m ago" : " minutes ago"));
            }
        } else if (hours >= 1) {
            return hours + ((hours === 1) ? (isShort ? "h ago" : " hour ago") : (isShort ? "h ago" : " hours ago"));
        }

    } else if (days >= 1 && days <= 3) {
        return days + ((days === 1) ? (isShort ? "d ago" : " day ago") : (isShort ? "d ago" : " days ago"));
    }
    else {
        return formatDate(date);
    }
}

export { formatTime, formatDate, AmPmToISO, getMonthNumber, clearModalBackdrop, eepFormatDateTime, formatFilterDate, formatDateForBackEnd }