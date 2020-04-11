// Importing modules
require('prototype.creep')();
let roleRepairer = require('role.repairer');

let roleWallRepairer = {

    run: function(creep) {

        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
        }

        // Repair the first wall in the list
        if (creep.memory.repairing) {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: s => s.hits < 1000000
                && s.structureType == STRUCTURE_WALL
            });
            if (targets.length) {
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {reusePath: 5}, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            // If there's nothing to repair, switch to repairer
            else {
                roleRepairer.run(creep);
            }
        }
        // Refill from energy source
        else {
            creep.refill(useSource=true);
        }
    }
};

module.exports = roleWallRepairer;