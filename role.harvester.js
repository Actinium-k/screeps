// Importing modules
require('prototype.creep')();

let roleHarvester = {

    run: function(creep) {

        // If the creep is working and has less than 50 energy, stop working
        if (creep.memory.working == true && creep.store.getUsedCapacity() < 50) {
            creep.memory.working = false;
        }
        // Once the creep is full, switch to working state
        else if (creep.memory.working == false && creep.store.getUsedCapacity() == creep.store.getCapacity()) {
            creep.memory.working = true;
        }

        // Find an energy source to harvest from
        if(creep.memory.working == false) {
            creep.refill();
        }

        // Refill existing structures with energy
        else if(creep.memory.working) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_SPAWN ||
                        s.structureType == STRUCTURE_TOWER) &&
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            // Find closest target
            var target = creep.pos.findClosestByPath(targets);

            if(targets.length > 0) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {reusePath: 3}, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // Move to a parking area if the structures are full
            else if((creep.transfer(target, RESOURCE_ENERGY) == ERR_FULL)
                    || (creep.transfer(target, RESOURCE_ENERGY) == ERR_INVALID_TARGET)) {
                creep.moveTo(Game.flags['parking_area_W36S38'])
            }
        }
        else {
            creep.say('ERROR')
        }
    }
};

module.exports = roleHarvester;