var dir = Java.type("noppes.npcs.api.NpcAPI").Instance().getWorldDir().toPath().getParent().resolve("custom_events");
var JFILE = Java.type("java.io.File")
var JNIOFile = Java.type("java.nio.file.Files");
var DESKTOP = Java.type('java.awt.Desktop');
var NPCException = Java.type("noppes.npcs.api.CustomNPCsException")

var Param = INSTANCE("MYEVENT",
    {
        a: 545411,
        b: "БашкараШка",
        c: 5654,
        d: 4544,
        e: 2228
    })

print(OBJToJSON(Param))
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
function EVENT_LIST() {
    var EVENTS = JSONObjectGet();
    for (var key in EVENTS) {
        print("\n===CUSTOM EVENT LIST===\n")
        print("EVENT: " + key)
        print("DESCRIPTION: " + EVENTS[key]["description"])
        print("CONSTRUCTOR: " + OBJToJSON(EVENTS[key]["args"]))
    }
}
function OBJToJSON(object) {
    return JSON.stringify(object, null, 2);
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