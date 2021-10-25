/**
 * Author: Evanechecssss
 * Link: https://bio.link/evanechecssss
 * Date: 07.10.2021
 */

/* CODE */
function init() {

}
/**
 * String constants
 */
var strEventList = "\n===CUSTOM EVENT LIST===\n"
var strEventEvent = "EVENT: "
var strEventDescription = "DESCRIPTION: "
var strEventConstructor = "DESCRIPTION: "
var fileTutorialName = "tutor.html"
var fileEventsName = "custom_events.json"
var eventDescription = "description"
var eventArgs = "args"
var eventName = "name"
var exceptionTutorial = "\n\nYou lose tutoryal file\n\n"
var exceptionExist = "\n\n %s - event is not exist\n\n"
var exceptionCorrect = "\n\n %s- is not correct! You args most be as %s \n\n"
var exceptionCorrect = "\n\nYou has uncorrect type of entity= %S \n\n"
var exceptionEmpty = "\n\nYour events file is empty\n\n"
var exceptionTileEntity = "\n\nBlock hasn't tile entity= %s \n\n"
/**
 * Helper classes
 */
var DIR = Java.type("noppes.npcs.api.NpcAPI").Instance().getWorldDir().toPath().getParent().resolve("custom_events") // DIR is place, where you should keep you custom events
var JFILE = Java.type("java.io.File") //For work with files
var JNIOFile = Java.type("java.nio.file.Files") //For work with files
var DESKTOP = Java.type('java.awt.Desktop') //For work with browsers
var NPCException = Java.type("noppes.npcs.api.CustomNPCsException") //For call exceptions
var MCPlayer = Java.type("net.minecraft.entity.player.EntityPlayer") //Is main Player calss
var MCNPC = Java.type("noppes.npcs.entity.EntityNPCInterface") //Is main npc class
var PLAYER_DATA = Java.type("noppes.npcs.controllers.data.PlayerData") //Is class of player data
var TILE_SCRIPTED = Java.type("noppes.npcs.blocks.tiles.TileScripted") //Is main tile block class
var BLOCK_WRAPPER = Java.type("noppes.npcs.api.wrapper.BlockWrapper") //Is main block class
var JSTRING = Java.type("java.lang.String") //Is class for string formating
/**
 * Methods for public usage
 */

/**
 * If you will run it, event list will show in console!
 * If you add some custom events in custom event file, they will be show in console
 */
function EVENT_LIST() {
    var EVENTS = jsonObjectGet()
    for (var key in EVENTS) {
        print(strEventList)
        print(strEventEvent + key)
        print(strEventDescription + EVENTS[key][eventDescription])
        print(strEventConstructor + objToJSON(EVENTS[key][eventArgs]))
    }
}
/**
 * If you will run it, tutorial site will be opened in your browser
 */
function TUTORIAL() {
    try {
        var file = new JFILE(DIR.resolve(fileTutorialName))
        DESKTOP.getDesktop().browse(file.toURI())
    }
    catch (err) {
        throw new NPCException(exceptionTutorial)
    }

}
/**
 * 
 * @param name of event, you can to know it, if you call EVENT_LIST()
 * @return default instance of this event
 */
function DEF(name) {
    var EVENTS = jsonObjectGet()
    if (!(name in EVENTS)) {
        throw new NPCException()
    }
    return EVENTS[name]
}
/**
 * YOU SHOULD USE IT, BECOUSE YOU CAN GET SAFE EVENT INSTANCE
 * You can call TUTORIAL(), if you whant to know how use it
 * @param name of event, you can to know it, if you call EVENT_LIST()
 * @param args of event, they replace default values, names in object dosnt matter, only leght
 * @return instance with you values
 */
function INSTANCE(name, args) {
    var EVENTS = jsonObjectGet()
    if (!(name in EVENTS)) {
        throw new NPCException(JSTRING.format(exceptionExist, name))
    }
    EVENTS[name][eventArgs] = replaceNewData(EVENTS[name][eventArgs], args)
    return EVENTS[name]
}
/**
 * 
 * @param event , you can get it with INSTANCE(name, args)
 */
