/// <reference path="entities.ts" />
// ReSharper disable InconsistentNaming
var XSocketWrapper = (function () {
    function XSocketWrapper() {
        this.apiVersion = xsockets.version;
    }
    Object.defineProperty(XSocketWrapper.prototype, "isScriptLoaded", {
        get: function () {
            return xsockets != undefined;
        },
        enumerable: true,
        configurable: true
    });
    XSocketWrapper.prototype.connect = function (url, name) {
        var self = this;
        var conn = new xsockets.client(self.connectionUrl = url);
        conn.setParameters({ name: name });
        self._controller = conn.controller("game");
        self._controller.on("playerjoinedroom", function (data) {
            self.room.players.push(data);
            self.onPlayerJoinedRoom(data);
        });
        self._controller.on("playerleaveroom", function (data) {
            var i = self.room.players.indexOf(data);
            self.room.players.splice(i, 1);
            self.onPlayerLeaveRoom(data);
        });
        self._controller.on("playermessage", function (data) {
            self.onPlayerMessage(data);
        });
        self._controller.on("playerposition", function (data) {
            self.onPlayerPosition(data);
        });
        self._controller.on("playerangle", function (data) {
            self.onPlayerAngle(data);
        });
        self._controller.on("playerpositionandangle", function (data) {
            self.onPlayerPositionAndAngle(data);
        });
        self._controller.on("connected", function (data) {
            self.me = data.me;
            self.serverVersion = data.serverVersion;
            self.onConnected(data);
        });
        self._controller.onOpen = function () {
            window.onbeforeunload = function () {
                conn.close();
            };
        };
        conn.open();
    };
    XSocketWrapper.prototype.joinRoom = function (gameName, roomName, maxPlayers, password) {
        if (password === void 0) { password = ""; }
        var self = this;
        this._controller.invoke("joinorcreateroom", { gameName: gameName, roomName: roomName, maxPlayers: maxPlayers, password: password })
            .then(function (data) {
            self.room = data.room;
            self.onRoomJoined();
        });
    };
    XSocketWrapper.prototype.autoJoinRoom = function (gameName, roomName, maxPlayers) {
        var self = this;
        this._controller.invoke("autojoinroom", { gameName: gameName, roomName: roomName, maxPlayers: maxPlayers })
            .then(function (data) {
            self.room = data.room;
            self.onRoomJoined();
        });
    };
    XSocketWrapper.prototype.leaveRoom = function () {
        var self = this;
        this._controller.invoke("leaveroom").then(function () {
            self.room = undefined;
            self.onRoomLeft();
        });
    };
    XSocketWrapper.prototype.broadcastMessage = function (tag, value) {
        this._controller.invoke("broadcastmessage", { tag: tag, value: value });
    };
    XSocketWrapper.prototype.sendMessage = function (playerId, tag, value) {
        this._controller.invoke("sendmessage", { playerId: playerId, tag: tag, value: value });
    };
    XSocketWrapper.prototype.broadcastPosition = function (tag, x, y) {
        this._controller.invoke("broadcastposition", { tag: tag, x: x, y: y });
    };
    XSocketWrapper.prototype.broadcastAngle = function (tag, angle) {
        this._controller.invoke("broadcastangle", { tag: tag, angle: angle });
    };
    XSocketWrapper.prototype.broadcastPositionAndAngle = function (tag, x, y, angle) {
        this._controller.invoke("broadcastpositionandangle", { tag: tag, x: x, y: y, angle: angle });
    };
    XSocketWrapper.prototype.onConnected = function (player) { };
    XSocketWrapper.prototype.onRoomJoined = function () { };
    XSocketWrapper.prototype.onRoomLeft = function () { };
    XSocketWrapper.prototype.onPlayerJoinedRoom = function (player) { };
    XSocketWrapper.prototype.onPlayerLeaveRoom = function (player) { };
    XSocketWrapper.prototype.onPlayerMessage = function (message) { };
    XSocketWrapper.prototype.onPlayerPosition = function (position) { };
    XSocketWrapper.prototype.onPlayerAngle = function (angle) { };
    XSocketWrapper.prototype.onPlayerPositionAndAngle = function (positionAndAngle) { };
    return XSocketWrapper;
}());
// ReSharper restore InconsistentNaming 
//# sourceMappingURL=xsocket-wrapper.js.map