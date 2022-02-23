import { attributes } from "./attributes";

export class Item {
    name:string
    attributes:attributes //物品的属性类

    constructor(name:string){
        this.name = name
        print("一个新的物品创建了,名字为",this.name)
    }

    getData():Data['item']{
        return {name:this.name}
    }

}