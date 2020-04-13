module.exports = function() {

    Creep.prototype.refill = function(useSource, useStorage, useContainer) {
        // Select creeps with a low life expectancy
        if (this.ticksToLive < this.store.getCapacity()) {

            // Calculate the number of body parts in each creep
            var numberOfWorkParts = 0;
            this.body.forEach(function(part) {
                if (part.type == WORK) {
                    numberOfWorkParts++;
                }
            })

            // Kill the creep if they won't be able to refill entirely
            if (this.ticksToLive < (this.store.getFreeCapacity() / numberOfWorkParts * 2 + 10)) {
                console.log('Suiciding creep:', this.name)
                this.suicide();
            }
        }

        // If useSource is true, harvest energy from sources
        if (useSource) {
            // Create an array of active sources
            let sources = this.room.find(FIND_SOURCES_ACTIVE);
            
            // Check if there are any active sources in the room
            if (sources) {
                // Find the closest source of energy
                let target = this.pos.findClosestByPath(sources);
                
                // Harvest from the closest active source
                if (this.harvest(target) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target, {reusePath: 5, visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
        
        // If useStorage is true, withdraw energy from storage
        if (useStorage) {
            let storage = this.room.find(FIND_MY_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_STORAGE
            });

            let target = this.pos.findClosestByPath(storage);

            if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target, {reusePath: 5, visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }

        // If useContainer is true, withdraw energy from containers
        if (useContainer) {
            let containers = this.room.find(FIND_MY_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER
            });

            let target = this.pos.findClosestByPath(containers);
            
            if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target, {reusePath: 5, visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }

    };

    Creep.prototype.moveToRoom = function(target_room) {
        // Move to the specified room
        var exit = this.room.findExitTo(target_room);
        return this.moveTo(this.pos.findClosestByRange(exit),
            {reusePath: 8, visualizePathStyle: {stroke: '#000000'}});
    
    };
    
    // Debug function
    /*Creep.prototype.sayHello = function() {
        return this.say('Hello!');
    };*/

};