function SEND_TO_ALL_NPCS(event) {
    sendToAllEntity(event)
}
/**
 * 
 * @param event , you can get it with INSTANCE(name, args)
 */
function SEND_TO_ALL_PLAYERS(event) {
    sendToAllPlayers(event)
}
/**
 * 
 * @param event , you can get it with INSTANCE(name, args)
 * @param players , array of players
 */
function SEND_TO_PLAYERS(event, players) {
    sendToEntities(players, event)
}
/**
 * 
 * @param event , you can get it with INSTANCE(name, args)
 * @param npcs , array of npcs
 */
function SEND_TO_NPCS(event, npcs) {
    sendToEntities(npcs, event)

}
/**
 * 
 * @param event , you can get it with INSTANCE(name, args)
 * @param blocks , array of blocks
 */
function SEND_TO_BLOCKS(event, blocks) {
    sendToBlocks(event, blocks)
}

/**
 * Methods for only extened users
 */

function replaceNewData(def, val) {
    var returnedDef = def
    if (Object.keys(returnedDef).length != Object.keys(val).length) {
        throw new NPCException(JSTRING.format(exceptionCorrect, objToJSON(val), objToJSON(def)))
    }
    for (var i = 0; i < Object.keys(returnedDef).length; i++) {
        returnedDef[Object.keys(returnedDef)[i]] = val[Object.keys(val)[i]]
    }
    return returnedDef
}
function jsonObjectGet() {
    var file
    var reader
    var line
    var text = ""
    var obj = null
    file = DIR.resolve(fileEventsName)
    if (JNIOFile.exists(file)) {
        reader = JNIOFile.newBufferedReader(file)
        while ((line = reader.readLine()) != null) {
            text += line
        }
        reader.close()
        try {
            obj = JSON.parse(text)
        } catch (err) {
            throw new NPCException(exceptionEmpty)
        }
    }
    return obj
}

function objToJSON(object) {
    return JSON.stringify(object, null, 4)
}

function sendToAllEntity(event) {
    var npcs = Java.type("noppes.npcs.api.NpcAPI").Instance().getIWorld(1).getAllEntities(2)
    sendToEntities(npcs, event)
}

function sendToAllPlayers(event) {
    var players = Java.type("noppes.npcs.api.NpcAPI").Instance().getIWorld(1).getAllPlayers()
    sendToEntities(players, event)
}

function sendToBlocks(event, blocks) {
    sendToEntities(blocks, event)
}

function sendToEntities(entities, event) {
    for (var index = 0; index < entities.length; index++) {
        privateSend(entities[index].getMCEntity(), event)
    }
}

function getScriptsFromNPC(npc) {
    return npc.script
}
function getScriptsFromPlayer(player) {
    return PLAYER_DATA.get(player).scriptData
}
function getScriptsFromBlock(block) {
    var mcTile = block.getMCTileEntity()
    if (mcTile instanceof TILE_SCRIPTED) {
        return mcTile;
    } else {
        throw new NPCException(JSTRING.format(exceptionTileEntity, mcTile.toString()))
    }
}
function privateSend(mcEntity, event) {
    var data;
    if (mcEntity instanceof MCPlayer) {
        data = getScriptsFromPlayer(mcEntity)
    } else if (mcEntity instanceof MCNPC) {
        data = getScriptsFromNPC(mcEntity)
    } else if (mcEntity instanceof BLOCK_WRAPPER) {
        data = getScriptsFromBlock(mcEntity)
    } else {
        throw new NPCException(JSTRING.format(exceptionCorrect, mcEntity.toString()))
    }
    privateCallMethodsFromScripts(scripts.getScripts(), event)
}

function privateCallMethodsFromScripts(scripts, event) {
    for (var i = 0; i < scripts.length; i++) {
        scripts[i].run(event[eventName], event[eventArgs])
    }
}
