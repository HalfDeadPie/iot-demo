// human-readble battery states
const BAT_ULTRA_LOW = 'Ultra low'
const BAT_LOW = 'Low'
const BAT_OK = 'OK'
const BAT_GOOD = 'Good'

// human-readable list of available sensors
const EXT_TYPE_01 = 'E1 Temperature sensor'

// positions in hex payload (two slots = 1 Byte)
// device payload details in documentation
const POS_BAT_START = 0
const POS_BAT_END = 4
const POS_INTEMP_END = 8
const POS_INHUM_END = 12
const POS_EXT_TYPE_END = 14
const POS_EXT_DATA_END = 18

// Parse hexnumber to bits
function hex2bin(hex){
    return parseInt(hex, 16).toString(2)
}

// Parse hexnumber to signed integer
function parseSignedInt(hexNum){
    hexNum = parseInt(hexNum, 16);
    if ((hexNum & 0x8000) > 0) {
        hexNum = hexNum - 0x10000;
    }
    return hexNum
}

// Convert numeric state of battery into human-readable info
function batStatusToString(status){
    switch (status){
        case '00':
            return BAT_ULTRA_LOW
        case '01':
            return BAT_LOW
        case '10':
            return BAT_OK
        case '11':
            return BAT_GOOD
    }
}

// Convert numeric type of sensor into human-readable sensor name
function extTypeToString(type){
    if (type){
        return EXT_TYPE_01
    }
    else{
        return null
    }
}

function decode_payload(payload){
    // Parse battery info
    let batData = payload.substring(POS_BAT_START, POS_BAT_END) // slice battery data only

    let batStatus = parseInt(batData,16)>>14 & 0xFF // get only battery status
    //console.log(hex2bin(batStatus))
    batStatus = batStatusToString(batStatus.toString(2)) // convert battery status to bits

    let batVoltage = parseInt(batData,16) & 0x3FFF // parse voltage information
    // console.log('Battery status:', batStatus)
    // console.log('Battery voltage:', batVoltage)

    // Parse built-in temperature and humidity
    let inTemp = parseSignedInt(payload.substring(POS_BAT_END, POS_INTEMP_END),16)/100 // parse builtin temperature
    let inHum = parseInt(payload.substring(POS_INTEMP_END, POS_INHUM_END),16)/10 // parse built-in humidity
    // console.log('Built-in temperature:', inTemp)
    // console.log('Built-in humidity:', inHum)

    // build result JSON
    let resultJson = {
        "battery status": batStatus,
        "battery voltage": batVoltage,
        "builtin temperature": inTemp,
        "builtin humidity": inHum,
    }

    // Parse external type and data
    let extType = parseInt(payload.substring(POS_INHUM_END, POS_EXT_TYPE_END), 16) // parse type of external sensor
    let extData = null
    // console.log('External type:', extType)

    // add potential external sensor information
    if (extType){
        extData = parseSignedInt(payload.substring(POS_EXT_TYPE_END, POS_EXT_DATA_END))/100 // parse external data
        resultJson['external type'] = extTypeToString(extType) // add human-readable type of sensor to JSON
        resultJson['external data'] = extData // add external data to JSON
    }

    return resultJson
}

// Argument processing
let resultJson = decode_payload(process.argv.slice(2).toString())
//console.log(JSON.stringify(resultJson))

module.exports = { decode_payload }

process.on('exit', function(code) {
    return console.log(JSON.stringify(resultJson))
});

