let arr = [];
const cup = document.querySelector('.cup');
const sign = document.querySelector('.sign');
const currentUsers = {};
let sigs = [];

function dropCreate(url, isAvatar = false){
    const avatar = document.createElement('avatar');
    avatar.className = 'avatar';
    avatar.innerHTML = `
    <img class = "avatar" src = "${url}"/>
    `;
    return avatar;
}

function doDrop({username, url, isAvatar = false})
{
    currentUsers[username] = true;
    const avatar = dropCreate(url, isAvatar);
    const drop = {
        id: username,
        avatar,
        location: {
            x: (window.innerWidth / 2) + Math.random(),
            y:  -200,
        },
        velocity: {
            x: Math.random() * (Math.random() > .5 ? -1 : 1) * 4,
            y: Math.random() * 3
        }
    };
    arr.push(drop);
    document.body.appendChild(avatar);
    updatePos(drop);
}

function updatePos(drop)
{
    //if (drop.land) return;
    drop.avatar.style.top = drop.location.y + 'px';
    drop.avatar.style.left = (drop.location.x - (drop.avatar.clientWidth/2)) + 'px';
}



function update(username)
{
    arr.forEach(drop=> {
        //if (drop.land) return;

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
            drop.avatar.classList.add("landed");
            const {x} = drop.location;
            const score = Math.abs(window.innerWidth / 2 - x);

            if (score <= cup.clientWidth / 2)
            {
                console.log("Hit");
                sigs.push({username: drop.id});
            }

            renderSign();

            //drop.land = true;
        }
        
        drops = arr.filter(d => d != drop);

        setTimeout(() => {
            currentUsers[drop.id] = false;
            document.body.removeChild(drop.avatar);
        }, 30000);
        
    });
}

function renderSign()
{
    const name = sign.querySelector('.names');
    name.innerHTML = sigs.reduce((html, {username}) => {
        return html + `<p>${username}</p>`;
    }, '');
}

function draw()
{
    arr.forEach(drop=> {
        drop.avatar.style.top = drop.location.y + 'px';
        drop.avatar.style.left = (drop.location.x - (drop.avatar.clientWidth/2)) + 'px';
    });
}

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


	if (message.startsWith('!dieup'))
    {
        if (currentUsers[tags.username]) return;
         doDrop({username: tags.username, url: "dice_PNG49.png"});
    }
});