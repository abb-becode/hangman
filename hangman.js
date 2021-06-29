window.onload = () => {

    class Desactivate {
      static buttons() {
        for (const li of document.querySelectorAll('#buttons>ul>li')) {
          //console.log("li.textcontext: " + li.textContent);
          li.setAttribute("class","active");
          li.onclick = null;
        }
      }
      static showMissingLetters() {
        let lis = document.getElementById("proposed-word").getElementsByTagName("li");
        //for (const li of document.querySelectorAll('#hold>ul>li')) {
        for (let i = 0; i < lis.length; i++) {
          let li = lis[i];
          if (li.innerText === "_") { 
            //console.log(li.innerText + " indice:" + i);
            let letter = word[i];               //get missing letter from gesses word
            li.innerText = letter;              //change content of li 
            li.setAttribute("class","missing"); //set class to li
          }
        }
      }
    }

    class Loser {
      static smiley() {
        
        let canvas = document.getElementById("stickman");
        let ctx = canvas.getContext("2d");

        //smiley
        ctx.beginPath(); 
        ctx.fillStyle = "yellow";
        ctx.arc(230, 75, 50, 0, Math.PI * 2, true); // Cercle extérieur
        ctx.fill();
        ctx.moveTo(255,105);
        ctx.arc(230, 105, 25, 0, Math.PI, true);  // Bouche (sens anti horaire)
        ctx.moveTo(220, 65);
        ctx.arc(215, 65, 5, 0, Math.PI * 2, true);  // Oeil gauche
        ctx.moveTo(250, 65);
        ctx.arc(245, 65, 5, 0, Math.PI * 2, true);  // Oeil droite
        ctx.strokeStyle = 'red';
        ctx.stroke();
      }
    }

    class Winner {
      static winColor() {
        let winWord = document.getElementById("proposed-word");
        winWord.setAttribute("class","win");
      }
      static smiley() {

        let canvas = document.getElementById("stickman");
        let ctx = canvas.getContext("2d");

        //smiley
        ctx.beginPath(); 
        ctx.fillStyle = "yellow";
        ctx.arc(230, 75, 50, 0, Math.PI * 2, true); // Cercle extérieur
        ctx.fill();
        ctx.moveTo(265,75);
        ctx.arc(230, 75, 35, 0, Math.PI, false);  // Bouche (sens horaire)
        ctx.moveTo(220, 65);
        ctx.arc(215, 65, 5, 0, Math.PI * 2, true);  // Oeil gauche
        ctx.moveTo(250, 65);
        ctx.arc(245, 65, 5, 0, Math.PI * 2, true);  // Oeil droite
        ctx.strokeStyle = 'green';
        ctx.stroke();
      }
    }

    var alphabet = [
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h','i', 'j', 'k', 'l', 'm',
                    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
                  ];
    
    var categories;      // Array of topics
    var chosenCategory;  // Selected catagory
    var word ;           // Selected word
    var guess ;          // Guess letter
    var guesses = [ ];   // Stored guesses letters
    var lives ;          // Lives 
    var counter ;        // Count correct guesses letters
    var space;           // Number of spaces in word '-'
  
    // Get elements
    var showLives = document.getElementById("remainingLives");  //paragraph to show remaining lives            
    var showClue = document.getElementById("clue");             //paragraph to show a clue
  

    // create alphabet ul (each button represent an alphabet)
    buttons = () => {
      gameButtons = document.getElementById('buttons');
      letters = document.createElement('ul');
  
      for (var i = 0; i < alphabet.length; i++) {
        letters.id = 'alphabet';
        list = document.createElement('li');
        list.id = 'letter';
        list.innerHTML = alphabet[i];
        check();  //attach onclick event for this button
        gameButtons.appendChild(letters);
        letters.appendChild(list);
      }
    }   
    
    // Select Catagory
    selectCat = () => {
      if (chosenCategory === categories[0]) {
        categoryName.innerHTML = "The Chosen Category is Avengers characters";
      } else if (chosenCategory === categories[1]) {
        categoryName.innerHTML = "The Chosen Category is Pixar animation";
      } else if (chosenCategory === categories[2]) {
        categoryName.innerHTML = "The Chosen Category is European capitals";
      }
    }
  
    // Create guesses ul
    result = () => {
      wordHolder = document.getElementById('hold');
      proposedWord = document.createElement('ul');
  
      for (var i = 0; i < word.length; i++) {
        proposedWord.setAttribute('id', 'proposed-word');
        guess = document.createElement('li');
        guess.setAttribute('class', 'guess');
        if (word[i] === "-") {
          guess.innerHTML = "-";
          space = 1;
        } else {
          guess.innerHTML = "_";
        }
  
        guesses.push(guess);
        wordHolder.appendChild(proposedWord);
        proposedWord.appendChild(guess);
      }
    }
      
    // Show lives and check if the player was win
    comments = () => {
      if ( showLives.classList.contains('win') || showLives.classList.contains('lose') ) {
        showLives.removeAttribute("class");
      }
      showLives.innerHTML = "You have " + lives + " lives";  
      if (lives < 1) {
        showLives.innerHTML = "Game over, you lose"; //game over 
        showLives.setAttribute("class","lose");
        //showLives.setAttribute("class","lose");
        Desactivate.buttons();            //desactivate all letters
        Desactivate.showMissingLetters(); //show missing letters in another color in the result
        Loser.smiley();
      }
      //for (var i = 0; i < guesses.length; i++) {
      if (counter + space === guesses.length) {
        //congratulations
        showLives.innerHTML = "Congratulations, you win";   //you win
        showLives.setAttribute("class","win");
        Desactivate.buttons();   //desactivate all letters
        Winner.winColor();       //color all letters with green color
        Winner.smiley();
      }
      //}
    } 

    // Animate man
    var animate = () => {
      var bodyMember = lives ;     // get a body member of hangman to draw it (= remaining lives)
      drawFunctions[bodyMember](); // call function corresponding to element in the drawFunctions array
    }    
 
    //Hangman canvas
    canvas = () => { 
      _stickman = document.getElementById("stickman");
      context = _stickman.getContext('2d'); //if (!canvas.getContext) => Browser NOT support canvas tag was displayed inside div
      context.beginPath();
      context.strokeStyle = "#fff";
      context.lineWidth = 2;
    };
  
    draw = ($pathFromx, $pathFromy, $pathTox, $pathToy) => {
      context.moveTo($pathFromx, $pathFromy);
      context.lineTo($pathTox, $pathToy);
      context.stroke(); 
    }
  
    gallowsPart1 = () => {
       draw (0, 150, 150, 150);
    };
     
    gallowsPart2 = () => {
       draw (10, 0, 10, 600);
    };
    
    gallowsPart3 = () => {
       draw (0, 5, 70, 5);
    };
    
    gallowsPart4 = () => {
       draw (60, 5, 60, 15);
    };

    head = () => {
      _stickman = document.getElementById("stickman");
      context = _stickman.getContext('2d');
      context.beginPath();
      context.arc(60, 25, 10, 0, Math.PI*2, true);
      context.stroke();
    }
    
    torso = () => {
       draw (60, 36, 60, 70);
    };
    
    rightArm = () => {
       draw (60, 46, 100, 50);
    };
    
    leftArm = () => {
       draw (60, 46, 20, 50);
    };
    
    rightLeg = () => {
       draw (60, 70, 100, 100);
    };
    
    leftLeg = () => {
       draw (60, 70, 20, 100);
    };
    
    drawFunctions = [rightLeg, leftLeg, rightArm, leftArm,  torso,  head, gallowsPart4, gallowsPart3, gallowsPart2, gallowsPart1]; 
    

    // Attach onclick event for each letter
    // I used function keyword instead of arrow function "() =>" 
    // because the arrow functions are only callable and not constructible
    check = function () {
      list.onclick = function () {
        var letterClicked = (this.innerHTML);
        this.setAttribute("class", "active");
        this.onclick = null;
        //verify if letter clicked founded in the guess word
        for (var i = 0; i < word.length; i++) {
          if (word[i] === letterClicked) {
            guesses[i].innerHTML = letterClicked;
            counter += 1;
          } 
        }
        var j = (word.indexOf(letterClicked));
        if (j === -1) {
          lives -= 1;
          //comments(); //show remaining lives and check if player was win
          animate();  //draw the next member of the hanged man's body 
        } //else {
        comments(); //show remaining lives and check if player was win/lose
        //}
      }
    }

    // Play => function called when window loaded
    play = () => {
      categories = [
          ["iron-man", "hulk", "thor", "captain-america", "spiderman"],
          ["up", "cars", "inside-out", "coco", "monsters-inc"],
          ["brussels", "london", "madrid", "paris", "prague"]
      ];
  
      //random: choose one array from categories matrice
      chosenCategory = categories[Math.floor(Math.random() * categories.length)];

      //random: choose one word from choosen category
      word = chosenCategory[Math.floor(Math.random() * chosenCategory.length)];

      //replace each space character in the word string by "-"
      word = word.replace(/\s/g, "-");
      //console.log(word);

      //add buttons: each letter is a button
      buttons();
      guesses = [];
      lives = 10;
      counter = 0;
      space = 0;
      result();     //Create guesses ul and display number of letters and spaces in the proposed word
      comments();   //display number of lives remaining
      selectCat();  //display selected category
      canvas();     //specify context of canvas
    }
    
    // Hint: display clue
    hint.onclick = () => {
      hints = [
        ["he can fly with an armor", "he becomes green and very angry", "he controls lightning ", "braive patriot soldier", "he is afraid of his aunt"],
        ["the house take off with balloon", "the cars are speacking", "when the emotions come alive", "he wants to become a singer", "they frightened little children to pick-up their energy"],
        ["saved from fire by a little boy", "we can hear the song of is bigben", "Spanish capital", "french capital", "Czech Republic capital"]
      ];
  
      var categoryIndex = categories.indexOf(chosenCategory);
      var hintIndex = chosenCategory.indexOf(word);
      showClue.innerHTML = "Clue: " +  hints [categoryIndex][hintIndex];
    };

    // Reset game
    reset.onclick = () => {
      proposedWord.parentNode.removeChild(proposedWord);
      letters.parentNode.removeChild(letters);
      showClue.innerHTML = "";
      context.clearRect(0, 0, 400, 400);

      play();
    };
  
    //start game
    play(); 

}
