// Importing modules
require('prototype.creep')();

let roleTransporter = {
    run: function(creep) {

        let source = Game.getObjectById('5e91d351ccaa2b2bac672042');
        let target = Game.getObjectById('5e92f1bc3dfe156ccacc7134');
        
        if (creep.memory.refill && creep.store.getFreeCapacity() == 0) {
            creep.memory.refill = false;
        }
        if (!creep.memory.refill && creep.store[RESOURCE_LEMERGIUM] == 0) {
            creep.memory.refill = true;
        }

        if (creep.memory.refill) {
            // Check if the source exists
            if (source) {
                // Harvest from the closest active source
                if (creep.withdraw(source, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {reusePath: 5, visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }

        if (!creep.memory.refill) {
            // Check if the target exists
            if (target) {
                // Harvest from the closest active source
                if (creep.transfer(target, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {reusePath: 5, visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }

    }
};

module.exports = roleTransporter;