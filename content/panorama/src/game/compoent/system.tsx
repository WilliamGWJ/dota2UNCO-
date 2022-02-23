import { useGameEvent } from "@demon673/react-panorama";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export class DS{
    #dispatchmap:Map<string,Record<string,dispatch<any>>> = new Map()
    #pipemap:Map<string,Record<string,any>> = new Map()
    #motion:Map<string,dispatch<boolean>> = new Map()
    static #_instance:DS|undefined

    static get instance(){
        if(this.#_instance == null){
            this.#_instance = new DS()
        }
        return this.#_instance
    }

    //创造一个管道
    registerDispatch<K extends keyof DispatchKV,V extends keyof DispatchKV[K]>(ConpoentName:K,value:DispatchKV[K],index?:number){
        if(this.#dispatchmap.has(ConpoentName + (index ? index : ""))) return ;
        this.#dispatchmap.set(ConpoentName + (index ? index : ""),value)
    }

    getdispatch<K extends keyof DispatchKV,V extends keyof DispatchKV[K] >(ConpoentName:K,index?:number):any{
        return this.#dispatchmap.get(ConpoentName + (index ? index : ""))
    }

    //创造一个管道
    registerPipe(ConpoentName:string,{...args}:{[keys:string]:any},index?:number){
        this.#pipemap.set(ConpoentName + (index ? index : ""),args)
        $.Msg(ConpoentName + (index ? index : ""),args)
        for(const key in args){
           const motion = this.#motion.get(ConpoentName + key)
           if(!motion) continue
           motion(value=>!value)
        }
    }
    
    getPipe<K extends keyof Pipe,V extends keyof Pipe[K] >(ConpoentName:K,index?:number):any{
        return this.#pipemap.get(ConpoentName + (index ? index : ""))
    }

    MotionPipe<K extends keyof Pipe,V extends keyof Pipe[K] >(ConpoentName:K,pipeName:V,motion:dispatch<boolean>){
        this.#motion.set(ConpoentName + pipeName,motion)
    }

    traversePipe<K extends keyof Pipe,V extends keyof Pipe[K] >(ConpoentName:K,start:number,end:number,cb:(value:Pipe[K],index:number)=>any){
        for(let _start = start ; _start <= end ; _start ++){
            const table = this.#pipemap.get(ConpoentName + _start) as Pipe[K]
            cb(table,_start)
        }
    }
    
//
}


type dispatch<T> = React.Dispatch<React.SetStateAction<T>>

interface DispatchKV{
    PublicTips:{setjsx:dispatch<number>},
    BackpackBlock:{setisfull:dispatch<boolean>}
    Backpack_Block_Manager:{set_full_list:dispatch<number[]>}
    Block:{setx:dispatch<number>,sety:dispatch<number>}
}

interface Pipe{
    BackpackBlock:{isfull:boolean}
    Block:{_x:number,_y:number}
}
 
export function useRDispatch<K extends keyof DispatchKV,V extends keyof DispatchKV[K] >(ConpoentName:K,value:DispatchKV[K],index?:number){
    useEffect(()=>{
        $.Msg(value)
        DS.instance.registerDispatch(ConpoentName,value,index)
    },[])
}

export function useGdispatch<K extends keyof DispatchKV,V extends keyof DispatchKV[K],C extends keyof DispatchKV[K][V] >(ConpoentName:K,index?:number):Record<V,DispatchKV[K][V]>{
    const [state,setstate] = useState(DS.instance.getdispatch(ConpoentName,index))

    useEffect(()=>{
        setstate(DS.instance.getdispatch(ConpoentName,index))
    },[index])

    return state
}

export function useUpdatePipe<K extends keyof Pipe>(ConpoentNmae:K,value:Pipe[K],motion:any[],index?:number){
    useLayoutEffect(()=>{
        DS.instance.registerPipe(ConpoentNmae,value,index)
    },motion)
}

export function useGetPipe<K extends keyof Pipe,V extends keyof(Pipe[K]),C extends keyof Pipe[K][V]>(ConpoentNmae:K,index?:number,motion?:Array<any>){
    const [state,setstate] = useState(DS.instance.getPipe(ConpoentNmae,index))

    useLayoutEffect(()=>{
        setstate(DS.instance.getPipe(ConpoentNmae,index))
    },motion)

    return state
}

export function useMotion<K extends keyof Pipe,V extends keyof(Pipe[K]),C extends keyof Pipe[K][V]>(ConpoentName:K,pipeName:V){
    const [state,setstate] = useState(false)

    useLayoutEffect(()=>{
        DS.instance.MotionPipe(ConpoentName,pipeName,setstate)
    },[])

    return state
}
