var XMLLookUpTable;
var ApplicationVirtualDirectory = GetVirtualDirectory();
var TimeOutSearchPeriod = 10000;

function GetVirtualDirectory() {
    var PathName = location.pathname;
    var VirtualDirectoryBeginPlace = PathName.indexOf("/", 0);
    var VirtualDirectoryEndPlace = PathName.indexOf("/", 1);

    //virtual directory caanot be extracted !!!

    if (VirtualDirectoryBeginPlace != 0 || VirtualDirectoryEndPlace == -1)
        return "internet";



    var VirtualDirectory = PathName.substring(1, VirtualDirectoryEndPlace);

    var v = ExtractDomainWithUrlForMTI();
    if (v != "")
        VirtualDirectory = v + "/" + VirtualDirectory;
    else
        VirtualDirectory = "/" + VirtualDirectory;

    return VirtualDirectory;

}
function isInsideVB() {
    try { var parentname = parent._parent.name; } catch (ex) { return false; }
    return (parent.parent != parent._parent);
}
function hasVBInside() {
    return typeof (YTI) == "object" || typeof (parent.YTI) == "object";
}

function ExtractDomainWithUrlForMTI() {
    if (!isInsideVB())
        return ""; 			// no YTI
    //alert("inside VB");
    var path = "";
	try {
		path = top.location.href;
		}
	catch {
		path = parent._parent.location.href;
		}
    var firstSlashes = path.indexOf("//", 0);
    var secondSlash = path.substring(firstSlashes + 2).indexOf("/", 0);
    secondSlash = secondSlash + firstSlashes + 2; // add two slash and firstslash
    if (firstSlashes == -1 || secondSlash == -1)
        return "";
    var middle = path.substring(firstSlashes + 2, secondSlash);
    if (middle.indexOf(":") == -1)
        return "";
    //alert("this is test");
    var port = middle.substring(middle.indexOf(":") + 1);
    var domainUrlStart = path.substring(0, secondSlash);
    domainUrlStart = domainUrlStart.replace(":" + port, "");
    return domainUrlStart;
}
//selfWindow is the level of (container || controlloader || mainloader)
function checkAndSetIsSubmitted(selfWindow, newState) {

    if (selfWindow == selfWindow.parent) {
        return true;
    }

    var DashboardLevel; // level of topmost container frame. (not top.)(for commercial(coex) login.ashx)
    if (selfWindow.parent.document.forms[0].isSubmitted)
        DashboardLevel = selfWindow.parent;
    if (selfWindow.parent.parent.document.forms[0].isSubmitted)
        DashboardLevel = selfWindow.parent.parent;
    if (selfWindow.parent.parent.parent.document.forms[0].isSubmitted)
        DashboardLevel = selfWindow.parent.parent.parent;

    if (newState == 1) // sayfan�n submit an�
    {
        //				alert("newState == 1 oldu");
        //CheckBox Logic
        if (DashboardLevel.CheckCheckboxProcedure) {
            if (!DashboardLevel.CheckCheckboxProcedure())
                return false;
            DashboardLevel.CheckCheckboxProcedure = null;
        }
        //IVR Aktar Logic
        if (DashboardLevel.preventSubmission) {
            DashboardLevel.preventSubmission = false;
            if (DashboardLevel.IVRAktarProsedure)
                DashboardLevel.IVRAktarProsedure();
            return false;
        }

        if (DashboardLevel.document.forms[0].isSubmitted.value == 1)
            return false;

        DashboardLevel.document.forms[0].isSubmitted.value = 1;
    }
    else //newState == 0
    {
        DashboardLevel.document.forms[0].isSubmitted.value = 0;
        DashboardLevel.preventSubmission = false;
        DashboardLevel.IVRAktarProsedure = null;
        DashboardLevel.AgentMessageHandlerFunctionPointer = null;
    }
    return true;
}
//selfWindow is the level of (container || controlloader || mainloader)
function SendChannelSpesificMessage(selfWindow) {
    var targetWindow = selfWindow; // targetWindow -> icerikFrame
    if (selfWindow.parent.TxChannel == undefined) {
        if (selfWindow.parent.parent.TxChannel) {
            targetWindow = selfWindow.parent;
        } else {
            selfWindow.parent.TxChannel = "Heey!! hen�z �a�r� bu ekibe gelmemi�"; // default'a d��mesi i�in :) (ab56041)
        }
    }
    switch (targetWindow.parent.TxChannel) {
        case targetWindow.parent.TxChannelCagri:
            var TitleText;
            TitleText = selfWindow.document.Form1.CagriMessage.value;
            if (selfWindow !== targetWindow) {
                targetWindow.document.Form1.CagriMessage.value = TitleText;
            }
            if (document.Form1.IsFirstLoad.value == "1") {
                TitleText = TitleText.replace(/RandNo/g, "Rand_OLD_No");
                TitleText = TitleText.replace(/KKBF/g, "KK_OLD_BF");
                TitleText = TitleText.replace(/IsCepBasvuru/g, "IsCep_OLD_Ba");
            }
            else {
                targetWindow.parent.setTimeoutPreventTimeout();
            }
            if (typeof (targetWindow.parent.setCagriTitle) != "undefined")
                targetWindow.parent.setCagriTitle(TitleText);
            else
                targetWindow.parent.document.title = TitleText;
            break;
        case targetWindow.parent.TxChannelInternet:
        default:
            break;
    }

}
function CoexRenew(selfWindow, randNo) {
    if (typeof (selfWindow.parent.renewYTISession) != "undefined") {
        selfWindow.parent.renewYTISession(randNo);
    }
    if (hasVBInside()) {
        selfWindow.parent.RenewTIBSession(randNo);
    }
}

function IfIsMultipleFrame() {
    try {
        if ((parent.document.getElementById("IsFrame"))) {
            document.forms[0].innerHTML = '<input type=hidden id=IsFrame name=IsFrame value=True>' + document.forms[0].innerHTML;
            //alert ( document.forms[0].innerHTML );
        }
    }
    catch (e) {
        //alert("hataa");
    }

}

function SetValue() {
    SetValue2();
}

function SetValue2() {
    //Berker 07.06.2011 Yeni �nternet Men�, 1 sayfada n frame �a�r�lmas�.
    //IfIsMultipleFrame();



    if ((window.opener) && (window.opener.parent) && (window.opener.parent.document) && (window.opener.parent.document.forms[0]) && (window.opener.parent.document.forms[0].rno)) {
        checkAndSetIsSubmitted(window.opener, 0);
        SendChannelSpesificMessage(window.opener);
        if (document.Form1.IsFirstLoad.value != "1") {
            window.opener.parent.document.forms[0].rno.value = document.Form1.rno.value;
            document.Form1.IsFirstLoad.value = "1";
            CoexRenew(window.opener, document.Form1.rno.value);
        } else
            CoexRenew(window.opener, -1); // this is for resizing. 56041

        if (document.forms[0]._ctl0_ParolaCheck) {
            document.forms[0]._ctl0_ParolaCheck.checked = false;
            document.forms[0]._ctl0_HatirlatmaCheck.checked = false;
            document.forms[0]._ctl0_SifreCheckBox.checked = false;
        }
        window.opener.parent.document.forms[0].lastTransactionPeriod.value = GetTimeinMSeconds() - window.opener.parent.document.forms[0].lastSubmitTime.value;
    }
    else {
        checkAndSetIsSubmitted(window, 0);
        SendChannelSpesificMessage(window);
        if (document.Form1.IsFirstLoad.value != "1") {
            var RandNo;
            if (parent.document.forms[0].rno) {
                parent.document.forms[0].rno.value = document.Form1.rno.value;
                RandNo = document.Form1.rno.value;
            }
            if (parent.parent.document.forms[0].rno) {
                parent.parent.document.forms[0].rno.value = document.Form1.rno.value;
                RandNo = document.Form1.rno.value;
            }
            CoexRenew(window, RandNo);
            document.Form1.IsFirstLoad.value = "1";
        } else
            CoexRenew(window, -1); // this is for resizing. 56041

        if (document.forms[0]._ctl0_ParolaCheck) {
            document.forms[0]._ctl0_ParolaCheck.checked = false;
            document.forms[0]._ctl0_HatirlatmaCheck.checked = false;
            document.forms[0]._ctl0_SifreCheckBox.checked = false;
        }
        if (parent.document.forms[0].lastSubmitTime) {
            parent.document.forms[0].lastTransactionPeriod.value = GetTimeinMSeconds() - parent.document.forms[0].lastSubmitTime.value;
        }

        //SetTableBackgroundImages();
        //Lightbox Begin
        LightBoxOpener();
        //Lightbox End

        //Frame olmayan her i�lem a��ld���nda scroll top yap�larak sayfan�n en �st� g�steriliyor.
        try {
            if (parent.parent.document && (document.getElementById("isFrame") == null || document.getElementById("isFrame") == "undefined")) {
                $(parent.parent.document).scrollTop(0);
                if (isInsideVB())
                    $(_parent.document).scrollTop(0);
            }
        }
        catch (ex) { }

    }

    try {
        if (typeof (SetClientLogObject) == 'function') {
            SetClientLogObject('WindowOnloadTime');
        }

    } catch (e) { }

}
//----------------------------------------------------------------------------------------------------------------------------------
function GetValue() {
    GetValue2();
}

