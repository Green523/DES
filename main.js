function Test(){
	//********************询问是加密还是解密*******************************
	var mode = prompt("加密请输入：1，解密请输入：0")
	var circleNum = 0
	var keyCircleNum = 0
	//********************************************************************************
	//*******************获取密钥**************************************
	var keyNode = document.getElementById("keypart")
	var visdataNode = document.getElementsByName("visdata")[0]
	var hiddataNode = document.getElementsByName("hiddata")[0]
	
	KeyObj.key =(KeyObj.trans(Tran.trim(keyNode.value))).split("")
	//**********************************************************************************
	//console.log(KeyObj.key)
	//*****************获取每一轮的子密钥************************************
	KeyObj.makey()
	//console.log(KeyObj.subKey)
	//**********************************************************************************
	var DataStr =""
	
	//******************加密**********************************
	if(mode == "1"){
		visdataNode.value="我是钟小雯SMGJJ1307"
		Tran.mdata =(Tran.trim(visdataNode.value)).split("")
		console.log("明文：\r"+Data.Str(Tran.mdata))
		Tran.bindata=Tran.toBin()	//UTF8	
		console.log("转化为二进制的明文：\r"+Tran.bindata)
		var ChaDis=Tran.displayHiData(Tran.allData(mode))
		hiddataNode.value=ChaDis
		
	}
	
	//************************解密*****************************
	else if(mode =="0"){
		hiddataNode.value="DD@IDHIHBMLCCCGELKDKEFL@FILJ@MAKIOKIF@HECBCEOGNL"
		Tran.nomdata =Tran.trim(hiddataNode.value)
		Tran.bindata=Tran.visDataDeal(Tran.nomdata).split("")	//得到密文
		//**************还原明文*********
		visdataNode.value=Tran.toChar(Tran.allData(mode))
		
	}
	//***********************************************************
	
		//console.log(Tran.visDataDeal(ChaDis))	//应该等于hiddata
	
}

