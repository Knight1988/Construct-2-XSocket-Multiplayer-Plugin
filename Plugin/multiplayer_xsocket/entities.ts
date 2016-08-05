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

class Room {
    name: string;
    gameName: string;
    maxPlayer: number;
    hostId: number;
    players: Array<number>;
}

class Player {
    id: number;
    name: string;
    isHost: boolean;
}

class Message {
    tag: string;
    value: any;
}