function GetValue2() {
    try {

        try {
            if (parent.InternetLightBoxFrame && parent.InternetLightBoxFrame.$("input[isLightbox='False']") && parent.InternetLightBoxFrame.$("input[isLightbox='False']").length > 0) {

                parent.InternetLightBoxFrame.$("input[isLightbox='False']")[0].disabled = true;
            }
        }
        catch (excep) {
        }

        var hidden = document.getElementById("LogJsHolder");
        if (hidden && hidden != null) {
            hidden.value += "-GetValue2Run";
        }
        if ((window.opener) && (window.opener.parent) && (window.opener.parent.document) && (window.opener.parent.document.forms[0]) && (window.opener.parent.document.forms[0].rno)) {
            if (!checkAndSetIsSubmitted(window.opener, 1)) { return false; }
            document.Form1.rno.value = window.opener.parent.document.forms[0].rno.value;
            document.Form1.lastTRKD.value = window.opener.parent.document.forms[0].lastTRKD.value;
            window.opener.parent.document.forms[0].lastTRKD.value = document.Form1.trkd.value;
            document.Form1.lastTransactionPeriod.value = window.opener.parent.document.forms[0].lastTransactionPeriod.value;
            window.opener.parent.document.forms[0].lastSubmitTime.value = GetTimeinMSeconds();
        }
        else {
            if (!checkAndSetIsSubmitted(window, 1)) { return false; }
            if (parent.document.forms[0].rno) {
                document.Form1.rno.value = parent.document.forms[0].rno.value;
            }
            if (parent.parent.document.forms[0].rno) {
                document.Form1.rno.value = parent.parent.document.forms[0].rno.value;
            }
            if (parent.document.forms[0].lastTRKD) {
                document.Form1.lastTRKD.value = parent.document.forms[0].lastTRKD.value;
                parent.document.forms[0].lastTRKD.value = document.Form1.trkd.value;
            }
            if (parent.parent.document.forms[0].lastTRKD) {
                document.Form1.lastTRKD.value = parent.parent.document.forms[0].lastTRKD.value;
                parent.parent.document.forms[0].lastTRKD.value = document.Form1.trkd.value;
            }

            if (parent.document.forms[0].lastTransactionPeriod)
                document.Form1.lastTransactionPeriod.value = parent.document.forms[0].lastTransactionPeriod.value;
            if (parent.parent.document.forms[0].lastTransactionPeriod)
                document.Form1.lastTransactionPeriod.value = parent.parent.document.forms[0].lastTransactionPeriod.value;
            if (parent.document.forms[0].lastSubmitTime)
                parent.document.forms[0].lastSubmitTime.value = GetTimeinMSeconds();
            if (parent.parent.document.forms[0].lastSubmitTime)
                parent.parent.document.forms[0].lastSubmitTime.value = GetTimeinMSeconds();
        }

        //alert('a');
        var SifreControl = document.getElementById('SifreText');
        try {
            var hidden = document.getElementById("LogJsHolder");
            if (hidden && hidden != null) {
                var sifre = SifreControl.value;
                var masked = "";
                var counter = 0;
                for (counter = 0; counter < sifre.length; counter++) {
                    if (sifre.charAt(counter) == "" || sifre.charAt(counter) != parseInt(sifre.charAt(counter)))
                        masked += sifre.charAt(counter);
                    else
                        masked += "*";
                }
                hidden.value += "-SifreText:" + masked;
            }
        }
        catch (ex) {
            var hidden = document.getElementById("LogJsHolder");
            if (hidden && hidden != null)
                hidden.value += "-SifreText:exc";
        }
        //alert(SifreControl);
        if (SifreControl && SifreControl != null && SifreControl != undefined && SifreControl.value == '') {
            var hidden = document.getElementById("LogJsHolder");
            if (hidden && hidden != null) {
                hidden.value += "-GetValue2 1st Condition";
            }
            getJText('SifreText');

            try {
                var hidden = document.getElementById("LogJsHolder");
                if (hidden && hidden != null) {
                    var sifre = SifreControl.value;
                    var masked = "";
                    var counter = 0;
                    for (counter = 0; counter < sifre.length; counter++) {
                        if (sifre.charAt(counter) == "" || sifre.charAt(counter) != parseInt(sifre.charAt(counter)))
                            masked += sifre.charAt(counter);
                        else
                            masked += "*";
                    }
                    hidden.value += "-AfterJSifreText:" + masked;
                }
            }
            catch (ex) {
                var hidden = document.getElementById("LogJsHolder");
                if (hidden && hidden != null)
                    hidden.value += "-AfterJSifreText:exc";
            }


            if (SifreControl && SifreControl != null && SifreControl != undefined && SifreControl.value == '') {

                try {
                    var HiddenElmt = document.getElementById('LogJsSifreFix');
                    HiddenElmt.value = 'SifreTextEmptyFix';
                }
                catch (ex) {
                }

                parent.document.forms[0].isSubmitted.value = 0;

                showSOnayLBKeyboard();
                return false;

            }
        }

        return true;
    }
    catch (ex) {
        var hidden = document.getElementById("LogJsHolder");
        if (hidden && hidden != null) {
            hidden.value += "-GetValue2Ex";
            hidden.value += ":" + ex.description;
        }
    }
}


//----------------------------------------------------------------------------------------------------------------------------------
function OpenerGetValue() {
    window.document.Form1.rno.value = window.opener.parent.document.forms[0].rno.value;
    return true;
}
//----------------------------------------------------------------------------------------------------------------------------------
function NewWindow(mypage, myname, w, h, scroll, pos, _resizable) {
    var win = null;
    if (pos == "random") {
        LeftPosition = (screen.width) ? Math.floor(Math.random() * (screen.width - w)) : 100;
        TopPosition = (screen.height) ? Math.floor(Math.random() * ((screen.height - h) - 75)) : 100;
    }
    if (pos == "center") {
        LeftPosition = (screen.width) ? (screen.width - w) / 2 : 100;
        TopPosition = (screen.height) ? (screen.height - h) / 2 : 100;
    }
    else if ((pos != "center" && pos != "random") || pos == null) {
        LeftPosition = 0;
        TopPosition = 20;
    }

    if (_resizable) {
        settings = 'width=' + w + ',height=' + h + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=' + scroll + ',location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=' + _resizable;
    }
    else {
        settings = 'width=' + w + ',height=' + h + ',top=' + TopPosition + ',left=' + LeftPosition + ',scrollbars=' + scroll + ',location=no,directories=no,status=no,menubar=no,toolbar=no,resizable=no';
    }
    win = window.parent.open(mypage, myname, settings);
}
//----------------------------------------------------------------------------------------------------------------------------------

function checkIfTrkdExistsForTabMenu(trkd, islemSira) {
    var hidden = parent.TabMenu.document.getElementById("trkdsTabMenuFrameHas");

    if (hidden.value.indexOf(trkd) == -1) {
        checkTRKDForTabMenuFrame(trkd, islemSira);
        hidden.value = "";
    }

}

function checkTRKDForTabMenuFrame(trkd, islemSira) {
    var url = getTRKDForTabMenuFrameURL(trkd, islemSira);
    parent.TabMenu.location.href = url;
}

function getTRKDForTabMenuFrameURL(trkd, islemSira) {
    return (ApplicationVirtualDirectory + "/Menu/TabMenuFrame.aspx?trkd=" + trkd + "&islemSira=" + islemSira);
}

function querySt(ji) {
    hu = window.location.search.substring(1);

    gy = hu.split("&");
    for (i = 0; i < gy.length; i++) {
        ft = gy[i].split("=");
        if (ft[0] == ji) {
            return ft[1];
        }
    }
}

