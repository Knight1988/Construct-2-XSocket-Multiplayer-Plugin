/// <reference path="entities.ts" />
// ReSharper disable InconsistentNaming
var XSocketWrapper = (function () {
    function XSocketWrapper() {
    }
    Object.defineProperty(XSocketWrapper.prototype, "isScriptLoaded", {
        get: function () {
            return xsockets != undefined;
        },
        enumerable: true,
        configurable: true
    });
    XSocketWrapper.prototype.loadJavaScript = function (url) {
        var self = this;
        ((function (d, s, id) {
            var fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id))
                return;
            var js = d.createElement(s);
            js.id = id;
            fjs.parentNode.insertBefore(js, fjs);
            js.onload = self.onScriptLoaded;
            js.src = url;
        })(document, "script", "xsockets-sdk"));
    };
    XSocketWrapper.prototype.connect = function (url, name) {
        var self = this;
        var conn = new xsockets.client(url);
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
            self.me = data;
            self.onConnected(data);
        });
        self._controller.onOpen = function () {
            window.onbeforeunload = function () {
                conn.close();
            };
        };
        conn.open();
    };
    XSocketWrapper.prototype.createRoom = function (gameName, roomName, maxPlayer, password) {
        var self = this;
        this._controller.invoke("createandjoinroom", { gameName: gameName, roomName: roomName, maxPlayer: maxPlayer, password: password })
            .then(function (data) {
            self.room = data.room;
            self.onRoomJoined();
        });
    };
    XSocketWrapper.prototype.joinRoom = function (roomId, password) {
        var self = this;
        this._controller.invoke("joinroom", { roomId: roomId, password: password })
            .then(function (data) {
            self.room = data.room;
            self.onRoomJoined();
        });
    };
    XSocketWrapper.prototype.autoJoinRoom = function (gameName, roomName, maxPlayer) {
        var self = this;
        this._controller.invoke("autojoinroom", { gameName: gameName, roomName: roomName, maxPlayer: maxPlayer })
            .then(function (data) {
            self.room = data.room;
            self.onRoomJoined();
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
    XSocketWrapper.prototype.onScriptLoaded = function () { };
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