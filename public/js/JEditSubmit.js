var foccnt = 2;
var timerID;
var IsJagEditDownloaded;
var agt=navigator.userAgent.toLowerCase();
var isIE = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1)) ? true : false;
var isWin = ((agt.indexOf("win") != -1) || (agt.indexOf("16bit")!=-1)) ? true : false;
var isNT = (agt.indexOf("windows nt")!=-1 ) ? true : false;
var JagEditVersion="";






function getversion(jageditname)
{
// Herhangi bir property ' e ula�madan �nce test = 1 yap�yoruz.

var getval;
eval("document."+jageditname+".test = 9");
getval = eval("document."+jageditname+".JText");
document.all("vers").value = "VERSION = " + getval;


}



function setpas()
{
// Herhangi bir property ' e ula�madan �nce test = 1 yap�yoruz.
document.JagEdit.test = 1
document.JagEdit.PasswordChar = '';
document.JagEdit.setFocus();



}

function setFocus(fname)
{
	if (checkJagEdit())
	{
	 eval("document.J"+fname+".setFocus()");
	 eval("document.J"+fname+".focus()");
	}
	else
	{
	 eval("document."+fname+".focus()");
	}
}


//--------------------------------------------------------------------------------------------------------------------
function checkJagEdit()
{
return false;
	//try
	//{
	//var JagEdit;
	//JagEdit = new ActiveXObject("JaguarEditControl.JaguarEditCtrl4ISB.1");
	//JagEdit.test = 9;	
	//JagEditVersion = JagEdit.JText;	
	////if (JagEditVersion=="") JagEditVersion="1,1,0,15";
	////alert("JagEdit yuklu");
	//return true;                 

	//}
	//catch(e)
	//{

	////alert("JagEdit yuklu degil");
    //return false;
	
	//}

}

//Bg imaj eklerken javascript'ler tekrar �al��t��� i�in bu method tekrar �al��t���nda fazladan textbox at�l�yor ekrana. 
//Onun i�in  BG imaj eklenen yerde replace yap�l�yor. bknz. Commonnew SetTableBackgroundImages.
function createInputFieldFake(fname,tabindex,maxlength,evt,action,evt2,action2,cssname)
{

}

