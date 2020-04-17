// Find all exits for the specified room
module.exports.findExits = function(spawn_index) {
    
    const exits = Game.map.describeExits(Game.spawns[spawn_index].room.name);
    let exit_list = []
    for (let exit in exits) {
        exit_list.push(exits[exit])
    }
    
    return exit_list

};

// Find all empty neighbouring rooms
module.exports.findEmptyRooms = function(spawn_index) {
    
    let empty_rooms = []
    let exit_list = this.findExits(spawn_index)
    for (let room in exit_list) {
        if (Game.map.getRoomStatus(exit_list[room]).status == 'normal') {
            empty_rooms.push(room)
        }
    }

    return empty_rooms

};