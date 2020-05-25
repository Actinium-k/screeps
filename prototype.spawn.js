module.exports = function() {
    
    StructureSpawn.prototype.respawnCreep =
        function (spawn_index, creep_role, creep_name, properties, creep_parts) {
            
            // Generate the name of the creep
            let name = (Math.random().toString(36)+'000000').slice(2, 6)
            let newName = creep_name + '·' + name;

            // Say in the console which creep we are spawning
            if (Game.spawns[spawn_index].spawning) {
                console.log(`${Game.spawns[spawn_index]} spawning new ${creep_role}:`, newName);
            }
            
            // Generate the parts based on creep_parts
            let parts = Game.spawns[spawn_index].partSelection(creep_parts);

            // Spawn the creep using the input values
            return Game.spawns[spawn_index].spawnCreep(parts, newName, {memory: {
                role: `${creep_role}`,
                room: Game.spawns[spawn_index].room.name,
                working: false,
                target: properties[0]
            }});
            
        }
    
    StructureSpawn.prototype.partSelection =
        function ({n_move=0, n_work=0, n_carry=0, n_attack=0, n_ranged_attack=0, n_heal=0, n_claim=0, n_tough=0}) {
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

    // Debug function
    /*StructureSpawn.prototype.debug = function (i) {
        console.log(JSON.stringify(Game.spawns[i].name))
    }*/

};