//--------------------------------------------------------------------------------------------------------------------
function createInputField(fname,tabindex,maxlength,evt,action,evt2,action2,cssname,evt3,action3)
{

if(cssname==null || cssname==undefined)
{
	cssname="inputsifretextJEDIT";
}

IsJagEditDownloaded = checkJagEdit();
var jaguarParams = "";

if(isIE && isWin && IsJagEditDownloaded)
{
     //alert("JagEditVersion:"+JagEditVersion);
	
	if(cssname!="inputsifretextJEDIT" && cssname!="input_Z5Z6_JEDIT")
		cssname+="_JEDIT";


	 if (isNT) 
	 {
		if (JagEditVersion >= '1,1,0,29')
		{
			objstr = "<OBJECT id=\"J"+fname+"\" codeBase=\"/internet/lib/JaguarEdit4ISBv29.CAB#version='"+JagEditVersion+"'\" classid=\"CLSID:D5D17C21-1719-4640-B0B2-4F3262419920\"";
			jaguarParams = "<PARAM NAME=\"Disable3D\" VALUE=\"1\">";
		}
		else if (JagEditVersion >= '1,1,0,27')
		{
			objstr = "<OBJECT id=\"J"+fname+"\" codeBase=\"/internet/lib/JaguarEdit4ISBv27.CAB#version='"+JagEditVersion+"'\" classid=\"CLSID:D5D17C21-1719-4640-B0B2-4F3262419920\"";
		}
		else
		{
			objstr = "<OBJECT id=\"J"+fname+"\" codeBase=\"/internet/lib/JaguarEdit4ISB.CAB#version='"+JagEditVersion+"'\" classid=\"CLSID:D5D17C21-1719-4640-B0B2-4F3262419920\"";
		}
	 }
	 else
	 {
	  objstr = "<OBJECT id=\"J"+fname+"\" codeBase=\"/internet/lib/JaguarEdit4ISB98.CAB#version='"+JagEditVersion+"'\" classid=\"CLSID:D5D17C21-1719-4640-B0B2-4F3262419998\"";	
	 }
	 if (evt != "" && action!="")
	 	objstr += " " + evt+"=\""+action+"\"";
	 if(evt2!="" && evt2!=null && action2!="" && action2!=null)
		objstr += " " + evt2+"=\""+action2+"\"";
	if(evt3!="" && evt3!=null && action3!="" && action3!=null)
		objstr += " " + evt3+"=\""+action3+"\"";
	 	
	 objstr += " VIEWASTEXT height=\"20px\" class=\""+ cssname +"\" tabindex=\""+tabindex+"\" >" + jaguarParams + "</OBJECT>"; 

	 document.write(objstr);
	 document.write("<input TYPE='hidden' name='"+fname+"'  size='16'>");

	
}   
else
{
    if (evt != "" && action!="")
	{
		objstr="<INPUT id='"+fname+"' type='password' size='20' name='"+fname+"' "+evt+"=\""+action+"\"";
		if(evt2!=null && evt2!="" && action2!=null && action2!="")
		{
		objstr += " " + evt2+"=\""+action2+"\"";
		}
		if(evt3!=null && evt3!="" && action3!=null && action3!="")
		{
		objstr += " " + evt3+"=\""+action3+"\"";
		}
		objstr +=" class='"+cssname+"' tabindex='"+tabindex+"' MaxLength='"+maxlength+"' autocomplete='off'>";

		document.write(objstr);
//	document.write("<INPUT id='"+fname+"' type='password' size='20' name='"+fname+"' "+evt+"=\""+action+"\" class='"+cssname+"' tabindex='"+tabindex+"' MaxLength='"+maxlength+"'>");
	// style='WIDTH: 152px; HEIGHT: 22px' alert("<INPUT id='"+fname+"' style='WIDTH: 152px; HEIGHT: 22px' type='password' size='20' name='"+fname+"' "+evt+"=\""+action+"\" >");
	//document.write("<INPUT ID=ntx name=jagEdit VALUE='Not Windows or IE ' style='WIDTH: 300px; HEIGHT: 20px' size=28> ");
    }
    else
    {
    document.write("<INPUT id='"+fname+"' type='password' size='20' name='"+fname+"' class='"+cssname+"' tabindex='"+tabindex+"' MaxLength='"+maxlength+"' autocomplete='off'>");
    }

}

}

