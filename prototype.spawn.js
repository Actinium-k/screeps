module.exports = function() {
    
    StructureSpawn.prototype.respawnCreep =
        function (spawn_index, creep_role, creep_name, creep_parts, properties) {
            let newName = creep_name + Game.time;
            console.log(`Spawning new ${creep_role}:`, newName);
            let parts = this.spawns[spawn_index].partSelection(creep_parts);
            return this.spawns[spawn_index].spawnCreep(parts, newName,
                {memory: {role: `${creep_role}`}, properties});
        }
    
    StructureSpawn.prototype.partSelection =
        function (n_move, n_work, n_carry, n_attack, n_ranged_attack, n_heal, n_claim, n_tough) {
            let parts = []

            // Change the order of the parts (TOUGH first, HEAL last)
            for (let i = 0; i < n_tough; i++) {
                parts.push(TOUGH)
            }
            for (let i = 0; i < n_work; i++) {
                parts.push(WORK)
            }
            for (let i = 0; i < n_carry; i++) {
                parts.push(CARRY)
            }
            for (let i = 0; i < n_move; i++) {
                parts.push(MOVE)
            }
            for (let i = 0; i < n_attack; i++) {
                parts.push(ATTACK)
            }
            for (let i = 0; i < n_ranged_attack; i++) {
                parts.push(RANGED_ATTACK)
            }
            for (let i = 0; i < n_heal; i++) {
                parts.push(HEAL)
            }
            for (let i = 0; i < n_claim; i++) {
                parts.push(CLAIM)
            }
            
            return parts;
        }


};