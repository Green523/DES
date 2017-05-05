var Tran = {
				mdata : [],
				nomdata:"",
				engIndex:[],
				bindata:[]
}


//************************去掉头尾空格********************************
Tran.trim= function(str){
	var reg1 = /^\s+/
	str = str.replace(reg1,"")
	var reg2 = /\s+$/
	str = str.replace(reg2,"")
	return str
	}
//***************************************************************************

//*****将汉字转化为二进制*************
Tran.toBin = function(){
	var engNum = 0
	var temp=""
	var sum = ""
	for(i = 0;i<Tran.mdata.length;i++){
			 temp = encodeURIComponent(Tran.mdata[i])
			if(temp.length == 9){		//汉字
				 var regExp=/^%(\w+)%(\w+)%(\w+)$/ig
				 regExp.exec(temp)
				 var $1 =parseInt(RegExp.$1,16).toString(2)   //由十六进制先转为十进制再转为二进制，结果为字符串格式
				 var $2 =parseInt(RegExp.$2,16).toString(2)
				 var $3 =parseInt(RegExp.$3,16).toString(2)
				 var chiBin = $1+$2+$3	//一个汉字由24bits的数据组成
				 //console.log(chiBin)
				 sum=sum+chiBin
			}
			else if(temp.length == 1){	//字母数字（按8位算）
				var engBin =  Tran.mdata[i].charCodeAt(0).toString(2)
				engBin.length>7?engBin=engBin
							:engBin.length>6?engBin = "0"+engBin
							:engBin ="00"+engBin
				sum=sum+engBin
				Tran.engIndex[engNum]=i	//假设i=4 6则   bit开始处为：i*24-1      i*24+[i=4]*8-1
				engNum++
			}
	}	
		return sum.split("")
}

Tran.Group64=function(groupNum){
	var groupArr = new Array()
	for(i=0;i<64;i++){
		groupArr[i]=Tran.bindata[groupNum*64+i]
	}
	return groupArr
}

Tran.displayHiData = function(str){		//加密后显示
	var ChaDis = ""
	var temp =""
	for(j=0;j<str.length/4;j++){
	
	temp="100"+str.substr(j*4,4)
	//console.log(String.fromCharCode(parseInt(temp,2)))
	ChaDis=ChaDis+String.fromCharCode(parseInt(temp,2))
	}	
	//console.log(ChaDis.length)
	return ChaDis
}

//***************************************解密格式时使用**********************************
Tran.visDataDeal=function(str){		//输入为明文字符串，解密后为密文
	var hidata = ""
	var regExp = /100(\d+)$/ig
	var temp = ""
	for(i=0;i<str.length;i++){
		var engBin = str.charCodeAt(i).toString(2) 		//str.charCodeAt(i)还原为十进制
			  regExp.exec(engBin)
			  temp = RegExp.$1
			   hidata=hidata+temp
	}
	return hidata
}
//**********************************解密****************************************
Tran.decod=function(DataStr){
			var arr1 = new Array()
			var cha8=""
			var sum=""
			var 
			arr1 = DataStr.split("")
			for(i=0;i<DataStr.length;){
				for(j=0;j<Tran.engIndex.length;j++){
					 if(i != Tran.engIndex[j]*24){
						 //汉字的处理
						 i = i+24
					 }
					else{
						for(k=0;k<8;k++){
							cha8=cha8+DataStr[i+k]	
							sum= sum+String.fromCharCode(parseInt(cha8,2))
						}
						 i=i+8
					 }
					
				}

				
			}
	
}



//*********************************所有注释*********************************************
/*
1.
	Tran.transChinToBin的功能为将字符串转化为二进制的字符串并返回
	具体实现是将汉字的码字同义转换为UTF-8的模式，转换方法为：
	1.在UTF-8中汉字占3个字节，英文等字符占一个字节（這里假设都是汉字的编码）
	2.用encodeURI（）得到%（十六进制数1）%（十六进制数2）%（十六进制数3）
	3.将十六进制数123提取出来，转化为二进制数（共6×4=24bits）
2.
	将英文字符转换为二进制
	temp = parseInt(temp,2)//字符串的二进制转十进制
	console.log(String.fromCharCode(temp))转换为字符串
3.
	如何判别split后的字符是汉字还是字母：
		1.用encodeURIComponent().length
		2.如果是汉字则长度为9，如果是字母数字则长度为1
	 如何判别split后的字符是数字还是字母：
		1.用Unicode的编码范围来确定
4.//console.log(parseInt(str.substr(j*8,8),2))
	//console.log((String.fromCharCode(parseInt(str.substr(j*4,4),2))))	//字
	//	console.log((String.fromCharCode(parseInt(str.substr(j*8,8),2)).charCodeAt(0)))  //还原为十进制
5.
temp.length>3?temp = temp
							:temp.length>2?temp = "0"+temp
							:temp.length>1?temp = "00"+temp
							:temp.length>0?temp = "000"+temp
							:temp ="0000"
*/
