// Importing modules
require('prototype.creep')();

let roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // Find an energy source to harvest from
        if(creep.store.getFreeCapacity() > 0) {
            creep.refill();
        }

        // Refill existing structures with energy
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_SPAWN ||
                        s.structureType == STRUCTURE_CONTAINER ||
                        s.structureType == STRUCTURE_TOWER) &&
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {reusePath: 3}, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // Move to a parking area if the structures are full
            else if((creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_FULL)
                    || (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_INVALID_TARGET)) {
                creep.moveTo(Game.flags['parking_area_W36S38'])
            }
        }
    }
};

module.exports = roleHarvester;