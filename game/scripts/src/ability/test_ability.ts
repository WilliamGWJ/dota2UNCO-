import { BaseAbility, registerAbility } from "../lib/dota_ts_adapter";
import { Timers } from "../lib/timers";
import { reloadable } from "../lib/tstl-utils";


@reloadable
@registerAbility()
class item_kv_generator_test extends BaseAbility{

    Precache(context: CScriptPrecacheContext): void {
        PrecacheResource('particle', 'particles/dev/library/base_tracking_projectile.vpcf', context);
    }

    OnSpellStart(): void {
       const point = this.GetOrigin()
       const units = FindUnitsInRadius(DotaTeam.NOTEAM,point,null,500,UnitTargetTeam.ENEMY,UnitTargetType.ALL,UnitTargetFlags.NONE,FindOrder.FARTHEST,false)
       units.forEach(unit=>{
            const project:CreateTrackingProjectileOptions = {
            "Ability":this,
            "EffectName":"particles/dev/library/base_tracking_projectile.vpcf",
            "Source":this.GetCaster(),
            "Target":unit,
            "bDodgeable":false,
            "iMoveSpeed":300
            }
            ProjectileManager.CreateTrackingProjectile(project)
       })
    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        const id = ParticleManager.CreateParticle("particles/econ/events/ti10/high_five/towers/dire_tower_2021/high_five_dire_tower_2021_impact_fire.vpcf",ParticleAttachment.ABSORIGIN_FOLLOW,target)
        ParticleManager.SetParticleControl(id,3,target.GetOrigin())
        Timers.CreateTimer(2,()=>{
            ParticleManager.DestroyParticle(id,true)
        })
        const damageTable:ApplyDamageOptions = {
            "ability":this,
            "attacker":this.GetCaster(),
            "damage":300,
            "damage_flags":DamageFlag.NONE,
            "damage_type":DamageTypes.MAGICAL,
            "victim":target
        }
        ApplyDamage(damageTable)
    }

    OnAbilityPhaseStart(): boolean {
        print("当技能开始释放了,但是资源(魔法值还没被消耗)!")
        return true
    }
}