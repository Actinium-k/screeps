// Importing modules
require('prototype.spawn')();
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleRepairer = require('role.repairer');
let roleWallRepairer = require('role.wallrepairer');
let roleClaimer = require('role.claimer');
let roleMiner = require('role.miner');
let roleRemoteHarvester = require('role.remoteharvester')
let roleTransporter = require('role.transporter')
let roleDefender = require('role.defender')

// Create arrays containing all roles
let roles = [roleHarvester, roleUpgrader, roleBuilder, roleRepairer, roleWallRepairer, roleClaimer, 
    roleMiner, roleRemoteHarvester, roleTransporter, roleDefender];
let roles_str = ['harvester', 'upgrader', 'builder', 'repairer', 'wallrepairer', 'claimer', 
    'miner', 'remoteharvester', 'transporter', 'defender'];

module.exports.loop = function () {

    // Apply the main sequence to every spawn
    for (const spawn_index in Game.spawns) {

        // Define the maximum numbers of creeps for each role
        const harvesters_max = 2;
        const upgraders_max = 3;
        const builders_max = 3;
        const repairers_max = 1;
        const wallrepairers_max = 1;
        const miners_max = 1;
        const remoteharvesters_max = 10;
        const claimers_max = 0;

        // Describe all exits in the room
        const exits = Game.map.describeExits(Game.spawns[spawn_index].room.name);
        var exit_list = []
        for (exit in exits) {
            exit_list.push(exits[exit])
        }

        // Create arrays containing every creep of each role
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        let repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        let wallrepairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallrepairer');
        let miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        let remoteharvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteharvester');
        let claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
        
        // Run each role
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            for (let i = 0; i < roles.length; i++) {
                if (creep.memory.role == roles_str[i]) {
                    roles[i].run(creep)
                }
            }
        }

        // Respawning harvesters
        if (harvesters.length < harvesters_max) {
            Game.spawns[spawn_index].respawnCreep(spawn_index, 'harvester', 'HA', [false, undefined],
            {n_move: 4, n_work: 5, n_carry: 3})
        }

        // Respawning upgraders
        if (upgraders.length < upgraders_max) {
            Game.spawns[spawn_index].respawnCreep(spawn_index, 'upgrader', 'UP', [undefined, undefined],
            {n_move: 5, n_work: 5, n_carry: 5})
        }

        // Respawning builders
        if (builders.length < builders_max) {
            Game.spawns[spawn_index].respawnCreep(spawn_index, 'builder', 'BD', [undefined, undefined],
            {n_move: 5, n_work: 5, n_carry: 5})
        }

        // Respawning repairers
        if (repairers.length < repairers_max) {
            Game.spawns[spawn_index].respawnCreep(spawn_index, 'repairer', 'RP', [undefined, undefined],
            {n_move: 5, n_work: 5, n_carry: 5})
        }

        // Respawning wall repairers
        if (wallrepairers.length < wallrepairers_max) {
            Game.spawns[spawn_index].respawnCreep(spawn_index, 'wallrepairer', 'WR', [undefined, undefined],
            {n_move: 5, n_work: 5, n_carry: 5})
        }

        // Respawning miners
        if (miners.length < miners_max) {
            Game.spawns[spawn_index].respawnCreep(spawn_index, 'miner', 'MI', [false, undefined],
            {n_move: 3, n_work: 4, n_carry: 2})
        }
        
        // Respawning remote harvesters
        if (remoteharvesters.length < remoteharvesters_max) {
            // Select a random exit from exit_list
            let rand = Math.random();
            rand *= exit_list.length;
            rand = Math.floor(rand);
            // Spawn a remote harvester whose target is a random room nearby
            Game.spawns[spawn_index].respawnCreep(spawn_index, 'remoteharvester', 'RH', [false, exit_list[rand]],
            {n_move: 8, n_work: 4, n_carry: 4})
        }
        
        // Respawning claimers
        if (claimers.length < claimers_max) {
            Game.spawns[spawn_index].respawnCreep(spawn_index, 'claimer', 'CL', [false, 'W35S38'],
            {n_move: 2, n_claim: 2})
        }

        // Detect enemies in the room
        var hostiles = Game.spawns[spawn_index].room.find(FIND_HOSTILE_CREEPS)

        if (hostiles.length > 0) {
            // Attack the enemies using the towers
            let towers = Game.spawns[spawn_index].room.find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(hostiles[0]));
            console.log("ALERT - WE ARE BEING ATTACKED - TARGET:", hostiles[0])
        }
        
        if (hostiles.length > 1) {
            // Spawn a defensive creep if there are more enemies
            Game.spawns[spawn_index].respawnCreep(spawn_index, 'defender', 'DF', [undefined, undefined],
            {n_move: 4, n_tough: 4, n_attack: 4})
        }

    }

    // Clear the memory of non-existing creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep in memory:', name);
        }
    }
    
}