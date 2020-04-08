let roleBuilder = require('role.builder');

let roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
            creep.say('🛠️ repair');
        }

        // Repair the first structure in the list
        if(creep.memory.repairing) {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
                && object.structureType != STRUCTURE_WALL
            });
            if(targets.length) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {reusePath: 3}, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            // If there's nothing to repair, switch to builder
            else {
                roleBuilder.run(creep);
            }
        }
        // Refill from energy source
        else {
            let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {reusePath: 3}, {visualizePathStyle: {stroke: '#ff7373'}});
            }
        }
    }
};

module.exports = roleRepairer;