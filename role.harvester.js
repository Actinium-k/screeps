let roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // Find an energy source to harvest from
        if(creep.store.getFreeCapacity() > 0) {
            let source = creep.pos.findClosestByPath(FIND_SOURCES)
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        // Refill existing structures with energy
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {reusePath: 3}, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }//A CHANGER // SI DEPLACER PRES SPAWN ATTENTION ENCOMBREMENT --> parking area
            else if((creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_FULL)
                    || (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_INVALID_TARGET)) {
                creep.moveTo(Game.flags['parking_area_W36S38'])
            }
        }
    }
};

module.exports = roleHarvester;