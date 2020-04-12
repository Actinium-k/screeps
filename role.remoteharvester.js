// Importing modules
require('prototype.creep')();

let roleRemoteHarvester = {
    run: function(creep) {

        // If the creep is working and has less than 50 energy, switch to non-working state
        if (creep.memory.working && creep.store.getUsedCapacity() < 50) {
            creep.memory.working = false;
        }
        // Once the creep is full, switch to working state
        else if (!creep.memory.working && creep.store.getUsedCapacity() == creep.store.getCapacity()) {
            creep.memory.working = true;
        }

        // If the creep is not working
        if (!creep.memory.working) {
            // If the creep is not in the target room, move to it
            if (creep.room.name != creep.memory.target) {
                creep.moveToRoom(creep.memory.target);
            }
            // Once the creep is in the target room, start refilling
            else {
                creep.refill(useSource=true);
            }
        }

        // If the creep is working
        else if (creep.memory.working) {
            // If the creep is not in the spawn room, move to it
            if (creep.room.name != 'W36S38') {
                creep.moveToRoom('W36S38')
            }
            // If the creep is in the spawn room, refill the structures
            else {
                var targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (s) => {
                        return (s.structureType == STRUCTURE_STORAGE &&
                            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                    }
                });
                
                // If the targets exist in the room
                if (targets.length) {

                    // Find closest target
                    var target = creep.pos.findClosestByPath(targets);
    
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {reusePath: 5, visualizePathStyle: {stroke: '#dddddd'}});
                    }
                    else if ((creep.transfer(target, RESOURCE_ENERGY) == ERR_FULL)
                    || (creep.transfer(target, RESOURCE_ENERGY) == ERR_INVALID_TARGET)) {
                        creep.transfer(targets[0])
                    }
                }
            }
        }

    }
};

module.exports = roleRemoteHarvester;