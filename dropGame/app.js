const arr = [];

function dropCreate(url){
    const avatar = document.createElement('avatar');
    avatar.className = 'avatar';
    avatar.innerHTML = `
    <img class = "avatar" src = "${url}"/>
    `;
    return avatar;
}

function doDrop(url)
{
    const avatar = dropCreate(url);
    const drop = {
        id: Date.now() + Math.random(),
        avatar,
        location: {
            x: window.innerWidth * Math.random(),
            y:  -200,
        },
        velocity: {
            x: Math.random() * (Math.random() > .5 ? -1 : 1) * 2,
            y: Math.random() * 2
        }
    };
    arr.push(drop);
    document.body.appendChild(avatar);
    updatePos(drop);
}

function updatePos(drop)
{
    if (drop.land) return;
    drop.avatar.style.top = drop.location.y + 'px';
    drop.avatar.style.left = (drop.location.x - (drop.avatar.clientWidth/2)) + 'px';
}



function update()
{
    arr.forEach(drop=> {
        if (drop.land) return;

        drop.location.x += drop.velocity.x;
        drop.location.y += drop.velocity.y;

        if (drop.location.x + drop.avatar.clientWidth / 2 >= window.innerWidth)
        {
            drop.velocity.x = -Math.abs(drop.velocity.x);
        }
        else if (drop.location.x - drop.avatar.clientWidth /2 < 0)
        {
            drop.velocity.x = Math.abs(drop.velocity.x);
        }

        if (drop.location.y + drop.avatar.clientHeight >= window.innerHeight)
        {
            drop.velocity.y = 0;
            drop.velocity.x = 0;
            drop.location.y = drop.avatar.clientHeight - drop.location.y;
            //drop.land = true;
        }
        
    });
}

function draw()
{
    arr.forEach(drop=> {
        drop.avatar.style.top = drop.location.y + 'px';
        drop.avatar.style.left = (drop.location.x - (drop.avatar.clientWidth/2)) + 'px';
    });
}

// const drops = [
//     'https://static-cdn.jtvnw.net/jtv_user_pictures/99aa4739-21d6-40af-86ae-4b4d3457fce4-profile_image-70x70.png',
//     'https://static-cdn.jtvnw.net/jtv_user_pictures/99aa4739-21d6-40af-86ae-4b4d3457fce4-profile_image-70x70.png',
//     'https://static-cdn.jtvnw.net/jtv_user_pictures/99aa4739-21d6-40af-86ae-4b4d3457fce4-profile_image-70x70.png',
//     'https://static-cdn.jtvnw.net/jtv_user_pictures/99aa4739-21d6-40af-86ae-4b4d3457fce4-profile_image-70x70.png',
//     'https://static-cdn.jtvnw.net/jtv_user_pictures/99aa4739-21d6-40af-86ae-4b4d3457fce4-profile_image-70x70.png',
//     'https://static-cdn.jtvnw.net/jtv_user_pictures/99aa4739-21d6-40af-86ae-4b4d3457fce4-profile_image-70x70.png',
//     'https://static-cdn.jtvnw.net/jtv_user_pictures/99aa4739-21d6-40af-86ae-4b4d3457fce4-profile_image-70x70.png',
//     'https://static-cdn.jtvnw.net/jtv_user_pictures/99aa4739-21d6-40af-86ae-4b4d3457fce4-profile_image-70x70.png',
//     'https://static-cdn.jtvnw.net/jtv_user_pictures/99aa4739-21d6-40af-86ae-4b4d3457fce4-profile_image-70x70.png'
// ]

// drops.forEach(doDrop);

function game()
{
    update();
    draw();
    requestAnimationFrame(game);
}

game();

const client = new tmi.Client({
	channels: [ 'bigdadsnasty' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	if (message.startsWith('!drop'))
    {
        doDrop(url);
    }
});
