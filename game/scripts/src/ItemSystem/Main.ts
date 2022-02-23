// 我们背包虽然呈现在 客户端的react UI上面  但是我们的实际存储数据和操作数据 都是在服务端进行
// 由客户端发送请求 接受数据  然后渲染   这是客户端做的事情

import { reloadable } from "../lib/tstl-utils";
import { Item } from "./item";
import { ItemContainer } from "./itemContainer";

// 首先有一个 物品类 物品的容器类  背包主类  物品的attributes参数也抽象出来 称为一个属性类 比如我们要写一个随机属性的装备 



type CGAMEEVENT = CustomGameEventDeclarations
type send = {[P in keyof CGAMEEVENT]:P extends `s2c_item${infer R}` ? CGAMEEVENT[P] : never}[keyof CGAMEEVENT]
type registerC2S = {[P in keyof CGAMEEVENT]:P extends `c2s_item${infer R}` ? `c2s_item${R}` : never}[keyof CGAMEEVENT]
type BackpackMainS2cKey = {[P in keyof CGAMEEVENT]:P extends `s2c_item${infer R}` ? `s2c_item${R}` : never}[keyof CGAMEEVENT]

const backpackConstantTable ={
    defaultBackpackContainerNumber/**背包容器数量 */:60,
}
 

/**总背包类 */
@reloadable
export class BackpackMain { 
    Player:CDOTAPlayer
    ItemContaineies:Record<number,ItemContainer> = {}
    

    constructor(Player:CDOTAPlayer){
        this.Player = Player
        this.registerC2S()
        this.registerofficialEvent()
        this.initItemContainer()
        this.init()
    }

    init(){
        const aLLdata = this.getDataTypesOfAllContainers()
        this.s2c("s2c_item_send_totalInformation",aLLdata)
    }

    /**初始化一个背包里的容器情况 */
    initItemContainer(){
        for(let index = 0 ; index < backpackConstantTable.defaultBackpackContainerNumber ; index ++){
            this.ItemContaineies[index] = new ItemContainer(index,this)
        }
    }

    /**获取所有容器的数据类型 */
    getDataTypesOfAllContainers(){
        const c2sArray:Data['itemContainer'][] = []
        for(let index = 0 ; index < backpackConstantTable.defaultBackpackContainerNumber ; index ++){
            c2sArray.push(this.ItemContaineies[index].GetData())
        }
        return c2sArray
    }

    /**获取单一容器的所有数据类型 */
    GetsingleItemContainer(index:number){
        return this.ItemContaineies[index].GetData()
    }

    /** 这个函数是调用某个客户端接口 send 发送数据到客户端 */
    s2c(key:BackpackMainS2cKey,sendData:send){
        DeepPrintTable(sendData)
        CustomGameEventManager.Send_ServerToPlayer(this.Player,key,sendData)
    }

    /**注册事件  当物品被丢弃时触发 */
    c2s_item_discardItems(event:CGAMEEVENT['c2s_item_discardItems']){
        
    }

    /**注册事件  当物品交换位置时触发 */
    c2s_item_exchange(event:CGAMEEVENT['c2s_item_exchange']){
        const from = event.from
        const to = event.to
        const fromItem = this.ItemContaineies[from].Getitem
        const toItem = this.ItemContaineies[to].Getitem
        this.ItemContaineies[from].setItem(toItem)
        this.ItemContaineies[to].setItem(fromItem)
    }

    /**注册事件 当客户端需要所有数据的时候触发 */
    c2s_item_get_totalInformation(event:CGAMEEVENT["c2s_item_get_totalInformation"]){
        const aLLdata = this.getDataTypesOfAllContainers()
        this.s2c("s2c_item_send_totalInformation",aLLdata)
    }


    registerC2S(){
        const registerTable:Record<registerC2S,Function> = {
            "c2s_item_discardItems":this.c2s_item_discardItems.bind(this),
            "c2s_item_exchange":this.c2s_item_exchange.bind(this),
            "c2s_item_get_totalInformation":this.c2s_item_get_totalInformation.bind(this),
        }
        for(const key in registerTable){
            CustomGameEventManager.RegisterListener(key,(_,event)=>{
                registerTable[key](event)
            })
        }
    }

    /**当物品被拾取时候触发的事件 */
    dota_item_picked_up(event: GameEventProvidedProperties & DotaItemPickedUpEvent){
        const item = EntIndexToHScript(event.ItemEntityIndex) as CDOTA_Item
        print(item.GetName())
        print("物品被拾取")
        const current_null_index = this.findTheNearestAirContainer()
        if(current_null_index == -1){
            return
        }
        this.ItemContaineies[current_null_index].setItem(new Item(item.GetName()))
        item.RemoveSelf()
    }

    /**查找最近的空物品容器 */
    findTheNearestAirContainer(){
        for(const key in this.ItemContaineies){
           if(this.ItemContaineies[key].isNull()){
              print("当前找到为空的容器是",key)
              return this.ItemContaineies[key].Getindex
           }
        }
        return -1
    }

    /**注册官方事件 */
    registerofficialEvent(){
        ListenToGameEvent("dota_item_picked_up",(event)=>this.dota_item_picked_up(event),null)
    }

}
