// Importing modules
//require('prototype.creep')();

let roleMiner = {
    run: function(creep) {
        
        // If the creep is working and full, switch to non-working state
        if (creep.memory.working && creep.store.getUsedCapacity() == creep.store.getCapacity()) {
            creep.memory.working = false;
        }
        // If the creep is not working and empty, switch to working state
        else if (!creep.memory.working && creep.store.getUsedCapacity() == 0) {
            creep.memory.working = true;
        }

        // Refill the closest containers with the minerals
        if (!creep.memory.working) {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER
                && s.store.getFreeCapacity(RESOURCE_LEMERGIUM) > 0
            });

            // Find closest target
            let target = creep.pos.findClosestByPath(targets);

            // If the room contains a container, transfer the minerals there
            if (targets.length) {
                if (creep.transfer(target, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {reusePath: 5}, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // If all containers are full, move minerals to storage
            else {
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_STORAGE
                    && s.store.getFreeCapacity(RESOURCE_LEMERGIUM) > 0
                });

                let target = creep.pos.findClosestByPath(targets);

                if (targets.length) {
                    if (creep.transfer(target, RESOURCE_LEMERGIUM) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {reusePath: 5}, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }

                // If all storages are full, standby
                else {
                    console.log('Containers and storage are full')
                }
            }
        }

        // Find a mineral deposit to harvest from
        else if (creep.memory.working) {

            if (creep.ticksToLive < creep.store.getCapacity()) {
                var numberOfWorkParts = 0;
                creep.body.forEach(function(part) {
                    if (part.type == WORK) {
                        numberOfWorkParts++;
                    }
                })

                // Kill the creep if they won't be able to refill entirely
                if (creep.ticksToLive < (creep.store.getFreeCapacity() / numberOfWorkParts * 6 + 20)) {
                    console.log('Suiciding creep:', creep.name)
                    creep.suicide();
                }
            }

            let deposit = creep.room.find(FIND_MINERALS);

            // Harvest from the mineral deposit
            if (creep.harvest(deposit[0]) == ERR_NOT_IN_RANGE) {
                return creep.moveTo(deposit[0], {reusePath: 5, visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }

    }
};

module.exports = roleMiner;