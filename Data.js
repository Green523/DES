var Data = {
			indata : [],
			outdata:[],
//上述为从用户处接收到的明文数据，先假设为64bit的标准形式
			ipIndex : [
								58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4,
								62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8,
								57, 49, 41, 33, 25, 17,  9,  1, 59, 51, 43, 35, 27, 19, 11, 3,
								61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7
						],
//	data数据的初始置换下标表			
			 expanIndex :  [
								32,  1,  2,  3,  4,  5,  4,  5,  6,  7,  8,  9,
								 8,  9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17,
								16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25,
								24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32,  1
				],
//明文的扩展表
			 sIndex : [
// S0 
								[[14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7],
								 [ 0, 15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8],
								 [ 4,  1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0],
								 [15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13]],
// S1 
								[[15,  1,  8, 14,  6, 11,  3,  4,  9,  7,  2, 13, 12,  0,  5, 10],
								 [ 3, 13,  4,  7, 15,  2,  8, 14, 12,  0,  1, 10,  6,  9, 11,  5],
								 [ 0, 14,  7, 11, 10,  4, 13,  1,  5,  8, 12,  6,  9,  3,  2, 15],
								 [13,  8, 10,  1,  3, 15,  4,  2, 11,  6,  7, 12,  0,  5, 14,  9]],
// S2 
								[[10,  0,  9, 14,  6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8],
								 [13,  7,  0,  9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1],
								 [13,  6,  4,  9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7],
								 [ 1, 10, 13,  0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12]],
// S3 
								[[ 7, 13, 14,  3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15],
								 [13,  8, 11,  5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9],
								 [10,  6,  9,  0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4],
								 [ 3, 15,  0,  6, 10,  1, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14]],
// S4
								[[ 2, 12,  4,  1,  7, 10, 11,  6,  8,  5,  3, 15, 13,  0, 14,  9],
								 [14, 11,  2, 12,  4,  7, 13,  1,  5,  0, 15, 10,  3,  9,  8,  6],
								 [ 4,  2,  1, 11, 10, 13,  7,  8, 15,  9, 12,  5,  6,  3,  0, 14],
								 [11,  8, 12,  7,  1, 14,  2, 13,  6, 15,  0,  9, 10,  4,  5,  3]],
// S5 
								[[12,  1, 10, 15,  9,  2,  6,  8,  0, 13,  3,  4, 14,  7,  5, 11],
								 [10, 15,  4,  2,  7, 12,  9,  5,  6,  1, 13, 14,  0, 11,  3,  8],
								 [ 9, 14, 15,  5,  2,  8, 12,  3,  7,  0,  4, 10,  1, 13, 11,  6],
								 [ 4,  3,  2, 12,  9,  5, 15, 10, 11, 14,  1,  7,  6,  0,  8, 13]],
// S6 
								[[ 4, 11,  2, 14, 15,  0,  8, 13,  3, 12,  9,  7,  5, 10,  6,  1],
								 [13,  0, 11,  7,  4,  9,  1, 10, 14,  3,  5, 12,  2, 15,  8,  6],
								 [ 1,  4, 11, 13, 12,  3,  7, 14, 10, 15,  6,  8,  0,  5,  9,  2],
								 [ 6, 11, 13,  8,  1,  4, 10,  7,  9,  5,  0, 15, 14,  2,  3, 12]],
// S7 
								[[13,  2,  8,  4,  6, 15, 11,  1, 10,  9,  3, 14,  5,  0, 12,  7],
								 [ 1, 15, 13,  8, 10,  3,  7,  4, 12,  5,  6, 11,  0, 14,  9,  2],
								 [ 7, 11,  4,  1,  9, 12, 14,  2,  0,  6, 10, 13, 15,  3,  5,  8],
								 [ 2,  1, 14,  7,  4, 10,  8, 13, 15, 12,  9,  0,  3,  5,  6, 11]]
						],
			pIndex :  [    16, 7, 20, 21, 29, 12, 28, 17, 1,  15, 23, 26, 5,  18, 31, 10,
								2,  8, 24, 14, 32, 27, 3,  9,  19, 13, 30, 6,  22, 11, 4,  25 ],
			ipRestore :[
								40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,
								38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,
								36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,
								34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25
							],
			 
			L32 : [ ],
			R32 :[ ]
}

