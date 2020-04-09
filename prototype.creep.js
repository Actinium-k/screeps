module.exports = function() {

    /*// Refill from energy source
    Creep.prototype.refill = function() {
        // Create an array of non-empty tombstones, dropped energy and active sources
        let sources = this.room.find(FIND_SOURCES_ACTIVE);
        
        // Find the closest source of energy
        let target = this.pos.findClosestByPath(sources);
        
        if(this.harvest(target) == ERR_NOT_IN_RANGE) {
                return this.moveTo(target, {reusePath: 3, visualizePathStyle: {stroke: '#ffaa00'}});
        }
    };*/

    // Refill from energy source
    Creep.prototype.refill = function() {
        // Create an array of non-empty tombstones and active sources
        let sources = (this.room.find(FIND_TOMBSTONES, {
            filter: (t) => t.store[RESOURCE_ENERGY] > 0
        })).concat(this.room.find(FIND_SOURCES_ACTIVE));
        
        // Find the closest source of energy
        let target = this.pos.findClosestByPath(sources);
        
        // If the target is a tombstone, withdraw from it
        if(target instanceof Tombstone && target.store[RESOURCE_ENERGY] > 0) {
            console.log(target.store[RESOURCE_ENERGY])
            this.say('t = tomb')
            if(this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                return this.moveTo(target, {reusePath: 3, visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        // Else, the target is a source so we harvest it
        else if(this.harvest(target) == ERR_NOT_IN_RANGE) {
                return this.moveTo(target, {reusePath: 3, visualizePathStyle: {stroke: '#ffaa00'}});
        }
    };

    /*// Debug function
    Creep.prototype.sayHello = function() {
        return this.say('Hello!');
    };*/
}