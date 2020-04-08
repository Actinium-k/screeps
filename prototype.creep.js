module.exports = function() {

    // Refill from energy source
    Creep.prototype.refill = function() {
        // Create an array of dropped energy and active sources
        let sources = (creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: {resourceType: RESOURCE_ENERGY}
        })).concat(creep.room.find(FIND_SOURCES_ACTIVE));
        
        // Find the closest source of energy
        let target = creep.pos.findClosestByPath(sources);

        // If the target is a dropped energy, pick it up
        if(target == RESOURCE_ENERGY) {
            if(creep.pickup(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {reusePath: 3}, {visualizePathStyle: {stroke: '#ffaa00'}});
            }   
        }
        // Else, the target is a source so harvest
        else {
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {reusePath: 3},{visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}