var twofarequest = document.getElementById("twofarequest");
function HOTP(K, C) {
    var key = sjcl.codec.base32.toBits(K);
    // Count is 64 bits long.  Note that JavaScript bitwise operations make
    // the MSB effectively 0 in this case.
    var count = [((C & 0xffffffff00000000) >> 32), C & 0xffffffff];
    var otplength = 6;
    var hmacsha1 = new sjcl.misc.hmac(key, sjcl.hash.sha1);
    var code = hmacsha1.encrypt(count);
    var offset = sjcl.bitArray.extract(code, 152, 8) & 0x0f;
    var startBits = offset * 8;
    var endBits = startBits + 4 * 8;
    var slice = sjcl.bitArray.bitSlice(code, startBits, endBits);
    var dbc1 = slice[0];
    var dbc2 = dbc1 & 0x7fffffff;
    var otp = dbc2 % Math.pow(10, otplength);
    var result = otp.toString();
    while (result.length < otplength) {
        result = '0' + result;
    }
    return result;
}
function gettfa() {
    var secret = document.getElementById('twofarequest').value;
    if (secret.length > 0) {
        var ctime = Math.floor((new Date() - 0) / 30000);
        var otp = HOTP(secret, ctime);
        document.getElementById("twofaresult").value = otp;
    }
}
function refresh() {
    var ptext = document.getElementById("pastetext").value;
    var ptextresult = document.getElementById("dividedtext").value;
    if (ptext.length > 0 && ptextresult.length == 0) {
        dividetext();
    }
    var secret = document.getElementById('twofarequest').value;
    if (secret.length > 0) {
        var ifTfa = document.getElementById('twofaresult').value;
        if (ifTfa.length == 0) {
            gettfa();
            copytfa();
        }
        var refreshtime = 30 - Math.floor(((new Date() - 0) % 30000) / 1000);
        document.getElementById("refreshtime").value = "还剩" + refreshtime + "秒";
        if (refreshtime == 30) {
            gettfa();
            document.getElementById("copytfa").innerHTML = "复制验证码";
            var obj = document.getElementById('copytfa');
            obj.style.backgroundColor = "#f2f2f2";
            obj.style.color = "#000000";
        } else if (refreshtime <= 3) {
            var obj = document.getElementById('copytfa');
            obj.style.backgroundColor = "#ffeae6";
            obj.style.color = "#991a00";
        }
    }
    var countstr = document.getElementById("linksstr").value;
    if (countstr.length > 0) {
        countTextOcc();
    }
}

function normal8() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 8;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    document.getElementById("password").value = password;
}
function complex16() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 16;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    document.getElementById("password").value = password;
}
function normal16() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 16;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    document.getElementById("password").value = password;
}
function copyPassword() {
    var copyText = document.getElementById("password");
    copyText.select();
    copyText.setSelectionRange(0, 999);
    document.execCommand("copy");
}
function copytfa() {
    var ifTfa = document.getElementById("twofaresult").value;
    if (ifTfa.length > 0) {
        var copyTfaresult = document.getElementById("twofaresult");
        copyTfaresult.select();
        copyTfaresult.setSelectionRange(0, 999);
        document.execCommand("copy");
        document.getElementById("copytfa").innerHTML = "√ 已复制验证码";
        var obj = document.getElementById('copytfa');
        obj.style.backgroundColor = "#daf2c2";
        obj.style.color = "#397300";
    } else {
        document.getElementById("copytfa").innerHTML = "没有验证码";
    }
}
function dividetext() {
    var ptext = document.getElementById("pastetext").value;
    ptext = ptext.replace(/\|\|\|/g, "\n");
    ptext = ptext.replace(/\|\|/g, "\n");
    ptext = ptext.replace(/\|/g, "\n");
    ptext = ptext.replace(/---/g, "\n");
    ptext = ptext.replace(/--/g, "\n");
    ptext = ptext.replace(/\t/g, "\n");
    ptext = ptext.replace(/\u0020/g, "");
    document.getElementById("dividedtext").value = ptext;
    document.getElementById("metalink").setAttribute("href", "https://mbasic.facebook.com?email=" + ptext.substring(0, ptext.indexOf("\n")) + "&pass=" + ptext.substring(ptext.indexOf("\n") + 1, ptext.indexOf("\n", ptext.indexOf("\n") + 1)))
    var twofact = /[A-Z0-9]{32}/g.exec(ptext);
    document.getElementById("twofarequest").value = twofact;
    var timestamp1 = Date.parse(new Date());
    var tc = Math.floor(timestamp1 / 30000);
    gettfa();
    copytfa();
}

function openlinks() {
    var linksstr = document.getElementById("linksstr").value;
    linklist = linksstr.split("\n");
    for (i = 0; i < linklist.length; i++) {
        var s;
        if (!linklist[i].includes("http")) {
            s = "http://" + linklist[i];
        } else {
            s = linklist[i];
        }
        window.open(s);
    }
}


function svttrack() {
    var linksstr = document.getElementById("linksstr").value;
    linksstr = "https://t.17track.net/zh-cn?v=2#nums=" + linksstr;
    var len = linksstr.split("\n").length;
    for (var i = 1; i <= len; i++) {
        if (i % 40 == 0) {
            linksstr = linksstr.replace("\n", "Enter2Replacehttps://t.17track.net/zh-cn?v=2#nums=");
        } else {
            linksstr = linksstr.replace("\n", ",");
        }
    }
    linksstr = linksstr.replace(/,,/g, ",");
    linksstr = linksstr.replace(/Enter2Replace/g, "\n");
    if (linksstr.charAt(linksstr.length - 1) == ",") {
        linksstr = linksstr.substring(0, linksstr.length - 1);
    }
    if (linksstr.charAt(linksstr.length - 1) == "=") {
        linksstr = linksstr.substring(0, linksstr.length - 38);
    }
    linklist = linksstr.split("\n");
    for (i = 0; i < linklist.length; i++) {
        s = linklist[i];
        window.open(s);
    }
}

function soetrack() {
    var linksstr = document.getElementById("linksstr").value;
    linksstr = "https://www.track718.us/zh-CN/detail?nums=" + linksstr;
    var len = linksstr.split("\n").length;
    for (var i = 1; i <= len; i++) {
        if (i % 40 == 0) {
            linksstr = linksstr.replace("\n", "Enter2Replacehttps://www.track718.us/zh-CN/detail?nums=");
        } else {
            linksstr = linksstr.replace("\n", ",");
        }
    }
    linksstr = linksstr.replace(/,,/g, ",");
    linksstr = linksstr.replace(/Enter2Replace/g, "\n");
    if (linksstr.charAt(linksstr.length - 1) == ",") {
        linksstr = linksstr.substring(0, linksstr.length - 1);
    }
    if (linksstr.charAt(linksstr.length - 1) == "=") {
        linksstr = linksstr.substring(0, linksstr.length - 43);
    }
    linklist = linksstr.split("\n");
    for (i = 0; i < linklist.length; i++) {
        s = linklist[i];
        window.open(s);
    }
}

function delparentheses() {
    var linksstr = document.getElementById("linksstr").value;
    var result = linksstr.replace(/ *\([^)]*\)/g, "");
    result = result.replace(/\n/g, ",");
    while (result.includes(',,')) {
        result = result.replace(/,,/g, ",");
    }
    document.getElementById("linksstr").value = result;
    var copyText = document.getElementById("linksstr");
    copyText.select();
    copyText.setSelectionRange(0, 999);
    document.execCommand("copy");
    document.getElementById("delparentheses").innerHTML = "√ 已复制";
    var obj = document.getElementById('delparentheses');
    obj.style.backgroundColor = "#daf2c2";
    obj.style.color = "#397300";
    setTimeout(function () {
        obj.innerHTML = "去括号 + 复制";
        obj.style.backgroundColor = "#f2f2f2";
        obj.style.color = "#000000";
    }, 3000);
}

function space2enter() {
    var linksstr = document.getElementById("linksstr").value;
    var result = linksstr.replace(/ *\([^)]*\)/g, "");
    result = result.replace(/\s+/g, "\n");
    document.getElementById("linksstr").value = result;
    var copyText = document.getElementById("linksstr");
    copyText.select();
    copyText.setSelectionRange(0, 9999);
    document.execCommand("copy");
    document.getElementById("space2enter").innerHTML = "√ 已复制";
    var obj = document.getElementById('space2enter');
    obj.style.backgroundColor = "#daf2c2";
    obj.style.color = "#397300";
    setTimeout(function () {
        obj.innerHTML = "空格 → 换行";
        obj.style.backgroundColor = "#f2f2f2";
        obj.style.color = "#000000";
    }, 3000);
}

function calculateUPCChecksum(digits) {
    var sum = 0;
    var parity = digits.length % 2;
    for (var i = 0; i < digits.length; i++) {
        var digit = parseInt(digits.charAt(i));
        if (i % 2 === parity) {
            sum += digit * 3;
        } else {
            sum += digit;
        }
    }
    var checksum = (10 - (sum % 10)) % 10;
    return checksum.toString();
}

