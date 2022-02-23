import { Item } from "./item";
import { BackpackMain } from "./Main";

/**这个是物品的容器类 */
export class ItemContainer{
    private host:BackpackMain
    private index:number
    private item:Item
    private state:boolean = true

    constructor(index:number,host:BackpackMain){
        this.index = index
        this.host = host
    }

    get Getindex() {
        return this.index
    }

    get Getitem(){
        return this.item
    }

    setItem(Item:Item){
        this.item = Item
        this.host.s2c('s2c_item_send_index_itemContainer_update',this.GetData())
        print("当前第",this.index,"号容器添加了一个新物品")
    }

    GetData():Data['itemContainer']{
        return {index:this.index,item:this.item?.getData(),state:this.state}
    }

    isNull(){
        return this.item == null
    }
}