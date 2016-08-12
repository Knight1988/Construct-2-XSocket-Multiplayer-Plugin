class SyncObjectBase {
    playerId: number;
    tag: string;
}

class Pos extends SyncObjectBase {
    x: number;
    y: number;
}

class Angle extends SyncObjectBase {
    angle: number;
}

class PositionAndAngle extends SyncObjectBase {
    x: number;
    y: number;
    angle: number;
}

class ObjectInfo {
    syncId: number;
    name: string;
    x: number;
    y: number;
    visible: boolean;
    layer: string;
    tick: number;
}

class Room {
    name: string;
    gameName: string;
    maxPlayer: number;
    hostId: number;
    players: Array<Player>;
    playerJoined: Player;
    playerLeft: Player;
}

class Player {
    id: number;
    name: string;
}

class Message {
    tag: string;
    value: any;
}