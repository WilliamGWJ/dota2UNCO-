import { BaseItem } from "./lib/dota_ts_adapter";
import { reloadable } from "./lib/tstl-utils";

@reloadable
export class Test{
    constructor(){
        ListenToGameEvent("npc_spawned",(event)=>Spawend(event),null)
        // GameRules.GetGameModeEntity().SetItemAddedToInventoryFilter((event)=>{
        //     let item = EntIndexToHScript(event.item_entindex_const) as CDOTA_Item_DataDriven;
        //     print(item.GetName())
        //     return false
        // },this)
    }

    call(){

    }
}

function Spawend(event:GameEventProvidedProperties & NpcSpawnedEvent){
    const entity = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC
    // if(entity.IsHero()){
    //     entity.AddNewModifier(entity,null,"Test_modilfer",{duration:100})
    // }
    const ability = entity.FindAbilityByName("item_kv_generator_test")
    ability && ability.SetLevel(2)
}
