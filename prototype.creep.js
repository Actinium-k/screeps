module.exports = function() {

// Refill from energy source
Creep.prototype.refill = function() {
    // Create an array of non-empty tombstones, dropped energy and active sources
    let sources = this.room.find(FIND_SOURCES_ACTIVE);
    
    // Find the closest source of energy
    let target = this.pos.findClosestByPath(sources);
    
    if(this.harvest(target) == ERR_NOT_IN_RANGE) {
            return this.moveTo(target, {reusePath: 3, visualizePathStyle: {stroke: '#ffaa00'}});
    }
    else {
        /*// DEBUG: nothing should end up here
        console.log('------')
        console.log('Creep name', this.name)
        console.log('Creep target', target)
        //this.say('Bug')*/
    }
};

    // Debug function
    Creep.prototype.sayHello = function() {
        return this.say('Hello!');
    };
}