//--------------------------------------------------------------------------------------------------------------------
function createInputFieldIAB(fname,tabindex,maxlength,evt,action)
{

IsJagEditDownloaded = checkJagEdit();

if(isIE && isWin && IsJagEditDownloaded)
{
     //alert("JagEditVersion:"+JagEditVersion);
	var jaguarParams = "";

	 if (isNT) 
	 {
		if (JagEditVersion >= '1,1,0,29')
		{
			objstr = "<OBJECT id=\"J"+fname+"\" codeBase=\"/internet/lib/JaguarEdit4ISBv29.CAB#version='"+JagEditVersion+"'\" classid=\"CLSID:D5D17C21-1719-4640-B0B2-4F3262419920\"";
			jaguarParams = "<PARAM NAME=\"Disable3D\" VALUE=\"1\">";
		}
		else if (JagEditVersion >= '1,1,0,27')
		{
			objstr = "<OBJECT id=\"J"+fname+"\" codeBase=\"/internet/lib/JaguarEdit4ISBv27.CAB#version='"+JagEditVersion+"'\" classid=\"CLSID:D5D17C21-1719-4640-B0B2-4F3262419920\"";
		}
		else
		{
			objstr = "<OBJECT id=\"J"+fname+"\" codeBase=\"/internet/lib/JaguarEdit4ISB.CAB#version='"+JagEditVersion+"'\" classid=\"CLSID:D5D17C21-1719-4640-B0B2-4F3262419920\"";
		}
	 }
	 else
	 {
	  objstr = "<OBJECT id=\"J"+fname+"\" codeBase=\"/internet/lib/JaguarEdit4ISB98.CAB#version='"+JagEditVersion+"'\" classid=\"CLSID:D5D17C21-1719-4640-B0B2-4F3262419998\"";	
	 }
	 if (evt != "" && action!="")
	 	objstr += " " + evt+"=\""+action+"\"";
	 	
	 objstr += " VIEWASTEXT height=\"20px\" class=\"inputSifreGiris\" tabindex=\""+tabindex+"\">" + jaguarParams + "</OBJECT>";
	 document.write(objstr);
	 document.write("<input TYPE='hidden' name='"+fname+"'  size='16' >");

	
}   
else
{
    if (evt != "" && action!="")
	{
	document.write("<INPUT id='"+fname+"' type='password' size='20' name='"+fname+"' "+evt+"=\""+action+"\" class='input01' tabindex='"+tabindex+"' MaxLength='"+maxlength+"' autocomplete='off' onkeypress='return isNumber(event);'>");
	// style='WIDTH: 152px; HEIGHT: 22px' alert("<INPUT id='"+fname+"' style='WIDTH: 152px; HEIGHT: 22px' type='password' size='20' name='"+fname+"' "+evt+"=\""+action+"\" >");
	//document.write("<INPUT ID=ntx name=jagEdit VALUE='Not Windows or IE ' style='WIDTH: 300px; HEIGHT: 20px' size=28> ");
    }
    else
    {
    document.write("<INPUT id='"+fname+"' type='password' size='20' name='"+fname+"' class='input01' tabindex='"+tabindex+"' MaxLength='"+maxlength+"' autocomplete='off'>");
    }

}

}


//--------------------------------------------------------------------------------------------------------------------

function saat() {
	setTimeout("saatTimedOut()",200);
}
function saatTimedOut(){

	if (checkJagEdit()) 
	{
			jEditTimerID = setTimeout("onJEditSubmit()",500);
			if (document.JParolaText) 
			{
			document.JParolaText.test = 1;
			document.JParolaText.TextLen=16;
			}
			if (document.JYeniParolaText) 
			{
			document.JYeniParolaText.test = 1;
			document.JYeniParolaText.TextLen=16;
			}
			if (document.JYeniParolaTekrarText) 
			{
			document.JYeniParolaTekrarText.test = 1;
			document.JYeniParolaTekrarText.TextLen=16;
			}
			if (document.JEskiParolaText) 
			{
			document.JEskiParolaText.test = 1;
			document.JEskiParolaText.TextLen=16;
			}
			if (document.JSifreText) 
			{
			document.JSifreText.test = 1;
			document.JSifreText.TextLen=6;
			} 
			if (document.JYeniSifreText) 
			{
			document.JYeniSifreText.test = 1;
			document.JYeniSifreText.TextLen=6;
			} 
			if (document.JYeniSifreTekrarText) 
			{
			document.JYeniSifreTekrarText.test = 1;
			document.JYeniSifreTekrarText.TextLen=6;
			} 
			if (document.JYeniTelSifreText) 
			{
			document.JYeniTelSifreText.test = 1;
			document.JYeniTelSifreText.TextLen=4;
			}  
			if (document.JYeniTelSifreTekrarText) 
			{
			document.JYeniTelSifreTekrarText.test = 1;
			document.JYeniTelSifreTekrarText.TextLen=4;
			}  
			if (document.JSifreTextIAnahtar) 
			{
			document.JSifreTextIAnahtar.test = 1;
			document.JSifreTextIAnahtar.TextLen=8;
			} 
	}
	
}

