// Importing modules
require('prototype.creep')();
let roleBuilder = require('role.builder');

let roleRepairer = {

    run: function(creep) {

        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
        }
        if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
        }

        // Repair the first structure in the list
        if(creep.memory.repairing) {
            // Creating an array of all structures that need repairs
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < (object.hitsMax)
                && object.structureType != STRUCTURE_WALL
            });

            // Sorting the structures from least decayed to most decayed
            targets = targets.sort(function(a,b) {
                return b.hits - a.hits
            });
            
            // DEBUG: logging all targets
            /*for(let i = 0; i < targets.length; i++) {
                console.log(targets[i].hits, i)
            }*/

            if(targets.length) {
                if(creep.repair(targets[targets.length - 1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[targets.length - 1], {reusePath: 3}, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            // If there's nothing to repair, switch to builder
            else {
                roleBuilder.run(creep);
            }
        }
        // Refill from energy source
        else {
            creep.refill();
        }
    }
};

module.exports = roleRepairer;