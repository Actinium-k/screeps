// Importing modules
require('prototype.spawn')();
let mod_exit = require('module.exit');
let mod_spawn = require('module.spawn');
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
let roleSettler = require('role.settler')
let roleAttacker = require('role.attacker')

// Create arrays containing all roles
const roles = [roleHarvester, roleUpgrader, roleBuilder, roleRepairer, roleWallRepairer, roleClaimer, 
    roleMiner, roleRemoteHarvester, roleTransporter, roleDefender, roleSettler, roleAttacker];
const roles_str = ['harvester', 'upgrader', 'builder', 'repairer', 'wallrepairer', 'claimer', 
    'miner', 'remoteharvester', 'transporter', 'defender', 'settler', 'attacker'];

module.exports.loop = function () {

    // Apply the main sequence to every spawn
    for (const spawn_index in Game.spawns) {
        
        var spawn = Game.spawns[spawn_index]

        // Define the max number of creeps and their parts
        mod_spawn.defineMaxCreeps(spawn_index)
        mod_spawn.getCreepsParts(spawn_index)

        // Define the maximum numbers of creeps for each role
        const harvesters_max = 3;
        const upgraders_max = 3;
        const builders_max = 2;
        const repairers_max = 1;
        const wallrepairers_max = 2;
        const miners_max = 0;
        const remoteharvesters_max = 5;
        const claimers_max = 1;
        const settlers_max = 2;
        
        // Describe all empty neighbouring rooms
        var empty_rooms = mod_exit.findEmptyRooms(spawn_index);

        // Create arrays containing every creep of each role
        let harvesters = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'harvester'/* && creep.memory.spawn == spawn.name*/);
        let upgraders = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'upgrader');
        let builders = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'builder');
        let repairers = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'repairer');
        let wallrepairers = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'wallrepairer');
        let miners = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'miner');
        let remoteharvesters = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'remoteharvester');
        let claimers = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'claimer');
        let settlers = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'settler');
        
        // Run each role
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            for (let i = 0; i < roles.length; i++) {
                if (creep.memory.role == roles_str[i]) {
                    roles[i].run(creep)
                }
            }
        }

        // If the room does not have any extension, spawn a default creep
        if (spawn.room.energyCapacityAvailable == 300 && upgraders.length < upgraders_max) {
            spawn.respawnCreep(spawn_index, 'upgrader', 'up', [undefined],
            {n_move: 2, n_work: 1, n_carry: 1})
        }
        
        // Respawning harvesters
        if (harvesters.length < harvesters_max) {
            spawn.respawnCreep(spawn_index, 'harvester', 'ha', [undefined],
            {n_move: 4, n_work: 4, n_carry: 4})
        }

        // Respawning upgraders
        if (upgraders.length < upgraders_max) {
            spawn.respawnCreep(spawn_index, 'upgrader', 'up', [undefined],
            {n_move: 6, n_work: 6, n_carry: 6})
        }

        // Respawning builders
        if (builders.length < builders_max) {
            spawn.respawnCreep(spawn_index, 'builder', 'bd', [undefined],
            {n_move: 6, n_work: 6, n_carry: 6})
        }

        // Respawning repairers
        if (repairers.length < repairers_max) {
            spawn.respawnCreep(spawn_index, 'repairer', 'rp', [undefined],
            {n_move: 4, n_work: 4, n_carry: 4})
        }

        // Respawning wall repairers
        if (wallrepairers.length < wallrepairers_max) {
            spawn.respawnCreep(spawn_index, 'wallrepairer', 'wr', [undefined],
            {n_move: 4, n_work: 4, n_carry: 4})
        }

        // Respawning miners
        if (miners.length < miners_max) {
            spawn.respawnCreep(spawn_index, 'miner', 'mi', [undefined],
            {n_move: 3, n_work: 4, n_carry: 2})
        }

        // Respawning settlers
        if (settlers.length < settlers_max) {
            spawn.respawnCreep(spawn_index, 'settler', 'st', ['W38S38'],
            {n_move: 6, n_work: 3, n_carry: 3})
        }
        
        // Respawning remote harvesters
        if (remoteharvesters.length < remoteharvesters_max) {
            // Select a random exit from empty_rooms
            let rand = Math.random();
            rand = Math.floor(rand * empty_rooms.length);
            // Spawn a remote harvester whose target is a random room nearby
            spawn.respawnCreep(spawn_index, 'remoteharvester', 'rh', ['W35S38']/*[empty_rooms[rand]]*/,
            {n_move: 8, n_work: 4, n_carry: 4})
        }
        
        // Respawning claimers
        if (claimers.length < claimers_max) {
            spawn.respawnCreep(spawn_index, 'claimer', 'cl', ['W35S38'],
            {n_move: 1, n_claim: 1})
        }
        
        // Detect enemies in the room
        var hostiles = spawn.room.find(FIND_HOSTILE_CREEPS)

        if (hostiles.length > 0) {
            // Attack the enemies using the towers
            let towers = spawn.room.find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(hostiles[0]));
            console.log("ALERT - WE ARE BEING ATTACKED - TARGET:", hostiles[0])

            // Spawn a defensive creep if there is more than 1 enemy
            if (hostiles.length > 1) {
                spawn.respawnCreep(spawn_index, 'defender', 'df', [undefined],
                {n_move: 4, n_tough: 4, n_attack: 4})
            }
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