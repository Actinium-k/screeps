let roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        // Upgrade the closest controller
        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {reusePath: 3}, {visualizePathStyle: {stroke: '#0000ff'}});
            }
        }
        // Refill from energy source
        else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {reusePath: 3}, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleUpgrader;