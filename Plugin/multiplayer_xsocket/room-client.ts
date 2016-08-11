/// <reference path="entities.ts" />
/// <reference path="client.ts" />
class RoomClient extends Client {
    room: Room;
    get isHost() {
        return this.room == undefined || this.room.hostId === this.me.id;
    }

    connect(url: string, name: string, controllerName: string = "room") {
        super.connect(url, name, controllerName);
        const self = this;
        const $self = $(this);
        self.controller.on("playerjoinedroom", (data) => {
            self.room = data;
            $self.trigger("onPlayerJoinedRoom", data.playerJoined);
        });
        self.controller.on("playerleftroom", (data) => {
            self.room = data;
            $self.trigger("onPlayerLeftRoom", data.playerLeft);
        });
        self.controller.on("hostchanged", (data) => {
            self.room.hostId = data;
            $self.trigger("onHostChanged", data);
        });
    }

    joinRoom(gameName: string, roomName: string, maxPlayers: number, password: string) {
        const self = this;
        const $self = $(this);
        self.controller.invoke("joinorcreateroom", { gameName, roomName, maxPlayers, password }).then((data) => {
            self.room = data.room;
            if (data.success) $self.trigger("onJoinedRoom", data.room);
            else $self.trigger("onJoinRoomFailed", data.message);
        });
    }

    autoJoinRoom(gameName: string, roomName: string, maxPlayers: number) {
        const self = this;
        const $self = $(this);
        self.controller.invoke("autojoinroom", { gameName, roomName, maxPlayers }).then((data) => {
            self.room = data.room;
            if (data.success) $self.trigger("onJoinedRoom", data.room);
            else $self.trigger("onJoinRoomFailed", data.message);
        });
    }

    promoteHost(playerId: number) {
        const self = this;
        self.controller.invoke("promotehost", playerId);
    }

    leaveRoom() {
        const self = this;
        const $self = $(this);
        self.controller.invoke("leaveRoom").then(() => {
            $self.trigger("onLeftRoom");
        });
    }

    onJoinedRoom(action: Function) {
        $(this).on("onJoinedRoom", (e, data) => {
            if (typeof (action) == "function") action(data);
        });
    }

    onJoinRoomFailed(action: Function) {
        $(this).on("onJoinRoomFailed", (e, data) => {
            if (typeof (action) == "function") action(data);
        });
    }

    onPlayerJoinedRoom(action: Function) {
        $(this).on("onPlayerJoinedRoom", (e, data) => {
            if (typeof (action) == "function") action(data);
        });
    }

    onPlayerLeftRoom(action: Function) {
        $(this).on("onPlayerLeftRoom", (e, data) => {
            if (typeof (action) == "function") action(data);
        });
    }

    onHostChanged(action: Function) {
        $(this).on("onHostChanged", (e, data) => {
            if (typeof (action) == "function") action(data);
        });
    }

    onLeftRoom(action: Function) {
        $(this).on("onLeftRoom", (e, data) => {
            if (typeof (action) == "function") action(data);
        });
    }
}