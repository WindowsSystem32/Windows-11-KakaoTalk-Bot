const scriptName = "windowsBot";
const prefix = "@";
const botName = "윈도우";
const bn = "[" + botName + "] ";
const lw = "\u200b".repeat(1000);
const lw2 = "전체보기를 눌러 확인하세요" + lw;
const lw3 = "전체보기를 눌러 확인하세요!" + lw;
const ln = "\n";
var arr1 = []; //출석목록
var cC = 0; //출석한 사람 수
var arr2 = []; //허용/차단 방 리스트
var arr3 = []; //문의 리스트
var cl = [[],[]]; //채팅로그 리스트
var ur = []; //안 읽은 메시지 수 리스트
var wlst = true; //화이트 리스트 여부
const mrn = "windows 11 bot v0.2.4 관리방"; //봇 관리방 이름
var sl = null; //선택된 방의 이름
var eau = [[], [], [], []]; //이발 사용 가능한 유저 리스트
var coml = []; //명령어 처리 리스트
var cll = 0; //호출 횟수
var cS = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789~=[]\\;',./~!@#$%^&*()_+{}|:\"<>?";
var key;
var r1 = false;
var r2 = null;
var bB = false;
const savePath = "/sdcard/win11bot.settings";
var loaded = false;
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(!loaded){
    Log.clear();
    loaded = load();
  }
  var sender2 = decode2(sender);
  if (!cl[0].includes(room)) {
    cl[0].push(room);
    cl[1][room] = [];
  }
  var hashCode = java.lang.String(imageDB.getProfileImage()).hashCode();
  try {
    cl[1][room].push([date(), sender, hashCode, msg]);
  } catch (e) {
    FLog(4, "채팅로그 쓰기를 할 수 없습니다. 채팅로그를 초기화합니다.");
    cl = [[],[]];
  }
  if (room == sl) {
    replier.reply("DEBUG ROOM", date() + ":" + ln + 
    "방:" + ln + 
    room + ln + 
    "유저:" + ln + 
    sender2 + ln + 
    "메시지:" + ln + 
    msg);
  }
  if (eau[0].includes(sender) && !eau[2][eau[0].indexOf(sender)]) {
    var iOU = eau[0].indexOf(sender);
    eau[2][iOU] = true;
    eau[3][iOU] = hashCode;
  }
  if (((wlst? arr2.includes(room) : !arr2.includes(room)) || ((room == mrn) || isDebugRoom(room, sender)))) {
    var aL = (isDebugRoom(room, sender)? 3 : adminLev(sender, hashCode));
    var iA = (aL > 0 && aL <= 3);
    if (msg.startsWith("%" + prefix)) {
      if (isDebugRoom(room, sender)) {
        snd(replier, msg.substring(1));
      }
    } else if (msg.startsWith(prefix)) {
      msg = msg.substring(prefix.length);
      aL = (isDebugRoom(room, sender)? 3 : adminLev(sender, hashCode));
      iA = (aL > 0 && aL <= 3);
      if (msg == "안녕") {
        replier.reply("안녕하세요 저는 윈도우 입니다" + ln + 
        prefix + "도움말을 입력 하십시오");
      } else if (msg == "사양") {
        replier.reply(botName + "의 사양입니다." + ln + 
        lw3 + ln + 
        "안드로이드 버전 코드: " + Device.getAndroidVersionCode() + ln + 
        "안드로이드 버전 이름: " + Device.getAndroidVersionName() + ln + 
        "휴대폰 브랜드: " + Device.getPhoneBrand() + ln + 
        "휴대폰 모델: " + Device.getPhoneModel() + ln + 
        "충전 중: " + boolToStr1(Device.isCharging()) + ln + 
        "충전기 타입: " + Device.getPlugType() + ln + 
        "배터리 잔량: " + Device.getBatteryLevel() + "%" + ln + 
        "배터리 건강 상태: " + numToStr1(Device.getBatteryHealth()) + ln + 
        "배터리 온도: " + (Device.getBatteryTemperature() / 10) + " ºC" + ln + 
        "배터리 전압: " + Device.getBatteryVoltage() + " mV" + ln + 
        "배터리 상태: " + numToStr2(Device.getBatteryStatus()) + ln + 
        "메모리 사용량: 약 " + (Math.floor((Device.getFreeMemory() / Device.getTotalMemory()) * 1000) / 10) + "%(" + Device.getFreeMemory() + "/" + Device.getTotalMemory() + ")" + ln + 
        "화면 켜짐: " + boolToStr1(Device.isScreenOn()));
      } else if (msg == "시계") {
        replier.reply(dc("■", "○"));
      } else if (msg == "관리자 호출") {
        replier.reply("DEBUG ROOM", date() + ":" + ln + 
        "  호출 (" + (cll + 1) + "):" + ln + 
        "    방: " + ln + 
        "      " + room + ln + 
        "    호출한 사람:" + ln + 
        "      " + sender);
        Api.makeNoti(botName, "(" + (cll + 1) + ") " + room + " 방의 " + sender + " 님이 호출", 1);
        cll++;
      } else if (msg == "ㅊㅊ") {
        if (arr1[room] == undefined || arr1[room] == null) {
          arr1[room] = [];
        }
        var ind = arr1[room].indexOf(sender);
        if (ind < 0) {
          ind = arr1[room].push(sender);
          var ni = ["🥇 ", "🥈 ", "🥉 ", ""];
          replier.reply(ni[clamp(ind - 1, 0, 3)] + "이 방에서 " + (ind) + "번째로 출석했습니다." + ln + 
          ni[clamp(cC, 0, 3)] + "전체 순위는 " + (cC + 1) + "등입니다." + (cC == 0? ln + 
            "와 1등 ㄷㄷ" : ""));
          cC += 1;
        } else {
          replier.reply("님은 이미 " + (ind + 1) + "번째로 출석하셨습니다.");
        }
      } else if (msg.startsWith("방 선택 ")) {
        if (aL == 3) {
          sl = msg.substring(5);
          replier.reply("'" + sl + "' 방을 선택했습니다.");
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg.startsWith("방 추가 ")) {
        if (aL == 3) {
          msg = msg.substring(5);
          if (!arr2.includes(msg)) {
            arr2.push(msg);
            replier.reply("'" + msg + "' 방을 " + tOL() + " 리스트에 추가했습니다!");
          } else {
            replier.reply("'" + msg + "' 방은 이미 " + tOL() + " 리스트에 있습니다!");
          }
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg.startsWith("방 제거 ")) {
        if (aL == 3) {
          msg = msg.substring(5);
          if (arr2.includes(msg)) {
            arr2.splice(arr2.indexOf(msg), 1);
            replier.reply("'" + msg + "' 방을 " + tOL() + " 리스트에서 제거했습니다!");
          } else {
            replier.reply("'" + msg + "' 방은 " + tOL() + " 리스트에 없습니다!");
          }
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg == "방") {
        if (aL == 3) {
          replier.reply("현재 " + tOL() + " 리스트에 있는 방 목록 & 현재 선택되어 있는 방입니다." + lw3 + ln + 
          "현재 " + tOL() + " 리스트에 있는 방:" + ln + 
          "  " + ((arr2.length <= 0)? "없음" : arr2.join(ln + 
          "  ")) + ln + 
          "현재 선택된 방:" + ln + 
          "  " + ((sl == undefined || sl == null)? "없음" : sl));
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg == "방 목록") {
        if (aL == 3) {
          replier.reply("현재 " + tOL() + " 리스트에 있는 방 목록입니다." + lw3 + ln + 
          "현재 " + tOL() + " 리스트에 있는 방:" + ln + 
          "  " + ((arr2.length <= 0)? "없음" : arr2.join(ln + 
          "  ")));
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg == "인증") {
        if (!iA) {
          if (Api.canReply(mrn)) {
            key = randomChar(10, cS);
            replier.reply(mrn, key);
            replier.reply("✅관리방에 인증코드를 전송하였습니다.");
            cTC(key);
          } else {
            replier.reply("❌관리방이 활성화되지 않았으므로 인증코드를 전송할 수 없습니다!");
          }
        } else {
          replier.reply("당신은 이미 관리자입니다! (" + aL2(aL) + ")");
        }
      } else if (msg.startsWith("인증코드 ")) {
        if (!iA) {
          if (key != null && key != undefined) {
            if (key == msg.substring(5)) {
              replier.reply("✅인증하였습니다!");
              replier.reply("관리자 목록에 추가 중입니다...");
              replier.reply((aA(sender, 1, true, hashCode)? "✅관리자 목록에 추가하였습니다!" : "❌관리자 추가에 실패하였습니다!"));
            } else {
              replier.reply("❌인증코드가 일치하지 않습니다!");
            }
          } else {
            replier.reply("❌인증코드가 유효하지 않습니다! 다시 발급하세요!");
          }
        } else {
            replier.reply("당신은 이미 관리자입니다! (" + aL2(aL) + ")");
        }
      } else if (msg.startsWith("이발 ")) {
        if (!iA) {
          replier.reply("❌당신은 관리자가 아닙니다! 만약 관리자라면, " + ln + 
          "1. 인증하거나," + ln + 
          "2. 상위 관리자가 당신을 관리자로 추가할 때까지 기다리세요!");
        } else {
          var com = msg.substring(3);
          var rc = true;
          if (aL == 1) {
            var ind2 = coml.push();
            coml[ind2] = [room, sender, com, 0];
            Log.info("이발 요청: " + com);
            replier.reply("관리자께서 명령을 승인하실 때까지 기다려 주십시오...");
            replier.reply("DEBUG ROOM", (ind + 1) + "." + ln + 
            "  방: " + coml[ind2][0] + ln + 
            "  유저: " + coml[ind2][1] + ln + 
            "  명령:" + ln + 
            "  " + coml[ind2][2]);
            replier.reply(mrn, (ind + 1) + "." + ln + 
            "  방: " + coml[ind2][0] + ln + 
            "  유저: " + coml[ind2][1] + ln + 
            "  명령:" + ln + 
            "  " + coml[ind2][2]);
            while (coml[ind2][3] == 0){}
            rc = (coml[ind2][3] == 1);
            if (rc) {
              replier.reply("✅" + sender2 + " 님, 관리자께서 명령어를 승인하셨어요!" + ln + 
              "(명령어: " + coml[ind][2] + ")");
            } else {
              replier.reply("❌" + sender2 + " 님, 관리자께서 명령어를 거부하셨어요!" + ln + 
              "(명령어: " + coml[ind][2] + ")");
            }
          }
          if (rc) {
            var rt1 = Date.now();
            var eres;
            try {
              eres = "✅성공:" + ln + 
              eval(com);
            } catch (e) {
              eres = "❌오류:" + ln + 
              "내용: " + e + ln + 
              ln + 
              "줄: " + e.lineNumber;
            }
            var rt2 = Date.now();
            replier.reply("결과(실행 시간: " + (rt2 - rt1) + " 밀리초): " + ln + 
            eres);
          }
        }
      } else if (msg == "명령어") {
        if (aL == 3) {
          var prn4 = "승인 대기/승인/거부 명령어";
          var leng2 = coml.length;
          if (leng2 <= 0) {
            prn4 += "가 없습니다.";
          } else if (leng2 <= 1){
            prn4 += "는";
          } else {
            prn4 += " 목록입니다. " + lw2;
          }
          if (leng2 > 0) {
            for (var q = 0; q < leng2; q++) {
              prn4 += ln + 
              ln + 
              (q + 1) + "." + ln + 
              "  방: " + coml[q][0] + ln + 
              "  유저: " + coml[q][1] + ln + 
              "  명령어: " + ln + 
              "  " + coml[q][2] + ln + 
              "  상태: " + (["거부됨", "승인 대기", "승인됨"])[coml[q][3] + 1];
            }
          }
          replier.reply(prn4);
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg.startsWith("명령어 ")) {
        if (aL == 3) {
          msg = msg.substring(4);
          var param1 = strToNum(msg.substring(msg.indexOf(" "))) - 1;
          if ((msg.startsWith("승인 ") || msg.startsWith("거부 ")) && (param1 >= 0 && param1 < coml.length)) {
            var aC = msg.startsWith("승인 ");
            if (aC) {
              coml[param1][3] = 1;
            } else {
              coml[param1][3] = -1;
            }
            replier.reply("✅OK!");
          } else {
            replier.reply("❌명령어를 승인/거부할 수 없습니다.");
          }
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg.startsWith("관리자 ")) {
        if (aL == 3) {
          msg = msg.substring(4);
          if (msg.startsWith("추가 ")) {
            msg = msg.substring(3);
            var aAL = (["하위 ", "중위 ", "상위 "]).indexOf(msg.substring(0, 3)) + 1;
            if (aAL > 0) {
              msg = msg.substring(3);
              if (aA(msg, aAL, false)) {
                replier.reply("✅'" + msg + "' 님을 " + aL2(aAL) + "로 추가하였습니다!");
              } else {
                replier.reply("❌'" + msg + "' 님은 이미 관리자 목록에 있습니다!");
              }
            }
          } else if (msg.startsWith("제거 ")) {
            msg = msg.substring(3);
            if (dA(msg)) {
              replier.reply("✅'" + msg + "' 님을 관리자 목록에서 삭제하였습니다!");
            } else {
              replier.reply("❌'" + msg + "' 님은 관리자 목록에 없습니다!");
            }
          } else if (msg.startsWith("변경 ")) {
            msg = msg.substring(3);
            var nAL = (["하위 ", "중위 ", "상위 "]).indexOf(msg.substring(0, 3)) + 1;
            if (nAL > 0) {
              msg = msg.substring(3);
              var aI  = eau[0].indexOf(msg);
              if (aI >= 0) {
                var pAL = eau[1][aI];
                if (pAL != nAL) {
                eau[1][aAI] = nAL;
                  replier.reply("✅'" + msg + "' 님의 등급을 " + aL2(pAL) + "에서 " + aL2(nAL) + "(으)로 변경하였습니다!");
                } else {
                  replier.reply("'" + msg + "' 님은 이미 " + aL2(pAL) + "입니다.");
                }
              } else {
                replier.reply("❌'" + msg + "' 님은 관리자 목록에 없습니다!");
              }
            }
          } else if (msg == "목록") {
            var prn1 = "이 봇의 관리자";
            if (eau.length <= 0) {
              prn1 += "가 없습니다!";
            } else {
              if (eau.length > 3) {
                prn1 += " 목록입니다." + ln + 
                lw3;
              } else {
                prn1 += "는";
              }
              for (var i = 0; i < eau.length; i++) {
                prn1 += ln + 
                "'" + eau[0][i] + "'" + ln + 
                "(" + (["하위", "상위", "상위"])[clamp(eau[1][i], 0, 2)] + " 관리자)";
              }
            }
            replier.reply(prn1);
          }
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg == "리스트 허용") {
        if (aL == 3) {
          wlst = true;
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg == "리스트 차단") {
        if (aL == 3) {
          wlst = false;
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg == "채팅로그") {
        replier.reply(loadCL2(room, true));
      } else if (msg.startsWith("채팅로그 ")) {
        msg = msg.substring(5);
        if (aL == 3) {
          replier.reply(loadCL2(msg, false));
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg == "채팅로그_삭제") {
        msg = msg.substring(8);
        if (aL == 3) {
          cl[0].splice(iOR, 1);
          cl[1].splice(iOR, 1);
          replier.reply("✅이 방의 채팅로그를 삭제하였습니다.");
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg.startsWith("채팅로그_삭제 ")) {
        msg = msg.substring(8);
        var rn2 = msg;
        var iOTR = cl[0].indexOf(rn2);
        if (aL == 3) {
          if (iOTR >= 0) {
            cl[0].splice(iOTR, 1);
            cl[1].splice(iOTR, 1);
            replier.reply("✅'" + rn2 + "' 방의 채팅로그를 삭제하였습니다.");
          } else {
            replier.reply("❌'" + rn2 + "' 방의 채팅로그가 없습니다.");
          }
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg == "채팅로그_초기화") {
        if (aL == 3) {
          cl = [[],[]];
          replier.reply("✅모든 방의 채팅로그를 초기화하였습니다.");
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg == "채팅로그_목록") {
        if (aL == 3) {
          var prn2 = "채팅로그가 있는 방";
          if (cl[0].length > 3) {
            prn2 += "목록입니다." + ln + 
            lw3;
          } else {
            prn2 += "은";
          }
          prn2 += ln + cl[0].join(ln);
          replier.reply(prn2);
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg.startsWith("문의 ")) {
        msg = msg.substring(3);
        var ind3 = arr3.push();
        arr3[ind3] = [room, sender, msg];
        replier.reply(ind3 + "번째 문의를 넣었습니다." + ln + 
        "문의를 처리하는 데 시간이 걸릴 수도 있으니 기다려주세요!");
        replier.reply(mrn, "문의(" + ind3 + "):" + ln + 
          "  방: " + room + ln + 
        "  유저: " + sender + ln + 
        "  문의 내용: " + ln + 
        "  " + msg);
        replier.reply("DEBUG ROOM", "문의(" + ind3 + "):" + ln + 
          "  방: " + room + ln + 
        "  유저: " + sender + ln + 
        "  문의 내용: " + ln + 
        msg);
      } else if (msg == "문의") {
        if (aL == 3) {
          var prn3 = "문의 목록입니다." + ln + 
          lw3;
          for (var j = 0; j < arr3.length; j++) {
            prn3 += ln + 
            ((j == 0)? "" : ln) + 
            (j + 1) + "." + ln + 
            "  방: " + arr3[j][0] + ln + 
            "  유저: " + arr3[j][1] + ln + 
            "  문의 내용:" + ln + 
            "  " + arr3[j][2];
          }
          replier.reply(prn3);
          arr3 = [];
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg.startsWith("문의_읽기 ")) {
        msg = msg.substring(6);
        if (aL == 3) {
          if (isInt(msg) && (msg - 1) >= 0 && (msg - 1) < arr3.length) {
            msg -= 1;
            replier.reply((msg + 1) + "번쨰 문의 내용입니다." + ln + 
            "  방: " + arr3[msg][0] + ln + 
            "  유저: " + arr3[msg][1] + ln + 
            "  문의 내용:" + ln + 
            "  " + arr3[msg][2]);
          }
        } else {
          replier.reply("❌상위 관리자만 쓸 수 있는 기능입니다.");
        }
      } else if (msg == "도움") {
        replier.reply("도움을 주신 분 목록입니다." + ln + 
        lw3 + ln + 
        "아이디어 제공:" + ln + 
        "  windows 11" + ln + 
        "  https://open.kakao.com/o/sfOCAypd" + ln + 
        ln + 
        "제작(JS): " + ln + 
        "  Windows" + ln + 
        "  https://open.kakao.com/me/Windows");
      } else if (msg == "정보") {
        replier.reply("이 봇의 정보입니다." + ln + 
        lw3 + ln + 
        "버전: 0.2.7 \"SAVE\"" + ln + 
        "언어: 자바스크립트(JS)" + ln + 
        "개발 시작: 2021-12-18" + ln + 
        "최근 업데이트: 2022-01-28");
      } else if (msg == "주사위") {
        replier.reply((Math.floor(Math.random() * 5) + 1) + "(이)가 나왔습니다!");
      } else if (msg.startsWith("따라하기 ")) {
        msg.substring(5);
        replier.reply("따라하겠습니다!" + ln + 
        msg);
      } else if (msg.startsWith("타이머 ")) {
        msg = msg.substring(4);
        var param2 = strToNum(msg);
        if (param2 > 0) {
          replier.reply(sender2 + "님, " + param2 + "초 뒤에 타이머가 끝납니다!");
          try {
            java.lang.Thread.sleep(param2 * 1000);
            replier.reply(param2 + "초 타이머가 끝났습니다!");
          } catch (err) {
            replier.reply(sender2 + "님께서 설정하신 " + param2 + "초 타이머가 취소되었습니다!");
          }
        } else {
          replier.reply("... '" + msg + "' 초라고요?" + (!isInt(msg)? ln + 
          " '" + msg + "'은(는) 숫자가 아닌 것 같습니다만?" : ""));
        }
      } else if (msg == "역사") {
        replier.reply("이 봇의 역사입니다." + ln + 
        lw3 + ln + 
        "2021-12-18: 0.2.4 JS 개발 시작" + ln + 
        "2021-12-19: 개발" + ln + 
        "2021-12-25~27: 또 개발 & 0.2.4 완성" + ln + 
        "2022-01-01: 개발" + ln + 
        "2022-01-08: 정보 기능 추가" + ln + 
        "2022-01-11: 역사,해시,타이머,따라하기,주사위 기능 등 추가 & 0.2.5 완성" + ln + 
        "2022-01-20: 자폭,숨겨진 기능 추가 & 0.2.6 완성" + ln + 
        "2022-01-21: 자폭 기능 수정" + ln + 
        "2022-01-2?: 0.2.7 완성" + ln + 
        "2022-01-28: 여러 기능 수정, 설정 저장/로드 기능 추가, 0.2.8 완성" + ln + 
        "(개발자: 살려주세요)");
      } else if (msg == "해시") {
        replier.reply("당신의 해시는" + ln + 
        hashCode);
      } else if (msg == "자폭") {
        if (!bB) {
          replier.reply("자폭 명령이 인식되었습니다. 코드를 삭제합니다.");
          var progress = 0;
          var pL = 1077;
          var lV;
          bB = true;
          while (progress < pL) {
            progress += 1;
            var fOP = (((progress / pL) * 100) - (((progress / pL) * 100) % 10)) / 10;
            if (fOP != lV) {
              replier.reply("삭제 중... (" + ((progress / pL) * 100) + "%, " + progress + "/" + pL + ")");
              lV = fOP;
            }
            java.lang.Thread.sleep(Math.floor(Math.random() * 90) + 10);
          }
          replier.reply("삭제가 완료되었습니다.");
          java.lang.Thread.sleep(3000);
          replier.reply("뻥이에요 ㅋㅋ");
        }
      } else if (msg == "도움말") {
        replier.reply("이 봇의 도움말입니다." + ln + 
        lw3 + ln + 
        "일반인:" + ln + 
        ln + 
        prefix + "안녕:" + ln + 
        "인사를 해드립니다." + ln + 
        ln + 
        prefix + "사양:" + ln + 
        "지금 봇을 돌리는 폰의 사양/상태를 알려드립니다." + ln + 
        ln + 
        prefix + "시계:" + ln + 
        "디지털 시계를 보여드립니다." + ln + 
        ln + 
        prefix + "관리자 호출:" + ln + 
        "관리자를 호출해드립니다." + ln + 
        ln + 
        prefix + "ㅊㅊ:" + ln + 
        "출석체크를 해드립니다." + ln + 
        ln + 
        prefix + "인증:" + ln + 
        "인증코드를 생성 & 관리방으로 전송합니다." + ln + 
        "인증하면 이발을 쓸 수 있습니다." + ln + 
        ln + 
        prefix + "인증코드 (인증코드):" + ln + 
        "유효한 인증코드를 입력할 경우, 관리자 목록에 추가시킵니다." + ln + 
        ln + 
        prefix + "채팅로그:" + ln + 
        "이 방의 채팅로그를 알려드립니다." + ln + 
        ln + 
        prefix + "문의 (문의내용):" + ln + 
        "(문의내용)을 관리자방&디버그룸에 전달합니다." + ln + 
        ln + 
        prefix + "도움:" + ln + 
        "봇 개발에 기여를 하신 분들을 알려드립니다." + ln + 
        ln + 
        prefix + "정보:" + ln + 
        "이 봇의 정보를 표시합니다." + ln + 
        ln + 
        prefix + "역사:" + ln + 
        "이 봇의 역사를 알려드립니다." + ln + 
        ln + 
        prefix + "해시:" + ln + 
        "당신의 해시를 알려드립니다." + ln + 
        ln + 
        prefix + "타이머 (초):" + ln + 
        "(초) 만큼 타이머를 설정합니다." + ln + 
        ln + 
        prefix + "주사위:" + ln + 
        "주사위를 굴립니다(=1에서 6까지의 숫자 중 아무거나 골라드립니다)." + ln + 
        ln + 
        prefix + "자폭:" + ln + 
        "자폭합니다(?)" + ln + 
        ln + 
        prefix + "도움말:" + ln + 
        "이 도움말을 표시합니다." + ln + 
        ln + 
        ln + 
        ln + 
        "하위 관리자:" + ln + 
        ln + 
        prefix + "이발 (명령어):" + ln + 
        "(명령어)를 실행시킵니다. 하위 관리자인 경우, " + ln + 
        "상위 관리자가 명령어를 승인해야 합니다." + ln + 
        ln + 
        ln + 
        ln + 
        "상위 관리자:" + ln + 
        ln + 
        prefix + "방 선택 (방 이름):" + ln + 
        "(방 이름) 방을 선택합니다." + ln + 
        "방을 선택한 상태에서 디버그룸에서 메시지를 보낼 경우," + ln + 
        "선택된 방으로 메시지가 전송됩니다." + ln + 
        ln + 
        prefix + "방 (추가|제거) (방 이름):" + ln + 
        "허용/차단 리스트에 방을 추가/제거시킵니다." + ln + 
        ln + 
        prefix + "방:" + ln + 
        "현재 허용/차단 목록에 있는 방 목록&현재 선택되어 있는 방을 보여드립니다." + ln + 
        ln + 
        prefix + "방 목록:" + ln + 
        "현재 허용/차단 리스트에 있는 방의 목록을 보여드립니다." + ln + 
        ln + 
        prefix + "명령어:" + ln + 
        "하위 관리자가 요청한 명령어 목록을 보여드립니다." + ln + 
        ln + 
        prefix + "명령어 (승인|거부) (번호):" + ln + 
        "하위 관리자가 요청한 명령어를 승인/거부합니다." + ln + 
        ln + 
        prefix + "관리자 (추가|변경) (상위|중위|하위) (이름):" + ln + 
        "(이름) 관리자를 (상위|중위|하위) 등급으로 관리자 목록에 추가하거나, " + ln + 
        "해당 관리자의 등급을 변경해드립니다." + ln + 
        ln + 
        prefix + "관리자 제거 (이름):" + ln + 
        "(이름) 관리자를 관리자 목록에서 삭제합니다." + ln + 
        ln + 
        prefix + "관리자 목록:" + ln + 
        "이 봇의 관리자 목록을 보여드립니다." + ln + 
        ln + 
        prefix + "리스트 (허용|차단):" + ln + 
        "리스트의 방식을 바꿉니다. 리스트 방식이 '허용'인 경우, 리스트에 있는 방에만 반을을 하며, " + ln + 
        "리스트 방식이 '차단'인 경우, 리스트에 없는 방에만 반응을 합니다." + ln + 
        ln + 
        prefix + "채팅로그 (방이름):" + ln + 
        "(방이름) 방의 채팅로그를 보여드립니다." + ln + 
        ln + 
        prefix + "채팅로그_삭제:" + ln + 
        "이 방의 채팅로그를 전부 지웁니다." + ln + 
        ln + 
        prefix + "채팅로그_삭제 (방이름):" + ln + 
        "(방이름) 방의 채팅로그를 전부 지웁니다." + ln + 
        ln + 
        prefix + "채팅로그_초기화:" + ln + 
        "채팅로그를 초기화 시킵니다." + ln + 
        ln + 
        prefix + "채팅로그_목록:" + ln + 
        "채팅로그가 있는 방의 목록을 보여드립니다." + ln + 
        ln + 
        prefix + "문의:" + ln + 
        "문의 목록을 보여드립니다." + ln + 
        ln + 
        prefix + "문의_읽기 (번호):" + ln + 
        "(번호)번째 문의 내용을 보여드립니다.");
      }
    } else {
      if (isDebugRoom(room, sender)) {
        snd(replier, msg);
      }
    }
  }
  save();
  if (!r1) {
    try {
      r1 = true;
      while (true) {
        var cd = date2();
        if (r2 != cd) {
          r2 = cd;
          arr1 = [];
          cC = 0;
        }
      }
    } catch (e) {
      r1 = false;
    }
  }
}

function load() {
  var success = true;
  FLog(1, "관리자 목록을 불러오는 중...");
  try {
    var ta = JSON.parse(FileStream.read(savePath));
    if (ta == null || ta == undefined) {
      FLog(0, "관리자 목록 불러오기: 관리자 목록이 없어요!");
      save();
    } else {
      try {
        arr1 = ta[0];
        arr2 = ta[1];
        arr2 = ta[2];
        cl = ta[3];
        wlst = ta[4];
        sl = ta[5];
        eau = ta[6];
        coml = ta[7];
        cll = ta[8];
        key = ta[9];
        r2 = ta[10];
        bB = ta[11];
        FLog(2, "관리자 목록 불러오기 완료!");
      } catch (e) {
        save();
        FLog(3, "관리자 목록 불러오기 실패, 현재 설정을 저장");
      }
    }
  } catch (e) {
    success = false;
    FLog(3, "관리자 목록 불러오기 실패: " + e);
  }
  return success;
}

function save(l) {
  var success = true;
  if (l != false) {
    FLog(1, "관리자 목록을 저장하는 중...");
  }
  try {
    var ta = [arr1, //0
      arr2, //1
      arr3, //2
      cl, //3
      wlst, //4
      sl, //5
      eau, //6
      coml, //7
      cll, //8
      key, //9
      r2, //10
      bB]; //11
    FileStream.write(savePath, JSON.stringify(ta));
    if (l != false) {
      FLog(2, "관리자 목록 저장 완료!");
    }
  } catch (e) {
    success = false;
    if (l != false) {
      FLog(3, "관리자 목록 저장 실패: " + e);
    }
  }
  return success;
}

function FLog(logType, logStr) {
  var logTypeArray1 = ["⚗", "🟢", "🔵", "❌", "⚠"];
  var logTypeArray2 = ["디버그", "알림", "정보", "오류", "경고"];
  if ((logType == null || logType == undefined) && (logStr == null || logStr == undefined)) {
    return "Log([로그 타입, 0에서 4까지의 숫자(0: 디버그, 1: 알림, 2: 정보, 3: 오류, 4: 경고)], [로그 내용])";
  } else if (!(logType <= 4 && logType >= 0)) {
    logType = 0;
    FLog(4, "Log(" + logType + ", " + logStr + "): 로그 타입이 잘못되었습니다.");
  }
  logStr = logTypeArray1[logType] + "[" + date() + "][" + logTypeArray2[logType] + "] " + logStr;
  if (logType == 0) {
    Log.d(logStr);
  } else if (logType == 1) {
    Log.i(logStr);
  } else if (logType == 2) {
    Log.i(logStr);
  } else if (logType == 3) {
    Log.e(logStr);
  } else if (logType == 4) {
    Log.e(logStr);
  }
}

function repl2(inCS) {
  return repl1(inCS, "\u202e", "(\\u202e)");
}

function repl1(inCS, fC, tC) {
  var outCS = inCS;
  if (fC != tC) {
    while (outCS.includes(fC)) {
      outCS = outCS.replace(fC, tC);
    }
  }
  return outCS;
}

function strToNum (str) {
  var out = -1;
  out = Number(str);
  if (Number.isNaN(out)) {
    out = -1;
  }
  return out;
}

function isInt (int) {
  var out = false;
  var n = Number(int);
  out = !(Number.isNaN(n));
  return out;
}

function decode (input) {
  var output = input;
  while (output.includes("\u202e") || output.includes("\u202d")) {
    output = output.replace("\u202e", "").replace("\u202d", "");
  }
  return output;
}

function decode2 (input) {
  var output = input;
  while (output.includes("\u202e") || output.includes("\u202d")) {
    output = output.replace("\u202e", "(\\u202e)").replace("\u202d", "(\\u202d)");
  }
  return output;
}

function snd(replier, str) {
  if (sl == undefined || sl == null) {
    replier.reply("❌방을 선택해주세요!");
  } else {
    if (Api.canReply(sl)) {
      replier.reply(sl, str);
      replier.reply("✅전송 성공!");
    } else {
      replier.reply("❌전송 불가!");
    }
  }
}

function isDebugRoom(room, sender) {
  return (room == "DEBUG ROOM" && sender == "DEBUG SENDER");
}

function loadCL2(rN, sR) {
  return (sR? "이" : "'" + rN + "'") + " 방의 채팅로그입니다." + ln + 
  lw2 + ln + 
  loadCL1(rN);
}

function loadCL1(rM, jC, eC) {
  if (eC == null || eC == undefined) {
    eC = "(EMPTY)";
  }
  if (jC == null || jC == undefined) {
    jC = ln + ln;
  }
  //return (!cl[0].includes(rM)? eC : cl[0][rM].map((a) => repl(repl(repl(cLS, "%DATE%", a[0]), "%SENDER%", a[1]), "%MSG%")));
  return (!cl[0].includes(rM)? eC : cl[1][rM].map((a) => a[0] + ":" + ln + 
  "  SENDER:" + ln + 
  "    NAME: " + repl2(a[1], "\u202e", "(\\u202e)") + ln + 
  "    HASHCODE: " + a[2] + ln + 
  "  MSG:" + ln + 
  "    " + a[3]).join(jC));
}

function cTC (tTC) {
  Api.getContext().getSystemService(android.content.Context.CLIPBOARD_SERVICE).setText(tTC);
}

function dA (name) {
  var res = false;
  var ind = eau[0].indexOf(name);
  if (ind >= 0) {
    eau[0].splice(ind, 1);
    eau[1].splice(ind, 1);
    eau[2].splice(ind, 1);
    eau[3].splice(ind, 1);
    res = true;
  }
  return res;
}

function aA (name, lev, hashSaved, hashCode) {
  var res = false;
  if (eau[0].indexOf(name) == -1) {
    eau[0].push(name);
    eau[1].push(lev);
    eau[2].push(hashSaved);
    eau[3].push(hashCode);
    res = true;
  }
  return res;
}

function aL2 (aL) {
  return (["일반인", "하위 관리자", "중위 관리자", "상위 관리자"])[aL];
}

function adminLev (sender, hashCode) {
  var aI = adminIndex(sender, hashCode);
  return ((aI == -1)? 0 : (eau[1][aI]));
}

function adminIndex (sender, hashCode) {
  var res = -1;
  for (var i = 0; i < eau.length; i++) {
    if (eau[0][i] == sender && ((eau[2][i]? (eau[3][i] == hashCode) : true))) {
      res = i;
      break;
    }
  }
  return res;
}

function randomChar (length, charSet) {
  var output = "";
  var length2 = strToNum(length);
  var length3 = charSet.length;
  if (length2 > 0 && length3 > 0) {
    for (var i = 0; i < length2; i++) {
      output += charSet[Math.floor(Math.random() * length3)];
    }
  } else {
    output = "!";
  }
  return output;
}

function tOL () {
  return (wlst? "허용" : "차단");
}

function clamp (val, min, max) {
  if (min > max) {
    val = null;
  } else {
    if (val < min) {
      val = min;
    } else if (val > max) {
      val = max;
    }
  }
  return val;
}

function dc (on, off) {
  if (on == undefined || on == null) {
    on = "■";
  }
  if (off == undefined || off == null) {
    off = "□";
  }
  var ca = [[on + on + on, on + off + on, on + off + on, on + off + on, on + on + on], //0
  [off + off + on, off + off + on, off + off + on, off + off + on, off + off + on], //1
  [on + on + on, off + off + on, on + on + on, on + off + off, on + on + on], //2
  [on + on + on, off + off + on, on + on + on, off + off + on, on + on + on], //3
  [on + off + on, on + off + on, on + on + on, off + off + on, off + off + on], //4
  [on + on + on, on + off + off, on + on + on, off + off + on, on + on + on], //5
  [on + on + on, on + off + off, on + on + on, on + off + on, on + on + on], //6
  [on + on + on, on + off + on, off + off + on, off + off + on, off + off + on], //7
  [on + on + on, on + off + on, on + on + on, on + off + on, on + on + on], //8
  [on + on + on, on + off + on, on + on + on, off + off + on, on + on + on], //9
  [off + off + off, off + on + off, off + off + off, off + on + off, off + off + off]];//:
  var dt = new Date();
  var h0 = String(dt.getHours());
  var h1 = boolToStr(h0 < 10, "0", h0[0]);
  var h2 = boolToStr(h0 < 10, h0[0], h0[1]);
  var m0 = String(dt.getMinutes());
  var m1 = boolToStr(m0 < 10, "0", m0[0]);
  var m2 = boolToStr(m0 < 10, m0[0], m0[1]);
  var out = [];
  for (var i = 0; i < 5; i++) {
    out.push(ca[h1][i] + " " + ca[h2][i] +  " " + ca[10][i] + " " + ca[m1][i] + " " + ca[m2][i]);
  }
  //dt.getHours() + ":" + dt.getMinutes()
  var out2 = out.join(ln);
  return "현재 시간입니다." + ln + lw3 + ln + out2;
}

function boolToStr (bool, t, f, e) {
  var out = e;
  try {
    if (bool) {
      out = t;
    } else {
      out = f;
    }
  } catch (err) {
    
  }
  return out;
}

function select (bool, t, f) {
  var out = null;
  try {
    if (bool) {
      out = t;
    } else {
      out = f;
    }
  } catch (err) {
    
  }
  return out;
}


function flag1 (room) {
  var bool = arr2.includes(room);
  var bool2 = flag3(room);
  var out = false;
  try {
    if (wlst) {
      out = (bool) || (bool2);
    } else {
      out = (!bool) || (bool2);
    }
  } catch (err) {
    
  }
  return out;
}

function flag2 (room) {
  return (room == "DEBUG ROOM");
}

function flag3 (room) {
  return (flag2(room) || room == mrn);
}

function numToStr1 (num) {
    var out = "알 수 없음";
    try {
      switch (num) {
        case 1 :
          out = "알 수 없음"; //BATTERY_HEALTH_UNKNOWN
          break;
        case 2 :
          out = "좋음"; //BATTERY_HEALTH_GOOD
          break;
        case 3 :
          out = "과열됨"; //BATTERY_HEALTH_OVERHEAT
          break;
        case 4 :
          out = "사망"; //BATTERY_HEALTH_DEAD
          break;
        case 5 :
          out = "과전압"; //BATTERY_HEALTH_OVER_VOLTAGE
          break;
        case 6 :
          out = "지정되지 않은 오류"; //BATTERY_HEALTH_UNSPECIFIED_FAILURE
          break;
        case 7 :
          out = "차가움"; //BATTERY_HEALTH_COLD
          break;
      }
    } catch (err) {
      
    }
    return out;
  }

function numToStr2 (num) {
    var out = "알 수 없음";
    try {
      switch (num) {
        case 1 :
          out = "알 수 없음"; //BATTERY_STATUS_UNKNOWN
          break;
        case 2 :
          out = "충전 중"; //BATTERY_STATUS_CHARGING
          break;
        case 3 :
          out = "충전 중이 아님"; //BATTERY_STATUS_DISCHARGING
          break;
        case 4 :
          out = "충전 중이 아님"; //BATTERY_STATUS_NOT_CHARGING
          break;
        case 5 :
          out = "꽉 참"; //BATTERY_STATUS_FULL
          break;
      }
    } catch (err) {
      
    }
    return out;
}

function boolToStr1 (bool) {
  return boolToStr(bool, "예", "아니요", "알 수 없음");
}

function boolToStr2 (bool) {
  return boolToStr(bool, "허용", "차단", "알 수 없음");
}

function boolToStr3 (bool) {
  return boolToStr(bool, "true", "false", "!error!");
}
function date () {
  var dt = new Date();
  var days = "일월화수목금토";
  var year = dt.getFullYear();
  var month = dt.getMonth() + 1;
  var day = dt.getDate();
  var hour = dt.getHours();
  var minute = dt.getMinutes();
  var second = dt.getSeconds();
  return year + "-" + 
  ((month < 10) ? "0" : "") + month + "-" + 
  ((day < 10) ? "0" : "") + day + 
  "(" + days[dt.getDay()] + ") " + 
  ((hour < 10) ? "0" : "") + hour + ":" + 
  ((minute < 10) ? "0" : "") + minute + ":" + 
  ((second < 10) ? "0" : "") + second;
}

function date2 () {
  var dt = new Date();
  var year = dt.getFullYear();
  var month = dt.getMonth() + 1;
  var day = dt.getDate();
  return year + "-" + 
  ((month <= 10) ? "0" : "") + month + "-" + 
  ((day <= 10) ? "0" : "") + day;
}

function time () {
  var dt = new Date();
  var hour = dt.getHours();
  var minute = dt.getMinutes();
  return ((hour <= 10) ? "0" : "") + hour + ":" + 
  ((minute <= 10) ? "0" : "") + minute;
}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}