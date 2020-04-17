// Define the maximum number of creeps of each roles for each spawn
module.exports.defineMaxCreeps = function(spawn_index) {
    
    let spawn = Game.spawns[spawn_index]
    let rcl = spawn.room.controller.level
    if (rcl <= 3) {
        spawn.memory.haversters_max = 2;
        spawn.memory.builders_max = 2;
        spawn.memory.repairers_max = 1;
    }
    else if (rcl <= 4) {
        spawn.memory.harvesters_max = 3;
        spawn.memory.upgraders_max = 2;
        spawn.memory.wallrepairers_max = 1;
        spawn.memory.remoteharvesters_max = 4;
    }
    else if (rcl <= 5) {
        spawn.memory.harvesters_max = 4;
        spawn.memory.remoteharvesters_max = 6;
        spawn.memory.claimers_max = 2;
    }
    else if (rcl <= 6) {
        spawn.memory.upgraders_max = 3;
        spawn.memory.remoteharvesters_max = 8;
        spawn.memory.claimers_max = 4;
        spawn.memory.miners_max = 1;
    }
    else if (rcl <= 7) {
        console.log('Please setup RCL 7 constants')
    }
    else if (rcl == 8) {
        spawn.memory.upgraders_max = 1;
    }

};

// Define the number of creep_parts for each roles
module.exports.getCreepsParts = function(spawn_index) {
    
    let spawn = Game.spawns[spawn_index]
    let energy_max = Game.spawns[spawn_index].room.energyCapacityAvailable

    // Define the maximum energy use, class and whether the creep will use roads
    const harvester = [33, 'worker', true]
    const upgrader = [50, 'worker', true]
    const builder = [50, 'worker', true]
    const repairer = [33, 'worker', true]
    const wallrepairer = [33, 'worker', true]
    const claimer = [33, 'military', false]
    const miner = [25, 'worker', true]
    const remoteharvester = [50, 'worker', false]
    const transporter = [25, 'carrier', true]
    const defender = [33, 'military', true]
    const settler = [40, 'worker', false]

    const roles = [harvester, upgrader, builder, repairer, wallrepairer, claimer, miner,
        remoteharvester, transporter, defender, settler]
    const roles_str = ['harvester', 'upgrader', 'builder', 'repairer', 'wallrepairer', 'claimer', 'miner',
        'remoteharvester', 'transporter', 'defender', 'settler']
    
    function addArrays(a, b) {
        return a.map((x, i) => x + b[i])
    }
    
    function sumArray(a) {
        return a.reduce((x, y) => x + y)
    }

    for (let i = 0; i in roles; i++) {
        // Calculate the maximum energy used for the creep, rounded to  50
        let e_max = energy_max * roles[i][0] / 100
        e_max = Math.ceil(e_max / 50) * 50
        
        // If the creep is a worker, it can have MOVE, WORK and CARRY parts
        if (roles[i][1] == 'worker') {
            // If the creep will use roads, the number of MOVE, WORK and CARRY will be the same
            if (roles[i][2]) {
                let cost = [x=50,y=100,z=50]
                let creep_parts = [x,y,z]
                
                // Add cost to creep_parts until the creep costs reaches the maximum, with a tolerance of 50
                while (sumArray(creep_parts) + sumArray(cost) <= e_max + 50) {
                    creep_parts = addArrays(creep_parts, cost)
                }

                // Set the number of parts in the spawn memory
                creep_parts = creep_parts.map((a, i) => a / cost[i])
                spawn.memory[roles_str[i]] = creep_parts
            }
            // If the creep won't use road, it will have twice as many MOVE, e.g. double the cost of x
            else {
                let cost = [x=100,y=100,z=50]
                let creep_parts = [x,y,z]
                
                // Add cost to creep_parts until the creep costs reaches the maximum, with a tolerance of 50
                while (sumArray(creep_parts) + sumArray(cost) <= e_max + 50) {
                    creep_parts = addArrays(creep_parts, cost)
                }

                // Change the value of x to reflect the true cost of the part
                cost[0] = 50

                // Set the number of parts in the spawn memory
                creep_parts = creep_parts.map((a, i) => a / cost[i])
                spawn.memory[roles_str[i]] = creep_parts
            }
        }

        // If the creep is military, it can have MOVE, ATTACK, RANGED_ATTACKED and TOUGH parts
        else if (roles[i][1] == 'military') {

        }

        // If the creep is a carrier, it can have MOVE and CARRY parts
        else if (roles[i][1] == 'carrier') {
            
        }

    }

};