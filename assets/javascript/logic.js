$(document).ready(function () {

  //GLOBAL VARIABLES --- Browser Scope
  var inputName = "";
  var rounds = 1;
  var roundOver = false;

  //var for storing player1 info
  var wins1 = 0;
  var losses1 = 0;
  var ties1 = 0;
  var choice1 = "";


  //var for storing player2 info  
  var wins2 = 0;
  var losses2 = 0;
  var ties2 = 0;
  var choice2 = "";


  // var for storing the player objects read from DB
  var player1 = {};
  var player2 = {};


  // Store the index of the player in the user's browser
  var playerIndex = 0;


  //Flag for checking if players exist in DB
  var first = false;
  var second = false;

  // var for storing input names of players
  var playerName = "";
  var opponentName = ""

  //-----------------------------------------------------------

  // Initialize Firebase
  // Make sure to match the configuration to the script version number in the HTML
  // (Ex. 3.0 != 3.7.0)
  var config = {
    apiKey: "AIzaSyDTC9vEG1dEewGuzFoUDGoF9-mXBBPFcmI",
    authDomain: "rockpaperscissors-5b3d1.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-5b3d1.firebaseio.com",
    projectId: "rockpaperscissors-5b3d1",
    storageBucket: "rockpaperscissors-5b3d1.appspot.com",
    messagingSenderId: "946725595980"
  };

  firebase.initializeApp(config);

  // Create a variable to reference the database.
  var database = firebase.database();

  // All of our connections will be stored in this directory.
  var connectionsRef = database.ref("/connections");

  //info for first entrant stored here
  var playersRef1 = database.ref("/firstPlayer");

  //info for second entrant stored here
  var playersRef2 = database.ref("/secondPlayer");


  // '.info/connected' is a special location provided by Firebase that is updated
  // every time the client's connection state changes....boolean true/false
  var connectedRef = database.ref(".info/connected");

  // ----------------------------------------------------


  // When the client's connection state changes...
  connectedRef.on("value", function (snap) {

    // If they are connected..
    if (snap.val()) {

      // Add user to the connections list.
      var con = connectionsRef.push(true);

      // Remove user from the connection list when they disconnect.
      con.onDisconnect().remove();
    }
  });

  // When first loaded or when the connections list changes...
  connectionsRef.on("value", function (snap) {

    //This is the number of active connections
    playerCount = snap.numChildren();

  });

  //Event listener for root
  database.ref().on("value", function (snap) {

    if (snap.child("firstPlayer").exists()) {
      first = true;
      player1 = snap.child("firstPlayer").val();

      //if you are player2 then opponent is player1
      if (playerIndex == 2 && opponentName == "") {
        opponentName = player1.name;
        // set opponent name  on Right Side
        $("#oppName").text(opponentName);
        $("#message").html("Make Your Selection");
      }
      choice1 = player1.choice;
      if (playerIndex == 1 && roundOver==false) {

          resetColors(); 
        updateColor(choice1, "red");
        
      }

      if (choice1 && choice2) {
        console.log("call pickwinner from 1");
        pickWinner();
      }
    } else {
      first = false;
    }


    if (snap.child("secondPlayer").exists()) {
      second = true;
      player2 = snap.child("secondPlayer").val();

      //if you are player1 then opponent is player2
      if (playerIndex == 1 && opponentName == "") {
        opponentName = player2.name;
        // set opponent name  on Right Side
        $("#oppName").text(opponentName);
        $("#message").html("Make Your Selection");
      }
      choice2 = player2.choice;
      if (playerIndex == 2 && roundOver==false) {
        resetColors();
        updateColor(choice2, "green");
      }
      if (choice1 && choice2) {
        console.log("call pickwinner from 2");
        pickWinner();
      }

    } else {
      second = false;
    }

    $("#chatWindow").val(player1.chat);


  });

  //Event listener for ("/firstPlayer")
  playersRef1.on("value", function (data) {

    // TODO update chat window
    // $("#chatWindow").val(player1.chat);


  });

  //Event listener for ("/secondPlayer")
  playersRef2.on("value", function (data) {

    // $("#chatWindow").val(player1.chat);


  });


  //******************
  function resetColors() {

    $("#rock").css("border", "0px solid blue");
    $("#paper").css("border", "0px solid blue");
    $("#scissors").css("border", "0px solid blue");

  }

  function updateColor(myChoice, myColor) {

    if (myChoice == "r") {
      $("#rock").css("border", "8px solid " + myColor);

    }
    if (myChoice == "p") {
      $("#paper").css("border", "8px solid " + myColor);

    }
    if (myChoice == "s") {
      $("#scissors").css("border", "8px solid " + myColor);

    }
    // if (myChoice == "") {
    //   $("#rock").css("background-color", "blue");
    //   $("#paper").css("background-color", "blue");
    //   $("#scissors").css("background-color", "blue");
    // }
  }


  function pickWinner() {

    if (roundOver == false) {
      // This logic determines the outcome of the round (win/loss/tie), and increments the scores
      roundOver = true;
      rounds++;


      updateColor(choice1, "red");
      updateColor(choice2, "green");


      if ((choice1 === "r" && choice2 === "s") ||
        (choice1 === "s" && choice2 === "p") ||
        (choice1 === "p" && choice2 === "r")) {
        console.log("winner is " + choice1);
        wins1++;
        if (playerIndex == 1) {
          $("#message").text("Yay! You Won This Round");
        }
        else {
          $("#message").text("Sorry! You Lost This Round");
        }
        // losses2++;

      } else if (choice1 === choice2) {
        ties1++;
        ties2++;
        updateColor(choice2, "black");
        $("#message").text("Its a Tie! Nobody Wins This Round");


      } else {
        console.log("winner is " + choice2);

        // losses1++;
        wins2++;
        if (playerIndex == 2) {
          $("#message").text("Yay! You Won This Round");
        }
        else {
          $("#message").text("Sorry! You Lost This Round");
        }
      }

      if (playerIndex == 1) {
        // $("#yourname").text(data.val().name);
        $("#yourWins").text(wins1);
        $("#oppWins").text(wins2);

        // $("#yourLosses").text(data.val().losses);
        // $("#yourTies").text(data.val().ties);
      } else if (playerIndex == 2) {
        $("#yourWins").text(wins2);
        $("#oppWins").text(wins1);
        // $("#oppLosses").text(data.val().losses);
        // $("#oppTies").text(data.val().ties);
      }

    }

    if(rounds >= 4)
    {
      if (wins1== wins2) {
        $("#message").text("GAME OVER:  Its a TIE");
      } 
      
      if (wins1 > wins2 ) {
        if (playerIndex ==1){
           $("#message").text("GAME OVER:  YOU WON");
        }
        else
         {
          $("#message").text("GAME OVER:  YOU LOST");
        }
      }
      if (wins1 < wins2 ) {
        if (playerIndex ==2){
           $("#message").text("GAME OVER:  YOU WON");
        }
        else
         {
          $("#message").text("GAME OVER:  YOU LOST");
        }
      }
    }
else{
    $("#btnNext").show();
}


  }

  //  --------------------------------------------------------------

  $("#btnNext").on("click", function (event) {

    // reset choice1 and choice2
    resetColors();
    roundOver = false;

    choice1 = "";
    choice2 = "";

    // Update FireBase
    playersRef1.update({ wins: wins1, ties: ties1, losses: losses1, choice: "" });
    playersRef2.update({ wins: wins2, ties: ties2, losses: losses2, choice: "" });

    // Hide the directions
    $("#message").text(rounds + " of 3 : Make your selection");

    //Hide the Next button
    $("#btnNext").hide();

  });




  //Event handler for submit button
  $("#btnSubmit").on("click", function (event) {

    //Preventing the button from trying to submit the form
    event.preventDefault();

    // Grab user input
    inputName = $("#inputName").val().trim().toLowerCase();

    if (inputName != "") {
      RegisterPlayer(event);
    }

    //Hide when player has registered
    $("#userNameForm").hide();

  });

  // $("#tryAgain").on("click", function (event) {

  //Preventing the button from trying to submit the form
  //event.preventDefault();

  //   RegisterPlayer(event);
  // });

  // $("#playAgain").on("click", function (event) {

  //Preventing the button from trying to submit the form
  //event.preventDefault();

  //   RegisterPlayer(event);
  // });

  function RegisterPlayer(event) {

    if (playerName == "") {
      playerName = inputName;
    }

    if (playerName != "") {

      //create temporary player obj
      var player = {
        name: playerName,
        wins: 0,
        losses: 0,
        choice: "",
        chat: ""
      };

      // check if first or second player and write accordingly to firebase
      console.log(playerName);
      if (first == false) {

        playersRef1.set(player);
        $("#yourName").css("color", "red");
        $("#oppName").css("color", "green");
        $("#chatWindow").css("color", "red");

        $("#yourName").text(playerName);
        
        //$("#chatWindow").text(playerName + ": ");

        if (second == false) {

          $("#message").text("Waiting for player2");
        }
        else {
          $("#message").html("Make Your Selection");
          $("#oppName").text(player2.name);
        }

        playerIndex = 1;

        // If this user disconnects by closing or refreshing the browser, remove the user from the database
        playersRef1.onDisconnect().remove();

      } else if (second == false) {
        $("#yourName").css("color", "green");
        $("#chatWindow").css("color", "green");

        $("#oppName").css("color", "red");
        $("#yourName").text(playerName);
        // $("#chatWindow").text(playerName.toUpperCase() + ": ");

        playersRef2.set(player)


        if (first == false) {
          $("#message").html("Waiting for player 2");
        }
        else {
          $("#message").html("Make Your Selection");
          $("#oppName").text(player1.name);
        }
        playerIndex = 2;

        // If this user disconnects by closing or refreshing the browser, remove the user from the database
        playersRef2.onDisconnect().remove();
      }
      else {
        //TODO Display the TryAgain Button and Message Too Many players
      }

    }

    //TODO Hide the submit div and display the RPS buttons

    $("#inputName").val(" ");

  }

  // --------------------------------------------------------------

  // Whenever a user clicks the RPS button
  $("#rock").on("click", function () {

    if (!roundOver) {
      //check which player clicked it
      if (playerIndex === 1) {

        playersRef1.update({ choice: "r" });

      } else if (playerIndex === 2) {

        playersRef2.update({ choice: "r" });

      }
    }

  });

  $("#paper").on("click", function () {

    if (!roundOver) {

      console.log("paper clicked");
      //check which player clicked it
      if (playerIndex === 1) {

        playersRef1.update({ choice: "p" });

      } else if (playerIndex === 2) {
        playersRef2.update({ choice: "p" });

      }
    }
  });

  $("#scissors").on("click", function () {


    if (!roundOver) {
      
      //check which player clicked it
      if (playerIndex === 1) {

        playersRef1.update({ choice: "s" });

      } else if (playerIndex === 2) {

        playersRef2.update({ choice: "s" });
      }
    }
  });

  $("#btnChat").on("click", function(){

    //Preventing the button from trying to submit the form
    event.preventDefault();

    //store current chat content in temp
    var temp = $("#chatWindow").val();

    //Read chat from DB in dbChat
    var dbChat = player1.chat;

    //add current chat to DBchat in newChat
    var newChat = dbChat + temp;
    //alert("new chat is  " + newChat);

    //write to DB
    playersRef1.update({chat: temp});

  });

});         //End of document-ready function