function generateUPC() {
    var linksstrText = document.getElementById("linksstr").value;
    var lines = linksstrText.split('\n');
    var result = "";
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var digits = line.replace(/\D/g, '');
        digits = digits.padEnd(11, '0');
        var checksum = calculateUPCChecksum(digits);
        var upc = digits + checksum;
        result += upc + '\n';
    }
    document.getElementById("linksstr").value = result;
    var copyText = document.getElementById("linksstr");
    copyText.select();
    copyText.setSelectionRange(0, 999);
    document.execCommand("copy");
    document.getElementById("bulkupc").innerHTML = "√ 已复制";
    var obj = document.getElementById('bulkupc');
    obj.style.backgroundColor = "#daf2c2";
    obj.style.color = "#397300";
    setTimeout(function () {
        obj.innerHTML = '<img height="50%" src="https://img.icons8.com/pulsar-color/48/barcode.png" alt="upc"/>&nbsp;批量UPC';
        obj.style.backgroundColor = "#f2f2f2";
        obj.style.color = "#000000";
    }, 3000);
}
function countTextOcc() {
    var str1 = document.getElementById("linksstr").value;
    // Count the number of lines
    const linesCount = str1.split(/\r\n|\r|\n/).length;
    const linesLength = str1.length;
    // Count the number of commas
    const commasCount = (str1.match(/(%2C|,)/g) || []).length + 1;

    console.log("Number of lines:", linesCount);
    console.log("Number of commas:", commasCount);
    document.getElementById("countLinesNCommas").innerText = "行数：" + linesCount + " | 分词/商品数：" + commasCount + " | 长度：" + linesLength;
}
function copyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
}
function copyAndRedirect() {
    const code = "554e0e8654804bedad765a63330a1e75";
    copyTextToClipboard(code);
    const overlay = document.getElementById("overlay");
    const popup = document.getElementById("popup");
    const popupText = document.getElementById("popupText");
    overlay.style.display = "block";
    popupText.textContent = "已复制邀请码，3秒后跳转到 Greasyfork";
    popup.style.display = "block";


    let countdown = 3;
    const countdownInterval = setInterval(function () {
        countdown -= 1;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            popup.style.display = "none";
            overlay.style.display = "none";
            window.open("https://greasyfork.org/zh-CN/scripts/418942-%E4%B8%87%E8%83%BD%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5-%E5%8D%87%E7%BA%A7%E7%89%88");
        } else {
            popupText.textContent = `已复制邀请码，${countdown}秒后跳转到 Greasyfork`;
        }
    }, 1000);
}
function metaCheck() {
    window.open('https://accountscenter.facebook.com/personal_info/contact_points/', '_blank');
    window.open('https://account.live.com/proofs/manage/additional', '_blank');
    window.open('https://accountscenter.facebook.com/password_and_security/login_activity', '_blank');
    window.open('https://accountscenter.facebook.com/password_and_security/login_alerts', '_blank');
    window.open('https://business.facebook.com/business-support-home/?landing_page=account_overview', '_blank');
    window.open('https://business.facebook.com/settings/info', '_blank');
}
function getMaleName() {
    // 定义一个字符串列表
    var items = ["Tyler","Tylor","Tyrell","Tyron","Tyrone","Tyrrell","Tyson","Ulric","Ulysses","Upton","Val","Valentine","Van","Vance","Vaughan","Vaughn","Vere","Vergil","Vern","Vernon","Vic","Victor","Vin","Vinal","Vince","Vincent","Vinnie","Vinny","Virgil","Vivian","Vyvyan","Wade","Waldo","Walker","Wallace","Wallis","Wally","Walt","Walter","Walton","Ward","Wardell","Warner","Warren","Warrick","Warwick","Washington","Wat","Watson","Waverly","Wayland","Waylon","Wayne","Webster","Weldon","Wells","Wendell","Wes","Wesley","Westley","Weston","Whitaker","Whitney","Wil","Wilbur","Wilburn","Wilder","Wiley","Wilf","Wilford","Wilfred","Wilfrid","Wilkie","Will","Willard","William","Willie","Willis","Willoughby","Willy","Wilmer","Wilson","Wilt","Wilton","Windsor","Winfield","Winfred","Winslow","Winston","Winthrop","Winton","Wisdom","Wolf","Wolfe","Woodie","Woodrow","Woody","Wright","Wyatt","Wynne","Wystan","Xander","Xavier","Xavior","Xzavier","Yale","Yancy","Yorick","York","Zac","Zach","Zachariah","Zachary","Zachery","Zack","Zackary","Zackery","Zaiden","Zak","Zander","Zane","Zavier","Zayden","Zayne","Zeb","Zechariah","Zed","Zeke","Zeph","Reese","Reg","Regan","Reggie","Reginald","Reid","Reign","Reilly","Remington","Remy","Rene","Reuben","Rex","Reynard","Reynold","Rhett","Rhys","Rian","Rich","Richard","Richie","Rick","Rickey","Ricki","Rickie","Ricky","Ridge","Ridley","Rigby","Riley","Riordan","Ripley","Ritchie","River","Rob","Robbie","Robby","Robert","Robin","Rocky","Rod","Roddy","Roderick","Rodge","Rodger","Rodney","Rodolph","Roger","Roland","Rolf","Rolland","Rollie","Rollo","Rolo","Rolph","Roly","Roman","Romilly","Ron","Ronald","Ronan","Ronin","Ronnie","Ronny","Roosevelt","Rorie","Rory","Roscoe","Ross","Roswell","Rowan","Rowen","Rowland","Rowley","Roy","Royal","Royale","Royce","Roydon","Royle","Royston","Rube","Rudolph","Rudy","Rudyard","Rufus","Rupert","Russ","Russel","Russell","Rusty","Ry","Ryan","Ryder","Ryker","Rylan","Ryland","Rylee","Ryley","Rylie","Sacheverell","Sage","Saint","Sal","Salem","Sam","Sammie","Sammy","Sampson","Samson","Samuel","Sandford","Sandy","Sanford","Santana","Satchel","Sawyer","Saxon","Schuyler","Scot","Scott","Scottie","Scotty","Scout","Sean","Sebastian","Sefton","Selby","Selwyn","Sequoia","Seth","Seven","Sevyn","Seward","Seymour","Shad","Shae","Shane","Shannon","Shanon","Shaun","Shaw","Shawn","Shaye","Shayne","Sheard","Shel","Shelby","Sheldon","Shelley","Shelly","Shelton","Shepherd","Sheridan","Sherman","Sherwood","Shirley","Shon","Sid","Sidney","Sigmund","Silas","Silver","Silvester","Simon","Sincere","Sinclair","Sinjin","Sky","Skylar","Skyler","Slade","Sloan","Sly","Smith","Solomon","Sonnie","Sonny","Soren","Sparrow","Spencer","Spike","Stace","Stacey","Stacy","Stafford","Stan","Stanford","Stanley","Ste","Steph","Stephen","Sterling","Stetson","Steve","Steven","Stevie","Stew","Stewart","Stirling","St","Stone","Storm","Stu","Stuart","Sullivan","Sully","Sunday","Sunny","Sutton","Syd","Sydney","Sylas","Sylvan","Sylvanus","Sylvester","Tad","Talbot","Talon","Tanner","Tate","Tatton","Tatum","Tayler","Taylor","Ted","Teddie","Teddy","Tel","Temple","Tennyson","Terance","Terell","Terence","Terrance","Terrell","Terrence","Terry","Terry","Tevin","Tex","Thad","Thaddeus","Thane","Thatcher","Theo","Theobald","Theodore","Thom","Thomas","Thorburn","Thorley","Thornton","Thurstan","Tibby","Tiger","Tim","Timmy","Timothy","Titus","Tobias","Tobin","Toby","Tod","Todd","Tolly","Tom","Tommie","Tommy","Tony","Topher","Torin","Tory","Trace","Tracey","Tracy","Trafford","Tranter","Travers","Travis","Trent","Trenton","Trev","Trevelyan","Trevor","Trey","Tripp","Tristan","Tristen","Tristin","Triston","Tristram","Troy","Trueman","Truman","Tucker","Turner","Ty","Tye","Tylar","Louie","Louis","Lovel","Lovell","Lowell","Loyd","Lucas","Lucian","Lucius","Lucky","Luke","Luther","Lyall","Lyle","Lyndon","Lynn","Lynton","Lynwood","Lyric","Mac","Macaulay","Macauley","Mack","Mackenzie","Maddox","Madison","Maitland","Major","Malachi","Malakai","Malcolm","Malcom","Malone","Manley","Manny","Mansel","Marcus","Marion","Mark","Marley","Marlin","Marlon","Marlowe","Marlyn","Marmaduke","Marshal","Marshall","Martie","Martin","Marty","Marvin","Marvyn","Mason","Masterman","Mat","Mathew","Matt","Matthew","Mattie","Matty","Maurice","Maurie","Maverick","Max","Maxie","Maximilian","Maximillian","Maxton","Maxwell","Maynard","Maynerd","Mayson","McKenzie","McKinley","Meade","Mel","Melville","Melvin","Melvyn","Memphis","Meredith","Merit","Meriwether","Merle","Merlin","Merlyn","Merrick","Merrill","Merritt","Merton","Merv","Mervin","Mervyn","Messiah","Micah","Michael","Micheal","Mick","Mickey","Micky","Mike","Mikey","Milburn","Miles","Milford","Millard","Miller","Milo","Milton","Mitch","Mitchell","Mo","Moe","Monday","Monroe","Montague","Montana","Monte","Montgomery","Monty","Morgan","Morley","Morris","Mort","Mortimer","Morton","Morty","Moses","Moss","Munro","Munroe","Murphy","Murray","Myles","Myron","Napier","Napoleon","Nash","Nat","Nate","Nathan","Nathaniel","Navy","Neal","Ned","Neely","Neil","Nelson","Nevada","Nevil","Neville","Newt","Newton","Nic","Nicholas","Nick","Nickolas","Nicky","Nigel","Nigellus","Nik","Nikolas","Niles","Nixon","Noah","Noble","Noel","Nolan","Norbert","Norm","Norman","Norris","Norton","Norwood","Nowell","Oakley","Ocean","Odell","Odin","Ogden","Oli","Oliver","Ollie","Olly","Omar","Onyx","Ora","Oral","Ormond","Ormonde","Orrell","Orson","Orval","Orville","Osbert","Osborn","Osborne","Osbourne","Oscar","Osmond","Ossie","Oswald","Oswin","Otis","Otto","Owen","Oz","Ozzie","Ozzy","Pace","Pacey","Paden","Page","Paget","Palmer","Pancras","Parker","Parris","Parry","Pat","Patrick","Patsy","Patton","Paul","Paulie","Paxton","Payton","Pearce","Peers","Pepper","Perce","Percival","Percy","Peregrine","Perry","Pete","Peter","Peyton","Phil","Philander","Philip","Phillip","Phoenix","Pierce","Piers","Pip","Placid","Porter","Praise","Presley","Preston","Price","Prince","Princeton","Promise","Prosper","Purdie","Quentin","Quin","Quincey","Quincy","Quinlan","Quinn","Quinten","Quintin","Quinton","Radcliff","Radclyffe","Raeburn","Rafe","Rafferty","Rain","Raine","Raleigh","Ralf","Ralph","Ralphie","Ramsey","Randal","Randall","Randell","Randolf","Randolph","Randy","Ranulph","Raphael","Rastus","Raven","Ray","Raymond","Raymund","Raynard","Rayner","Read","Reagan","Rearden","Red","Redd","Reece","Reed","Jaxon","Jaxson","Jaxton","Jaxtyn","Jaxx","Jaxxon","Jay","Jayce","Jaycee","Jayceon","Jaycob","Jayden","Jaydon","Jaye","Jayme","Jaymes","Jayson","Jeb","Jed","Jeff","Jefferson","Jeffery","Jeffrey","Jeffry","Jem","Jemmy","Jensen","Jenson","Jep","Jepson","Jeptha","Jerald","Jere","Jeremiah","Jeremy","Jericho","Jerold","Jerome","Jerrard","Jerred","Jerrod","Jerrold","Jerry","Jervis","Jess","Jesse","Jessie","Jessy","Jett","Jewel","Jewell","Jez","Jezza","Jim","Jimi","Jimmie","Jimmy","Jo","Joby","Jocelyn","Jody","Joe","Joel","Joey","John","Johnathan","Johnathon","Johnie","Johnnie","Johnny","John","Johnson","Jojo","Jolyon","Jon","Jonah","Jonathan","Jonathon","Jones","Jonny","Jonty","Jools","Jordan","Jordin","Jordon","Joseph","Josey","Josh","Joshua","Josiah","Joss","Joyce","Judd","Jude","Jules","Julian","Julius","July","Julyan","Junior","Justice","Justin","Justy","Kade","Kaden","Kaeden","Kai","Kaiden","Kairo","Kaison","Kaleb","Kal-El","Kam","Kamden","Kameron","Kamryn","Kane","Kaolin","Karl","Karson","Karsyn","Karter","Kasen","Kasey","Kash","Kashton","Kason","Kayce","Kayden","Kaylan","Kaylen","Kaysen","Kayson","Kean","Keane","Keaton","Keefe","Keegan","Kegan","Keiran","Keith","Kelan","Kelcey","Kellan","Kellen","Kelley","Kelly","Kelsey","Kelvin","Kemp","Ken","Kendal","Kendall","Kendrick","Kenelm","Kenith","Kennard","Kennedy","Kenneth","Kennith","Kenny","Kenrick","Kent","Kenton","Kenyon","Kenzie","Kermit","Kerry","Kester","Kev","Kevan","Kevin","Kevyn","Kian","Kiaran","Kiefer","Kieran","Kieron","Kim","Kimball","King","Kingsley","Kingston","Kip","Kipling","Kirby","Kirk","Kit","Klay","Knox","Knute","Koby","Koda","Kodey","Kody","Kohen","Kolby","Kole","Kolton","Konnor","Korbin","Korey","Kory","Kris","Kristopher","Kurt","Kurtis","Kylan","Kyle","Kyler","Kynaston","Kyro","Kyson","Lacey","Lachlan","Lacy","Laird","Lake","Lamar","Lambert","Lamont","Lance","Landen","Landon","Landyn","Lane","Lanford","Langdon","Langston","Lanny","Larrie","Larry","Lauren","Laurence","Laurie","Lavern","Laverne","Lawrence","Lawrie","Lawson","Layne","Layton","Laz","Lee","Lefty","Legacy","Legend","Leigh","Leighton","Leith","Leland","Lemoine","Len","Lenard","Lennie","Lennon","Lennox","Lenny","Lenox","Leo","Leon","Leonard","Leopold","Leroi","Leroy","Les","Lesley","Leslie","Lester","Levi","Lew","Lewin","Lewis","Lex","Leyton","Liam","Lincoln","Linden","Lindon","Lindsay","Lindsey","Lindy","Linford","Link","Linton","Linwood","Lionel","Lloyd","Lockie","Logan","Lon","London","Lonnie","Lonny","Loren","Lorin","Lorn","Lorne","Lorrin","Lou","Emmet","Emmett","Emmitt","Emory","Ennis","Eric","Erick","Erik","Erle","Ern","Ernest","Ernie","Errol","Erskine","Esme","Esmé","Esmond","Esmund","Ethan","Ethelbert","Ethelred","Eugene","Eustace","Evan","Evelyn","Ever","Everard","Everest","Everett","Everette","Everitt","Ewart","Ezekiel","Ezra","Fabian","Farley","Faron","Farrell","Favour","Felix","Fenton","Ferdie","Ferdinand","Ferdy","Finlay","Finley","Finn","Finnegan","Finnley","Fisher","Fitz","Fitzroy","Flanagan","Fletcher","Flick","Flint","Florence","Floyd","Flynn","Ford","Forest","Forrest","Fortune","Foster","Foster","Fox","Fran","Francis","Frank","Frankie","Franklin","Franklyn","Franny","Fraser","Frazier","Fred","Freddie","Freddy","Frederic","Frederick","Fredric","Fredrick","Freeman","Friday","Fulk","Fulke","Fulton","Gabe","Gabriel","Gael","Gage","Gale","Galen","Gallagher","Gareth","Garey","Garfield","Garland","Garnet","Garnett","Garret","Garrett","Garrick","Garry","Garth","Gary","Gavin","Gayelord","Gayle","Gaylord","Gaz","Geffrey","Gene","Geoff","Geoffrey","Geordie","George","Georgie","Gerald","Gerard","Gerrard","Gerry","Gervase","Gib","Gibson","Gideon","Giffard","Gift","Gil","Gilbert","Giles","Gilroy","Gladwin","Gladwyn","Glanville","Glen","Glenn","Goddard","Godfrey","Goodwin","Gord","Gorden","Gordie","Gordon","Gordy","Gore","Grady","Graeme","Graham","Grahame","Grant","Granville","Gray","Graysen","Grayson","Greer","Greg","Gregg","Gregory","Grenville","Gresham","Grey","Greyson","Grier","Griffin","Grosvenor","Grover","Gunner","Gus","Guy","Gyles","Hadley","Hadyn","Hal","Hale","Hall","Hallam","Hamilton","Hammond","Hamnet","Hank","Happy","Harding","Hardy","Harlan","Harland","Harley","Harlow","Harmon","Harold","Harper","Harris","Harrison","Harry","Hartley","Harve","Harvey","Harvie","Haven","Hayden","Haydn","Hayes","Haywood","Haze","Headley","Heath","Hector","Hedley","Henderson","Hendrix","Henry","Herb","Herbert","Herbie","Herman","Hervey","Hewie","Hilary","Hildred","Hiram","Holden","Hollis","Homer","Honor","Horace","Horatio","Houston","Howard","Howie","Hoyt","Hubert","Hudson","Huey","Hugh","Hughie","Hugo","Humbert","Humphrey","Humphry","Hunter","Huxley","Hyram","Hyrum","Ian","Iggy","Ike","Indiana","Indigo","Ingram","Inigo","Innocent","Ira","Irvin","Irvine","Irving","Irwin","Isaac","Isador","Isadore","Isaiah","Isiah","Isidore","Israel","Issac","Issy","Ivan","Ivor","Izaiah","Izzy","Jace","Jacey","Jack","Jackie","Jackson","Jacob","Jade","Jaden","Jadyn","Jae","Jagger","Jai","Jaiden","Jake","James","Jameson","Jamey","Jamie","Jamison","Jared","Jaren","Jarod","Jaron","Jarred","Jarrett","Jarrod","Jarvis","Jase","Jason","Jasper","Jax","Cedar","Cedric","Celestine","Chace","Chad","Chadwick","Chance","Chandler","Channing","Charles","Charley","Charlie","Charlton","Chas","Chase","Chauncey","Chaz","Cherokee","Chesley","Chester","Chet","Chile","Chip","Chris","Christian","Christie","Christmas","Christopher","Christy","Chuck","Chuckie","Chucky","Clair","Clancy","Clarence","Clark","Claud","Claude","Clay","Clayton","Clem","Clement","Cleo","Cletis","Cletus","Cleve","Cleveland","Cliff","Clifford","Clifton","Clint","Clinton","Clive","Clyde","Coby","Codie","Cody","Cohen","Colbert","Colby","Cole","Coleman","Colin","Colin","Collin","Collins","Collyn","Colson","Colt","Colten","Colter","Colton","Connell","Conner","Connie","Connor","Conor","Conrad","Constant","Conway","Cooper","Corbin","Cordell","Corey","Cornelius","Cornell","Cortney","Corwin","Cory","Cosmo","Coty","Courtney","Coy","Craig","Crawford","Cree","Creighton","Crew","Crispian","Crispin","Crofton","Cullen","Curran","Curt","Curtis","Cuthbert","Cy","Cyan","Cyril","Cyrus","Dacre","Dakota","Dale","Daley","Dallas","Dalton","Daly","Damian","Damion","Damon","Dan","Dana","Dane","Daniel","Dannie","Danny","Darby","D'Arcy","Darcy","Darden","Darell","Daren","Darian","Dariel","Darien","Darin","Darion","Darius","Darnell","Darrel","Darrell","Darren","Darrin","Darryl","Darwin","Daryl","Dash","Dashiell","Dave","Davey","David","Davie","Davin","Davis","Davy","Dawson","Dax","Daxton","Dayton","Deacon","Dean","Declan","Dederick","Dee","Deemer","Deforest","Deforrest","Delano","Delbert","Dell","Delmar","Delroy","Den","Dene","Denholm","Denis","Dennis","Denny","Denton","Denver","Denzel","Denzil","Deon","Derby","Derek","Derick","Derren","Derrick","Derryl","Deryck","Des","Desi","Desmond","Devan","Deven","Devereux","Devin","Devon","Devyn","Dewayne","Dewey","Dex","Dexter","Dezi","Dick","Digby","Diggory","Dillan","Dillon","Dion","Dior","Dirk","Dixon","Dolph","Dom","Domenic","Dominic","Dominick","Don","Donald","Donnie","Donny","Donovan","Doran","Dorian","Doug","Douglas","Douglass","Doyle","Drake","Dre","Drew","Driscoll","Driskoll","Drogo","Drummond","Duane","Dudley","Duff","Duke","Duncan","Dunstan","Durward","Dustin","Dusty","Dutch","Dwain","Dwayne","Dwight","Dylan","Dyson","Earl","Earle","Earnest","Easton","Eben","Ebenezer","Ed","Eddie","Eddy","Edgar","Edison","Edmund","Edric","Edward","Edwin","Edwyn","Egbert","Egypt","Eithan","Eldon","Eldred","Eli","Elias","Elihu","Elijah","Eliot","Eliott","Ellery","Ellington","Elliot","Elliott","Ellis","Elmer","Elmo","Elroy","Elsdon","Elton","Elvin","Elvis","Elwin","Elwood","Elwyn","Ely","Emerson","Emery","Emil","Emile","Emmanuel","Emmerson","Aaren","Aaron","Abe","Abel","Abner","Abraham","Abram","Ace","Adair","Adam","Addison","Aden","Adler","Adolph","Adrian","Aidan","Aiden","Al","Alan","Alban","Albert","Albie","Albin","Alden","Aldous","Alec","Alex","Alexander","Alexis","Alf","Alfie","Alfred","Algar","Alger","Algernon","Alijah","Allan","Allen","Allison","Allyn","Alonzo","Aloysius","Alpha","Alphonso","Alphonzo","Alton","Alva","Alvin","Ambrose","Amery","Amias","Amos","Amyas","Anderson","Andie","Andre","Andrew","Andy","Angel","Angus","Ansel","Anselm","Anson","Anthony","Anton","Antony","Archer","Archibald","Archie","Arden","Aric","Ariel","Arin","Arlen","Arlie","Arlo","Armani","Arn","Arnie","Arnold","Arron","Art","Arthur","Artie","Arvel","Ash","Asher","Ashley","Ashton","Ashtyn","Aster","Aston","Astor","Athelstan","Aubrey","Audie","Audley","August","Augustine","Austen","Austin","Auston","Austyn","Averill","Avery","Axel","Axl","Aydan","Ayden","Aylmer","Azure","Babe","Bailey","Baker","Baldric","Baldwin","Balfour","Banks","Barclay","Barnabas","Barnaby","Barney","Barret","Barrett","Barrie","Barry","Bart","Bartholomew","Basil","Baxter","Bayley","Baylor","Baz","Bazza","Bear","Beau","Beauden","Beaumont","Beauregard","Beck","Beckett","Beckham","Bellamy","Ben","Benedict","Benj","Benjamin","Benji","Benjy","Bennett","Bennie","Benny","Benson","Bentley","Benton","Bernard","Bernie","Berny","Berry","Bert","Bertie","Bertram","Bertrand","Bevan","Beverly","Bevis","Biff","Bill","Billie","Billy","Bishop","Blaine","Blair","Blake","Blaze","Blessing","Blue","Blythe","Bob","Bobbie","Bobby","Bodhi","Bodie","Boniface","Booker","Boone","Boston","Bowen","Bowie","Boyce","Boyd","Brad","Braden","Bradford","Bradley","Brady","Braeden","Braiden","Braidy","Braith","Bram","Brand","Branden","Brandon","Brandt","Brannon","Branson","Brant","Brantley","Braxton","Brayden","Braylen","Braylon","Brendan","Brenden","Brendon","Brennan","Brent","Brenton","Bret","Brett","Brian","Briar","Brice","Bridger","Briggs","Brigham","Brion","Briscoe","Britton","Brock","Brodie","Brody","Bronson","Bronte","Brook","Brooklyn","Brooks","Bruce","Bryan","Bryant","Bryce","Brycen","Bryn","Bryon","Bryson","Buck","Bud","Buddy","Bugsy","Burke","Burt","Burton","Buster","Buzz","Byrne","Byron","Bysshe","Cade","Caden","Caelan","Caiden","Cairo","Cal","Cale","Caleb","Callahan","Callan","Calvin","Cam","Camden","Cameron","Campbell","Camron","Camryn","Cannon","Carey","Carl","Carleton","Carlisle","Carlton","Carlyle","Carol","Carrol","Carson","Carter","Carver","Cary","Case","Casey","Cash","Casimir","Cason","Cass","Cassidy","Cat","Cavan","Cayden","Cayson","Cecil"];

    // 从列表中随机选择一个元素
    var randomIndex = Math.floor(Math.random() * items.length);
    var randomItem = items[randomIndex];

    // 将随机选择的元素显示在页面上
    document.getElementById("password").value = randomItem;
}
function getFemaleName() {
    // 定义一个字符串列表
    var items = ["Unique","Unity","Ursella","Ursula","Val","Valarie","Valary","Vale","Valerie","Valorie","Vanessa","Velda","Velma","Velvet","Venetia","Vera","Verity","Verna","Veronica","Vi","Vianne","Vic","Vicki","Vickie","Vicky","Victoria","Vienna","Vikki","Vinnie","Viola","Violet","Viona","Virgee","Virgie","Virginia","Vivian","Viviette","Vivyan","Vonda","Wallis","Wanda","Waverly","Wenda","Wendi","Wendy","Wenona","Whitney","Wilda","Wilfreda","Wilhelmina","Willa","Willie","Willow","Wilma","Windsor","Winifred","Winnie","Winnifred","Winona","Winter","Wisdom","Wisteria","Wren","Wrenlee","Wrenley","Wynona","Wynonna","Wynter","Xanthia","Xavia","Xaviera","Yancy","Yasmin","Yasmine","Yazmin","Yolanda","Yolonda","Yvette","Yvonne","Zandra","Zanna","Zara","Zaria","Zariah","Zavanna","Zavia","Zelda","Zella","Zelma","Zena","Zenia","Zinnia","Zoe","Zoë","Zoey","Zoie","Zola","Zowie","Zula","Scout","Seanna","Sela","Selby","Selina","Selma","September","Sequoia","Sera","Seraphina","Serena","Serenity","Serina","Serrena","Seven","Sevyn","Shae","Shaelyn","Shana","Shanae","Shanelle","Shanene","Shania","Shanna","Shannah","Shannen","Shannon","Shanon","Shantae","Shantel","Shantelle","Sharalyn","Shari","Sharise","Sharla","Sharleen","Sharlene","Sharmaine","Sharon","Sharona","Sharron","Sharyl","Sharyn","Shauna","Shavon","Shavonne","Shawn","Shawna","Shawnda","Shawnee","Shaye","Shayla","Shaylyn","Sheelagh","Sheena","Sheila","Shelagh","Shelby","Shelia","Shell","Shelley","Shelly","Shena","Sheree","Sheri","Sheridan","Sherie","Sherill","Sherilyn","Sherisse","Sherley","Sherlyn","Sherri","Sherrie","Sherry","Sheryl","Sheryll","Shevaun","Shevon","Shirlee","Shirley","Shonda","Shyla","Sibyl","Sidney","Sidony","Siena","Sienna","Sierra","Sigourney","Silver","Silvia","Simone","Simonette","Sinclair","Sindy","Sissie","Sissy","Sky","Skye","Skyla","Skylar","Skyler","Skylynn","Sloan","Sloane","Snow","Sommer","Sondra","Sonia","Sonya","Sookie","Sophia","Sophie","Sophy","Sorrel","Sparrow","Spirit","Spring","Stace","Stacee","Stacey","Staci","Stacia","Stacie","Stacy","Star","Starla","Starr","Stefani","Stella","Steph","Stephani","Stephania","Stephanie","Stephany","Stevie","Storm","Stormi","Stormy","Sue","Suellen","Suki","Sukie","Summer","Sunday","Sunny","Sunshine","Susan","Susanna","Susanne","Susie","Sutton","Suz","Suzan","Suzanna","Suzanne","Suzi","Suzie","Suzy","Sybella","Sybil","Syd","Sydne","Sydnee","Sydney","Sydnie","Sylvia","Symphony","Tabatha","Tabby","Tabitha","Tacey","Taegan","Tahlia","Tahnee","Talia","Tallulah","Tamara","Tameka","Tamela","Tamera","Tami","Tamika","Tammara","Tammi","Tammie","Tammy","Tamra","Tamsen","Tamsin","Tamsyn","Tamzen","Tania","Tansy","Tanya","Tanzi","Tara","Tarah","Tarina","Taryn","Tasha","Tatiana","Tatianna","Tatum","Tatyanna","Tawnee","Tawnie","Tawny","Tawnya","Tayla","Tayler","Taylor","Teagan","Teal","Teale","Teddie","Tegan","Temperance","Tempest","Temple","Tenley","Tera","Teresa","Teri","Terra","Terri","Terrie","Terry","Terry","Tess","Tessa","Tessie","Tetty","Thankful","Thea","Thelma","Theodora","Theresa","Therese","Thomasina","Tia","Tiana","Tianna","Tiara","Tibby","Tiffani","Tiffany","Tiffiny","Tigerlily","Tilda","Tillie","Tilly","Timotha","Tina","Tisha","Titty","Toby","Tommie","Toni","Tonia","Tonya","Topaz","Topsy","Tori","Toria","Tory","Tottie","Totty","Tracee","Tracey","Traci","Tracie","Tracy","Treasure","Trecia","Tresha","Tressa","Tria","Tricia","Trina","Trinity","Trish","Trisha","Trista","Tristen","Tristin","Trix","Trixie","Trudi","Trudie","Trudy","Tuesday","Twila","Twyla","Tyla","Tyra","Ulyssa","Una","Unice","Ora","Oralee","Oralie","Orinda","Orpha","Ottoline","Pacey","Page","Paget","Paige","Paislee","Paisley","Paityn","Palmer","Pam","Pamela","Pamelia","Pamella","Pamila","Pansy","Parker","Parnel","Parris","Pat","Patience","Patrice","Patricia","Patsy","Patti","Pattie","Patty","Paula","Pauleen","Paulene","Pauletta","Paulette","Paulina","Pauline","Payton","Peace","Pearl","Pearle","Pearlie","Peg","Peggie","Peggy","Pen","Pene","Penelope","Penny","Peony","Pepper","Perlie","Permelia","Pernel","Peronel","Peta","Petal","Petra","Petrina","Petronel","Petula","Petunia","Peyton","Phebe","Phemie","Pheobe","Philadelphia","Philipa","Philippa","Philis","Phillida","Phillipa","Phillis","Philomena","Phoebe","Phoenix","Phyliss","Phyllida","Phyllis","Piety","Pip","Piper","Pippa","Pleasance","Pollie","Polly","Poppy","Porsche","Portia","Posie","Posy","Praise","Precious","Presley","Primrose","Primula","Princess","Pris","Priscilla","Prissy","Promise","Pru","Prudence","Prue","Prunella","Purdie","Queen","Queenie","Quin","Quinlan","Quinn","Quintella","Rachael","Racheal","Rachel","Rachelle","Rachyl","Racquel","Rae","Raegan","Raelene","Raelyn","Raelynn","Raewyn","Rain","Rainbow","Raine","Raleigh","Ramona","Randi","Randy","Raquel","Raschelle","Raven","Ravenna","Raylene","Reagan","Reanna","Reannon","Reba","Rebecca","Rebeccah","Rebeccanne","Rebeckah","Rebekah","Reene","Reenie","Reese","Regan","Regana","Regena","Regina","Reign","Reilly","Remington","Remy","Rena","Renae","Rene","Renee","Renie","Renita","Retha","Reverie","Rexana","Rexanne","Rheanna","Rhetta","Rhianna","Rhiannon","Rhoda","Rhonda","Riannon","Rica","Richardine","Richelle","Richmal","Ricki","Ridley","Rikki","Riley","Rilla","Ripley","Rita","River","Robbie","Robena","Roberta","Robin","Robina","Robyn","Robynne","Rochelle","Romaine","Romayne","Romey","Romilly","Romy","Rona","Ronda","Roni","Ronnette","Ronnie","Rorie","Rory","Ros","Rosa","Rosabel","Rosabella","Rosalee","Rosaleen","Rosalie","Rosalin","Rosalind","Rosaline","Rosalyn","Rosalynne","Rosamond","Rosamund","Rosanna","Rosannah","Rosanne","Rose","Roseann","Roseanne","Roselyn","Rosemarie","Rosemary","Rosie","Roslyn","Rosy","Rowan","Rowanne","Rowena","Rowina","Roxana","Roxane","Roxanna","Roxanne","Roxie","Roxy","Royal","Royale","Royalty","Roz","Rozanne","Ruby","Rubye","Rue","Ruth","Ruthie","Ryana","Ryann","Ryanne","Rylee","Ryleigh","Ryley","Rylie","Sabella","Sable","Sabrina","Sabryna","Sadie","Saffron","Sage","Saige","Sal","Salem","Salena","Salina","Sallie","Sally","Salome","Sam","Samantha","Samara","Sammi","Sammie","Sammy","Sandie","Sandra","Sandy","Santana","Sapphire","Sara","Sarah","Saranna","Sarina","Sasha","Saundra","Savanna","Savannah","Sawyer","Saylor","Scarlet","Scarlett","Scarlette","Schuyler","Scottie","Magdalene","Maggie","Magnolia","Mahala","Mahalia","Maisie","Maisy","Maitland","Makayla","Makenna","Makenzie","Malandra","Malani","Malaysia","Maleah","Malia","Malinda","Maliyah","Mallory","Malone","Malvina","Mamie","Mandi","Mandy","Maple","Maralyn","Marcelyn","Marci","Marcia","Marcie","Marcy","Maree","Margaret","Margaretta","Marge","Margery","Margie","Margo","Margret","Maria","Mariabella","Mariah","Marian","Marianna","Marianne","Marie","Mariel","Marigold","Marilla","Marilou","Marilyn","Marilynn","Marina","Marinda","Marion","Maris","Marisa","Marissa","Marje","Marjorie","Marjory","Marla","Marlee","Marleen","Marlena","Marlene","Marley","Marlowe","Marly","Marlyn","Marni","Marnie","Marsha","Martha","Martie","Martina","Marva","Marvel","Mary","Mary","Maryann","Mary","Maryanne","Marybelle","Mary","Marybeth","Mary","Mary","Mary","Marylou","Marylu","Marylyn","Mathilda","Matilda","Mattie","Maud","Maude","Maudie","Maura","Maureen","Maurene","Maurie","Maurine","Mavis","Maxene","Maxie","Maxine","May","Maya","Maybelle","Maybelline","Mayme","Mckayla","McKenna","McKenzie","McKinley","Meade","Meadow","Meagan","Meaghan","Meg","Megan","Meghan","Mel","Melanie","Melantha","Melany","Melba","Melesina","Melicent","Melina","Melinda","Melissa","Mellony","Melody","Melva","Melyssa","Mercia","Mercy","Meredith","Merideth","Meridith","Meriel","Merilyn","Merla","Merle","Merletta","Merlyn","Merrilyn","Merrion","Merritt","Merry","Meryl","Mia","Mica","Michaela","Michayla","Michele","Michelle","Michelyne","Mickey","Midge","Mikayla","Mikhaila","Mikki","Milani","Mildred","Miley","Miller","Millicent","Millie","Milly","Mimi","Mina","Mindy","Minerva","Minnie","Minta","Minty","Mirabelle","Miracle","Miranda","Miriam","Missie","Missy","Misti","Misty","Mo","Modesty","Moira","Mollie","Molly","Mona","Monday","Monica","Monique","Monna","Monroe","Montana","Mora","Moreen","Morgan","Morgana","Moriah","Mozelle","Muriel","Murphy","Mya","Myla","Mylah","Myra","Myranda","Myrna","Myrtie","Myrtle","Mysie","Nadia","Nadine","Nan","Nance","Nancy","Nanette","Nannie","Nanny","Naomi","Narelle","Nat","Natalee","Natalia","Natalie","Natasha","Natille","Navy","Neely","Nelda","Nell","Nelle","Nellie","Nelly","Nena","Ness","Nessa","Netta","Nettie","Neva","Nevada","Nevaeh","Nia","Nichola","Nichole","Nicki","Nicky","Nicola","Nicole","Nigella","Niki","Nikki","Nikkole","Nikole","Nina","Nita","Noel","Noelene","Noelle","Nola","Nona","Nonie","Nora","Norah","Noreen","Norene","Norma","Normina","Nova","Novalee","Nyah","Nydia","Nyla","Nylah","Nyree","Oaklee","Oakleigh","Oakley","Oaklyn","Oaklynn","Ocean","Octavia","October","Odelia","Odell","Odetta","Olive","Olivia","Ollie","Olyvia","Oneida","Onyx","Opal","Opaline","Ophelia","Kiersten","Kiki","Kiley","Kilie","Kim","Kimber","Kimberlee","Kimberleigh","Kimberley","Kimberly","Kimberlyn","Kimbra","Kimmie","Kimmy","Kinley","Kinsey","Kinslee","Kinsley","Kira","Kirby","Kirrily","Kirsten","Kit","Kitty","Kizzie","Kizzy","Kolleen","Kori","Korrine","Kortney","Kourtney","Kris","Krista","Kristal","Kristeen","Kristen","Kristi","Kristia","Kristie","Kristin","Kristina","Kristine","Kristy","Krystal","Krystelle","Krysten","Krystina","Krystine","Krystle","Kyla","Kylee","Kyleigh","Kylie","Kym","Kyra","Kyrie","Kyrsten","Lacey","Laci","Lacie","Lacy","Laila","Lainey","Lake","Lalia","Lallie","Lally","Lana","Laney","Lara","Laraine","Larissa","Lark","Laryn","Laura","Lauraine","Laureen","Laurel","Laurelle","Lauren","Laurena","Laurencia","Laurene","Lauressa","Laurie","Laurinda","Laurissa","Lauryn","Lavena","Lavender","Lavern","Laverne","Lavina","Lavone","Lavonne","Layla","Leah","Leann","Leanna","Leanne","Leanora","Leatrice","Lecia","Lee","Leeann","Leesa","Legacy","Leigh","Leighton","Leila","Leilah","Leith","Lela","Lena","Lennie","Lennon","Lennox","Lenora","Lenore","Leola","Leona","Leone","Leontyne","Lesia","Lesleigh","Lesley","Leslie","Lesly","Lessie","Leta","Letha","Letitia","Lettice","Lettie","Letty","Lexa","Lexi","Lexia","Lexie","Lexine","Lexus","Lexy","Leyla","Liana","Lianne","Libbie","Libby","Liberty","Liddy","Lila","Lilac","Lilah","Lilian","Liliana","Lilianna","Lilibet","Lilibeth","Lillia","Lillian","Lilliana","Lillie","Lilly","Lily","Lilyrose","Lina","Linda","Linden","Lindsay","Lindsey","Lindsie","Lindy","Linette","Linnaea","Linnet","Linnette","Linnie","Linsay","Linsey","Linzi","Lisa","Lise","Lisette","Lisha","Lissa","Lita","Liv","Livia","Livvy","Livy","Liz","Liza","Lizbeth","Lizette","Lizzie","Lizzy","Logan","Lois","Lola","Lolicia","London","Londyn","Lora","Loraine","Lorainne","Lorayne","Loreen","Lorelai","Lorelei","Lorelle","Loren","Lorena","Lorene","Loretta","Lori","Lorie","Lorin","Lorinda","Lorine","Lorna","Lorraine","Lorri","Lorrie","Lorrin","Lottie","Lotus","Lou","Louella","Louisa","Louise","Love","Loyalty","Luana","Luann","Luanna","Luanne","Lucia","Lucile","Lucille","Lucinda","Lucy","Luella","Lula","Lulu","Luna","Luvenia","Luvinia","Lyda","Lydia","Lyla","Lylah","Lyn","Lynda","Lyndi","Lyndsay","Lyndsea","Lyndsey","Lynette","Lynn","Lynna","Lynne","Lynnette","Lynsay","Lynsey","Lyric","Lysette","Lyssa","Mabel","Mabella","Mabelle","Mable","Macey","Maci","Macie","Mackenzie","Macy","Madalyn","Maddie","Maddison","Maddy","Madelaine","Madeleine","Madelina","Madeline","Madelyn","Madelynn","Madge","Madi","Madilyn","Madilynn","Madison","Madisyn","Madlyn","Madoline","Madonna","Madyson","Mae","Maegan","Maeghan","Magdalen","Magdalena","Jannah","Jannette","Jannine","January","Jaqueline","Jaquelyn","Jaslene","Jaslyn","Jasmin","Jasmine","Jasmyn","Jaycee","Jayda","Jayde","Jayden","Jaye","Jayla","Jaylah","Jaylee","Jayleen","Jaylen","Jaylene","Jaylin","Jaylyn","Jaylynn","Jayma","Jayme","Jayna","Jayne","Jaynie","Jazlyn","Jazmin","Jazmine","Jazmyn","Jean","Jeana","Jeane","Jeanette","Jeanie","Jeanine","Jeanna","Jeanne","Jeannette","Jeannie","Jeannine","Jemima","Jemma","Jen","Jena","Jenae","Jenelle","Jenessa","Jeni","Jenifer","Jenn","Jenna","Jenni","Jennica","Jennie","Jennifer","Jenny","Jeri","Jerilyn","Jerri","Jerrie","Jerry","Jess","Jessa","Jessalyn","Jessamine","Jessamyn","Jessi","Jessica","Jessie","Jessika","Jessy","Jessye","Jewel","Jewell","Jill","Jillian","Jillie","Jilly","Jimmie","Jinny","Jo","Joan","Joandra","Joanie","Joann","Joanna","Jo-Anne","Joanne","JoBeth","Jocelin","Jocelyn","Jodene","Jodi","Jodie","Jody","Joella","Joelle","Joetta","Joey","Johanna","Johna","Johnie","Johnna","Johnnie","Joi","Joisse","Jojo","Joleen","Jolene","Jolie","Joline","Jonelle","Jonette","Joni","Jonie","Jonquil","Jools","Jordan","Jordana","Jordin","Jordyn","Jorie","Jorja","Josceline","Joselyn","Josepha","Josephina","Josephine","Josie","Joslyn","Joss","Josslyn","Journee","Journey","Journi","Joy","Joyce","Joye","Jream","Jude","Judi","Judie","Judith","Judy","Jules","Julia","Juliana","Julianna","Julianne","Julie","Juliet","July","June","Juniper","Justice","Justina","Justine","Justy","Kacey","Kacie","Kadence","Kae","Kaelea","Kaelee","Kaelyn","Kaety","Kaila","Kailee","Kailey","Kailyn","Kaitlin","Kaitlyn","Kaitlynn","Kaleigh","Kaley","Kali","Kalie","Kalla","Kallie","Kalyn","Kalysta","Kam","Kameron","Kamryn","Kandace","Kandi","Kara","Karaugh","Karen","Karena","Karina","Karissa","Karlee","Karlene","Karly","Karol","Karolyn","Karrie","Karsyn","Karyn","Kasandra","Kasey","Kassandra","Kassia","Kassidy","Kassie","Kassy","Kat","Kate","Katee","Katelin","Katelyn","Katelynn","Katey","Katharine","Katharyn","Katherina","Katherine","Katheryn","Katheryne","Kathi","Kathie","Kathleen","Kathlyn","Kathryn","Kathy","Katie","Katlyn","Katrina","Katy","Kay","Kaya","Kayce","Kaycee","Kayden","Kaydence","Kaye","Kayla","Kaylan","Kaylani","Kayleah","Kaylee","Kayleen","Kayleigh","Kaylen","Kayley","Kaylie","Kaylin","Kayly","Kaylyn","Kaylynn","Keanna","Keara","Keeleigh","Keeley","Keely","Kehlani","Keighley","Keila","Keira","Keitha","Kelcey","Kelda","Kelia","Kelleigh","Kelley","Kelli","Kellie","Kelly","Kelsea","Kelsey","Kelsi","Kelsie","Kendal","Kendall","Kendra","Kennedi","Kennedy","Kensley","Kenya","Kenzie","Kerena","Keri","Kerri","Kerrie","Kerry","Kestrel","Kevyn","Khloe","Kiana","Kianna","Kiara","Kiarra","Kiera","Kierra","Eulalia","Eunice","Euphemia","Eustacia","Eva","Evaline","Evalyn","Evangelina","Evangeline","Eve","Eveleen","Evelina","Eveline","Evelyn","Evelynn","Ever","Everest","Everlee","Everleigh","Everly","Evette","Evie","Evonne","Evvie","Fae","Faith","Faithe","Fallon","Fancy","Fannie","Fanny","Favour","Fawn","Fay","Faye","Felecia","Felicia","Felicity","Felisha","Femie","Fern","Ferne","Finley","Fiona","Flannery","Fleur","Fleurette","Flick","Flo","Floella","Flora","Florence","Floretta","Florrie","Florry","Flossie","Flower","Fortune","Fran","Francene","Frances","Francine","Francis","Frankie","Frannie","Franny","Freda","Freddie","Frederica","Freida","Freya","Frieda","Frona","Gabby","Gabriella","Gabrielle","Gaby","Gae","Gail","Gaila","Gale","Galilea","Gardenia","Garnet","Garnet","Garnett","Garnette","Gay","Gaye","Gayla","Gayle","Gaynor","Geena","Gemma","Gena","Genesis","Genette","Geneva","Genevieve","Genie","Georgeanna","Georgene","Georgetta","Georgia","Georgiana","Georgianna","Georgie","Georgina","Geraldine","Geralyn","Geri","Gerri","Gerry","Gertie","Gertrude","Giana","Gianna","Gift","Gifty","Gill","Gillian","Gina","Ginger","Ginnie","Ginny","Giselle","Gisselle","Githa","Gladys","Glenda","Glenna","Gloria","Gloriana","Glory","Goldie","Grace","Gracelyn","Gracelynn","Gracie","Gray","Greer","Greta","Gretchen","Gretta","Grey","Grier","Griselda","Gussie","Gwen","Gwenda","Gwendoline","Gwendolyn","Gwenevere","Gwyneth","Gypsy","Gytha","Hadley","Hadyn","Hailee","Hailey","Hailie","Haleigh","Haley","Halle","Hallie","Halo","Hannah","Happy","Harlee","Harleigh","Harley","Harlow","Harmonie","Harmony","Harper","Harriet","Harriett","Harrietta","Harriette","Hartley","Hattie","Hatty","Haven","Hayden","Haylee","Hayleigh","Hayley","Haylie","Haze","Hazel","Heather","Heaven","Heavenly","Heidi","Helen","Helena","Hellen","Henrietta","Hepsie","Hester","Hettie","Hilary","Hilda","Hildred","Hillary","Hollie","Hollis","Holly","Honey","Honor","Honora","Honour","Hope","Hortense","Hunter","Hyacinth","Hylda","Ibbie","Ida","Idella","Idelle","Idonea","Idony","Ilean","Ileen","Ilene","Imogen","Imogene","Ina","India","Indiana","Indie","Indigo","Indy","Inez","Iola","Iona","Ione","Ireland","Irene","Iris","Irma","Isabel","Isabella","Isabelle","Isadora","Isbel","Isebella","Isidora","Isla","Issy","Ivy","Izabelle","Izzy","Jacey","Jaci","Jacinda","Jacinth","Jackalyn","Jacki","Jackie","Jacklyn","Jaclyn","Jacqueline","Jacquelyn","Jacquetta","Jacqui","Jada","Jade","Jaden","Jadyn","Jae","Jaida","Jaiden","Jaime","Jaimie","Jaki","Jakki","Jamey","Jami","Jamie","2-Jan","Janae","Jane","Janeka","Janel","Janele","Janella","Janelle","Janene","Janessa","Janet","Janetta","Janette","Janey","Janice","Janie","Janine","Janis","Janna","Collyn","Columbine","Comfort","Connie","Constance","Cora","Coral","Cordelia","Coreen","Coretta","Cori","Coriander","Corie","Corina","Corinna","Corinne","Cornelia","Corrie","Corrina","Corrine","Cortney","Corynn","Courteney","Courtney","Cree","Cristen","Crystal","Cyan","Cybill","Cydney","Cymone","Cyndi","Cynthia","Cyrilla","Daffodil","Dahlia","Daisy","Dakota","Dale","Daley","Dallas","Daly","Dana","Danette","Dani","Danica","Daniela","Daniella","Danielle","Danika","Danita","Danna","Danni","Dannie","Daphne","Darby","Darcey","Darcie","D'Arcy","Darcy","Daria","Darian","Darla","Darleen","Darlene","Davena","Davida","Davina","Davinia","Dawn","Dayna","Deana","Deanna","Deanne","Deb","Debbi","Debbie","Debby","Debi","Deborah","Debra","Dee","Deeann","Deedee","Deena","Deidra","Deidre","Deirdre","Deitra","Delaney","Delia","Delia","Delice","Delicia","Delight","Delilah","Dell","Della","Delma","Delora","Delores","Deloris","Delphia","Delta","Demelza","Demetria","Demi","Dena","Dene","Denice","Denise","Deonne","Derby","Desi","Desirae","Desiree","Destinee","Destiny","Detta","Devan","Devin","Devon","Devyn","Dezi","Deziree","Di","Diamond","Diana","Diane","Diann","Dianna","Dianne","Diantha","Dina","Dinah","Dione","Dionne","Dior","Dixie","Docia","Dodie","Dollie","Dolly","Dolores","Dominica","Dona","Donelle","Donna","Dora","Dorean","Doreen","Doretta","Doria","Dorinda","Dorine","Doris","Dorothea","Dorothy","Dorris","Dortha","Dorthy","Dory","Dot","Dottie","Dotty","Dove","Drea","Dream","Dreda","Drina","Duana","Dulcibella","Dulcie","Dusty","Dyan","Earleen","Earlene","Earline","Earnestine","Eartha","Easter","Ebba","Eddie","Eden","Edie","Edith","Editha","Edna","Edweena","Edwena","Edwina","Edwyna","Edytha","Edythe","Effie","Eglantine","Egypt","Eileen","Eireen","Elaina","Elaine","Elea","Eleanor","Eleanora","Eleanore","Elena","Elenora","Elfleda","Elfreda","Elfrida","Elfrieda","Eliana","Elianna","Elicia","Elinor","Elisa","Elisabeth","Elise","Elissa","Eliza","Elizabeth","Ella","Ella","Elle","Ellen","Ellery","Elliana","Ellie","Ellington","Ellis","Elly","Elma","Elnora","Elodie","Eloise","Elora","Elouise","Elsa","Elsabeth","Elsie","Elvina","Elyse","Elyzabeth","Em","Emalee","Ember","Emberly","Emelia","Emely","Emerald","Emerie","Emerson","Emersyn","Emery","Emilee","Emilia","Emily","Emma","Emmaline","Emmalyn","Emmeline","Emmerson","Emmie","Emmy","Emmylou","Emory","Enid","Enola","Epiphany","Eppie","Erica","Ericka","Erika","Erin","Erma","Ermintrude","Ernestine","Erykah","Eryn","Esmae","Esmaralda","Esme","Esmé","Esmée","Esmee","Esmeralda","Essence","Essie","Esta","Estella","Estelle","Esther","Ethel","Ethelinda","Ethelyn","Etta","Ettie","Eugenia","Eugenie","Eula","Berny","Berry","Bertha","Bertie","Bertina","Beryl","Bess","Bessie","Beth","Bethanie","Bethany","Bethel","Bethney","Betony","Betsy","Bette","Bettie","Betty","Bettye","Beulah","Bev","Beverley","Beverly","Biddy","Billie","Bindy","Birdie","Blair","Blaire","Blake","Blakely","Blanch","Blanche","Blessing","Blondie","Blossom","Blue","Blythe","Bobbi","Bobbie","Bonita","Bonnie","Bowie","Braelyn","Braelynn","Braidy","Branda","Brande","Brandee","Brandi","Brandie","Brandy","Breana","Breann","Breanna","Breanne","Bree","Brenda","Brenna","Bria","Briana","Brianna","Brianne","Briar","Bridget","Bridgette","Brie","Briella","Brielle","Briley","Brinley","Briony","Bristol","Britannia","Britney","Brittani","Brittania","Brittany","Brittney","Brittni","Brittny","Bronte","Bronwyn","Brook","Brooke","Brooklyn","Brooklynn","Bryana","Bryanna","Bryanne","Brylee","Bryn","Brynlee","Brynn","Brynne","Bryony","Buffy","Bunny","Burgundy","Cadence","Caelie","Caetlin","Caileigh","Cailin","Cailyn","Caitlin","Caitlyn","Calanthe","Calanthia","Caleigh","Cali","Calista","Calla","Calleigh","Callie","Callista","Cam","Camellia","Cameron","Camilla","Camille","Cammie","Campbell","Camryn","Candace","Candi","Candice","Candida","Candis","Candy","Candyce","Capri","Caprice","Capricia","Cara","Careen","Caren","Carey","Cari","Carina","Caris","Carissa","Carla","Carlene","Carley","Carlie","Carlisa","Carlisle","Carly","Carlyn","Carmel","Carmella","Carmen","Carol","Carolann","Carolina","Caroline","Carolyn","Carreen","Carrie","Carrol","Carry","Carson","Cary","Caryl","Caryn","Casey","Cass","Cassandra","Cassarah","Cassidy","Cassie","Cassy","Cat","Cate","Catharine","Catherin","Catherina","Catherine","Cathleen","Cathryn","Cathy","Cayla","Caylee","Cayley","Ceara","Cearra","Cece","Cecelia","Cecilia","Cecily","Cedar","Celandine","Celeste","Celestine","Celia","Celinda","Celine","Chalice","Chandler","Chanel","Chanelle","Channing","Chantal","Chanté","Chantel","Chantelle","Charisma","Charissa","Charisse","Charity","Charla","Charlee","Charleen","Charleigh","Charlene","Charley","Charli","Charlie","Charlotte","Charmaine","Charnette","Chasity","Chastity","Chelle","Chelsea","Chelsey","Chelsie","Cher","Cherette","Cheri","Cherice","Cherie","Cherilyn","Cherise","Cherish","Cherokee","Cherry","Cherryl","Cheryl","Chesley","Chevonne","Cheyanne","Cheyenne","China","Chloe","Chloë","Chris","Chrissie","Chrissy","Christa","Christabel","Christabella","Christabelle","Christal","Christen","Christi","Christiana","Christie","Christina","Christine","Christmas","Christobel","Christy","Chrysanta","Chrystal","Chyna","Ciara","Cicely","Ciera","Cierra","Cinda","Cindi","Cindra","Cindy","Cissy","Claire","Clancy","Clara","Clare","Clarette","Claribel","Clarice","Clarinda","Clarissa","Clarity","Claudia","Clematis","Clemence","Clemency","Clementine","Cleo","Clotilda","Clover","Coby","Codie","Coleen","Colene","Colleen","Collins","Aaliyah","Aaralyn","Aaren","Abbey","Abbi","Abbie","Abby","Abegail","Abi","Abigail","Abigale","Abigayle","Abilene","Acacia","Ada","Adair","Adaline","Adalyn","Adalynn","Adamina","Addie","Addilyn","Addison","Addy","Addyson","Adela","Adelaide","Adele","Adelia","Adeline","Adella","Adelle","Adelyn","Adelynn","Adena","Adria","Adriana","Adrianna","Adrianne","Adrienne","Agatha","Aggie","Agnes","Aileen","Aimee","Ainslee","Ainsley","Ainslie","Alaia","Alaina","Alaiya","Alana","Alani","Alanis","Alanna","Alannah","Alannis","Alaya","Alayah","Alayna","Alberta","Alea","Aleah","Alease","Alecia","Aleesha","Alene","Alesha","Alesia","Aleta","Aletha","Alethea","Alex","Alexa","Alexandra","Alexandrea","Alexandria","Alexandrina","Alexia","Alexina","Alexis","Alexus","Alfreda","Ali","Aliah","Alice","Alicia","Aline","Alise","Alisha","Alishia","Alisia","Alison","Alissa","Alisya","Alita","Alivia","Allana","Allannah","Allegra","Allie","Allison","Allissa","Ally","Allycia","Allyn","Allyson","Alma","Alora","Alpha","Alvena","Alvina","Alyce","Alycia","Alys","Alysa","Alyse","Alysha","Alysia","Alyson","Alyssa","Alyssia","Alyx","Amabel","Amanda","Amaya","Amayah","Amber","Amberly","Amberlynn","Ambrosine","Amelia","America","Amery","Amethyst","Ami","Amie","Amilia","Amity","Amora","Amoura","Amy","Anabella","Anabelle","Anastasia","Anaya","Andi","Andie","Andrea","Andrina","Andy","Anemone","Angel","Angela","Angelia","Angelica","Angelina","Angelle","Angie","Anima","Anise","Anissa","Anita","Anjanette","Anjelica","Ann","Anna","Annabel","Annabella","Annabelle","Annabeth","Annalee","Annalise","Anne","Anneka","Annette","Annice","Annie","Annika","Annis","Annmarie","Annora","Anona","Ansley","Antonette","Antonia","Apple","April","Arabella","Araminta","Ardath","Arden","Ardith","Aretha","Aria","Ariah","Ariana","Arianna","Ariel","Ariella","Arienne","Arin","Ariyah","Arleen","Arlene","Arlie","Arline","Armani","Artie","Aryana","Ash","Ashlea","Ashlee","Ashleigh","Ashley","Ashlie","Ashlyn","Ashlynn","Ashton","Ashtyn","Asia","Aspen","Aspyn","Aster","Aston","Astoria","Astra","Astrid","Athena","Aubree","Aubrey","Aubriana","Aubrianna","Aubrie","Aubrielle","Audie","Audra","Audrea","Audrey","Augusta","Aura","Aureole","Aurora","Austyn","Autumn","Ava","Avah","Avaline","Avalon","Aveline","Averie","Averill","Avery","Aviana","Avianna","Avice","Avis","Avonlea","Avril","Ayla","Azalea","Azaria","Azura","Azure","Babe","Babette","Babs","Bailee","Bailey","Bambi","Barb","Barbara","Barbie","Barbra","Baylee","Bayley","Baylor","Bea","Beatrice","Beatrix","Beau","Becca","Becci","Beck","Becka","Beckah","Becky","Bee","Bekki","Belinda","Bella","Bellamy","Belle","Berenice","Bernadette","Bernadine","Bernetta","Bernice","Bernie","Berniece"];

    // 从列表中随机选择一个元素
    var randomIndex = Math.floor(Math.random() * items.length);
    var randomItem = items[randomIndex];

    // 将随机选择的元素显示在页面上
    document.getElementById("password").value = randomItem;
}

