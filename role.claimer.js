let roleClaimer = {
    run: function(creep) {

        if (creep.room.name != creep.memory.target) {
            creep.moveToRoom(creep.memory.target);
        }
        else if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {reusePath: 8}, {visualizePathStyle: {stroke: '#dddddd'}});
        }
        else if (creep.reserveController(creep.room.controller) == ERR_GCL_NOT_ENOUGH) {
            console.log('GCL not enough to claim this room');
        }
        
    }
};

module.exports = roleClaimer;