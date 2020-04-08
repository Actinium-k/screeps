//require('prototype.spawn')
//require('prototype.creep')();
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleRepairer = require('role.repairer');
let roleWallRepairer = require('role.wallrepairer');
let roleClaimer = require('role.claimer');

module.exports.loop = function () {

    // Define the maximum numbers of creeps for each role
    const harvesters_max = 3;
    const upgraders_max = 5;
    const builders_max = 4;
    const repairers_max = 2;
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

    // Respawning harvesters
    if(harvesters.length < harvesters_max) {
        let newName = 'DH' + Game.time;
        console.log('Spawning new harvester:', newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'harvester'}});
    }
    
    // Respawning upgraders
    if(upgraders.length < upgraders_max) {
        let newName = 'AU' + Game.time;
        console.log('Spawning new upgrader:', newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'upgrader'}});
    }
    
    // Respawning builders
    if(builders.length < builders_max) {
        let newName = 'DB' + Game.time;
        console.log('Spawning new builder:', newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'builder'}});
    }

    // Respawning repairers
    if(repairers.length < repairers_max) {
        let newName = 'IR' + Game.time;
        console.log('Spawning new repairer:', newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'repairer'}});
    }

    // Respawning repairers
    if(wallrepairers.length < wallrepairers_max) {
        let newName = 'WR' + Game.time;
        console.log('Spawning new wall repairer:', newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'wallrepairer'}});
    }

    // Spawning the creeps
    if(Game.spawns['Spawn1'].spawning) {
        let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x - 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    // Calling each role
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        for(let i = 0; i < roles.length; i++) {
            if(creep.memory.role == roles_str[i]) {
                roles[i].run(creep)
            }
        }
    }

    // Detect and shoot enemies
    let towers = _.filter(Game.structures, object => object.structureType == STRUCTURE_TOWER);
    
    for (let i = 0; i < towers.length; i++) {
        var target = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            towers[i].attack(target);
            console.log("ALERT - WE ARE BEING ATTACKED - ALERT")
            console.log('Target:', target);
        }   
    };

    // Clearing the memory of non-existing creeps
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creeps in memory:', name);
        }
    }
    
    //console.log('Current CPU usage:', (Math.round(Game.cpu.getUsed() * 100) / 1000));
    
}