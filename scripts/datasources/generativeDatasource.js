/* global define */

define(["module", "../d3", "../utils/objectUtils"], function(module, d3, objectUtils) {
    var config = module.config();
    
    var productName = "application";
    var nouns = ["sprocket", "matrix", "flux-capacitor", "warp-manifold"];
    var verbs = ["activated", "inverted", "stoked", "cranked", "primed", "fired"];
    
    // TODO: Put this in some utils somewhere
    var randomInt = function(min, max) {
        var range = max - min;
        return Math.floor(Math.random() * range) + min;
    };
    
    var pickRandomItem = function(array) {
        var index = randomInt(0, array.length);
        return array[index];
    };
    
    var generateRandomEvent = function(productName, nouns, verbs) {
        var separator = '.';
        var noun = pickRandomItem(nouns);
        var verb = pickRandomItem(verbs);
        return productName + separator + noun + separator + verb;
    };
    
    var generateRandomEvents = function(numberOfEvents, productName, nouns, verbs) {
        var eventNames = {},
            pad = 0,
            index,
            event,
            usePad;
        for (index = 0; index < numberOfEvents; index++) {
            event = generateRandomEvent(productName, nouns, verbs);
            usePad = eventNames.hasOwnProperty(event);
            if (usePad) {
                event = event + pad;
                pad += 1;
            }
            eventNames[event] = true;
        }
        return eventNames;
    };
    
    var generateRandomUser = function(eventNames) {
        var eventName,
            user = {},
            max = 100;
        for (eventName in eventNames) {
            if (eventNames.hasOwnProperty(eventName)) {
                user[eventName] = randomInt(0, max);
            }
        }
        return user;
    };
    
    var generateRandomUsers = function(numberOfEvents, productName, nouns, verbs, numberOfUsers) {
        var users = [],
            index,
            eventNames = generateRandomEvents(numberOfEvents, productName, nouns, verbs);
        for (index = 0; index < numberOfUsers; index++) {
            users[index] = generateRandomUser(eventNames);
        }
        return users;
    };
    
    var getData = function(callback) {
        var users = generateRandomUsers(config.numberOfEvents, productName, nouns, verbs, config.numberOfUsers);
        callback(null, users);
    };
    
    return {
        getData : getData
    };
});