//--------------------------------------------------------------------------------------------------------------------
function onTempJedit(){
	var trkd = document.forms[0].trkd.value ;

	if (document.JParolaText) 
	{
		document.JParolaText.test = 1
	}
	
	if (document.JSifreText) 
	{
		document.JSifreText.test = 1
	}
	
	if (document.JYeniSifreText) 
	{
		document.JYeniSifreText.test = 1
	}
	
	if (document.JYeniSifreTekrarText) 
	{
		document.JYeniSifreTekrarText.test = 1
	}
	
	if (document.JSifreTextIAnahtar) 
	{
		document.JSifreTextIAnahtar.test = 1
	}
		
	switch ( trkd )
	{
		case "LOG2":
			getJText('ParolaText');
			return CheckFields('logon1j');
		case "LOG3":
			getJText('SifreText');
			return CheckFields('logon2');
		case "GSIF":
				getJText('SifreText');
				return CheckFields('GSIF');
		case "PAR0":
			yokall();
			getJText('SifreText');
			getJText('YeniSifreText');
			getJText('YeniSifreTekrarText');
			getJText('YeniParolaText');
			getJText('YeniParolaTekrarText');
			getJText('EskiParolaText');
			return CheckFields('parola0');			
		case "PAR01":
			getJText('SifreText');
			getJText('YeniSifreText');
			getJText('YeniSifreTekrarText');
			getJText('YeniParolaText');
			getJText('YeniParolaTekrarText');
			getJText('EskiParolaText');
			return CheckFields('parola1');			
			case "SIFG":
			case "YSIF":
				getJText('YeniSifreText');
				getJText('YeniSifreTekrarText');				
				return CheckFields(trkd);				
			case "GSIF":
				getJText('SifreText');
				return CheckFields('GSIF');
			case "SIFG":
			case "YSIF":
				getJText('YeniSifreText');
				getJText('YeniSifreTekrarText');
				return CheckFields(trkd);
				
			case "*ASFI":
				getJText('SifreTextIAnahtar');
				return CheckFields(trkd);
				
	}
}
function onJEditSubmit() {

	var isEntered=0;
	if (document.JParolaText) 
	{
		document.JParolaText.test = 1
		isEntered = document.JParolaText.entered;
	}
	
	if (document.JSifreText) 
	{
		document.JSifreText.test = 1
		isEntered = document.JSifreText.entered;
	}
	
	if (document.JYeniSifreText) 
	{
		document.JYeniSifreText.test = 1
		isEntered = document.JYeniSifreText.entered;
	}
	
	if (document.JYeniSifreTekrarText) 
	{
		document.JYeniSifreTekrarText.test = 1
		isEntered = document.JYeniSifreTekrarText.entered;
	}
	
	if (document.JSifreTextIAnahtar) 
	{
		document.JSifreTextIAnahtar.test = 1
		isEntered = document.JSifreTextIAnahtar.entered;
	}
	
	if (isEntered==1) 
	{
		var trkd = document.forms[0].trkd.value ;
		
		switch ( trkd )
		{
		case "LOG2":
			getJText('ParolaText');
			if ( CheckFields('logon1j') )
			{
				document.forms[0].submit();
			}
			else
			{
				document.forms[0]._ctl0_MusNoText.focus();
			}
			break;	
			
		case "LOG3":
			getJText('SifreText');
			if ( CheckFields('logon2') )
			{
				document.forms[0].submit();
			}
			else
			{
				setFocus("SifreText");
			}
			break;
			
			case "GSIF":
				getJText('SifreText');
				if ( CheckFields('GSIF') )
				{
					document.forms[0].submit();
				}
				else
				{
					setFocus("SifreText");
				}
				break;			
		case "PAR0":
			yokall();
			getJText('SifreText');
			getJText('YeniSifreText');
			getJText('YeniSifreTekrarText');
			getJText('YeniParolaText');
			getJText('YeniParolaTekrarText');
			getJText('EskiParolaText');
			if ( CheckFields('parola0') )
			{
				document.forms[0].submit();
			}
			else
			{
				setFocus("SifreText");
			}
			break;
			
		case "PAR01":
			getJText('SifreText');
			getJText('YeniSifreText');
			getJText('YeniSifreTekrarText');
			getJText('YeniParolaText');
			getJText('YeniParolaTekrarText');
			getJText('EskiParolaText');
			if ( CheckFields('parola1') )
			{
				document.forms[0].submit();
			}
			else
			{
				setFocus("SifreText");
			}
			break;	
			
			case "SIFG":
			case "YSIF":
				getJText('YeniSifreText');
				getJText('YeniSifreTekrarText');
				
				if ( CheckFields(trkd) )
				{
					document.forms[0].submit();
				}
				else
				{
					setFocus("YeniSifreText");
				}
				break;		
			case "GSIF":
				getJText('SifreText');
				if ( CheckFields('GSIF') )
				{
					document.forms[0].submit();
				}
				else
				{
					setFocus("SifreText");
				}
				break;			
			case "SIFG":
			case "YSIF":
				getJText('YeniSifreText');
				getJText('YeniSifreTekrarText');
				
				if ( CheckFields(trkd) )
				{
					document.forms[0].submit();
				}
				else
				{
					setFocus("YeniSifreText");
				}
				break;	
				
			case "*ASFI":
				getJText('SifreTextIAnahtar');	
				
				if(CheckFields(trkd))
				{
					document.forms[0].submit();
				}
				else
				{
					setFocus("SifreTextIAnahtar");
				}
				break;
		}
		
		//document.forms[0]._ctl0_Button1.focus();
	}
	jEditTimerID = setTimeout("onJEditSubmit()",500); 
	
}     

