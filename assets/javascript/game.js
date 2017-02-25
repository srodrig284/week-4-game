/*INSTRUCTIONS
2. Here's how the app works:

* When the game starts, the player will choose a character by clicking on the fighter's picture. The player will fight as that character for the rest of the game.

* The player must then defeat all of the remaining fighters. Enemies should be moved to a different area of the screen.

* The player chooses an opponent by clicking on an enemy's picture.

* Once the player selects an opponent, that enemy is moved to a `defender area`.

* The player will now be able to click the `attack` button.
* Whenever the player clicks `attack`, their character damages the defender. The opponent will lose `HP` (health points). These points are displayed at the bottom of the defender's picture.
* The opponent character will instantly counter the attack. When that happens, the player's character will lose some of their `HP`. These points are shown at the bottom of the player character's picture.

3. The player will keep hitting the attack button in an effort to defeat their opponent.
* When the defender's `HP` is reduced to zero or below, remove the enemy from the `defender area`. The player character can now choose a new opponent.

4. The player wins the game by defeating all enemy characters. The player loses the game the game if their character's `HP` falls to zero or below.

##### Game design notes:
    * Each character in the game has 3 attributes: `Health Points`, `Attack Power` and `Counter Attack Power`.

* Each time the player attacks, their character's Attack Power increases by its base Attack Power.
* For example, if the base Attack Power is 6, each attack will increase the Attack Power by 6 (12, 18, 24, 30 and so on).
* The enemy character only has `Counter Attack Power`.
* Unlike the player's `Attack Points`, `Counter Attack Power` never changes.

* The `Health Points`, `Attack Power` and `Counter Attack Power` of each character must differ.

* No characters in the game can heal or recover Health Points.
* A winning player must pick their characters wisely by first fighting an enemy with low `Counter Attack Power`. This will allow them to grind `Attack Power` and to take on enemies before they lose all of their `Health Points`. Healing options would mess with this dynamic.

* Your players should be able to win and lose the game no matter what character they choose. The challenge should come from picking the right enemies, not choosing the strongest player.
*/
$(document).ready(function(){
    /*JQuery(document).ready(function($){})*/

    var characters = [
        {name: "Darth Vader", hp:   120, ap:   8, cap:  15, apm: 0, img: "darth-vader.jpg" },
        {name: "Yoda", hp:   100, ap:   5, cap:  10, apm: 0, img: "Yoda.png" },
        {name: "Jabba The Hutt", hp:   90, ap:   7, cap:  12, apm: 0, img: "jabba.png" },
        {name: "Han Solo", hp:   110, ap:   10, cap:  15, apm: 0, img: "Han_Solo.png" }];

    var player;
    var enemy;
    var attackRnd = 0;

    function setupCharacters(){
        $.each(characters, function (k, value){
            var charName = $('<p>')
                .addClass('character-name center-text')
                .html(characters[k].name);

            var charPic = $('<img>')
                .addClass('character-pic')
                .attr('src', 'assets/images/' + characters[k].img);

            var healthP = $('<p>')
                .addClass('health-points center-text')
                .html(characters[k].hp);

            $("<div>")
                .addClass('character')
                .data('data-index', k)
                .append(charName)
                .append(charPic)
                .append(healthP)
                .appendTo("#character-box");
        });

        attackRnd = 0;  // reset to zero

        $("#character-message").text("PICK YOUR CHARACTER");
        $(".character").one('click', setupMyCharacter);

    };

    function setupMyCharacter(){
        player = characters[$(this).data('data-index')];
        //console.log (player);

        $(this).appendTo("#player-character")
            .addClass('player');


        $("#character-box").children()
            .appendTo("#enemies-box")
            .addClass('enemies')
            .off('click', setupMyCharacter);

        $("<button>")
            .addClass('letter-button-color letter-button disabled')
            .text("ATTACK")
            .appendTo("#button");

        $("#character-message").text("SELECT AN OPPONENT");
        $(".enemies").one('click', setupOpponent);

    }

    function setupOpponent(){
        enemy = characters[$(this).data('data-index')];

        $(this).appendTo("#enemy-character")
            .addClass('enemy')
            .removeClass('enemies');

        $("#character-message").text("ATTACK... ATTACK... ATTACK...");

        $("#button>")
            .removeClass('disabled')
            .on('click', playerAttack);

        //$(".letter-button").on('click', playerAttack);

        $("#enemies-box").children()
            .off('click', setupOpponent);
    }

    function playerAttack(){

        attackRnd++;

        enemy.hp = enemy.hp - (player.ap * attackRnd);
        if(enemy.hp <= 0){
            gameOver(true);  // player wins
            return;
        }

        player.hp = player.hp - enemy.cap;
        if(player.hp <= 0){
            gameOver(false);  // player loses
            return;
        }

        $("#character-message").html('You attacked ' + enemy.name + ' for ' + player.ap * attackRnd + ' damage!' + '<br>'
            + enemy.name + ' attacked you back for ' + enemy.cap + ' damage!');

        // update health points for each
        $("#player-character .character .health-points").html(player.hp);
        $("#enemy-character .enemy .health-points").html(enemy.hp);
        console.log("player hp: " + player.hp);

    }

    function gameOver(playerwins){
        if(playerwins){
            // if the player won, then
            // - if more opponents, then remove defeated enemy, then ask to make another selection
            // - if no more opponents - ask to play again
            //if ( $('#myfav').children().length > 0 ) {
            if($("#enemies-box").children().length > 0) {    // are there more opponents? YES...
                $("#character-message").html('YOU WIN!!!' + '<br>' + 'SELECT ANOTHER OPPONENT.');
                // disable attack button
                $("#button>")
                    .addClass('disabled')
                    .off('click', playerAttack);
                // remove the current enemy
                $("#enemy-character .enemy").remove();

                // add the onclick to enemies to select
                $("#enemies-box").children()
                    .one('click', setupOpponent);
            }
            else {    // no more opponents
                $("#character-message").html('YOU WIN!!!' + '<br>' + 'GAME OVER!!!');
                $("#button>")
                    .text("PLAY AGAIN")
                    .one('click', function () {
                        location.reload()});
            }
        }
        else{   // player lost
            $("#character-message").html('YOU HAVE BEEN DEFEATED!!!');
            $("#button>")
                .text("PLAY AGAIN")
                .one('click', function () {
                    location.reload()});
        }
    }

    setupCharacters();

}); // END document.ready