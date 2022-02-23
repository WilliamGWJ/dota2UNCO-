declare interface CustomGameEventDeclarations {
    s2c_item_send_totalInformation:Data['itemContainer'][] //发送所有有关背包的信息至客户端
    s2c_item_send_singleItem:{} //发送单个物品的信息至客户端
    s2c_item_send_update_item_container:{} //当某个容器发生变化 我们发送更新信息 指定更新某个容器
    s2c_item_send_remove_item:{} // 删除某个物品
    c2s_item_exchange:{from:number,to:number} //客户端给服务端发送交换物品信息
    c2s_item_discardItems:{index:number} // 客户端给服务端发送丢弃物品信息
    c2s_item_get_totalInformation:{} //客户端要获得所有的物品信息
    s2c_item_send_index_itemContainer_update:Data['itemContainer']//发送某个容器的
}

declare interface Data{
    item:{name:string}
    itemContainer:{state:boolean|number,index:number,item:Data['item']|undefined}   
}