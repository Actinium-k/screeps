// Importing modules
require('prototype.creep')();
let roleBuilder = require('role.builder');

let roleSettler = {
    run: function(creep) {
        
        // If the creep is not in the target room, move to it
        if (creep.room.name != creep.memory.target) {
            creep.moveToRoom(creep.memory.target);
        }
        else {
            roleBuilder.run(creep)
        }
        
    }
};

module.exports = roleSettler;