var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="entities.ts" />
/// <reference path="client.ts" />
var RoomClient = (function (_super) {
    __extends(RoomClient, _super);
    function RoomClient() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(RoomClient.prototype, "isHost", {
        get: function () {
            return this.room == undefined || this.room.hostId === this.me.id;
        },
        enumerable: true,
        configurable: true
    });
    RoomClient.prototype.connect = function (url, name) {
        _super.prototype.connect.call(this, url, name);
        var self = this;
        var $self = $(this);
        self.controller.on("playerjoinedroom", function (data) {
            self.room = data;
            $self.trigger("onPlayerJoinedRoom", data.playerJoined);
        });
        self.controller.on("playerleftroom", function (data) {
            self.room = data;
            $self.trigger("onPlayerLeftRoom", data.playerLeft);
        });
        self.controller.on("hostchanged", function (data) {
            self.room.hostId = data;
            $self.trigger("onHostChanged", data);
        });
    };
    RoomClient.prototype.joinRoom = function (gameName, roomName, maxPlayers, password) {
        var self = this;
        var $self = $(this);
        self.controller.invoke("joinorcreateroom", { gameName: gameName, roomName: roomName, maxPlayers: maxPlayers, password: password }).then(function (data) {
            self.room = data.room;
            if (data.success)
                $self.trigger("onJoinedRoom", data.room);
            else
                $self.trigger("onJoinRoomFailed", data.message);
        });
    };
    RoomClient.prototype.autoJoinRoom = function (gameName, roomName, maxPlayers) {
        var self = this;
        var $self = $(this);
        self.controller.invoke("autojoinroom", { gameName: gameName, roomName: roomName, maxPlayers: maxPlayers }).then(function (data) {
            self.room = data.room;
            if (data.success)
                $self.trigger("onJoinedRoom", data.room);
            else
                $self.trigger("onJoinRoomFailed", data.message);
        });
    };
    RoomClient.prototype.promoteHost = function (playerId) {
        var self = this;
        self.controller.invoke("promotehost", playerId);
    };
    RoomClient.prototype.leaveRoom = function () {
        var self = this;
        var $self = $(this);
        self.controller.invoke("leaveRoom").then(function () {
            $self.trigger("onLeftRoom");
        });
    };
    RoomClient.prototype.onJoinedRoom = function (action) {
        $(this).on("onJoinedRoom", function (e, data) {
            if (typeof (action) == "function")
                action(data);
        });
    };
    RoomClient.prototype.onJoinRoomFailed = function (action) {
        $(this).on("onJoinRoomFailed", function (e, data) {
            if (typeof (action) == "function")
                action(data);
        });
    };
    RoomClient.prototype.onPlayerJoinedRoom = function (action) {
        $(this).on("onPlayerJoinedRoom", function (e, data) {
            if (typeof (action) == "function")
                action(data);
        });
    };
    RoomClient.prototype.onPlayerLeftRoom = function (action) {
        $(this).on("onPlayerLeftRoom", function (e, data) {
            if (typeof (action) == "function")
                action(data);
        });
    };
    RoomClient.prototype.onHostChanged = function (action) {
        $(this).on("onHostChanged", function (e, data) {
            if (typeof (action) == "function")
                action(data);
        });
    };
    RoomClient.prototype.onLeftRoom = function (action) {
        $(this).on("onLeftRoom", function (e, data) {
            if (typeof (action) == "function")
                action(data);
        });
    };
    return RoomClient;
}(Client));
//# sourceMappingURL=room-client.js.map