function CreateTabMenuHtml(isim, trkd, islemSira, aktif) {
    //alert( 'create"de last trkd =' + parent.document.forms[0].lastTRKD.value );
    var DivTabMenu;
    if (parent.document.getElementById('TabMenu') != null) {
        DivTabMenu = parent.document.getElementById('TabMenu');
    } else {
        DivTabMenu = document.getElementById('TabMenu');
    }
    if (DivTabMenu) {
        if (trkd == '') {
            DivTabMenu.innerHTML = '';
            DivTabMenu.style.paddingTop = "0px";
            DivTabMenu.style.marginBottom = "0px";
            var tabMenuLine = document.getElementById("tabMenuLineTd");
            if (tabMenuLine) {
                tabMenuLine.style.display = "none";
                tabMenuLine.style.width = "0px";
            }
            DivTabMenu.style.display = "none";
            //			var backgrndImg = parent.document.getElementById('intSubeTabMenuBackgroundResmi');
            //			backgrndImg.removeClass('tabAltiBeyaz');
            $("#intSubeTabMenuBackgroundResmi", parent.document.body).removeClass('tabAltiBeyaz');
            return;
            //alert('trkd yok');
        }

        var lastTRKD = querySt('trkd').replace('TM_', '');

        if (lastTRKD == 'INTGIRIS')
            return;

        var isimDizi = isim.split(';');
        var trkdDizi = trkd.split(';');
        var islemSiraDizi = islemSira.split('-');
        var aktifDizi = aktif.split(';');

        var tabMenu = '<table id="tblTabMenu" cellpadding="0" cellspacing="0" border="0"><tr><td width="10">&nbsp;</td>'
        var j;

        if (lastTRKD.indexOf('TM_') != -1) {
            lastTRKD = lastTRKD.substring(3);
        }

        if (lastTRKD == 'MBEH') {
            lastTRKD = 'MBEHA'
        }

        for (i = 0; i < trkdDizi.length - 1; i++) {
            //alert('trkdDizi\'nin elemanlar�' + trkdDizi[i]);

            if (islemSiraDizi[i] == 'undefined') {
                islemSiraDizi[i] = '';
                //alert('islem sira undefined');
            }

            if (i != 0) {
                tabMenu += '<td width="10">&nbsp;</td>'
            }

            j = 2;

            if (lastTRKD == trkdDizi[i]) {
                j = 1;
                //alert( 'last trkd trkd ile e�it ');
            }

            tabMenu += '<td><table id="tbl_tab' + i + '" class="typeintab" cellpadding="0" cellspacing="0" border="0"><tr><td class="intab-left';
            if (j == 1) {
                tabMenu += ' selected_tab';
            }
            tabMenu += '" width="8" height="22" style="line-height: 22px;">&nbsp;</td>';
            tabMenu += '<td class="intab-center';
            if (j == 1) {
                tabMenu += ' selected_tab';
            }
            tabMenu += '" height="22" align="center" valign="middle" style="line-height: 22px;"';
            if (aktifDizi[i] == 0) {
                tabMenu += 'onclick = "javascript:alert(\'��lem bu kanaldan yap�lamamaktad�r!\')"';
                //alert('Bu kanaldan olmaz');
            }
            else {
                tabMenu += 'onclick = "javascript:parent.checkTRKD(\'' + trkdDizi[i] + '\',\'\',\'\',\'' + islemSiraDizi[i] + '\')"';
            }
            tabMenu += ' onmouseover = "ShowStatus(\'' + trkdDizi[i] + '\',\'' + islemSiraDizi[i] + '\')"';
            tabMenu += ' onmouseout = "javascript:HideStatus()"';

            tabMenu += '>' + isimDizi[i] + '</td><td class="intab-right';
            if (j == 1) {
                tabMenu += ' selected_tab';
            }
            tabMenu += '" width="8" height="22" style="line-height: 22px;">&nbsp;</td></tr></table></td>';

        }

        tabMenu += '</tr></table>';

        var scrollWidth = parent.icerik.document.body.scrollWidth;
		if(scrollWidth == 0)
			scrollWidth = 500;
        var lineWidth = ('' +scrollWidth).replace('px', '');
        //var lineWidth = ('' + parent.icerik.document.body.scrollWidth).replace('px', '');

        //tabMenu += '<table><tr><td width="10"></td><td style="width:750px;border-width:1px;border-style:solid;border-color:#49A5E0;"></td></tr></table>'; 		
        tabMenu += '<table style="border-collapse:collapse;"><tr></td><td id="tabMenuLineTd" class="tabMenuUnderline" style="width:' + lineWidth + 'px" ></td></tr></table>';
        //alert(icerik.document.getElementById('ControlLabel').offsetWidth);
        //alert(tabMenu);

        DivTabMenu.innerHTML = tabMenu;
        if (!isInsideVB()) {
            DivTabMenu.style.paddingTop = "15px";
            DivTabMenu.style.marginBottom = ($(DivTabMenu).height() * -1) - 15 + "px";
            DivTabMenu.style.width = lineWidth + "px";
        }
        else {
            DivTabMenu.style.paddingTop = "0px";
            DivTabMenu.style.marginBottom = "0px";
            DivTabMenu.style.width = "800px";
        }
        DivTabMenu.style.display = "block";
        //$("#TabMenu").css({ "padding-top": "16px", "margin-bottom": ($("#TabMenu").height() * -1) - 16 + "px" });

        $("#intSubeTabMenuBackgroundResmi", parent.document.body).addClass('tabAltiBeyaz');
        //		var backgrndImg = parent.document.getElementById('intSubeTabMenuBackgroundResmi');
        //		alert(backgrndImg);
        //		backgrndImg.addClass('tabAltiBeyaz');
        return;
    }
    //alert('createhtml\'e gelemedi');

}

//--------------------------------------

function ClearTimerOBICoex() {
    try {

        ClearTimeoutOBICoex();
    } catch (e) {
        var a = e;
    }
}

function checkTRKD(trkd, pageName, islem, islemSira) {
ClearTimerOBICoex();
	var bibtoomni = null;
	try	{
		bibtoomni = FromBIBToOmniTransactions;	
		var arr = bibtoomni.split(';');
		
		
		for (i = 0; i < arr.length; i++) 
		{
			var temp = arr[i].split('-');
			if(temp[0] == trkd)
			{
				MenuClickForOmni(temp[1],islemSira,'O');
				return;
			}
		}

	}
	catch(e)
	{
		var a = e;
	}
	

   //burada trkd asl�nda bir obje i�inde attribute'ler var Sira falan. Dikkat..
    if (arguments.length == 1) {
        checkTRKDOmni(trkd);
    }
    else {
        // f1 called with three arguments


        if (parent.SubChannel == parent.SubChannelAnasayfa) {
            checkTRKDAdditional(trkd, pageName, islem, islemSira, parent.document.getElementById('anasayfaaspx').contentWindow);
        } else {
            checkTRKDAdditional(trkd, pageName, islem, islemSira, "");
        }
    }
}

function checkTRKDOmni(trxObject) {
    if (parent.SubChannel == parent.SubChannelAnasayfa) {
        checkTRKDAdditional(trxObject.trkd, trxObject.pageName, trxObject.islem, trxObject.islemSira, parent.document.getElementById('anasayfaaspx').contentWindow);
    } else {
        checkTRKDAdditional(trxObject.trkd, trxObject.pageName, trxObject.islem, trxObject.islemSira, "");
    }
}

function RevCoexBIBTrxStartProc() {
    if (typeof (YTIHasToken) != "undefined") // gitmeli.ori.
        YTIHasToken = false; // gitmeli.ori.
    whoHasToken = "MBI";
    //    if (typeof (parent.hideOBI) != "undefined") // sadece if gitmeli.ori.
    //        parent.hideOBI();
    //    if (hasVBInside()) {
    //        parent.hideYTI();        
    //    }    
}

function checkTRKDAdditional(trkd, pageName, islem, islemSira, additionalData) {
	ClearTimerOBICoex();
    if (trkd.indexOf(".aspx") === -1 && trkd.indexOf(".") > -1) {
        MenuClickForOmni(trkd, islemSira, 'O');
    }
    else {
        RevCoexBIBTrxStartProc();
        var v = getTrxUrl(trkd, pageName, islem, islemSira);
        //alert(v);
        if (typeof (additionalData) == "string") {
            parent.icerik.location.href = v + additionalData;
        }
        else {
            additionalData.location.href = v;
        }
        setLastTrx(trkd);

        if (parent.menuJson != undefined) {
            try {
                parent.NavigateMenuOmni(trkd, islemSira);
            }
            catch (e) {
            }
        }
    }

    /*try
    {
    HideAndClearSearchList();	
    }
    catch (e)
    {
    }*/
}

function checkAndSubmitTRKD(trkd, pageName, islem, islemSira) {
    document.forms[0].action = getTrxUrl(trkd, pageName, islem, islemSira);
    setLastTrx(trkd);
    document.forms[0].submit();
}

function isRnoNumeric(val) {
    var f = String(val);
    var bagnum = "0123456789";
    for (i = 0; i < (f.length); i++) {
        if (bagnum.indexOf(f.charAt(i)) == -1) {
            return false;
        }
    }
    return true;
}

//----------------------------------------------------------------------------------------------------------------------------------
function getTrxUrl(trkd, pageName, islem, islemSira) {
    var newrno = "";

    if (isRnoNumeric(parent.parent.document.getElementsByName("rno")[0].value)) {
        newrno = parent.parent.document.getElementsByName("rno")[0].value;
    }

    return (ApplicationVirtualDirectory + "/RequestHandler.ashx?trkd=" + trkd + "&rno=" + newrno + "&islem=" + islem + "&lastTRKD=" + parent.parent.document.forms[0].lastTRKD.value + "&lastTransactionPeriod=" + parent.parent.document.forms[0].lastTransactionPeriod.value + "&id=" + parent.parent.document.forms[0].isID.value + "&islemSira=" + islemSira + "&pageName=" + pageName);

}
function setLastTrx(trkd) {
    parent.document.forms[0].lastTRKD.value = trkd;
    parent.document.forms[0].lastSubmitTime.value = GetTimeinMSeconds();
}
//----------------------------------------------------------------------------------------------------------------------------------
function gotoHKASBG(pageName) {
    //location.href = "/" + ApplicationVirtualDirectory + "/isModules/Krediler/AnaSayfaHizliKredi/" + pageName ;
    location.href = pageName;

}
//----------------------------------------------------------------------------------------------------------------------------------
function GetTimeinMSeconds() {
    d = new Date();
    return d.getTime();
}
//----------------------------------------------------------------------------------------------------------------------------------
function IsStart(langcode) {
    if (parent.document.getElementById("isTabletApp") && parent.document.getElementById("isTabletApp").value == "true") {
        var os = parent.document.getElementById("osType").value;
        parent.location.href = ApplicationVirtualDirectory + '/index.aspx?isTablet=true&OS=' + os + '&width=' + screen.availWidth + '&height=' + screen.availHeight + '&LangCode=' + langcode;
        sendReLogonMessage();
    }
    else {
        parent.location.href = ApplicationVirtualDirectory + '/index.aspx' + '?width=' + screen.availWidth + '&height=' + screen.availHeight + '&LangCode=' + langcode;
    }
}

