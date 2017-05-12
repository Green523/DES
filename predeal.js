var Tran = {
				mdata : [],
				nomdata:"",
				engIndex:[5,6,7,8,9,10,11,12,13],
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

//**********************************解密****************************************
Tran.toChar=function(temp){		//此处进来一串二进制的数组
	var j=0
	var Cha =new Array()
	var sum=new Array()
	var con =""
	var re=""
	var buf=""
	
	for(i=0;i<temp.length;){
		if(i != (Tran.engIndex[j]*24-j*16)){
			//此处为汉字还原24bit
		//8+8+8={4,4}{4,4}[4,4}
		
		for(n=0;n<3;n++){
				buf=""
					for(k=0;k<2;k++){
						Cha[k]= temp.substr(i,4)
						buf=buf+parseInt(Cha[k],2).toString(16)
						i=i+4
					}
					sum[n]=buf
			}	
			re ="%"+sum[0]+"%"+sum[1]+"%"+sum[2]
			
			con = con+decodeURIComponent(re)
		
			
		}
		else  if(i == (Tran.engIndex[j]*24-j*16)){
			//此处为英文字母的还原
			j++
			con = con+String.fromCharCode(parseInt(temp.substr(i,8),2))
			i=i+8
		}
		
	}
		return con
		
}




Tran.Group64=function(groupNum){
	var groupArr = new Array()
	for(i=0;i<64;i++){
		groupArr[i]=Tran.bindata[groupNum*64+i]
	}
	return groupArr
}

//***********************多个64bits二进制数据的显示********************
Tran.allData=function(mode){
		var DataStr=""
		for(n=0;n<Tran.bindata.length/64;n++){
			Data.indata=Tran.Group64(n)
			DataStr=DataStr+Data.Run(mode)		//得到明文的二进制字符串或密文的
		}
		console.log("DES加密后的密文：\r"+DataStr)		//此处的DataStr应该与hidata相同
	return DataStr
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
	var temp = []
	for(i=0;i<str.length;i++){
		var engBin = str.charCodeAt(i).toString(2) 		//此处为二进制代码，str.charCodeAt(i)还原为十进制
		hidata=hidata+engBin.substr(3,4)
	}
	
	//console.log(hidata)
	return hidata
}





