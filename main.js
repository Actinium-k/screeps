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

        // Describe all empty neighbouring rooms
        var empty_rooms = mod_exit.findEmptyRooms(spawn_index);

        // Create arrays containing every creep of each role
        let harvesters = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'harvester' && creep.memory.room == spawn.room.name);
        let upgraders = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'upgrader' && creep.memory.room == spawn.room.name);
        let builders = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'builder' && creep.memory.room == spawn.room.name);
        let repairers = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'repairer' && creep.memory.room == spawn.room.name);
        let wallrepairers = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'wallrepairer' && creep.memory.room == spawn.room.name);
        let miners = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'miner' && creep.memory.room == spawn.room.name);
        let remoteharvesters = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'remoteharvester' && creep.memory.room == spawn.room.name);
        let claimers = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'claimer' && creep.memory.room == spawn.room.name);
        let settlers = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'settler' && creep.memory.room == spawn.room.name);
        
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
        if (spawn.room.energyCapacity == 300 && upgraders.length < spawn.memory.upgraders_max) {
            spawn.respawnCreep(spawn_index, 'upgrader', 'up', [undefined],
            {n_move: 2, n_work: 1, n_carry: 1})
        }
        
        // Respawning harvesters
        if (harvesters.length < spawn.memory.harvesters_max) {
            let memory = spawn.memory.harvester
            if (spawn.respawnCreep(spawn_index, 'harvester', 'ha', [undefined],
            {n_move: memory[0], n_work: memory[1], n_carry: memory[2]}) == -6 && harvesters.length <= 1) {
                // If no harvesters can spawn and none are alive, spawn a default harvester
                spawn.respawnCreep(spawn_index, 'harvester', 'ha', [undefined],
                {n_move: 2, n_work: 1, n_carry: 1})
            }
        }
        
        // Respawning upgraders
        if (upgraders.length < spawn.memory.upgraders_max) {
            let memory = spawn.memory.upgrader
            spawn.respawnCreep(spawn_index, 'upgrader', 'up', [undefined],
            {n_move: memory[0], n_work: memory[1], n_carry: memory[2]})
        }

        // Respawning builders
        if (builders.length < spawn.memory.builders_max) {
            let memory = spawn.memory.builder
            spawn.respawnCreep(spawn_index, 'builder', 'bd', [undefined],
            {n_move: memory[0], n_work: memory[1], n_carry: memory[2]})
        }

        // Respawning repairers
        if (repairers.length < spawn.memory.repairers_max) {
            let memory = spawn.memory.repairer
            spawn.respawnCreep(spawn_index, 'repairer', 'rp', [undefined],
            {n_move: memory[0], n_work: memory[1], n_carry: memory[2]})
        }

        // Respawning wall repairers
        if (wallrepairers.length < spawn.memory.wallrepairers_max) {
            let memory = spawn.memory.wallrepairer
            spawn.respawnCreep(spawn_index, 'wallrepairer', 'wr', [undefined],
            {n_move: memory[0], n_work: memory[1], n_carry: memory[2]})
        }

        // Respawning miners
        if (miners.length < spawn.memory.miners_max) {
            let memory = spawn.memory.miner
            spawn.respawnCreep(spawn_index, 'miner', 'mi', [undefined],
            {n_move: memory[0], n_work: memory[1], n_carry: memory[2]})
        }

        // Respawning settlers
        if (settlers.length < spawn.memory.settlers_max) {
            let memory = spawn.memory.settler
            spawn.respawnCreep(spawn_index, 'settler', 'st', ['W38S38'],
            {n_move: memory[0], n_work: memory[1], n_carry: memory[2]})
        }
        
        // Respawning remote harvesters
        if (remoteharvesters.length < spawn.memory.remoteharvesters_max) {
            let memory = spawn.memory.remoteharvester
            // Select a random exit from empty_rooms
            let rand = Math.random();
            rand = Math.floor(rand * empty_rooms.length);
            // Spawn a remote harvester whose target is a random room nearby
            spawn.respawnCreep(spawn_index, 'remoteharvester', 'rh', ['W35S38']/*[empty_rooms[rand]]*/,
            {n_move: memory[0], n_work: memory[1], n_carry: memory[2]})
        }
        
        // Respawning claimers
        if (claimers.length < spawn.memory.claimers_max) {
            //let memory = spawn.memory.claimer
            spawn.respawnCreep(spawn_index, 'claimer', 'cl', ['W35S38'],
            {n_move: 2, n_claim: 2})
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