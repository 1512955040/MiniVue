class Observer{
	constructor(data) {
	    this.walk(data)
	}
	//walk方法遍历data中的所有属性
	walk(data) {
		//1.判断data是否对象
		if(!data || typeof data !=='object'){
			return 
		}
		//2.遍历data对象的所有属性
		Object.keys(data).forEach(key=>{
			this.defineReactive(data,key,data[key])
		})
	}
	//degineReactivce方法定义响应式数据 把属性转化为getter和setter
	defineReactive(obj,key,val) {
		let that=this
		// 负责收集依赖,并发送通知
		let dep=new Dep()
		//如果val传入对象的话也给对象里面的属性添加getter和setter方法
		this.walk(val)
		Object.defineProperty(obj,key,{
			enumerable:true,
			configurable:true,
			get(){
				// 收集依赖
				Dep.target && dep.addSub(Dep.target)
				return val
			},
			set(newValue){
				if(newValue==val){
					return 
				}
				val=newValue
				//如果给属性重新赋值成对象,给对象里面的属性重新添加getter和setter方法
				//比如:历史数据vm.msg="Hello World" 修改之后vm.msg={a:'Hwllo World'}
				//再次调用此方法给vm.msg.a重新添加getter和setter方法
				that.walk(newValue)
				//发送通知
				dep.notify()
			}
		})
	}
}