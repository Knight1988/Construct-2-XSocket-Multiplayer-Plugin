// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.lingcor_multiplayer = function (runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
    var pluginProto = cr.plugins_.lingcor_multiplayer.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
	    // this.myValue = 0;
		var self = this;
		this.wayPoints = {};
	    this.instList = {};
	    this.histories = {};
	    this.cnds = cr.plugins_.lingcor_multiplayer.prototype.cnds;
        this.trigger = function(cnd) {
            self.runtime.trigger(cnd, self);
        }
		var client = self.client = new LingCorClient();

		client.onConnected(function (player) {
		    self.trigger(self.cnds.OnConnected);
		});

		client.onJoinedRoom(function () {
		    self.trigger(self.cnds.OnJoinedRoom);
	    });

	    client.onLeftRoom(function() {
	        self.trigger(self.cnds.OnLeftRoom);
	    });

	    client.onPlayerJoinedRoom(function() {
	        self.trigger(self.cnds.OnPlayerJoinedRoom);
	    });

	    client.onPlayerLeftRoom(function() {
	        self.trigger(self.cnds.OnPlayerLeftRoom);
	    });

	    client.onHostChanged(function () {
	        self.trigger(self.cnds.OnHostChanged);
	    });

	    client.onUpdateObjectInfo(function (objs) {
            self.updateObjectInfo(objs);
        });

	    client.onUpdateObjectVariable(function (objs) {
            self.updateObjectVariable(objs);
        });

        client.onDestroyObjects(function (objs) {
            self.destroyObjects(objs);
        });

        client.onPlayerMessage(function() {
            self.trigger(self.cnds.OnPlayerMessage);
        });

        //this.runtime.addDestroyCallback(function(inst) {
        //    self.onObjectDestroyed.call(self, inst);
        //});
	    this.runtime.tickMe(this);
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
	    // this.myValue = 0;
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
    /**END-PREVIEWONLY**/

    //////////////////////////////////////
    // Functions
	instanceProto.updateObjectInfo = function (objs) {
	    for (var i = 0; i < objs.length; i++) {
	        var obj = objs[i];
            // get type
	        var type = this.runtime.types[obj.name];
            // get layer
	        var layer = this.runtime.getLayerByName(obj.layer);
            // find associate instance
	        var inst = this.findAssociateInstance(obj);

            // create object if not found
	        if (inst == undefined) {
	            inst = this.runtime.createInstance(type, layer, obj.x, obj.y);
	            // Fire 'On created'
	            this.runtime.trigger(Object.getPrototypeOf(type.plugin).cnds.OnCreated, inst);
	            this.runtime.trigger(cr.plugins_.lingcor_multiplayer.prototype.cnds.OnObjectCreated, inst);
	            inst.syncId = obj.syncId;
	        } else {
	            Object.getPrototypeOf(type.plugin).acts.MoveToLayer.call(inst, layer);
	            //Object.getPrototypeOf(type.plugin).acts.SetPos.call(inst, obj.x, obj.y);
	            this.addWayPointTimeTravel(inst, obj.x, obj.y, 30);
	        }
	        Object.getPrototypeOf(type.plugin).acts.SetVisible.call(inst, obj.visible);
	        if (obj.animation !== undefined) Object.getPrototypeOf(type.plugin).acts.SetAnim.call(inst, obj.animation, "beginning");
	    }
	}

	instanceProto.updateObjectVariable = function (objs) {
	    for (var i = 0; i < objs.length; i++) {
	        var obj = objs[i];
            // find associate instance
	        var inst = this.findAssociateInstance(obj);

	        if (inst === undefined) continue;

            inst.instance_vars[obj.index] = obj.value
	    }
	}

	instanceProto.destroyObjects = function (objs) {
	    for (var i = 0; i < objs.length; i++) {
	        var obj = objs[i];
	        // find associate instance
	        var inst = this.findAssociateInstance(obj);

            if (inst == undefined) continue;

	        this.runtime.DestroyInstance(inst);
	        this.runtime.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnDestroyed, inst);
	    }
	}

	instanceProto.findAssociateInstance = function (obj) {
        var instances = this.runtime.types[obj.name].instances;
        for (var i = 0; i < instances.length; i++) {
            var inst = instances[i];
            if (inst.syncId == obj.syncId) return inst;
        }
    }

	instanceProto.findLayer = function(layerName) {
	    for (var i = 0; i < this.runtime.running_layout.layers.length; i++) {
	        var layer = this.runtime.running_layout.layers[i];
	        if (layer.name == layerName) return layer;
	    }
	}

	instanceProto.addWayPointTimeTravel = function(inst, x, y, timeTravel) {
	    if (this.wayPoints[inst.syncId] == undefined) this.wayPoints[inst.syncId] = [];

	    this.wayPoints[inst.syncId].push({
            inst,
	        x,
	        y,
            timeTravel
	    });
	}

    instanceProto.syncObjects = function ()
    {
        for (var key in this.wayPoints) {
            var wayPoint = this.wayPoints[key][0];
            var inst = wayPoint.inst;
            var x = inst.x + (wayPoint.x - inst.x) / wayPoint.timeTravel;
            var y = inst.y + (wayPoint.y - inst.y) / wayPoint.timeTravel;
            wayPoint.timeTravel--;
            Object.getPrototypeOf(inst.type.plugin).acts.SetPos.call(inst, x, y);

            if (wayPoint.timeTravel == 0)
                this.wayPoints[key].splice(0, 1);
            if (this.wayPoints[key].length == 0)
                delete this.wayPoints[key];
        }
    }

    instanceProto.updateObjectHistories = function() {
        for (var syncId in this.instList) {
            // get instance
            var inst = this.instList[syncId];
            // create instance history
            var history = this.getObjectHistory(inst);

            // create history array
            if (this.histories[syncId] == undefined) {
                this.histories[syncId] = [];
            } else {
                var histories = this.histories[syncId];
                // get last history
                var lastHistory = histories[histories.length - 1];
                // return if instance unchanged
                if (this.compareHistory(history, lastHistory)) {
                    lastHistory.tick = this.runtime.tickCount;
                    return;
                }
            }
            // add history
            this.histories[syncId].push(history);
        }
    }

    instanceProto.syncObjectHistories = function () {
        if (this.runtime.tickCount % 10 != 0) return;

        for (var syncId in this.histories) {
            this.client.updateHistories(this.histories);
        }
    }

    instanceProto.compareHistory = function (h1, h2) {
        // compare 2 history
        return h1.x == h2.x && h1.y == h2.y && h1.layer == h2.layer && h1.visible == h2.visible;
    }

    instanceProto.getObjectHistory = function (inst) {
        return {
            x: inst.x,
            y: inst.y,
            layer: inst.layer.name,
            visible: inst.visible,
            tick: this.runtime.tickCount
        };
    }

    instanceProto.tick = function () {
        this.updateObjectHistories();
        this.syncObjectHistories();
        this.syncObjects();
    }

    instanceProto.onObjectDestroyed = function(inst) {
        if (inst.syncId === undefined) return;
        
        var obj = {
            syncId: inst.syncId,
            name: inst.type.name,
        }
    
        //this.client.destroyObjects([obj]);
    }

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// XSocket connected event
	Cnds.prototype.OnConnected = function ()
	{
		return true;
	};

    // room joined event
	Cnds.prototype.OnJoinedRoom = function () {
	    return true;
	};

    // room joined event
	Cnds.prototype.OnLeftRoom = function () {
	    return true;
	};

    // player joined event
	Cnds.prototype.OnPlayerJoinedRoom = function () {
	    return true;
	};

    // check if player is host
	Cnds.prototype.IsHost = function () {
	    return this.client.isHost;
	};

    // on player message
	Cnds.prototype.OnPlayerMessage = function (tag) {
	    return this.client.message.tag == tag;
	};

    // on Promote host
	Cnds.prototype.OnPromoteHost = function (tag) {
	    return true;
	};

    // on player left room
	Cnds.prototype.OnPlayerLeftRoom = function (tag) {
	    return true;
	};

    // on host changed
	Cnds.prototype.OnHostChanged = function (tag) {
	    return true;
	};

    // on object created
	Cnds.prototype.OnObjectCreated = function () {
	    return true;
	};

    // on power updated
	Cnds.prototype.OnPowerUpdated = function () {
	    return true;
	};

    // on power update failed
	Cnds.prototype.OnPowerUpdateFailed = function () {
	    return true;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	// connect to server
	Acts.prototype.Connect = function (url, name)
	{
		this.client.connect(url, name);
	};
	
	// join room
	Acts.prototype.JoinRoom = function (gameName, roomName, maxPlayers, password)
	{
	    this.client.joinRoom(gameName, roomName, maxPlayers, password);
	};
	
	// auto join room
	Acts.prototype.AutoJoinRoom = function (gameName, roomName, maxPlayers)
	{
	    this.client.autoJoinRoom(gameName, roomName, maxPlayers);
	};
	
	// leave room
	Acts.prototype.LeaveRoom = function ()
	{
	    this.client.leaveRoom();
	};
	
	// Broadcast message
	Acts.prototype.BroadcastMessage = function (tag, message)
	{
	    this.client.broadcastMessage(tag, message);
	};
	
	// promote host
	Acts.prototype.PromoteHost = function (playerId)
	{
	    this.client.promoteHost(playerId);
	};
	
	// Sync object
	Acts.prototype.UpdateObjectInfo = function (type) {
	    var objs = [];
	    for (var i = 0; i < type.instances.length; i++) {
	        var inst = type.instances[i];
	        var syncId = inst.syncId == undefined ? inst.uid : inst.syncId;
	        var obj = {
	            syncId: inst.syncId = syncId,
	            x: inst.x,
	            y: inst.y,
	            name: inst.type.name,
	            layer: inst.layer.name,
	            visible: inst.visible,
	        }
	        if (inst.cur_animation !== undefined) obj.animation = inst.cur_animation.name;
	        objs.push(obj);
	    }
	    this.client.updateObjectInfo(objs);
	};

    // Destroy object
	Acts.prototype.DestroyObject = function (type) {
	    var objs = [];
	    var instances = type.getCurrentSol().instances;
	    for (var i = 0; i < instances.length; i++) {
            // get instance
	        var inst = instances[i];
            // add to destroy list if syncId found
	        if (inst.syncId !== undefined) {
	            var obj = {
	                syncId: inst.syncId,
	                name: inst.type.name,
	            }
	            objs.push(obj);
	        }
	        
	        this.runtime.DestroyInstance(inst);
	        this.runtime.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnDestroyed, inst);
	    }
	    this.client.destroyObjects(objs);
	};

    // Sync object
    Acts.prototype.SyncObject = function(type) {
        for (var i = 0; i < type.instances.length; i++) {
            var inst = type.instances[i];
            if (inst.syncId == undefined) inst.syncId = this.client.me.id + "_" + inst.uid;
            this.instList[inst.syncId] = inst;
        }
    };

    Acts.prototype.UpdateObjectInstanceVar = function(type, varIndex) {
        var objs = [];
        for (var i = 0; i < type.instances.length; i++) {
            var inst = type.instances[i];
            var syncId = inst.syncId == undefined ? inst.uid : inst.syncId;
            var obj = {
                syncId: inst.syncId = syncId,
                name: inst.type.name,
                index: varIndex,
                value: inst.instance_vars[varIndex]
            }
            if (inst.cur_animation !== undefined) obj.animation = inst.cur_animation.name;
            objs.push(obj);
        }
        this.client.updateObjectVariable(objs);
    }

    Acts.prototype.UpdatePower = function (userId, power, sessionCode) {
        var self = this;
        // setting up date
        var data = {
            userID: userId,
            power: power,
            sessionCode: sessionCode
        }

        // call webservice
        $.ajax({
            type: "POST",
            url: "http://lingcor.net/DesktopModules/ElearningEnglish/Services/LearningEnglishServices.asmx/UpdatePowerGame",
            cache: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            dataType: "json",
            success: function (data) {
                // store the service result
                self.powerUpdateResult = data.d.toString();
                // trigger power updated
                self.trigger(self.cnds.OnPowerUpdated);
            },
            error: function (e) {
                // store the status text
                self.powerUpdateResult = e.statusText;
                // trigger power update failed
                self.trigger(self.cnds.OnPowerUpdateFailed);
            }
        });
    }

    pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the connection url
	Exps.prototype.ConnectionUrl = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.client.connectionUrl);	// return our value
	};
	
	// the server version
	Exps.prototype.ServerVersion = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_string(this.client.serverVersion);	// return our value
	};
	
	// the api version
	Exps.prototype.ApiVersion = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.client.apiVersion);	// return our value
	};

    // The name for the current user.
	Exps.prototype.MyName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_string(this.client.me.name);	// return our value
	};

    // The current game name joined.
	Exps.prototype.CurrentGame = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_string(this.client.room.gameName);	// return our value
	};

    // The current room joined.
	Exps.prototype.CurrentRoom = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_string(this.client.room.name);	// return our value
	};

    // The current room joined.
	Exps.prototype.Message = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_any(this.client.message.value);	// return our value
	};

    // The left player id
	Exps.prototype.LeftPlayerId = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_int(this.client.room.playerLeft.id);	// return our value
	};

    // The left player id
	Exps.prototype.LeftPlayerName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_string(this.client.room.playerLeft.name);	// return our value
	};

    // The left player id
	Exps.prototype.MyId = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_int(this.client.me.id);	// return our value
	};

    // The left player id
	Exps.prototype.MyName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_string(this.client.me.name);	// return our value
	};

    // The left player id
	Exps.prototype.JoinedPlayerId = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_int(this.client.room.playerJoined.id);	// return our value
	};

    // The left player id
	Exps.prototype.JoinedPlayerName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_string(this.client.room.playerJoined.name);	// return our value
	};

    // The result after call update power service
	Exps.prototype.PowerUpdateResult = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
	    ret.set_string(this.powerUpdateResult);	// return our value
	};

	pluginProto.exps = new Exps();
}());