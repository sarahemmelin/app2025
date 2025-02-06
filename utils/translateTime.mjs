//---------------- Toggle --------------------
const useReadableTime = true;

//---------------------------------------------
const ReadableTime = useReadableTime ? 
    new Date().toLocaleString('no-NO', {
        timeZone: 'Europe/Oslo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }) : 
        Date.now();

export default ReadableTime;

