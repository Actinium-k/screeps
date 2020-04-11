// Importing modules
require('prototype.creep')();
let roleUpgrader = require('role.upgrader');

let roleBuilder = {

    run: function(creep) {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
        }

        // Build the first construction site in the list
        if (creep.memory.building) {
            let targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {reusePath: 5}, {visualizePathStyle: {stroke: '#ffd700'}});
                }
            }
            // If there are no construction sites in range, switch to upgrades
            else {
                roleUpgrader.run(creep);
            }
        }
        // Refill from energy source
        else {
            creep.refill(useSource=true);
        }
    }
};

module.exports = roleBuilder;