const iso2ToCountry = {
    "AD": "Andorra", "AE": "United Arab Emirates", "AF": "Afghanistan", "AG": "Antigua", "AI": "Anguilla",
             "AL": "Albania", "AM": "Armenia", "AN": "Netherlands Antilles", "AO": "Angola", "AQ": "Antarctica",
             "AR": "Argentina", "AS": "American Samoa", "AT": "Austria", "AU": "Australia", "AW": "Aruba",
             "AX": "Aland Islands", "AZ": "Azerbaijan", "BA": "Bosnia and Herzegovina", "BB": "Barbados",
             "BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BH": "Bahrain",
             "BI": "Burundi", "BJ": "Benin", "BL": "Saint Barthélemy", "BM": "Bermuda", "BN": "Brunei",
             "BO": "Bolivia",
             "BQ": "Bonaire, Sint Eustatius and Saba", "BR": "Brazil", "BS": "The Bahamas", "BT": "Bhutan",
             "BV": "Bouvet Island", "BW": "Botswana", "BY": "Belarus", "BZ": "Belize", "CA": "Canada",
             "CC": "Cocos (Keeling) Islands", "CD": "Democratic Republic of the Congo",
             "CF": "Central African Republic", "CG": "Republic of the Congo", "CH": "Switzerland",
             "CI": "Côte d'Ivoire", "CK": "Cook Islands", "CL": "Chile", "CM": "Cameroon", "CN": "China",
             "CO": "Colombia", "CR": "Costa Rica", "CV": "Cape Verde", "CW": "Curaçao", "CX": "Christmas Island",
             "CY": "Cyprus", "CZ": "Czech Republic", "DE": "Germany", "DJ": "Djibouti", "DK": "Denmark",
             "DM": "Dominica", "DO": "Dominican Republic", "DZ": "Algeria", "EC": "Ecuador", "EE": "Estonia",
             "EG": "Egypt", "EH": "Western Sahara", "ER": "Eritrea", "ES": "Spain", "ET": "Ethiopia",
             "FI": "Finland",
             "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Federated States of Micronesia", "FO": "Faroe Islands",
             "FR": "France", "GA": "Gabon", "GB": "United Kingdom", "GD": "Grenada", "GE": "Georgia",
             "GF": "French Guiana", "GG": "Guernsey", "GH": "Ghana", "GI": "Gibraltar", "GL": "Greenland",
             "GM": "The Gambia", "GN": "Guinea", "GP": "Guadeloupe", "GQ": "Equatorial Guinea", "GR": "Greece",
             "GS": "South Georgia and the South Sandwich Islands", "GT": "Guatemala", "GU": "Guam",
             "GW": "Guinea-Bissau", "GY": "Guyana", "HK": "Hong Kong", "HM": "Heard Island and McDonald Islands",
             "HN": "Honduras", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "ID": "Indonesia", "IE": "Ireland",
             "IL": "Israel", "IM": "Isle Of Man", "IN": "India", "IO": "British Indian Ocean Territory",
             "IQ": "Iraq",
             "IS": "Iceland", "IT": "Italy", "JE": "Jersey", "JM": "Jamaica", "JO": "Jordan", "JP": "Japan",
             "KE": "Kenya", "KG": "Kyrgyzstan", "KH": "Cambodia", "KI": "Kiribati", "KM": "Comoros",
             "KN": "Saint Kitts and Nevis", "KR": "South Korea", "KW": "Kuwait", "KY": "Cayman Islands",
             "KZ": "Kazakhstan", "LA": "Laos", "LB": "Lebanon", "LC": "St. Lucia", "LI": "Liechtenstein",
             "LK": "Sri Lanka", "LR": "Liberia", "LS": "Lesotho", "LT": "Lithuania", "LU": "Luxembourg",
             "LV": "Latvia",
             "LY": "Libya", "MA": "Morocco", "MC": "Monaco", "MD": "Moldova", "ME": "Montenegro",
             "MF": "Saint Martin",
             "MG": "Madagascar", "MH": "Marshall Islands", "MK": "Macedonia", "ML": "Mali", "MM": "Myanmar",
             "MN": "Mongolia", "MO": "Macau", "MP": "Northern Mariana Islands", "MQ": "Martinique",
             "MR": "Mauritania",
             "MS": "Montserrat", "MT": "Malta", "MU": "Mauritius", "MV": "Maldives", "MW": "Malawi", "MX": "Mexico",
             "MY": "Malaysia", "MZ": "Mozambique", "NA": "Namibia", "NC": "New Caledonia", "NE": "Niger",
             "NF": "Norfolk Island", "NG": "Nigeria", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway",
             "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "NZ": "New Zealand", "OM": "Oman", "PA": "Panama",
             "PE": "Peru", "PF": "French Polynesia", "PG": "Papua New Guinea", "PH": "Philippines",
             "PK": "Pakistan",
             "PL": "Poland", "PM": "Saint Pierre and Miquelon", "PN": "Pitcairn", "PR": "Puerto Rico",
             "PS": "Palestine", "PT": "Portugal", "PW": "Palau", "PY": "Paraguay", "QA": "Qatar", "RE": "Reunion",
             "RO": "Romania", "RS": "Serbia", "RU": "Russia", "RW": "Rwanda", "SA": "Saudi Arabia",
             "SB": "Solomon Islands", "SC": "Seychelles", "SE": "Sweden", "SG": "Singapore", "SH": "Saint Helena",
             "SI": "Slovenia", "SJ": "Svalbard and Jan Mayen", "SK": "Slovakia", "SL": "Sierra Leone",
             "SM": "San Marino", "SN": "Senegal", "SO": "Somalia", "SR": "Suriname", "SS": "South Sudan",
             "ST": "Sao Tome and Principe", "SV": "El Salvador", "SX": "Sint Maarten", "SZ": "Swaziland",
             "TC": "Turks and Caicos Islands", "TD": "Chad", "TF": "French Southern Territories", "TG": "Togo",
             "TH": "Thailand", "TJ": "Tajikistan", "TK": "Tokelau", "TL": "Timor-Leste", "TM": "Turkmenistan",
             "TN": "Tunisia", "TO": "Tonga", "TR": "Turkey", "TT": "Trinidad and Tobago", "TV": "Tuvalu",
             "TW": "Taiwan", "TZ": "Tanzania", "UA": "Ukraine", "UG": "Uganda",
             "UM": "United States Minor Outlying Islands", "US": "United States", "UY": "Uruguay",
             "UZ": "Uzbekistan",
             "VA": "Vatican City", "VC": "Saint Vincent and the Grenadines", "VE": "Venezuela",
             "VG": "British Virgin Islands", "VI": "US Virgin Islands", "VN": "Vietnam", "VU": "Vanuatu",
             "WF": "Wallis and Futuna", "WS": "Samoa", "XK": "Kosovo", "YE": "Yemen", "YT": "Mayotte",
             "ZA": "South Africa", "ZM": "Zambia", "ZW": "Zimbabwe"
};

function iso2CountryNames(){
    var inputText = document.getElementById("linksstr").value;
    var outputText = inputText.replace(/\b[A-Z]{2}\b/g, (isoCode) => iso2ToCountry[isoCode] || isoCode);
    document.getElementById("linksstr").value = outputText;
}

function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);    
  }

function copyTrackers(){
    copyToClipboard(textToCopy);
    var obj = document.getElementById('copytrackers');
    obj.innerHTML = "√ 已复制";
    obj.style.backgroundColor = "#daf2c2";
    obj.style.color = "#397300";
    setTimeout(function () {
        obj.innerHTML = '复制Trackers';
        obj.style.backgroundColor = "#f2f2f2";
        obj.style.color = "#000000";
    }, 3000);
}
setInterval("refresh()", 1000);
