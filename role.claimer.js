let roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let target = Game.flags['claim_W35S38']
        if(creep.room == Game.rooms['W35S38']) {
            if(creep.room.controller) {
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {reusePath: 8}, {visualizePathStyle: {stroke: '#dddddd'}});
                }
                else if(creep.claimController(creep.room.controller) == ERR_GCL_NOT_ENOUGH) {
                    console.log('GCL not enough to claim this room');
                }
            }
        }
        else {
            creep.moveTo(target, {reusePath: 5}, {visualizePathStyle: {stroke: '#dddddd'}});
        }
    }
};

module.exports = roleClaimer;