//----------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------
function IsLogOut(langcode) {
    parent.location.href = ApplicationVirtualDirectory + '/logoutpage.aspx?LangCode=' + langcode;
    if (parent.document.getElementById("isTabletApp") && parent.document.getElementById("isTabletApp").value == "true") {
        sendLogoutMessage();
    }
    //   parent.location.href=  getTrxUrl(trkd,pageName,islem);
    //   setLastTrx(trkd);
}
//----------------------------------------------------------------------------------------------------------------------------------
function sendReLogonMessage() {
    var obj = { action: 'ReLogon', content: { type: 'site', src: 'index.aspx'} };
    var msg = JSON.stringify(obj);
    JSBridge.SendUrl(msg);
}
function sendLogoutMessage() {
    var obj = { action: 'Logout', content: { type: 'site', src: 'index.aspx'} };
    var msg = JSON.stringify(obj);
    if (parent.document.getElementById("osType").value == "android")
        for (i = 0; i < 10; i++) { JSBridge.SendUrl(msg); }
    JSBridge.SendUrl(msg);
}
//----------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------
function AssertDate(maxdiffday) {
    var Date1Day = document.forms[0]._ctl0_DrpDate1Day.value;
    var Date1Month = document.forms[0]._ctl0_DrpDate1Month.value;
    var Date1Year = document.forms[0]._ctl0_DrpDate1Year.value;
    var Date2Day = document.forms[0]._ctl0_DrpDate2Day.value;
    var Date2Month = document.forms[0]._ctl0_DrpDate2Month.value;
    var Date2Year = document.forms[0]._ctl0_DrpDate2Year.value;

    //Date fonksiyonu tarih i�in ay bilgisini 0'dan ba�lat�p 11'e kadar ilerletti�i i�in 1 ��kar�ld�	
    Date1Month -= 1;
    Date2Month -= 1;

    FirstDate = new Date(Date1Year, Date1Month, Date1Day);
    SecondDate = new Date(Date2Year, Date2Month, Date2Day);
    Now = new Date();
    if (maxdiffday != 0) {
        var DiffFromNow = Now - FirstDate;
        DiffFromNow = new String(DiffFromNow / 86400000);
        if (DiffFromNow < 0) {
            alert(commonNew_msgBugundenIleriTarihGirme);
            return false;
        }

        var DiffFromNow = Now - SecondDate;
        DiffFromNow = new String(DiffFromNow / 86400000);
        if (DiffFromNow < 0) {
            alert(commonNew_msgBugundenIleriTarihGirme);
            return false;
        }
    }

    var Diff = SecondDate - FirstDate;
    Diff = new String(Diff / 86400000);

    if (Diff < 0) {
        alert(commonNew_msgSonaDahaBuyukTarihGir);
        document.forms[0]._ctl0_DrpDate2Day.focus();
        return false;
    }



    return true;


}
//----------------------------------------------------------------------------------------------------------------------------------
function AssertDateAnnounce(maxdiffday) {

    var Date1Day = document.forms[0]._ctl0_DrpDate1Day.value;
    var Date1Month = document.forms[0]._ctl0_DrpDate1Month.value;
    var Date1Year = document.forms[0]._ctl0_DrpDate1Year.value;
    var Date2Day = document.forms[0]._ctl0_DrpDate2Day.value;
    var Date2Month = document.forms[0]._ctl0_DrpDate2Month.value;
    var Date2Year = document.forms[0]._ctl0_DrpDate2Year.value;

    //Date fonksiyonu tarih i�in ay bilgisini 0'dan ba�lat�p 11'e kadar ilerletti�i i�in 1 ��kar�ld�	
    Date1Month -= 1;
    Date2Month -= 1;

    FirstDate = new Date(Date1Year, Date1Month, Date1Day);
    SecondDate = new Date(Date2Year, Date2Month, Date2Day);
    Now = new Date();
    var DiffFromNow = Now - FirstDate;
    DiffFromNow = new String(DiffFromNow / 86400000);
    var DiffFromNow2 = Now - SecondDate;
    DiffFromNow2 = new String(DiffFromNow2 / 86400000);

    if (DiffFromNow2 > 1) {
        alert(commonNew_msgBugundenGeriTarihGirme);
        return false;
    }

    if (maxdiffday != 0) {

        if (DiffFromNow < 0) {
            alert(commonNew_msgBugundenIleriTarihGirme);
            return false;
        }

        var DiffFromNow = Now - SecondDate;
        DiffFromNow = new String(DiffFromNow / 86400000);
        if (DiffFromNow < 0) {
            alert(commonNew_msgBugundenIleriTarihGirme);
            return false;
        }
    }

    var Diff = SecondDate - FirstDate;
    Diff = new String(Diff / 86400000);

    if (Diff < 0) {
        alert(commonNew_msgSonaDahaBuyukTarihGir);
        document.forms[0]._ctl0_DrpDate2Day.focus();
        return false;
    }

    return true;


}
//----------------------------------------------------------------------------------------------------------------------------------
function IBANCheck(IBAN, CountryCodeForIBAN) {
    var WarningPrefix = "Say�n M��terimiz, ";

    //IBAN kullanan bir �lke ise
    if (IsIBANCountry(CountryCodeForIBAN)) {
        var i;
        var j;
        var x1;
        var x2;
        var x3;

        var IBANStr = new String(IBAN);
        IBANStr = IBANStr.toUpperCase();

        if (!(IBANStr.charCodeAt(0) >= 65 && IBANStr.charCodeAt(0) <= 90 &&
		   IBANStr.charCodeAt(1) >= 65 && IBANStr.charCodeAt(1) <= 90)) {
            alert(commonNew_msgHesapNoUyari);
            return false;
        }

        if (!(IBANStr.substring(0, 2) == CountryCodeForIBAN)) {
            alert(WarningPrefix + "girdi�iniz hesap numaras� (IBAN) ile Muhabir banka koduna ait �lke bilgisi tutars�z. L�tfen se�iminizi kontrol ediniz.");
            return false;
        }

        x1 = "";
        for (var i = 0; i < IBANStr.length; ++i) {
            if ((IBANStr.charCodeAt(i) >= 65 && IBANStr.charCodeAt(i) <= 90) || (IBANStr.charCodeAt(i) >= 48 && IBANStr.charCodeAt(i) <= 57)) {
                x1 = x1 + IBANStr.charAt(i);
            }
        }
        x1 = x1.substring(4, x1.length).concat(x1.substring(0, 4));

        x2 = "";
        for (i = 0; i < x1.length; ++i) {
            if (x1.charCodeAt(i) >= 65 && x1.charCodeAt(i) <= 90) {
                x2 = x2.concat(x1.charCodeAt(i) - 55)
            }
            else {
                x2 = x2.concat(x1.charAt(i))
            }
        }

        x3 = parseInt(x2.substring(0, 2), 10)
        j = x3 % 97
        for (i = 2; i < x2.length; ++i) {
            x3 = 10 * j + parseInt(x2.substring(i, i + 1), 10);
            j = x3 % 97;
        }
        if (j == 1) {
            return true;
        }
        else {
            alert(commonNew_msgHesapNoBilgiGir);
            return false;
        }
    }
    //IBAN kullanan bir �lke de�il ise
    else {
        return true;
    }
}
//----------------------------------------------------------------------------------------------------------------------------------
//IBAN kullanan bir �lke olup olmad���n� kontrol eder
function IsIBANCountry(CountryCode) {
    if (CountryCode == "DE" || 		//ALMANYA
		CountryCode == "AD" || 		//ANDORRA
		CountryCode == "AT" || 		//AVUSTURYA
		CountryCode == "BE" || 		//BEL��KA
		CountryCode == "GI" || 		//CEBEL� TARIK
		CountryCode == "CZ" || 		//�EK CUMHUR�YET�
		CountryCode == "DK" || 		//DAN�MARKA
		CountryCode == "EE" || 		//ESTONYA
		CountryCode == "FI" || 		//F�NLAND�YA
		CountryCode == "FR" || 		//FRANSA
		CountryCode == "NL" || 		//HOLLAMDA
		CountryCode == "GB" || 		//�NG�LTERE
		CountryCode == "IE" || 		//�RLANDA
		CountryCode == "ES" || 		//�SPANYA
		CountryCode == "SE" || 		//�SVE�
		CountryCode == "CH" || 		//�SV��RE
		CountryCode == "IT" || 		//�TALYA
		CountryCode == "LV" || 		//LETONYA
		CountryCode == "LT" || 		//L�TVANYA
		CountryCode == "IS" || 		//�ZLANDA
		CountryCode == "LU" || 		//L�KSEMBURG
		CountryCode == "HU" || 		//MACAR�STAN
		CountryCode == "NO" || 		//NORVE�
		CountryCode == "PL" || 		//POLONYA
		CountryCode == "PT" || 		//PORTEK�Z
		CountryCode == "SK" || 		//SLOVAKYA
		CountryCode == "SI" || 		//SLOVENYA
		CountryCode == "GR") 			//YUNAN�STAN
    {
        return true;
    }

    return false;
}
//----------------------------------------------------------------------------------------------------------------------------------
function CheckNumericalElement(Element, ElementName) {
    if (Element.value == "") {
        alert(commonNew_msgElementNameGir);
        Element.focus();
        return false;
    }
    else {
        if (isNaN(Element.value)) {
            alert(commonNew_msgElementNameSayisalOlmali);
            Element.focus();
            return false;
        }
        else {
            if (Number(Element.value) <= 0) {
                alert(commonNew_msgElementNamePozitifGir);
                Element.focus();
                return false;
            }
            return true;
        }
    }
}
function CheckInputValue(Object, MinLength, Message) {

    if (Object && (Object.value == "" || Object.value == 0)
		|| MinLength != -1 && Object.value.length < MinLength) {
        alert(Message);
        Object.focus();
        return false;
    }
}


function KurusKontrolEt(fkurus) {
    if (!(fkurus) || (fkurus.value == "") || (fkurus.value == "00") || (fkurus.value <= 0)) {
        fkurus.value = "00";
        return false;
    }

    if (fkurus.value.length == 1) {
        fkurus.value = fkurus.value + 0;
    }

    return true;
}

