import { render, useGameEvent } from "@demon673/react-panorama";
import React, { DragEvent, DragEventHandler, useEffect, useRef, useState } from "react";
import shortid from "shortid";

function jsonToArray(json: any) {
    const keys = Object.keys(json);
    const list: any[] = [];
    keys.forEach(key => {
        list[+key] = json[key];
    });
    return list;
}


const Item = ({ data, index }: { data: Data['item'], index: number; }) => {

    return <DOTAItemImage className="item" itemname={data?.name} />;
};

const ItemContainer = ({ index, data }: { index: number, data:Data['itemContainer']; }) => {
    const [itemData, setItemData] = useState<Data['itemContainer']>(data);
    const ContainerRef = useRef<Panel|null>()

    useGameEvent("s2c_item_send_index_itemContainer_update", (event) => {
        if (event.index != index) return;
        setItemData(event);
    }, []);

    useEffect(() => {
        if(!ContainerRef.current) return
        $.RegisterEventHandler('DragEnter', ContainerRef.current, OnDragEnter);
        $.RegisterEventHandler('DragDrop',  ContainerRef.current, OnDragDrop);
        $.RegisterEventHandler('DragLeave',  ContainerRef.current, OnDragLeave);
        $.RegisterEventHandler('DragStart',  ContainerRef.current, OnDragStart);
        $.RegisterEventHandler('DragEnd',  ContainerRef.current, OnDragEnd);
    }, []);

    const OnDragEnter = () =>{

    }

    const OnDragDrop = (panelId:string, Panel:Panel) =>{
        GameEvents.SendCustomGameEventToServer("c2s_item_exchange",{from:Panel.Data().index,to:index})
    }

    const OnDragLeave = () =>{

    }

    const OnDragStart = (panelId:string, dragCallbacks:DragSettings) =>{
        if( Object.keys(data).length == 0) return
        const temp = $.CreatePanel("DOTAItemImage",$.GetContextPanel(),"temp")
        temp.AddClass("dragitem")
        temp.itemname = itemData.item?.name ?? ""
        dragCallbacks.displayPanel = temp
        temp.Data().index = index
    }

    const OnDragEnd = (panelId:string,displayPanel:Panel) =>{
        displayPanel.DeleteAsync(0)
    }


    return <Panel draggable={true} ref={panel=>ContainerRef.current = panel} className="itemContainer">
        <Item data={itemData.item ?? {"name":""}} index={index} />
    </Panel>;
};


const BackPackMain = () => {
    const [count, setcount] = useState<number>();
    const [allData, setAllData] = useState<CustomGameEventDeclarations['s2c_item_send_totalInformation']>();

    useGameEvent("s2c_item_send_totalInformation", (event) => {
        setcount(Object.keys(event).length);
        setAllData(jsonToArray(event));
    }, []);

    useEffect(() => {
        GameEvents.SendCustomGameEventToServer("c2s_item_get_totalInformation", {});
    }, []);

    return <Panel className="BackPackMain">
        {allData?.map(value => {
            return <ItemContainer key={shortid.generate()} index={value.index} data={value ?? {name:""}} />;
        })
        }
    </Panel>;
};
//
render(<BackPackMain />, $.GetContextPanel());//