
var KeyObj ={
						key :[],
						    

						 keyIndex :[
												57, 49, 41, 33, 25, 17,  9,   1, 58, 50, 42, 34, 26, 18,
												10,   2, 59, 51, 43, 35, 27,19, 11,   3, 60, 52, 44, 36,
												63, 55, 47, 39, 31, 23, 15,  7, 62, 54, 46, 38, 30, 22,
												14,   6, 61, 53, 45, 37, 29, 21, 13,  5, 28, 20, 12,  4
						],
								 loopkey : [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
								

						 keyChoiceIndex : [
												14, 17, 11, 24,  1,  5,  3, 28, 15,  6, 21, 10,
												23, 19, 12,  4, 26,  8, 16,  7, 27, 20, 13,  2,
												41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48,
												44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32
											],

//	上面的keyChoice是最终从56bit中选取的48bit的下标号	

						 subL28:[ 
											[ ],//用于存放C0
											[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ],
											[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ]
									],
						 subR28:[ 
											[ ],//用于存放D0
											[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ],
											[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ]
									],	
						subKey:[ 
											[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ],
											[ ],[ ],[ ],[ ],[ ],[ ],[ ],[ ]
									]									
}


/*上述部分的结果*/
 KeyObj.Key64To56 = function(){
			var newKey = new Array()
			var k = 0
			/*遍历数组*/
			for(i=0;i<this.keyIndex.length;i++){
				k = this.keyIndex[i]
				newKey[i]=this.key[k-1]	
			}

			for(i=0;i<newKey.length;i++){
				i<28?KeyObj.subL28[0][i] = newKey[i]:KeyObj.subR28[0][i-28]=newKey[i]
			}
}
//上面是通过function Key64To56() 将密钥的奇偶校验位去掉


KeyObj.trans=function(str){
	var dd = new Array()
	dd =str.split("")
	var sum =""
	for(i=0;i<dd.length;i++){
		dd[i] = (parseInt(dd[i],16)).toString(2)
		dd[i].length>7?dd[i]=dd[i]
							:dd[i].length>3?dd[i] = dd[i]
							:dd[i].length>2?dd[i] = "0"+dd[i]
							:dd[i].length>1?dd[i] = "00"+dd[i]
							:dd[i].length>0?dd[i] = "000"+dd[i]
							:dd[i] ="0000"
		sum = sum +dd[i]
	}
	return sum
}

KeyObj.aKeyCircleResult=function (circleNum){
		
			/*接下来是循环移位*/
			var temp =0
			var L28 =new Array()
			var R28 =new Array()
			for(i=0;i<28;i++){
				L28[i] = this.subL28[circleNum][i]
				R28[i] = this.subR28[circleNum][i]
			}
			
			
			/*
			上面真的是犯了个错误啊.........
			console.log(typeof KeyObj.subL28[circleNum])是对象，var L28 = KeyObj.subL28[circleNum]只能是引用
			引用与赋值不同
			*/
			
			for(i=0;i<this.loopkey[circleNum];i++){
				temp =L28[0]
				for(j=0;j<27;j++){
					L28[j]=L28[j+1]
				}
				L28[j]=temp;
			//	console.log("移位后的L28"+L28)
				
				temp =R28[0]
				for(j=0;j<27;j++){
					R28[j]=R28[j+1]
				}
				R28[j]=temp;
			}
			/*移位完毕,得到新的L28和R28，保存在subL28和subR28中等待下一轮的循环移位作为初始L28和R28的值*/
			this.subL28[circleNum+1]=L28
			this.subR28[circleNum+1]=R28
		
			/*合成子密钥*/
			var newKey = L28.concat(R28)
			for(i=0;i<this.keyChoiceIndex.length;i++){
			this.subKey[circleNum][i]=newKey[this.keyChoiceIndex[i]-1];
			}
		
}

//上面是实现循环左移的函数


KeyObj.makey=function(){
	KeyObj.Key64To56()
	for(circleNum=0;circleNum<16;circleNum++){
	KeyObj.aKeyCircleResult(circleNum)
	}
}





