function CheckInputForXML() {
    XMLLookUpVals = new String(XMLLookUpTable);
    if (XMLLookUpVals != "") {
        var XMLLookUpElement = "";
        var Start = 0;
        var DelimeterPoint = 1;
        EndofString = new Boolean(false);
        Counter = 1;

        while (EndofString == false) {
            DelimeterPoint = XMLLookUpVals.indexOf(XMLValsDelimeter, Start);

            if (DelimeterPoint < 0) {
                EndofString = true;
                DelimeterPoint = XMLLookUpVals.length;

            }
            else {
                XMLLookUpElement = XMLLookUpVals.substring(Start, DelimeterPoint);
                if (event.keyCode == XMLLookUpElement) {
                    return false;
                }
                Start = DelimeterPoint + XMLLookUpElement.length;
            }
        }
    }
    return true;
}
function SetHiddenType(Control, Val) {
    eval("document.forms[0]." + Control + ".value=" + Val);
}
//----------------------------------------------------------------------------------------------------------------------------------
function Dekont_CheckInputs() {
    if (AssertDate(document.forms[0]._ctl0_DekontSorgu_DrpIlkTarihGun, document.forms[0]._ctl0_DekontSorgu_DrpIlkTarihAy, document.forms[0]._ctl0_DekontSorgu_DrpIlkTarihYil,
				  document.forms[0]._ctl0_DekontSorgu_DrpSonTarihGun, document.forms[0]._ctl0_DekontSorgu_DrpSonTarihAy, document.forms[0]._ctl0_DekontSorgu_DrpSonTarihYil)) {
        if (document.forms[0]._ctl0_DekontSorgu_ChkSorguTip2.checked == true) {
            if (document.forms[0]._ctl0_DekontSorguMin_Tutar.value == "") {
                alert("L�tfen Minimum tutar alan�na numerik bir de�er giriniz");
                document.forms[0]._ctl0_DekontSorguMin_Tutar.focus();
                return false;
            }
            if (document.forms[0]._ctl0_DekontSorguMax_Tutar.value == "" || document.forms[0]._ctl0_DekontSorguMax_Tutar.value == "0") {
                alert("L�tfen Maksimum tutar alan�na numerik bir de�er giriniz");
                document.forms[0]._ctl0_DekontSorguMax_Tutar.focus();
                return false;
            }
            if (parseInt(document.forms[0]._ctl0_DekontSorguMin_Tutar.value) && parseInt(document.forms[0]._ctl0_DekontSorguMax_Tutar.value)) {
                var kckTutar = document.forms[0]._ctl0_DekontSorguMin_Tutar.value;
                var bykTutar = document.forms[0]._ctl0_DekontSorguMax_Tutar.value

                kckTutar = kckTutar.replace(",", "");
                bykTutar = bykTutar.replace(",", "");


                if (parseInt(kckTutar) > parseInt(bykTutar)) {
                    alert("L�tfen Maksimum tutar alan�na Minimum tutar alan�ndan b�y�k bir de�er giriniz");
                    return false;
                }
            }
        }
        return TutarGeriAl();
    }
    return false;
}

//----------------------------------------------------------------------------------------------------------------------------------
function AssertDate(DrpDate1Day, DrpDate1Month, DrpDate1Year, DrpDate2Day, DrpDate2Month, DrpDate2Year, maxdiffday) {
    var Date1Day = DrpDate1Day.value;
    var Date1Month = DrpDate1Month.value;
    var Date1Year = DrpDate1Year.value;
    var Date2Day = DrpDate2Day.value;
    var Date2Month = DrpDate2Month.value;
    var Date2Year = DrpDate2Year.value;

    //Date fonksiyonu tarih i�in ay bilgisini 0'dan ba�lat�p 11'e kadar ilerletti�i i�in 1 ��kar�ld�	
    Date1Month -= 1;
    Date2Month -= 1;

    FirstDate = new Date(Date1Year, Date1Month, Date1Day);
    SecondDate = new Date(Date2Year, Date2Month, Date2Day);
    Now = new Date();

    var DiffFromNow = Now - FirstDate;
    DiffFromNow = new String(DiffFromNow / 86400000);
    if (DiffFromNow < 0) {
        alert(commonNew_msgBugundenIleriTarihGirme);
        return false;
    }

    DiffFromNow = Now - SecondDate;
    DiffFromNow = new String(DiffFromNow / 86400000);
    if (DiffFromNow < 0) {
        alert(commonNew_msgBugundenIleriTarihGirme);
        return false;
    }

    var Diff = SecondDate - FirstDate;
    Diff = new String(Diff / 86400000);
    if (Diff < 0) {
        alert(commonNew_msgSonaDahaBuyukTarihGir);
        DrpDate2Day.focus();
        return false;
    }

    if (maxdiffday != 0) {
        if (Diff > maxdiffday + 1) {
            alert(commonNew_msgTarihAraligiAsildi);
            DrpDate1Day.focus();
            return false;
        }
    }


    return true;


}
//----------------------------------------------------------------------------------------------------------------------------------
function Dekont_ControlInputs(ControlType) {
    if (ControlType == "1") {
        if (document.forms[0]._ctl0_DekontSorgu_ChkSorguTip1.checked == true) {
            document.forms[0]._ctl0_DekontSorgu_DrpType.disabled = false;
        }
        else {
            document.forms[0]._ctl0_DekontSorgu_DrpType.selectedIndex = 0;
            document.forms[0]._ctl0_DekontSorgu_DrpType.disabled = true;
            document.forms[0]._ctl0_DekontSorgu_DrpType.disabled = true;
        }
    }
    else {
        if (document.forms[0]._ctl0_DekontSorgu_ChkSorguTip2.checked == true) {
            document.forms[0]._ctl0_DekontSorguMin_Tutar.value = "0";
            document.forms[0]._ctl0_DekontSorguMax_Tutar.value = "1,000";

            document.forms[0]._ctl0_DekontSorguMin_Tutar.disabled = false;
            document.forms[0]._ctl0_DekontSorguMax_Tutar.disabled = false;
        }
        else {
            document.forms[0]._ctl0_DekontSorguMin_Tutar.value = "0";
            document.forms[0]._ctl0_DekontSorguMax_Tutar.value = "0";
            document.forms[0]._ctl0_DekontSorguMin_Tutar.disabled = true;
            document.forms[0]._ctl0_DekontSorguMax_Tutar.disabled = true;
        }
    }
}
//----------------------------------------------------------------------------------------------------------------------------------
function Initialize_DekontValues() {
    if (document.forms[0]._ctl0_DekontSorgu_ChkSorguTip1.checked == true) {
        document.forms[0]._ctl0_DekontSorgu_DrpType.disabled = false;
    }
    else {
        document.forms[0]._ctl0_DekontSorgu_DrpType.disabled = true;
    }
    if (document.forms[0]._ctl0_DekontSorgu_ChkSorguTip2.checked == true) {
        document.forms[0]._ctl0_DekontSorguMin_Tutar.disabled = false;
        document.forms[0]._ctl0_DekontSorguMax_Tutar.disabled = false;
    }
    else {
        document.forms[0]._ctl0_DekontSorguMin_Tutar.disabled = true;
        document.forms[0]._ctl0_DekontSorguMax_Tutar.disabled = true;
    }
}
//----------------------------------------------------------------------------------------------------------------------------------
function HesapHareketleri_CheckInputs() {
    HesapVal = new String(document.forms[0]._ctl0_HesapHareketlerimGiris_DrpLstHesapSec.value);
    if (HesapVal.substr(0, 2) == "-1") {
        alert("L�tfen bir hesap se�iniz.");
        document.forms[0]._ctl0_HesapHareketlerimGiris_DrpLstHesapSec.focus();
        return false;
    }

    if (document.forms[0]._ctl0_HesapHareketlerimGiris_DrpIlkTarihYil.value != document.forms[0]._ctl0_HesapHareketlerimGiris_DrpSonTarihYil.value) {
        alert("L�tfen ilk ve son tarih i�in ayn� y�llar� se�iniz.");
        document.forms[0]._ctl0_HesapHareketlerimGiris_DrpIlkTarihYil.focus();
        return false;
    }

    if (AssertDate(document.forms[0]._ctl0_HesapHareketlerimGiris_DrpIlkTarihGun, document.forms[0]._ctl0_HesapHareketlerimGiris_DrpIlkTarihAy, document.forms[0]._ctl0_HesapHareketlerimGiris_DrpIlkTarihYil,
				  document.forms[0]._ctl0_HesapHareketlerimGiris_DrpSonTarihGun, document.forms[0]._ctl0_HesapHareketlerimGiris_DrpSonTarihAy, document.forms[0]._ctl0_HesapHareketlerimGiris_DrpSonTarihYil) == false) {
        return false;
    }

    var SelectedLastDay = document.forms[0]._ctl0_HesapHareketlerimGiris_DrpSonTarihGun.value;
    var SelectedLastMonth = document.forms[0]._ctl0_HesapHareketlerimGiris_DrpSonTarihAy.value;
    var SelectedLastYear = document.forms[0]._ctl0_HesapHareketlerimGiris_DrpSonTarihYil.value;
    var SelectedHiddenDay = document.forms[0].SonTarihGun.value;
    var SelectedHiddenMonth = document.forms[0].SonTarihAy.value;
    var SelectedHiddenYear = document.forms[0].SonTarihYil.value;

    SelectedLastMonth -= 1;
    SelectedHiddenMonth -= 1;

    SelectedDate = new Date(SelectedLastYear, SelectedLastMonth, SelectedLastDay);
    HiddenDate = new Date(SelectedHiddenYear, SelectedHiddenMonth, SelectedHiddenDay);

    var DiffFromNow = SelectedDate - HiddenDate;
    DiffFromNow = new String(DiffFromNow / 86400000);
    if (DiffFromNow > 0) {
        SelectedHiddenMonth += 1;
        alert('Se�ti�iniz tarih aral��� ' + padleft(SelectedHiddenDay, '0', 2) + '.' + padleft(SelectedHiddenMonth, '0', 2) + '.' + SelectedHiddenYear + '\'e kadar olmal�d�r. L�tfen tekrar giri� yap�n�z.');
        return false;
    }

    return true;
}
//----------------------------------------------------------------------------------------------------------------------------------
function ValidateEMail(Mailelement) {
    TurkishCharacters = new Array("�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�");
    var MailText = Mailelement.value;
    if (MailText.indexOf("@") == -1 || MailText.indexOf(".") == -1) {
        alert(EMail_Hatali);
        Mailelement.focus();
        return false;
    }
    if (MailText.lastIndexOf(".") < MailText.indexOf("@")) {
        alert(EMail_Hatali);
        Mailelement.focus();
        return false;
    }

    for (i = 0; i < TurkishCharacters.length; i++) {
        if (MailText.indexOf(TurkishCharacters[i]) != -1) {
            alert(EMail_Hatali);
            Mailelement.focus();
            return false;
        }
    }
    return true;
}
//----------------------------------------------------------------------------------------------------------------------------------
function setBrowser() {
    if (navigator.appVersion.charAt(0) == "4") {
        if (navigator.appName.indexOf("Explorer") >= 0) {
            isIE4 = true;
        }
        else {
            isNav4 = true;
        }
    }
    else if (navigator.appVersion.charAt(0) > "4") {
        isNav6 = true;
    }
}

