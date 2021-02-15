//过滤验证信息
export function stripscript(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥......&*（）&;—|{}【】‘；：”“' 。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

export function testUsername(value){
    let reg = /^[a-zA-Z0-9](\w|\-)+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
    return reg.test(value);
}