//******************************初始的L32与R32***************************
Data.LRGroup=function(temp){
			var dataArr= new Array()
			for(i=0;i<Data.ipIndex.length;i++){
				dataArr[i]=temp[Data.ipIndex[i]-1]
			}
			/*上述为明文的初始置换*/
			for(i=0;i<dataArr.length;i++){
				i<32?Data.L32[i]=dataArr[i]:Data.R32[i-32]=dataArr[i]
			}
}
//*******************************************************************************
		
Data.expanR=function(){
		var expanR48 = new Array()
		for(i=0;i<Data.expanIndex.length;i++){
			expanR48[i]=Data.R32[Data.expanIndex[i]-1]
		}
		//console.log("expandR48:\t"+expanR48)
		return expanR48
}
Data.Xor=function (A,B){
	//此处应使用js的运算符的自动类型转换功能
	var arrXor = new Array()
	for(i = 0;i<A.length;i++){
		arrXor[i]=A[i]^B[i]
	}
	//console.log("arrXor:\t"+arrXor)
	return arrXor
}
Data.boxS=function(temp){
	var x =0
	var y =0
	
	var out4 =""
	for(i=0,j =0;i<8;i++,j=j+6){
				x =parseInt( temp[j]+""+temp[j+5],2)
				y = parseInt(temp[j+1]+""+temp[j+2]+temp[j+3]+temp[j+4],2)
			//	console.log(Data.sIndex[i][x][y].toString(2))
			//	console.log(Data.sIndex[i][x][y].toString(2).length)
			//console.log(Data.sIndex[i][x][y])
			var z =Data.sIndex[i][x][y].toString(2)
			z.length>3?z=z
							:z.length>2?z = "0"+z
							:z.length>1?z="00"+z
							:z.length>0?z="000"+z
							:z="0000"
				out4 = out4+z
	}
	//console.log("boxS:\t"+out4)
	return out4
	
}
Data.pChange=function(str){
		var out4 =str.split("")
		var pResult=new Array()
		for(i=0;i<Data.pIndex.length;i++){
			pResult[i]=out4[Data.pIndex[i]-1]
		}
	//console.log("pResult:\t"+pResult)
	return pResult
}

//*********************num数组转string数组*****************************
Data.trans= function(arrNum){
	
	for(i=0;i<arrNum.length;i++){
	var singleChar = ""+arrNum[i]
	arrNum[i] =singleChar
	}	
	return arrNum
}
//*****************************************************************************
//***********************数组转字符串***********************************
Data.Str = function(arr){
	var temp = ""
	for(i=0;i<arr.length;i++){
	temp =temp+arr[i]
	}
	return temp
}
Data.Run = function(mode){
	
	 Data.LRGroup(Data.indata)
	//*********************************16轮的明文处理****************************
	var lastR32 =new Array()
	var outData=new Array()
	var hidData=new Array()
	
	for(circleNum =0;circleNum<16;circleNum++){
						if(mode=="1"){
							keyCircleNum = circleNum
					}
					else if(mode=="0"){
							keyCircleNum = 15-circleNum
					}
					
		//console.log(circleNum+"\r")
		lastR32 = Data.R32
		var buf =Data.Xor(Data.expanR(),KeyObj.subKey[keyCircleNum])
		var pResult=Data.pChange(Data.boxS(buf)) 
		Data.R32=Data.trans(Data.Xor(Data.L32,pResult))  //变换为string类型
		Data.L32 = lastR32
		//console.log("左："+Data.L32)
		//console.log("右："+Data.R32)
	}
	
	outData = Data.R32.concat(Data.L32)
	//console.log(outData)
	for(i=0;i<Data.ipRestore.length;i++){
		hidData[i]=outData[Data.ipRestore[i]-1]
	}
	/*处理完毕得到结果hidData*/
	
	console.log("每一次的明文加密：\r"+Data.Str(hidData))

	return Data.Str(hidData)
	
}












