
import { BackpackMain } from "./ItemSystem/Main";
import { BaseItem } from "./lib/dota_ts_adapter";
import { Timers } from "./lib/timers";
import { reloadable } from "./lib/tstl-utils";
import { Test } from "./test";

const heroSelectionTime = 10;

declare global {
    interface CDOTAGamerules {
        Addon: GameMode;
        test:Test;
        backPackMain:BackpackMain
    }
}

@reloadable
export class GameMode {
    public static Precache(this: void, context: CScriptPrecacheContext) {
        PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context);
        PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context);
    }

    public static Activate(this: void) {
        GameRules.Addon = new GameMode();
        GameRules.test = new Test();
        ListenToGameEvent("npc_spawned",(event)=>{
           const hero = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC
           GameRules.backPackMain = new BackpackMain(hero.GetPlayerOwner())
           if(hero.IsHero()){
               Timers.CreateTimer(1,()=>{
                   const item = CreateItem("item_circlet",hero.GetPlayerOwner(),hero.GetPlayerOwner())
                   CreateItemOnPositionSync(Vector(0,0,0),item)
                   return 10
               })
               hero.HeroLevelUp(true)
           }
        },null)
    }

    constructor() {
        this.configure();
    }

    private configure(): void {
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 3);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 3);

        GameRules.SetShowcaseTime(0);
        GameRules.SetHeroSelectionTime(heroSelectionTime);
    }


    public Reload() {
        print("Script reloaded!");
    }
}