//--------------------------------------------------------------------------------------------------------------------

function setJText(fname,val)
{
	// Herhangi bir property ' e ula�madan �nce test = 1 yap�yoruz.
	
	eval("if(document.J"+fname+") document.J"+fname+".test = 1");
	eval("if(document.J"+fname+") document.J"+fname+".JText = '"+val+"' ");
	
}
//--------------------------------------------------------------------------------------------------------------------

function getJText(fname)
{
	// Herhangi bir property ' e ula�madan �nce test = 1 yap�yoruz.
	if (eval("document.J"+fname))
		{
		eval("document.J"+fname+".test = 1");
		var s = eval("document.J"+fname+".JText");
		eval("document.Form1."+fname+".value = s");
		return s;
		}
}
//--------------------------------------------------------------------------------------------------------------------



//kullanilmiyor
function guvuyari()
{
IsJagEditDownloaded = checkJagEdit();
//alert("in guvuyari IsJagEditDownloaded"+IsJagEditDownloaded);
	if(isIE && isWin)
	{
		if (!IsJagEditDownloaded)
		{
			document.write("<img src=\"/images2/guvcember.gif\"><b><font color=red> \"G�venlik �emberi\"</b></font> <font color=navy>program�, hen�z bilgisayar�n�za y�klenmemi�tir. �nternet Bankac�l���'nda g�venli�inizi artt�rmak i�in<a style=\"COLOR: navy\" onclick=\"NewWindow(this.href,'hizlimenuekle','460','320','yes','center');return false\" href='/htmls/guvcemberyukle.htm'><b> <font color=red>G�venlik �emberi</font></b>'ni buradan</a> indirebilirsiniz.<br><a style=\"COLOR: navy\" onclick=\"NewWindow(this.href,'hizlimenuekle','460','320','yes','center');return false\" href='/htmls/guvcemberaciklama.htm'><b><font color=red>\"G�venlik �emberi\"</font></b> hakk�nda detayl� bilgi i�in buray� t�klay�n�z.</a>");
		}
		else
		{
			//document.write("<img src=\"/images2/guvcemberok.gif\"> \"G�venlik �emberi\" <font color=navy>program� bilgisayar�n�zda kuruludur. </font><br><a style=\"COLOR: navy\" onclick=\"NewWindow(this.href,'hizlimenuekle','460','320','yes','center');return false\" href='/htmls/guvcemberaciklama.htm'>Program hakk�nda detayl� bilgi almak i�in t�klay�n�z.</a>");
		}
		
	}
}

