// Importing modules
require('prototype.spawn')();
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleRepairer = require('role.repairer');
let roleWallRepairer = require('role.wallrepairer');
let roleClaimer = require('role.claimer');

module.exports.loop = function () {

    // Define the maximum numbers of creeps for each role
    const harvesters_max = 3;
    const upgraders_max = 4;
    const builders_max = 4;
    const repairers_max = 1;
    const wallrepairers_max = 0;

    // Create arrays containing all roles
    let roles = [roleHarvester, roleUpgrader, roleBuilder, roleRepairer, roleWallRepairer, roleClaimer];
    let roles_str = ['harvester', 'upgrader', 'builder', 'repairer', 'wallrepairer', 'claimer'];

    // Create arrays containing every creep of each role
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    let repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    let wallrepairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallrepairer');

    //let energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    //console.log('Current available energy:', energy)

    // Respawning harvesters //TODO: error catching + improve parts handling
    if (harvesters.length < harvesters_max) {
        let newName = 'DH' + Game.time;
        console.log('Spawning new harvester:', newName);
        let parts = Game.spawns.Spawn1.partSelection(3,4,2);
        Game.spawns['Spawn1'].spawnCreep(parts, newName,
            {memory: {role: 'harvester', working: false}});
    }

    // Respawning upgraders
    if (upgraders.length < upgraders_max) {
        let newName = 'AU' + Game.time;
        console.log('Spawning new upgrader:', newName);
        let parts = Game.spawns.Spawn1.partSelection(4,4,3);
        Game.spawns['Spawn1'].spawnCreep(parts, newName,
            {memory: {role: 'upgrader'}});
    }

    // Respawning builders
    if (builders.length < builders_max) {
        let newName = 'DB' + Game.time;
        console.log('Spawning new builder:', newName);
        let parts = Game.spawns.Spawn1.partSelection(4,4,3);
        Game.spawns['Spawn1'].spawnCreep(parts, newName,
            {memory: {role: 'builder'}});
    }

    // Respawning repairers
    if (repairers.length < repairers_max) {
        let newName = 'IR' + Game.time;
        console.log('Spawning new repairer:', newName);
        let parts = Game.spawns.Spawn1.partSelection(3,2,1);
        Game.spawns['Spawn1'].spawnCreep(parts, newName,
            {memory: {role: 'repairer'}});
    }

    // Respawning wall repairers
    if (wallrepairers.length < wallrepairers_max) {
        let newName = 'WR' + Game.time;
        console.log('Spawning new wall repairer:', newName);
        let parts = Game.spawns.Spawn1.partSelection(4,2,2);
        Game.spawns['Spawn1'].spawnCreep(parts, newName,
            {memory: {role: 'wallrepairer'}});
    }

    // Showing what role is being spawned
    if (Game.spawns['Spawn1'].spawning) {
        let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x - 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    // Call each role
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        for (let i = 0; i < roles.length; i++) {
            if (creep.memory.role == roles_str[i]) {
                roles[i].run(creep)
            }
        }
    }

    // Create an array containing every tower in the room
    var hostiles = Game.rooms['W36S38'].find(FIND_HOSTILE_CREEPS)
    if (hostiles.length > 0) {
        var towers = Game.rooms['W36S38'].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => tower.attack(hostiles[0]));
        console.log("ALERT - WE ARE BEING ATTACKED - TARGET:", hostiles[0])
    }
    
    // Clearing the memory of non-existing creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep in memory:', name);
        }
    }

}