var dir = Java.type("noppes.npcs.api.NpcAPI").Instance().getWorldDir().toPath().getParent().resolve("custom_events");
var JFILE = Java.type("java.io.File")
var JNIOFile = Java.type("java.nio.file.Files");
var DESKTOP = Java.type('java.awt.Desktop');
var NPCException = Java.type("noppes.npcs.api.CustomNPCsException")

var MCPlayer = Java.type("net.minecraft.entity.player.EntityPlayer")
var MCNPC = Java.type("noppes.npcs.entity.EntityNPCInterface")
var PLAYER_DATA = Java.type("noppes.npcs.controllers.data.PlayerData")
var Param = INSTANCE("MYEVENT",
    {
        a: 545411,
        b: "STRING",
        c: 5654,
        d: 4544,
        e: 2228
    })


function EVENT_LIST() {
    var EVENTS = JSONObjectGet();
    for (var key in EVENTS) {
        print("\n===CUSTOM EVENT LIST===\n")
        print("EVENT: " + key)
        print("DESCRIPTION: " + EVENTS[key]["description"])
        print("CONSTRUCTOR: " + OBJToJSON(EVENTS[key]["args"]))
    }
}

function TUTORIAL() {
    try {
        var file = new JFILE(dir.resolve("tutor.html"));
        DESKTOP.getDesktop().browse(file.toURI());
    }
    catch (err) {
        throw new NPCException("\n\nYou lose tutoryal file\n\n")
    }

}

function DEF(name) {
    var EVENTS = JSONObjectGet();
    if (!(name in EVENTS)) {
        throw new NPCException("\n\n" + name + " - event is not exist\n\n")
    }
    return EVENTS[name]
}

function INSTANCE(name, args) {
    var EVENTS = JSONObjectGet();
    if (!(name in EVENTS)) {
        throw new NPCException("\n\n" + name + " - event is not exist\n\n")
    }
    EVENTS[name]["args"] = ReplaceNewData(EVENTS[name]["args"], args)
    return EVENTS[name]
}

function ReplaceNewData(def, val) {
    var returnedDef = def;
    if (Object.keys(returnedDef).length != Object.keys(val).length) {
        throw new NPCException("\n\n" + OBJToJSON(val) + " - is not correct! You args most be as" + OBJToJSON(def) + "\n\n")
    }
    for (var i = 0; i < Object.keys(returnedDef).length; i++) {
        returnedDef[Object.keys(returnedDef)[i]] = val[Object.keys(val)[i]]
    }
    return returnedDef;
}
function JSONObjectGet() {
    var file, reader, line, text = '', obj = null;
    file = dir.resolve("custom_events.json");
    if (JNIOFile.exists(file)) {
        reader = JNIOFile.newBufferedReader(file);
        while ((line = reader.readLine()) != null) { text += line }
        reader.close();
        try {
            obj = JSON.parse(text)
        } catch (err) {
            throw new NPCException("\n\nYour events file is empty\n\n")
        }
    }
    return obj;
}
function OBJToJSON(object) {
    return JSON.stringify(object, null, 2);
}



function sendToAllEntity(event) {
    var npcs = Java.type("noppes.npcs.api.NpcAPI").Instance().getIWorld(1).getAllEntities(2)
    sendToEntities(npcs, event)
}

function sendToAllPlayers(event) {
    var players = Java.type("noppes.npcs.api.NpcAPI").Instance().getIWorld(1).getAllPlayers()
    sendToEntities(players, event)
}

function sendToEntities(entities, event) {
    for (var index = 0; index < entities.length; index++) {
        privateSend(entities[index].getMCEntity(), event)
    }
}

function privateSend(MCEntity, event) {
    if (MCEntity instanceof MCEntity) {
        var data = PLAYER_DATA.get(MCEntity).scriptData
        privateSendFor(data, event)
    } else if (MCEntity instanceof MCNPC) {
        var data = MCEntity.script
        privateSendFor(data, event)
    }
}

function privateSendFor(data, event) {
    var scripts = data.getScripts()
    for (var i = 0; i < scripts.length; i++) {
        scripts[i].run(event["name"], event["args"])
    }
}