//----------------------------------------------------------------------------------------------------------------------------------
function swap(divNum, expanding) {
    StrDivNum = new String(divNum);
    if (StrDivNum.length < 3) {
        MenuID = divNum
        //SubMenuID = 0
    }
    else {
        MenuID = StrDivNum.substring(0, StrDivNum.length - 2)
        if (MenuID.length > 2) {
            MenuID = MenuID.substring(0, MenuID.length - 2)
        }
        //SubMenuID = StrDivNum.substring(StrDivNum.length-2,2)
    }

    //alert(SubMenuID);

    for (i = 0; i < 20; i++) {
        if (document.all["c" + i] == null) {
            break;
        }

        if (document.all["c" + i]) {

            var Index
            for (j = 0; j < 20; j++) {
                StrJ = new String(j);
                if (StrJ.length == 1) {
                    Index = i + "0" + j;
                }
                else {
                    Index = String(i) + String(j);
                }
                if (divNum != 0) {
                    if (document.all["c" + Index] == null) {
                        break;
                    }
                }

                if (document.all["c" + Index]) {
                    setIdProperty("e" + Index, "display", "none");
                    setIdProperty("c" + Index, "display", "inline");
                }
            }
            /*	Ana menu*/
            setIdProperty("e" + i, "display", "none");
            setIdProperty("c" + i, "display", "inline");
        }

    }

    if (expanding) {
        setIdProperty("c" + MenuID, "display", "none");
        setIdProperty("e" + MenuID, "display", "inline");

        setIdProperty("c" + divNum, "display", "none");
        setIdProperty("e" + divNum, "display", "inline");
    }
    else {
        setIdProperty("e" + divNum, "display", "none");
        setIdProperty("c" + divNum, "display", "inline");

        /*	sub menu kapat�l�yor */
        if (StrDivNum.length > 2) {
            setIdProperty("c" + MenuID, "display", "none");
            setIdProperty("e" + MenuID, "display", "inline");
        }
    }
}
//----------------------------------------------------------------------------------------------------------------------------------
function swapall(expanding) {

    var list = document.getElementById('IDLIST').value.split(";");

    if (expanding) {
        for (i = 0; i < list.length - 1; i++) {

            setIdProperty("c" + list[i], "display", "none");
            setIdProperty("e" + list[i], "display", "inline");


        }
        setIdProperty("c0", "display", "none");
        setIdProperty("e0", "display", "inline");

    }
    else {
        for (i = 0; i < list.length - 1; i++) {
            setIdProperty("e" + list[i], "display", "none");
            setIdProperty("c" + list[i], "display", "inline");
        }

        setIdProperty("c0", "display", "inline");
        setIdProperty("e0", "display", "none");
    }



}
//----------------------------------------------------------------------------------------------------------------------------------
function setIdProperty(id, property, value) {

    var styleObject = document.getElementById(id);

    if (styleObject != null) {
        styleObject = styleObject.style;
        styleObject[property] = value;
    }

}
//----------------------------------------------------------------------------------------------------------------------------------
function OpenTimeOutPopup() {
    if (window.document.forms[0].IsTimeOut != null && window.document.forms[0].IsTimeOut.value == "1") {
        //timeout oldu�unda lightbox � kapatmak i�in. CANER
        //	if(window.document.forms[0].isLightBoxOpen.value=="1")
        //		{		
        //    		hidePopWin(false);
        //		}
        window.document.forms[0].IsTimeOut.value = "0";
        NewWindow('TimeOutPopup.aspx', '', '715', '300', 'no', 'center');
    }
}
//----------------------------------------------------------------------------------------------------------------------------------
function padleft(val, ch, num) {
    var re = new RegExp(".{" + num + "}$");
    var pad = "";
    if (!ch)
        ch = " ";
    do {
        pad += ch;
    }
    while (pad.length < num);
    return re.exec(pad + val);
}
//----------------------------------------------------------------------------------------------------------------------------------
function padright(val, ch, num) {
    var re = new RegExp("^.{" + num + "}");
    var pad = "";
    if (!ch)
        ch = " ";
    do {
        pad += ch;
    }
    while (pad.length < num);
    return re.exec(val + pad);
}
//----------------------------------------------------------------------------------------------------------------------------------

function resizeFrameInside(selfCall) {
    var IFrame;
    if (isInsideVB())
        IFrame = GetVBLightBoxFrameWithDocument();
    else
        IFrame = parent.parent.GetVBLightBoxFrameWithDocument();
    var Framewidth = 0;
    var Frameheigth = 0;



    if (IFrame) {
        if (typeof (FixedLightBoxWidth) != "undefined")
            return;
        if (isInsideVB()) {
            try {
                Framewidth = IFrame.contentWindow.document.body.scrollWidth;
                Frameheight = IFrame.contentWindow.document.body.scrollHeight;
                if (Framewidth == 0) {
                    setTimeout("resizeFrameInside(1)", 200);
                    return;
                }

                if (selfCall == 1)//56041
                    setTimeout("((isMTIInLightBox()) ? GetVBLightBoxFrame() : GetMTILightBoxFrame()).$('span').each(function(){if ($(this).parent().attr('class') == 'MsgTitle2' || $(this).parent().parent().attr('class') == 'MsgTitle2' ) $(this).text($(this).text() + ' ') })", 250); //56041

            } catch (e) {
                Framewidth = IFrame.offsetWidth;
                Frameheight = IFrame.offsetHeight;
            }
        }
        else {
            if (!IEmi()) {
                IFrame.style.width = 0 + "px";
                IFrame.style.height = 0 + "px";
            }
            Framewidth = IFrame.contentWindow.document.body.scrollWidth;
            Frameheight = IFrame.contentWindow.document.body.scrollHeight;
        }
        if (Framewidth != 0)
            IFrame.style.width = (Framewidth + 20) + "px";
        if (Frameheight != 0)
            IFrame.style.height = (Frameheight + 20) + "px";
        //alert("width:" + Framewidth);
        //alert("height:" + Frameheight);
        if (isInsideVB()) {
            SizeMTIForMtiLightBox(Framewidth + 20, Frameheight + 20)
        }
    }

}


function LightBoxOpener() {

    //alert('LightboxOpener Begin');
    var selector_isLightbox = null;
    try {
        selector_isLightbox = $("input[IsLightbox='True'],a[IsLightbox='True'],span[IsLightbox='True'],div[IsLightbox='True']");
        selector_isLightboxFalse = $("input[type='submit'][IsLightbox='False']");
        selector_isPassword = $("input[type='submit'][IsPasswordMo='True']");

    }
    catch (err) {
        //alert("LightBoxOpener : exception " + err.description)
    }

    //alert($(selector_isLightbox).attr("onclick"));
    //alert($(selector_isLightbox));
    //alert("$(selector_isLightbox)[0] : " + $(selector_isLightbox)[0]);
    //	alert($(selector_isLightbox).atrr("id"));

    try {

        //Giri� Sayfas�ndan isLightbox True set edilmi� submit butonuna bas�ld���nda
        if ($(selector_isLightbox)[0] != null) {
            //alert("selector_isLightbox : " + $(selector_isLightbox).atrr("id"));
            var SendBtnId = $(selector_isLightbox).attr("id");
            //alert(SendBtnId );
            if (document.getElementById(SendBtnId) && $(selector_isLightbox) && $(selector_isLightbox)[0]) {

                var MtiLightboxResult = true;
                if (isInsideVB() && parent.IsMtiLightbox()) {
                    MtiLightboxResult = false;
                }

                if (MtiLightboxResult) {
                    $(selector_isLightbox).each
			(
				function () {
				    //alert(this.id);
				    //alert($(this).attr('onclick'));
                    var StronclickEvent = document.getElementById(this.id).onclick;

                    //alert("caner2 " + document.getElementById(this.id));

                    //alert("caner " + document.getElementById(this.id).onclick);

				    document.getElementById(this.id).onclick = new Function('return FormBtnOnclickForLightBox(' + StronclickEvent + ')');
				}

			);
                }
            }

            /*
            if(	document.getElementById(SendBtnId) && $(selector_isLightbox) && $(selector_isLightbox)[0])
            {
		
            var StronclickEvent = $(selector_isLightbox).attr('onclick');
            document.getElementById(SendBtnId).onclick  = new Function ('return FormBtnOnclickForLightBox('+StronclickEvent+')');
			
            }				
            */
        }
        // Onay Sayfas�ndan isPassword True set edilmi� submit butonuna bas�ld���nda (�ifre Panel Onayla Butonu)
        else if ($(selector_isPassword)[0] != null) {
            var islemTrkd = "";
            if (document.getElementById('trkd') && document.getElementById('trkd').value)
                islemTrkd = document.getElementById('trkd').value;
            var MtiLightboxResult = true;

            var _IsMtiInitiatedInLightBox = parent.IsMtiInitiatedInLightBox();

            if (isInsideVB() && _IsMtiInitiatedInLightBox && islemTrkd == "ASTSECAPP2") {
                MtiLightboxResult = false;
            }


            if (isInsideVB() && _IsMtiInitiatedInLightBox && islemTrkd == "PKIS2") {
                MtiLightboxResult = false;
            }

            //MtiLightboxResult = true;

            if (MtiLightboxResult) {
                //alert("selector_isPassword: " +   selector_isPassword);
                var SendBtnId = $(selector_isPassword).attr("id");
                if (document.getElementById(SendBtnId) && $(selector_isPassword) && $(selector_isPassword)[0]) {
                    var StronclickEvent = $(selector_isPassword).attr('onclick');
                    //alert("selector_isPassword onclick" + StronclickEvent );
                    document.getElementById(SendBtnId).onclick = new Function('return LightboxFormBtnOnclickPost(' + StronclickEvent + ')');

                }
            }

        }
        //�ifre Mobil onay panel olmayan Onay sayfas�nda G�nder butonuna t�kland���nda 
        else if ($(selector_isLightboxFalse)[0] != null) {

            $(selector_isLightboxFalse).each
				(
					function () {
					    //alert(this.id);
					    //alert($(this).attr('onclick'));
					    var StronclickEvent = $(this).attr('onclick');
					    document.getElementById(this.id).onclick = new Function('return LightboxFormBtnOnclickPost(' + StronclickEvent + ')');
					    //alert(this.id);			
					    //alert("caner " + document.getElementById(this.id).onclick);
					}

				);

        }

        //alert('Lightboxopener End');

    }
    catch (err) {
        //alert('lightboxopener2 : ' + err);
    }
}

