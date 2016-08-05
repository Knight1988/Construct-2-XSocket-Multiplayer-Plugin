/// <reference path="entities.ts" />
declare var xsockets: any;

// ReSharper disable InconsistentNaming
class XSocketWrapper {

    private _controller: any;
    serverVersion: string;
    apiVersion: string = xsockets.version;
    me: Player;
    room: Room;
    connectionUrl: string;
    get isScriptLoaded() {
        return xsockets != undefined;
    }

    connect(url: string, name: string) {
        var self = this;
        var conn = new xsockets.client(self.connectionUrl = url);
        conn.setParameters({ name: name });
        self._controller = conn.controller("game");
        self._controller.on("playerjoinedroom",
            data => {
                self.room.players.push(data);
                self.onPlayerJoinedRoom(data);
            });
        self._controller.on("playerleaveroom",
            data => {
                var i = self.room.players.indexOf(data);
                self.room.players.splice(i, 1);
                self.onPlayerLeaveRoom(data);
            });
        self._controller.on("playermessage",
            data => {
                self.onPlayerMessage(data);
            });
        self._controller.on("playerposition",
            data => {
                self.onPlayerPosition(data);
            });
        self._controller.on("playerangle",
            data => {
                self.onPlayerAngle(data);
            });
        self._controller.on("playerpositionandangle",
            data => {
                self.onPlayerPositionAndAngle(data);
            });
        self._controller.on("connected",
            data => {
                self.me = data.me;
                self.serverVersion = data.serverVersion;
                self.onConnected(data);
            });
        self._controller.onOpen = () => {
            window.onbeforeunload = () => {
                conn.close();
            };
        };
        conn.open();
    }

    joinRoom(gameName: string, roomName: string, maxPlayers: number, password: string = "") {
        var self = this;
        this._controller.invoke("joinorcreateroom",
            { gameName: gameName, roomName: roomName, maxPlayers: maxPlayers, password: password })
            .then(data => {
                self.room = data.room;
                self.onRoomJoined();
            });
    }

    autoJoinRoom(gameName: string, roomName: string, maxPlayers: number) {
        var self = this;
        this._controller.invoke("autojoinroom", { gameName: gameName, roomName: roomName, maxPlayers: maxPlayers })
            .then((data) => {
                self.room = data.room;
                self.onRoomJoined();
            });
    }

    leaveRoom() {
        var self = this;
        this._controller.invoke("leaveroom").then(() => {
            self.room = undefined;
            self.onRoomLeft();
        });
    }

    broadcastMessage(tag: string, value: any) {
        this._controller.invoke("broadcastmessage", { tag: tag, value: value });
    }

    sendMessage(playerId: number, tag: string, value: any) {
        this._controller.invoke("sendmessage", { playerId: playerId, tag: tag, value: value });
    }

    broadcastPosition(tag: string, x: number, y: number) {
        this._controller.invoke("broadcastposition", { tag: tag, x: x, y: y });
    }

    broadcastAngle(tag: string, angle: number) {
        this._controller.invoke("broadcastangle", { tag: tag, angle: angle });
    }

    broadcastPositionAndAngle(tag: string, x: number, y: number, angle: number) {
        this._controller.invoke("broadcastpositionandangle", { tag: tag, x: x, y: y, angle: angle });
    }

    onConnected(player: Player) { }

    onRoomJoined() { }

    onRoomLeft() { }

    onPlayerJoinedRoom(player: Player) { }

    onPlayerLeaveRoom(player: Player) { }

    onPlayerMessage(message: Message) { }

    onPlayerPosition(position: Pos) { }

    onPlayerAngle(angle: Angle) { }

    onPlayerPositionAndAngle(positionAndAngle: PositionAndAngle) { }
}
// ReSharper restore InconsistentNaming