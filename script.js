var player = document.createElement('audio')
player.src = 'http://pablotheflamingo.com/assets/audio/music.mp3';
player.autobuffer = true;

// Uncomment the following line to activate the music
// player.play();

// Timing - Static value used to match up with the music
// x and y are the values that gravity alternates between
// for each axis (between -1 and +1 multiplied by this value).
// They are dynamically updated.
var params = {
    timing: 675,
    x: 0,
    y: 0,
};

var Bodies = Matter.Bodies;  
var Composites = Matter.Composites;
var Constraint = Matter.Constraint;
var Engine = Matter.Engine;
var Events = Matter.Events;
var MouseConstraint = Matter.MouseConstraint;
var World = Matter.World;

var engine = Engine.create(document.body, { 
    render: {
        options: {
            wireframes: true
        }
    }
});

var ground = Bodies.rectangle(400, 625, 800, 50, { 
    isStatic: true,
});

var neck = Composites.softBody(340, 240, 2, 6, 0, 0, true, 30, {}, {});
var head = Composites.softBody(160, 120, 5, 2, 0, 0, true, 30, {}, {});

var mouse = MouseConstraint.create(engine, {
    constraint: {stiffness: 0.1}
});

// Attach the neck to the ground
var createAnchor = function(x, y, bodyB) {
    return Constraint.create({ 
        pointA: {x: x, y: y}, 
        bodyB: bodyB, 
        stiffness: 1,
    });
};
var anchor1 = createAnchor(370, 570, neck.bodies[neck.bodies.length - 2]);
var anchor2 = createAnchor(430, 570, neck.bodies[neck.bodies.length - 1]);

// Attach the head to the neck
var createConnect = function(bodyA, bodyB) {
    return Constraint.create({ 
        bodyA: bodyA, 
        bodyB: bodyB, 
        stiffness: 1,
    });
};
var connect1 = createConnect(head.bodies[8], neck.bodies[0]);
var connect2 = createConnect(head.bodies[9], neck.bodies[1]);
var connect3 = createConnect(head.bodies[9], neck.bodies[0]);
var connect4 = createConnect(head.bodies[8], neck.bodies[1]);

World.add(engine.world, [mouse, ground, neck, head, anchor1, anchor2, connect1, connect2, connect3, connect4]);

Engine.run(engine);

Events.on(engine, 'tick', function(event) {

    // Animate the gravity based on sine curves based on dynamic x and y values.
    engine.world.gravity.y = params.y * Math.sin(20 * event.timestamp / (Math.PI * params.timing));
    engine.world.gravity.x = params.x * Math.sin(20 * event.timestamp / 2 / (Math.PI * params.timing) - 1 * Math.PI / 1);

    // Slowly animate the x and y values to add variety to the movement
    // x alternates between 0.5 and 1.5 over 17 seconds
    // y alternates between 0.75 and 1.75 over 42 seconds
    params.x += (0.50 * Math.sin(20 * engine.timing.timestamp / (Math.PI * 17 * 1000)) + 1.0 - params.x) / 20;
    params.y += (0.50 * Math.sin(20 * engine.timing.timestamp / (Math.PI * 42 * 1000)) + 1.25 - params.y) / 20;
});