//Logonduyuru'dan dolay� calismiyor 
function GuvenlikCemberiUyariResmiGorunsunmu()
{
	var Gorunsun = 0;

	IsJagEditDownloaded = checkJagEdit();
	//alert("in guvuyari IsJagEditDownloaded"+IsJagEditDownloaded);
	if(isIE && isWin){
		//64 Bit ise g�venlik �emberi linki g�sterilmeyecek.
		//alert(window.navigator.cpuClass);
		if(window.navigator.cpuClass=='x64')
		{
			Gorunsun = 0;
		}
		else
		{
			if (!IsJagEditDownloaded)
			{
				if (isNT){
					Gorunsun = 1; // NT lerde y�kleme linki ��ks�n 56041
				}else{
					Gorunsun = 0; // NT olmayanlar art�k y�kleyemiyor.
				}
			}else
			{
				if (JagEditVersion == "1,1,0,29"){// ye�il son versiyon 56041
					Gorunsun = 2;
				}else if (isNT){ // son versiyon yok ve NT ise y�kleme linki c�ks�n 56041
					Gorunsun = 1;
				}else if (JagEditVersion == "1,1,0,18"){ // NT de�il ve win98 i�in olan son versiyon y�kl� ise sar� �nceki versiyon 56041
					Gorunsun = 3;
				}else{// NT de�il ve 98 i�in olan son s�r�m de yok o zaman sar� �nceki versiyon 56041
					Gorunsun = 3;
				}
			}
		}
	}


	return Gorunsun;

}

//Logonduyuru'dan dolay� calismiyor
function UyariResmiGosteriminiKonrolEt(id1,id2, id3) 
{ 
	var idToBeVisible = GuvenlikCemberiUyariResmiGorunsunmu();
	
	for (var i = 1; i < 4; i++)
	{
		var visible = (idToBeVisible == i) ? true : false;
		switchDivVisibility(eval("id"+i), visible);
	}
}
//Logonduyuru'dan dolay� calismiyor
function switchDivVisibility(div, visible) // div'in visibilitysini ayarla 56041
{
	var IEVisibility = "hidden";		
	var NSVisibility = "hide";
	var NS6Visibility = 'hidden';
	if (visible)
	{
		IEVisibility = "visible";		
		NSVisibility = "show";
		NS6Visibility = 'visible';		
	}
	else
	{
		if (document.all) { document.all[div].innerHTML = "" ;} 
		if(document.layers) { document.layers[div].innerHTML = "" ;} 
		if(document.getElementById) {document.getElementById(div).innerHTML = "" ;} 
		//if (div != "divGuvCemberUyari")
		//{
			if (document.all) { document.all[div].style.display = "none" ;} 
			if(document.layers) { document.layers[div].style.display = "none" ;} 
			if(document.getElementById) {document.getElementById(div).style.display = "none" ;} 
		//}
	}
	if (document.all) { document.all[div].style.visibility = IEVisibility ;} 
	if(document.layers) { document.layers[div].visibility = NSVisibility ;} 
	if(document.getElementById) {document.getElementById(div).style.visibility = NS6Visibility;} 
}


//Sifre panel'de Sifretextbox �zerinden Enter'a bas�ld���nda submit'i Lightbox'a g�re yapmas� i�in 
function SubmitFromPasswordTextbox(e)
{	

	selector_isLightboxFalse = $("input[class='SendApprove']");
	
	var keycode;

	if (window.event) keycode = window.event.keyCode;
	else if (e) keycode = e.which;
	else keycode = e.keyCode;

	//Enter'a bas�ld�ysa
	if(keycode== "13" && $(selector_isLightboxFalse).length > 0)
	{
		var OnaylaBtnId = $(selector_isLightboxFalse).attr("id");
		document.getElementById(OnaylaBtnId).onclick();
		return false;
	}

}

function IsJagEditDownloadedToClient()
{	
	IsJagEditDownloaded = checkJagEdit();
	
	if(document.getElementById("IsJagEditDownloaded"))
	{
		document.getElementById("IsJagEditDownloaded").value = IsJagEditDownloaded;
	}
}
