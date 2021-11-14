module.exports = async function (firstDate: any, secondDate: any) {
    let diffInMilliSeconds = Math.abs(secondDate - firstDate) / 1000;
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    const seconds = Math.floor(diffInMilliSeconds) % 60;
    diffInMilliSeconds -= minutes * 60;
    let difference = '';
    if (days > 0) {
        //.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
        difference += (days === 1) ? `${days} day, ` : `${days.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} days, `;
    }
    if (hours > 0) {
        difference += (hours === 1 || hours === 2) ? `${hours} hour, ` : `${hours} hours, `;
    }
    if (minutes > 0) {
        difference += (minutes === 1 || minutes === 2) ? `${minutes} minute` : `${minutes} minutes, `;
    } 
    if(seconds>0) {
        difference += (seconds === 1 || seconds === 2) ? `${seconds} second` : `${seconds} seconds`; 
    } else {
        diffInMilliSeconds = parseFloat(Math.abs(diffInMilliSeconds).toString().split('.')[1]);
        difference += (diffInMilliSeconds === 1 || diffInMilliSeconds === 2) ? `${diffInMilliSeconds} millisecond` : `${diffInMilliSeconds.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} milliseconds`; 
    }
    return difference;
}