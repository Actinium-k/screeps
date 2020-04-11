// Importing modules
require('prototype.creep')();

let roleUpgrader = {
    run: function(creep) {
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
        }

        // Upgrade the controller
        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {reusePath: 5, visualizePathStyle: {stroke: '#0000ff'}});
            }
        }
        // Refill from energy source
        else if (!creep.memory.upgrading) {
            creep.refill(useSource=true);
        }
    }
};

module.exports = roleUpgrader;