//Lightbox frame'inden icerik'e post eden fonksiyon
function LightboxFormBtnOnclickPost(func) {
    try {

        var FunctionResult = false;
        //alert("LightboxFormBtnOnclickPost" + func);
        //Call Button Onclick Function and get boolean result to FunctionResult 
        if (func == null)
            FunctionResult = true;
        else {
            try {
                FunctionResult = func();
            }
            catch (ex) {
                //Do nothing
                //G�nder butonu alt�ndaki javascript hatas� olmas� durumunda onay lightbox'�n�n bozulmamas� i�in.
                FunctionResult = true;
            }
        }

        //alert("LightboxFormBtnOnclickPost func result : " + FunctionResult );
        //Return true yaz�lmam�� methodlar i�in undefined ve null ise true olarak varsay�l�p devam ediliyor.
        //Aksi takdirde t�m js methodlar�n� elden ge�irmek gibi bir maliyet ��kacakt�r.
        if (FunctionResult == "undefined" || FunctionResult == null || FunctionResult) {
            return SubmitAndHideLightBox();
        }
        else {
            //	alert('false');
            return false;
        }


    }
    catch (err) {
        //alert("LightboxFormBtnOnclickPost exception :" + err.description);
    }
}


//Lightbox frame'ine post eden fonksiyon
function FormBtnOnclickForLightBox(func) {
    try {


        var FunctionResult = false;
        //alert("FormBtnOnclick Begin");
        //alert(func);
        //Call Button Onclick Function and get boolean result to FunctionResult 
        try {
            if (func == null)
                FunctionResult = true;
            else
                FunctionResult = func();
        }
        catch (err) {
            //G�nder butonu alt�ndaki javascript hatas� olmas� durumunda onay lightbox'�n�n bozulmamas� i�in.
            FunctionResult = true;
        }

        //alert("func result : " + FunctionResult );
        //Return true yaz�lmam�� methodlar i�in undefined ve null ise true olarak varsay�l�p devam ediliyor.
        //Aksi takdirde t�m js methodlar�n� elden ge�irmek gibi bir maliyet ��kacakt�r.
        if (FunctionResult == "undefined" || FunctionResult == null || FunctionResult) {
            //alert("Before Validate");
            return ValidateFormBeforeLightbox();

        }
        else {
            //alert('false');
            return false;
        }

    }
    catch (err) {
        //alert("FormBtnOnclickForLightBox exception: " + err.description);
    }
}


function ValidateFormBeforeLightbox() {
    //Control if other accounts option is selected
    //	isHesDVMISelected(document.forms[0]._ctl0_Bilyoner_BorcluHesap)

    try {
        //alert("ValidateFormBeforeLightbox BEGIN");
        //��lemdeki T�m Dropdownloar 
        var selector_isLightbox = $("select[class='drop02']");

        var ObjreturnValue = true;

        jQuery.each($(selector_isLightbox), function () {
            //      alert($(this).attr("id"));
            //	  alert($(this).val() );
            //		alert(ObjreturnValue);
            var CmbSelectedValue = $(this).val();

            //alert("selected value :" + CmbSelectedValue.length + " " + CmbSelectedValue.substring(0,1));
            if (CmbSelectedValue != null && CmbSelectedValue.length > 1 && document.getElementById('_ctl0_YpNkdiKrdBasvuruGiris_cmbKredTur') == null && document.getElementById('_ctl0_TlNkdiKrdBasvuruGiris_cmbKredTur') == null && CmbSelectedValue.substring(0, 1) == 'D' && !isComboHesDVMIException(CmbSelectedValue)) {
                //	alert("ObjreturnValue");
                ObjreturnValue = false;
                //	alert("ObjreturnValue value: " + ObjreturnValue);
            }

        });

        //	alert("son: "+ ObjreturnValue);
        if (ObjreturnValue) {
            //Show LightBox
            //alert("ValidateFormBeforeLightbox SubmitAndShowLightBox");
            return SubmitAndShowLightBox();
        }
        else {
            //alert("ValidateFormBeforeLightbox return true");
            return true;
        }

    }
    catch (err) {
        //alert("ValidateFormBeforeLightbox exception: " + err.description);
    }
}

//
function isComboHesDVMIException(_Val) {
    switch (_Val) {
        case "DKK":
            return true;
        default:
            return false;
    }

}


//�cerik Frame'inin background'unu set etmek i�in 

function ShowHideIcerikFrameBackground() {
    var LastTRKD = "";
    if (parent.document.getElementById('lastTRKD'))
        LastTRKD = parent.document.getElementById('lastTRKD').value
    else if (parent.parent.document.getElementById('lastTRKD'))
        LastTRKD = parent.parent.document.getElementById('lastTRKD').value

    var TrkdList = ";GIRIS;GSAY;TRKD_HAVALE_TL;TRKD_HAVALE_DTH;TRKD_EFT;";



    var TDBackgroundItem1 = $('td[is_framebg="1"]', parent.document.body); 	  //Tbl_bg1_topleft
    var TDBackgroundItem2 = $('td[is_framebg="2"]', parent.document.body); 	  //Tbl_bg1_topcenter
    var TDBackgroundItem3 = $('td[is_framebg="3"]', parent.document.body); 	  //Tbl_bg1_topright
    var TDBackgroundItem4 = $('td[is_framebg="4"]', parent.document.body); 	  //Tbl_bg1_midleft
    var TDBackgroundItem5 = $('td[is_framebg="5"]', parent.document.body); 	  //Tbl_bg1_midcenter
    var TDBackgroundItem6 = $('td[is_framebg="6"]', parent.document.body); 	  //Tbl_bg1_midright
    var TDBackgroundItem7 = $('td[is_framebg="7"]', parent.document.body); 	  //Tbl_bg1_bottomleft
    var TDBackgroundItem8 = $('td[is_framebg="8"]', parent.document.body); 	  //Tbl_bg1_bottomcenter
    var TDBackgroundItem9 = $('td[is_framebg="9"]', parent.document.body); 	  //Tbl_bg1_bottomright

    if (LastTRKD != "" && TrkdList.indexOf(LastTRKD + ";") == -1 && SonucTransactionList.indexOf(LastTRKD + ";") == -1 && OnayTransactionList.indexOf(LastTRKD + ";") == -1) {

        $(TDBackgroundItem1).attr("class", "Tbl_bg1_topleft");
        $(TDBackgroundItem2).attr("class", "Tbl_bg1_topcenter");
        $(TDBackgroundItem3).attr("class", "Tbl_bg1_topright");
        $(TDBackgroundItem4).attr("class", "Tbl_bg1_midleft");
        $(TDBackgroundItem5).attr("class", "Tbl_bg1_midcenter");
        $(TDBackgroundItem6).attr("class", "Tbl_bg1_midright");
        $(TDBackgroundItem7).attr("class", "");
        $(TDBackgroundItem8).attr("class", "");
        $(TDBackgroundItem9).attr("class", "");

    }
    else {
        $(TDBackgroundItem1).attr("class", "");
        $(TDBackgroundItem2).attr("class", "");
        $(TDBackgroundItem3).attr("class", "");
        $(TDBackgroundItem4).attr("class", "");
        $(TDBackgroundItem5).attr("class", "");
        $(TDBackgroundItem6).attr("class", "");
        $(TDBackgroundItem7).attr("class", "");
        $(TDBackgroundItem8).attr("class", "");
        $(TDBackgroundItem9).attr("class", "");
    }

}

//XmlHttp Request ile Arkaplan'da �a��r�lan transactionlarda hata var m� kontrol�n� yapar. (BackgroundTransactionHandler.ashx'ten �al��an i�lemler i�in.)
function CheckIfBackgroundTransactionError(JResponse) {
    if (JResponse.indexOf('[BackgroundTransactionHandler_ERROR]') != -1)
        return true;
    else
        return false;
}


//��lem arkaplan �er�evisini ekler. Background imaj�n eklenmesi i�in tabloya  IS_ShowBgImage="1"  attribute'u eklenmelidir.
function SetTableBackgroundImages() {
    // var elem = $("table[IS_ShowBgImage='2']");
    // if (elem.length > 0) {
    //    elem.attr("IS_ShowBgImage", "1");
    //     setTimeout(function () { SetTableBackgroundImages(); }, 200);
    //     return;
    // }
    var selector = "table[IS_ShowBgImage='1']";
    //alert($(selector).length);
    //alert( $(selector).parent().html() );
    if ($(selector).length > 0) {

        $(selector).each
		(
			function () {

			    var tblhtml = $(selector).parent().html();
			    var TblBeginHtml = "<table border='0' cellspacing='0' cellpadding='0'>" +
						"        <tr>" +
						"        <td class='table-11' height='10' width='10'>" +
						"                &nbsp;" +
						"        </td>" +
						"        <td class='table-12' height='10'>" +
						"            &nbsp;" +
						"        </td>" +
						"        <td class='table-13' height='10' width='10'>" +
						"            &nbsp;" +
						"        </td>" +
						"    </tr>" +
						"    <tr>" +
						"        <td class='table-22' width='10'>" +
						"            &nbsp;" +
						"        </td>" +
						"        <td class='table-22' valign='top' align='center'>" +
						"            <!-- YSube BG Tasar�m End-->";

			    var TblEndHtml = "<!-- YSube BG Tasar�m  -->" +
						"            </td>" +
						"            <td class='table-22' width='10'>" +
						"                &nbsp;" +
						"            </td>" +
						"        </tr>" +
						"        <tr>" +
						"            <td class='table-31' height='15' width='10'>" +
						"                &nbsp;" +
						"            </td>" +
						"            <td class='table-32' height='15'>" +
						"                &nbsp;" +
						"            </td>" +
						"            <td class='table-33' height='15' width='10'>" +
						"                &nbsp;" +
						"            </td>" +
						"        </tr>" +
						"</table>" +
						"<!-- YSube BG Tasar�m  END -->";

			    tblhtml = tblhtml.replace(/createInputField/g, "createInputFieldFake");
			    tblhtml = tblhtml.replace(/ABSSor/g, "ABSSorFake");
			    tblhtml = TblBeginHtml + tblhtml + TblEndHtml;

			    $(selector).parent().html(tblhtml);
			}
			);
    }



}


// Set Randno for Background Transactions (BackgroundTransactionHandler.ashx.cs)
function ForceRandNoUpdate(rand) {
    if (parent.parent.parent.document.forms[0].rno)
        parent.parent.parent.document.forms[0].rno.value = rand;
    if (parent.parent.document.forms[0].rno)
        parent.parent.document.forms[0].rno.value = rand;
    if (parent.document.forms[0].rno)
        parent.document.forms[0].rno.value = rand;
    if (document.forms[0].rno)
        document.forms[0].rno.value = rand;

}
function KiymetFiyatDegisim_CheckInputs() {

    var selObj = document.getElementById("_ctl0_gun_dropdownbas");
    var selIndex = selObj.selectedIndex;
    if (selIndex == "0") {
        alert(KiymetFiyatDegisimiGiris_TarihSeciminiziYapin);
        return false;
    }

    var selObj2 = document.getElementById("_ctl0_ay_dropdownbas");
    var selIndex = selObj2.selectedIndex;
    if (selIndex == "0") {
        alert(KiymetFiyatDegisimiGiris_TarihSeciminiziYapin);
        return false;
    }

    var selObj3 = document.getElementById("_ctl0_yil_dropdownbas");
    var selIndex = selObj3.selectedIndex;
    if (selIndex == "0") {
        alert(KiymetFiyatDegisimiGiris_TarihSeciminiziYapin);
        return false;
    }
    if (document.getElementsByName('_ctl0:KiymetTip')[0].checked) {

        var selObj = document.getElementById('_ctl0_YatirimFonuDrp');
        var selIndex = selObj.selectedIndex;
        if (selIndex == "0") {
            alert(KiymetFiyatDegisimiGiris_KiymetSeciminiziYapin);
            return false;
        }
    }

    if (document.getElementsByName('_ctl0:KiymetTip')[1].checked) {

        var selObj = document.getElementById("_ctl0_BonoveTahvilDrp");
        var selIndex = selObj.selectedIndex;
        if (selIndex == "0") {
            alert(KiymetFiyatDegisimiGiris_KiymetSeciminiziYapin);
            return false;
        }
    }
    if (document.getElementsByName('_ctl0:KiymetTip')[3].checked) {

        var selObj = document.getElementById("_ctl0_AltinDrp");
        var selIndex = selObj.selectedIndex;
        if (selIndex == "0") {
            alert(KiymetFiyatDegisimiGiris_KiymetSeciminiziYapin);
            return false;
        }
    }
    if (document.getElementsByName('_ctl0:KiymetTip')[2].checked) {

        var selObj = document.getElementById("_ctl0_HisseSenediTxt").value;

        if (selObj == "") {
            alert(KiymetFiyatDegisimiGiris_HisseSeciminiziYapin);
            return false;
        }
    }

    if (AssertDate(document.forms[0]._ctl0_gun_dropdownbas, document.forms[0]._ctl0_ay_dropdownbas, document.forms[0]._ctl0_yil_dropdownbas,
				  document.forms[0]._ctl0_gun_dropdownson, document.forms[0]._ctl0_ay_dropdownson, document.forms[0]._ctl0_yil_dropdownson)) {
        return true;
    }
    else {
        return false;
    }
}


//Geri Ta��ma fonksiyonunu timeout'la �a��r�yoruz
var HtmlText = "";
function MoveFrameContentWithTimeOut(txtHtml) {
    HtmlText = txtHtml;
    MoveFrameContent(HtmlText);
    //setTimeout("MoveFrameContent(HtmlText)", 200);
}

//Lightbox'dan Geri Ta��ma
function MoveFrameContent(txtHtml) {
    parent.MtiCloseLightbox();
    parent.tempLoc = window.location.href; // + window.document.forms[0].action;

    document.write(txtHtml);
    parent.setTimeout("RestoreAction(0)", 500);
    //Geri ta��ma sonras�nda charset unicode olarak bozuldu�u i�in eklendi.
    if (document.charset != "iso-8859-9")
        document.charset = "iso-8859-9";
}

function RestoreAction(counter) {
    if (++counter > 15) {
        console.log("give Up")
        return;
    }
    try {
        icerik.document.forms[0].action = tempLoc;
    } catch (err) {
        setTimeout("RestoreAction(" + counter + ")", 500);
    }
}


function FindMainWindow() {
    MainW = this.window;
    do {
        MainW = MainW.parent;
    }
    while (MainW != MainW.parent);

    return MainW;
}

function ForceNewSessionFromJavascript() {
    (FindMainWindow()).location = "ChannelsCommon/isModules/OutSide.aspx?trkd=GIRIS&cause=forcenewsession.htm&langcode=tr-TR&from=Ajax";
}


//��lemlerde hesap ilk listede ise se�ili ��kmas�n�, devam yap�s�ndaysa manuel giri� panelinde de�erlerin set edilmesini sa�lar
function MakeAccountSelected(BranchNo, AccountNo, DevamIndex, RadioControlId, AccountComboId, BranchNoControlId, AccountControlId) {

    var HesapSubeText1 = "(" + BranchNo + ") " + AccountNo;
    var SelectedAccountFound = false;
    var SelectedAccountInd = 0;
    var AccountComboOptions = document.getElementById(AccountComboId).options;
    for (i = 0; i <= AccountComboOptions.length - 1; i++) {
        if (AccountComboOptions[i].text.indexOf(HesapSubeText1) > -1) {
            SelectedAccountFound = true;
            SelectedAccountInd = i;
        }
    }
    if (SelectedAccountFound)
        AccountComboOptions[SelectedAccountInd].selected = true;
    else if ($.trim(DevamIndex) != "" && $.trim(DevamIndex) != 0) {
        // Radiobutton se�ili yap�l�yor, click ile i�lemdeki radio'ya ait i�leme �zel script'lerin �al��t�r�lmas� sa�lan�yor.
        document.getElementById(RadioControlId).click();
        document.getElementById(BranchNoControlId).value = BranchNo;
        document.getElementById(AccountControlId).value = AccountNo;
    }

}

//��lemlerde kredi kart ilk listede ise se�ili ��kmas�n� sa�lar.
function MakeCardComboSelected(CardNo, CardComboId) {
    var CardText1 = $.trim(CardNo);
    var SelectedCardFound = false;
    var SelectedCardInd = 0;
    var CardComboOptions = document.getElementById(CardComboId).options;
    for (i = 0; i <= CardComboOptions.length - 1; i++) {
        if (CardComboOptions[i].text.indexOf(CardText1) > -1) {
            SelectedCardFound = true;
            SelectedCardInd = i;
        }
    }

    if (SelectedCardFound)
        CardComboOptions[SelectedCardInd].selected = true;
}

//��lemlerde kredi kart� radio ilk listede ise se�ili ��kmas�n� sa�lar.
function MakeCardRadioSelected(CardNo) {
    $("input[type='radio']").each
			(
				function () {

				    //alert(this.name);
				    //alert($(this).parent().text());
				    if ($(this).parent().length > 0 && $(this).parent().text().indexOf(CardNo) > -1) {
				        $(this).attr('checked', 'checked');
				    }


				}

			);
}
var AgentMessageHandlerFunctionPointer = null;
function AgentMessage(message) {
    //	alert("AgentMessage ilk alert");
    if (AgentMessageHandlerFunctionPointer != null)
        AgentMessageHandlerFunctionPointer(message);
}
