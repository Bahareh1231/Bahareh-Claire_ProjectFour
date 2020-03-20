(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

// list of constants
var app = {};
var chars = 'aaaaabbccdddeeeeeeefgghhiiiiiijklllmmnnoooooprrrrsssttttuuuvwxyz';
var answer = '';
var answerList = new Set();
var countdown = void 0;
var timerDisplay = document.querySelector('.timeLeft');

app.url = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/';
app.key = '8c5c85a3-ffa3-4f09-b901-7db8209015dc';

// RANDOMLY GENERATE LETTERS ON A 4X4 GRID WHEN PRESSING 'START GAME'

app.switchScreens = function () {
    $('.start').on('click touchstart', function (e) {
        e.preventDefault();
        window.location = "board.html";
    }); // end of start event function
}; // end of switchScreens function

app.getBoard = function () {
    // write a for loop to iterate over each box on the board
    for (var i = 1; i <= 16; i++) {
        // generate random letters
        var ranLet = chars[Math.floor(Math.random() * 63)];
        // append them to the board
        $('.' + i).append('<a href="#" class="letter"><p>' + ranLet + '</p></a>');
    };
    app.timer(90); // 90 seconds on the timer
}; //end of getBoard

app.events = function () {
    //EVENTS FUNCTION ONCE THE BOARD IS MADE


    // DISPLAY THE ANSWER

    $('.box').on('click touchstart', '.letter', function (e) {
        e.preventDefault(); // prevent default
        $(this).addClass('selected');
        var activeLetter = $(this).find('p').text();
        answer += activeLetter;
        $('.userAnswer').html('<p>' + answer + '</p>');

        // STRETCH GOAL 

        // upon first click, make everything 'unclickable'
        $('.letter').addClass('unclickable');

        // selectedBoxNum is equal to the *number* class of the box div
        var selectedBoxNum = parseInt($(this).parent().attr('class').slice(-2));

        // if statements for removing 'unclickable' class from boxes in first column, middle columns and last column
        for (var i = 1; i <= 16; i++) {
            if ($('.' + selectedBoxNum).hasClass('firstColumn')) {
                //firstColumn
                if (i === selectedBoxNum + 1) {
                    $('.' + i + ' .letter').removeClass('unclickable');
                } else if (i === selectedBoxNum - 3) {
                    $('.' + i + ' .letter').removeClass('unclickable');
                } else if (i === selectedBoxNum + 4 || i === selectedBoxNum - 4) {
                    $('.' + i + ' .letter').removeClass('unclickable');
                } else if (i === selectedBoxNum + 5) {
                    $('.' + i + ' .letter').removeClass('unclickable');
                }
            } //end of firstColumn
            else if ($('.' + selectedBoxNum).hasClass('lastColumn')) {
                    //lastColumn
                    if (i === selectedBoxNum - 1) {
                        $('.' + i + ' .letter').removeClass('unclickable');
                    } else if (i === selectedBoxNum + 3) {
                        $('.' + i + ' .letter').removeClass('unclickable');
                    } else if (i === selectedBoxNum + 4 || i === selectedBoxNum - 4) {
                        $('.' + i + ' .letter').removeClass('unclickable');
                    } else if (i === selectedBoxNum - 5) {
                        $('.' + i + ' .letter').removeClass('unclickable');
                    }
                } //end of lastColumn
                else {
                        //middleColumn
                        if (i === selectedBoxNum + 1 || i === selectedBoxNum - 1) {
                            $('.' + i + ' .letter').removeClass('unclickable');
                        } else if (i === selectedBoxNum + 3 || i === selectedBoxNum - 3) {
                            $('.' + i + ' .letter').removeClass('unclickable');
                        } else if (i === selectedBoxNum + 4 || i === selectedBoxNum - 4) {
                            $('.' + i + ' .letter').removeClass('unclickable');
                        } else if (i === selectedBoxNum + 5 || i === selectedBoxNum - 5) {
                            $('.' + i + ' .letter').removeClass('unclickable');
                        }
                    } //end of middleColumn
        } //end of for loop
    }); //end of making the word


    //preventing default action on unclickable
    $('.box').on('click touchstart', '.unclickable', function (e) {
        e.preventDefault();
    });

    // keep the enter key from repeating the letter 
    $('.box').on('keydown', '.letter', function (e) {
        e.preventDefault(); // prevent default
    });

    // CLEAR THE USER SELECTIONS

    $('.clear').on('click touchstart', function (e) {
        e.preventDefault(); //prevent default
        $('.userAnswer').empty();
        answer = '';
        $('.letter').removeClass('selected unclickable');
        $('.clear').addClass('');
        setTimeout(function () {
            $('.submitButton').removeClass('');
        }, 1000);
    }); // end of clear


    // COMPARING TO THE API

    $('form').on('submit', function (e) {
        e.preventDefault();
        $('.displayedAnswers').empty();

        var submitAnswer = $('.userAnswer').text();

        var getAPI = function getAPI(query) {
            $.ajax({
                url: '' + app.url + query,
                method: "GET",
                dataType: 'json',
                data: {
                    key: app.key
                }
            }).then(function (resp) {
                console.log(resp);

                // const word = resp.entry_list.entry;
                var word = resp[0];
                console.log(word);

                if (!word.fl) {
                    app.wrongAlert();
                    // console.log('suggestion');
                } // end of suggestion
                else if (word.fl) {
                        if (word.fl === 'abbreviation' || word.fl === 'combining form') {
                            answerList.delete(word.fl);
                            app.wrongAlert();
                        } else {
                            app.duplicateAnswer(word.hwi.hw);
                            answerList.add(word.hwi.hw);
                            app.findWhiteSpace(word.hwi.hw);
                        }
                    }

                // else if (word) { // start of if (word)
                //     if (word[0]) { //is array
                //         if (word[0].fl === "noun" || word[0].fl === "verb" || word[0].fl === "adjective" || word[0].fl === "adverb" || word[0].fl === "pronoun" || word[0].fl === "preposition" || word[0].fl === "conjunction" || word[0].fl === "determiner" || word[0].fl === "pronoun, plural in construction") { // array word types
                //         app.duplicateAnswer(word[0].ew);
                //         answerList.add(word[0].ew);
                //         app.findWhiteSpace(word[0].ew);

                //             if (word[0].ew === word[0].ew.toUpperCase() || word[0].ew === (word[0].ew).charAt(0).toUpperCase() + (word[0].ew).slice(1)) { // word is uppercase abbrev OR capitalized
                //                 answerList.delete(word[0].ew);
                //                 app.wrongAlert();
                //             } //end of word is uppercase abbrev OR capitalized

                //         } //end of array word types
                //         else if (word[0].cx.ct || word[0].cx[0].ct) { //targeting past tense words for arrays
                //             app.duplicateAnswer(word[0].ew);
                //             answerList.add(word[0].ew);
                //             app.findWhiteSpace(word[0].ew);
                //         } //end of past tense words for arrays
                //         else { // unaccepted word type for arrays
                //             app.wrongAlert();
                //         } //end of unaccepted word type for arrays


                //     } // end of is array
                //     else { //is object
                //         if (word.fl === "noun" || word.fl === "verb" || word.fl === "adjective" || word.fl === "adverb" || word.fl === "pronoun" || word.fl === "preposition" || word.fl === "conjunction" || word.fl === "determiner" || word.fl === "pronoun, plural in construction") { // object word types 
                //         app.duplicateAnswer(word.ew);
                //         answerList.add(word.ew);
                //         app.findWhiteSpace(word.ew);

                //             if (word.ew === word.ew.toUpperCase() || word.ew === (word.ew).charAt(0).toUpperCase() + (word.ew).slice(1)) { // word is uppercase abbrev OR capitalized
                //                 answerList.delete(word.ew);
                //                 app.wrongAlert();
                //             } //end of word is uppercase abbrev OR capitalized
                //             else if (word.et === "by shortening & alteration") { //shortform word
                //                 answerList.delete(word.ew);
                //                 app.wrongAlert();
                //             } // end of shortform word like "helo"

                //         } //end of object word types
                //         else if (word.cx.ct || word.cx[0].ct) { //targeting past tense words for objects 
                //             app.duplicateAnswer(word.ew);
                //             answerList.add(word.ew);
                //             app.findWhiteSpace(word.ew);
                //         } //end of past tense words for objects
                //         else { // unaccepted word type for objects
                //             app.wrongAlert();
                //         } //end of unaccepted word type for objects

                //     } //end of is object

                // } // end of if (word)
                // else { //not a word
                //     app.wrongAlert();

                // }; //end of if statements!!

                $('.userAnswer').empty();
                answer = "";
                $('.letter').removeClass('selected');
                console.log(answerList);

                app.displayAnswers();
                app.changeScore();
                $('.letter').removeClass('unclickable');
            }); // end of then
        }; // end of getAPI function
        // console.log(getAPI(submitAnswer));
        getAPI(submitAnswer);
    }); // end of form submit
}; // end of event function


// APPEND ANSWER TO THE DISPLAYEDANSWERS DIV

app.displayAnswers = function () {
    answerList.forEach(function (word) {
        // $('.displayedAnswers').empty();
        $('.displayedAnswers').append('<li>' + word + '</li>');
    });
}; // end of displayAnswers fucntion


// IF DUPLICATE, MAKE THE SUBMIT BUTTON SHOW THAT THEY ARE WRONG

app.duplicateAnswer = function (word) {
    if (answerList.has(word)) {
        app.wrongAlert();
    };
}; // end of duplicateAnswer function

app.wrongAlert = function () {
    $('.submitButton').removeClass('pulse infinite').addClass('wrong wobble');
    setTimeout(function () {
        $('.submitButton').removeClass('wrong wobble').addClass('infinite pulse');
    }, 1000);
    $('.letter.selected').addClass('wrong');
    setTimeout(function () {
        $('.letter').removeClass('wrong');
    }, 1000);
};

// SCORE WILL BE THE SAME AS THE NUMBER OF ITEMS ON THE SET

app.changeScore = function () {
    var score = answerList.size;
    $('.score').html('' + score);
    $('.scoreBoard').addClass('grow');
    setTimeout(function () {
        $('.scoreBoard').removeClass('grow');
    }, 500);
};

// if API result has a space in it, don't show it and count it as wrong

app.findWhiteSpace = function () {
    answerList.forEach(function (word) {
        var n = word.includes(" ");
        if (word = n) {
            app.wrongAlert();
            answerList.delete(word);
        };
    }); // end of forEach loop
}; // end of findWhiteSpace


// TIMER

app.timer = function (seconds) {
    var now = Date.now();
    var then = now + seconds * 1000;
    displayTimeLeft(seconds);
    countdown = setInterval(function () {
        var secondsLeft = (then - Date.now()) / 1000;
        if (secondsLeft <= 0) {
            clearInterval(countdown);
            app.gameOver();
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}; // end of timer function

// DISPLAY THE TIME

function displayTimeLeft(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainderSeconds = Math.floor(seconds % 60);
    var display = minutes + ':' + remainderSeconds;
    if (remainderSeconds < 10) {
        remainderSeconds = "0" + remainderSeconds;
        display = minutes + ':' + remainderSeconds;
    }
    timerDisplay.textContent = display;
} // end of displaying the time

// GAME OVER OVERLAY
app.gameOver = function () {
    $('.overlay').removeClass('hide');
    $('.playAgain').on('click touchstart', function (e) {
        e.preventDefault();
        location.reload();
        $('.overlay').addClass('hide');
    }); // end of start event function
};

// initialize function
app.init = function () {
    app.switchScreens();
    app.getBoard();
    app.events();
};

// run initialize function through the doc ready function (on page load)
$(function () {
    app.init();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9zY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0EsSUFBTSxNQUFNLEVBQVo7QUFDQSxJQUFNLFFBQVEsa0VBQWQ7QUFDQSxJQUFJLFNBQVMsRUFBYjtBQUNBLElBQU0sYUFBYSxJQUFJLEdBQUosRUFBbkI7QUFDQSxJQUFJLGtCQUFKO0FBQ0EsSUFBTSxlQUFlLFNBQVMsYUFBVCxDQUF1QixXQUF2QixDQUFyQjs7QUFFQSxJQUFJLEdBQUosR0FBVSxrRUFBVjtBQUNBLElBQUksR0FBSixHQUFVLHNDQUFWOztBQUdBOztBQUVBLElBQUksYUFBSixHQUFvQixZQUFXO0FBQzNCLE1BQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxrQkFBZixFQUFtQyxVQUFTLENBQVQsRUFBWTtBQUMzQyxVQUFFLGNBQUY7QUFDQSxlQUFPLFFBQVAsR0FBa0IsWUFBbEI7QUFDSCxLQUhELEVBRDJCLENBSXZCO0FBQ1AsQ0FMRCxDLENBS0c7O0FBRUgsSUFBSSxRQUFKLEdBQWUsWUFBVTtBQUNqQjtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsS0FBSyxFQUFyQixFQUF5QixHQUF6QixFQUE4QjtBQUMxQjtBQUNBLFlBQU0sU0FBUyxNQUFNLEtBQUssS0FBTCxDQUFXLEtBQUssTUFBTCxLQUFnQixFQUEzQixDQUFOLENBQWY7QUFDQTtBQUNBLGdCQUFNLENBQU4sRUFBVyxNQUFYLG9DQUFtRCxNQUFuRDtBQUNIO0FBQ0QsUUFBSSxLQUFKLENBQVUsRUFBVixFQVJpQixDQVFGO0FBQ3RCLENBVEQsQyxDQVNHOztBQUVILElBQUksTUFBSixHQUFhLFlBQVc7QUFBRTs7O0FBR3RCOztBQUVBLE1BQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxrQkFBYixFQUFpQyxTQUFqQyxFQUE0QyxVQUFTLENBQVQsRUFBWTtBQUNwRCxVQUFFLGNBQUYsR0FEb0Qs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aEIsQ0FBbUIsa0JBQW5CLEVBQXVDLFVBQVMsQ0FBVCxFQUFZO0FBQy9DLFVBQUUsY0FBRjtBQUNBLGlCQUFTLE1BQVQ7QUFDQSxVQUFFLFVBQUYsRUFBYyxRQUFkLENBQXVCLE1BQXZCO0FBQ0gsS0FKRCxFQUZzQixDQU1sQjtBQUVQLENBUkQ7O0FBVUE7QUFDQSxJQUFJLElBQUosR0FBVyxZQUFZO0FBQ25CLFFBQUksYUFBSjtBQUNBLFFBQUksUUFBSjtBQUNBLFFBQUksTUFBSjtBQUNILENBSkQ7O0FBTUE7QUFDQSxFQUFFLFlBQVk7QUFDVixRQUFJLElBQUo7QUFDSCxDQUZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gbGlzdCBvZiBjb25zdGFudHNcbmNvbnN0IGFwcCA9IHt9O1xuY29uc3QgY2hhcnMgPSAnYWFhYWFiYmNjZGRkZWVlZWVlZWZnZ2hoaWlpaWlpamtsbGxtbW5ub29vb29wcnJycnNzc3R0dHR1dXV2d3h5eic7XG5sZXQgYW5zd2VyID0gJyc7XG5jb25zdCBhbnN3ZXJMaXN0ID0gbmV3IFNldCgpO1xubGV0IGNvdW50ZG93bjtcbmNvbnN0IHRpbWVyRGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aW1lTGVmdCcpO1xuXG5hcHAudXJsID0gJ2h0dHBzOi8vd3d3LmRpY3Rpb25hcnlhcGkuY29tL2FwaS92My9yZWZlcmVuY2VzL2NvbGxlZ2lhdGUvanNvbi8nO1xuYXBwLmtleSA9ICc4YzVjODVhMy1mZmEzLTRmMDktYjkwMS03ZGI4MjA5MDE1ZGMnO1xuXG5cbi8vIFJBTkRPTUxZIEdFTkVSQVRFIExFVFRFUlMgT04gQSA0WDQgR1JJRCBXSEVOIFBSRVNTSU5HICdTVEFSVCBHQU1FJ1xuXG5hcHAuc3dpdGNoU2NyZWVucyA9IGZ1bmN0aW9uICgpe1xuICAgICQoJy5zdGFydCcpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IFwiYm9hcmQuaHRtbFwiO1xuICAgIH0pOyAvLyBlbmQgb2Ygc3RhcnQgZXZlbnQgZnVuY3Rpb25cbn07IC8vIGVuZCBvZiBzd2l0Y2hTY3JlZW5zIGZ1bmN0aW9uXG5cbmFwcC5nZXRCb2FyZCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIHdyaXRlIGEgZm9yIGxvb3AgdG8gaXRlcmF0ZSBvdmVyIGVhY2ggYm94IG9uIHRoZSBib2FyZFxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSAxNjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBnZW5lcmF0ZSByYW5kb20gbGV0dGVyc1xuICAgICAgICAgICAgY29uc3QgcmFuTGV0ID0gY2hhcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNjMpXTsgICAgICAgXG4gICAgICAgICAgICAvLyBhcHBlbmQgdGhlbSB0byB0aGUgYm9hcmRcbiAgICAgICAgICAgICQoYC4ke2l9YCkuYXBwZW5kKGA8YSBocmVmPVwiI1wiIGNsYXNzPVwibGV0dGVyXCI+PHA+JHtyYW5MZXR9PC9wPjwvYT5gKSAgICAgICAgICAgIFxuICAgICAgICB9O1xuICAgICAgICBhcHAudGltZXIoOTApOyAvLyA5MCBzZWNvbmRzIG9uIHRoZSB0aW1lclxufTsgLy9lbmQgb2YgZ2V0Qm9hcmRcblxuYXBwLmV2ZW50cyA9IGZ1bmN0aW9uKCkgeyAvL0VWRU5UUyBGVU5DVElPTiBPTkNFIFRIRSBCT0FSRCBJUyBNQURFXG5cblxuICAgIC8vIERJU1BMQVkgVEhFIEFOU1dFUlxuICAgIFxuICAgICQoJy5ib3gnKS5vbignY2xpY2sgdG91Y2hzdGFydCcsICcubGV0dGVyJyAsZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnQgZGVmYXVsdFxuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICBsZXQgYWN0aXZlTGV0dGVyID0gJCh0aGlzKS5maW5kKCdwJykudGV4dCgpO1xuICAgICAgICBhbnN3ZXIgKz0gYWN0aXZlTGV0dGVyO1xuICAgICAgICAkKCcudXNlckFuc3dlcicpLmh0bWwoYDxwPiR7YW5zd2VyfTwvcD5gKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFNUUkVUQ0ggR09BTCBcblxuICAgICAgICAvLyB1cG9uIGZpcnN0IGNsaWNrLCBtYWtlIGV2ZXJ5dGhpbmcgJ3VuY2xpY2thYmxlJ1xuICAgICAgICAkKCcubGV0dGVyJykuYWRkQ2xhc3MoJ3VuY2xpY2thYmxlJyk7XG4gICAgICAgIFxuICAgICAgICAvLyBzZWxlY3RlZEJveE51bSBpcyBlcXVhbCB0byB0aGUgKm51bWJlciogY2xhc3Mgb2YgdGhlIGJveCBkaXZcbiAgICAgICAgbGV0IHNlbGVjdGVkQm94TnVtID0gcGFyc2VJbnQoKCQodGhpcykucGFyZW50KCkpLmF0dHIoJ2NsYXNzJykuc2xpY2UoLTIpKTtcblxuICAgICAgICAvLyBpZiBzdGF0ZW1lbnRzIGZvciByZW1vdmluZyAndW5jbGlja2FibGUnIGNsYXNzIGZyb20gYm94ZXMgaW4gZmlyc3QgY29sdW1uLCBtaWRkbGUgY29sdW1ucyBhbmQgbGFzdCBjb2x1bW5cbiAgICAgICAgZm9yKGxldCBpID0gMTsgaSA8PSAxNjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoJChgLiR7c2VsZWN0ZWRCb3hOdW19YCkuaGFzQ2xhc3MoJ2ZpcnN0Q29sdW1uJykpIHsgLy9maXJzdENvbHVtblxuICAgICAgICAgICAgICAgIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyA0IHx8IGkgPT09IHNlbGVjdGVkQm94TnVtIC0gNCkge1xuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgNSkge1xuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IC8vZW5kIG9mIGZpcnN0Q29sdW1uXG4gICAgICAgICAgICBlbHNlIGlmICgkKGAuJHtzZWxlY3RlZEJveE51bX1gKS5oYXNDbGFzcygnbGFzdENvbHVtbicpKXsgLy9sYXN0Q29sdW1uXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDMpIHtcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDQgfHwgaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSA0KSB7XG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gLy9lbmQgb2YgbGFzdENvbHVtblxuICAgICAgICAgICAgZWxzZSB7IC8vbWlkZGxlQ29sdW1uXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgMSB8fCBpID09PSBzZWxlY3RlZEJveE51bSAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PT0gc2VsZWN0ZWRCb3hOdW0gKyAzIHx8IGkgPT09IHNlbGVjdGVkQm94TnVtIC0gMykge1xuICAgICAgICAgICAgICAgICAgICAkKGAuJHtpfSAubGV0dGVyYCkucmVtb3ZlQ2xhc3MoJ3VuY2xpY2thYmxlJylcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IHNlbGVjdGVkQm94TnVtICsgNCB8fCBpID09PSBzZWxlY3RlZEJveE51bSAtIDQpIHtcbiAgICAgICAgICAgICAgICAgICAgJChgLiR7aX0gLmxldHRlcmApLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09PSBzZWxlY3RlZEJveE51bSArIDUgfHwgaSA9PT0gc2VsZWN0ZWRCb3hOdW0gLSA1KSB7XG4gICAgICAgICAgICAgICAgICAgICQoYC4ke2l9IC5sZXR0ZXJgKS5yZW1vdmVDbGFzcygndW5jbGlja2FibGUnKVxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgXG4gICAgICAgICAgICB9IC8vZW5kIG9mIG1pZGRsZUNvbHVtblxuICAgICAgICB9IC8vZW5kIG9mIGZvciBsb29wXG4gICAgfSk7IC8vZW5kIG9mIG1ha2luZyB0aGUgd29yZFxuXG5cbiAgICAvL3ByZXZlbnRpbmcgZGVmYXVsdCBhY3Rpb24gb24gdW5jbGlja2FibGVcbiAgICAkKCcuYm94Jykub24oJ2NsaWNrIHRvdWNoc3RhcnQnLCAnLnVuY2xpY2thYmxlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSlcblxuICAgIC8vIGtlZXAgdGhlIGVudGVyIGtleSBmcm9tIHJlcGVhdGluZyB0aGUgbGV0dGVyIFxuICAgICQoJy5ib3gnKS5vbigna2V5ZG93bicsICcubGV0dGVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50IGRlZmF1bHRcbiAgICB9KTtcblxuXG4gICAgLy8gQ0xFQVIgVEhFIFVTRVIgU0VMRUNUSU9OU1xuICAgIFxuICAgICQoJy5jbGVhcicpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vcHJldmVudCBkZWZhdWx0XG4gICAgICAgICQoJy51c2VyQW5zd2VyJykuZW1wdHkoKTtcbiAgICAgICAgYW5zd2VyID0gJyc7XG4gICAgICAgICQoJy5sZXR0ZXInKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQgdW5jbGlja2FibGUnKTtcbiAgICAgICAgJCgnLmNsZWFyJykuYWRkQ2xhc3MoJycpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICQoJy5zdWJtaXRCdXR0b24nKS5yZW1vdmVDbGFzcygnJyk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH0pOyAvLyBlbmQgb2YgY2xlYXJcbiAgICBcbiAgICBcbiAgICAvLyBDT01QQVJJTkcgVE8gVEhFIEFQSVxuICAgXG4gICAgJCgnZm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJCgnLmRpc3BsYXllZEFuc3dlcnMnKS5lbXB0eSgpO1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgc3VibWl0QW5zd2VyID0gJCgnLnVzZXJBbnN3ZXInKS50ZXh0KCk7XG5cbiAgICAgICAgY29uc3QgZ2V0QVBJID0gZnVuY3Rpb24ocXVlcnkpIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBgJHthcHAudXJsfSR7cXVlcnl9YCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogYXBwLmtleVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4ocmVzcCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcCk7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zdCB3b3JkID0gcmVzcC5lbnRyeV9saXN0LmVudHJ5O1xuICAgICAgICAgICAgICAgIGNvbnN0IHdvcmQgPSByZXNwWzBdO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHdvcmQpO1xuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgaWYgKCF3b3JkLmZsKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcC53cm9uZ0FsZXJ0KCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWdnZXN0aW9uJyk7XG5cbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBvZiBzdWdnZXN0aW9uXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAod29yZC5mbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAod29yZC5mbCA9PT0gJ2FiYnJldmlhdGlvbicgfHwgd29yZC5mbCA9PT0gJ2NvbWJpbmluZyBmb3JtJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5kZWxldGUod29yZC5mbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLmR1cGxpY2F0ZUFuc3dlcih3b3JkLmh3aS5odyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJMaXN0LmFkZCh3b3JkLmh3aS5odyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAuZmluZFdoaXRlU3BhY2Uod29yZC5od2kuaHcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGVsc2UgaWYgKHdvcmQpIHsgLy8gc3RhcnQgb2YgaWYgKHdvcmQpXG4gICAgICAgICAgICAgICAgLy8gICAgIGlmICh3b3JkWzBdKSB7IC8vaXMgYXJyYXlcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlmICh3b3JkWzBdLmZsID09PSBcIm5vdW5cIiB8fCB3b3JkWzBdLmZsID09PSBcInZlcmJcIiB8fCB3b3JkWzBdLmZsID09PSBcImFkamVjdGl2ZVwiIHx8IHdvcmRbMF0uZmwgPT09IFwiYWR2ZXJiXCIgfHwgd29yZFswXS5mbCA9PT0gXCJwcm9ub3VuXCIgfHwgd29yZFswXS5mbCA9PT0gXCJwcmVwb3NpdGlvblwiIHx8IHdvcmRbMF0uZmwgPT09IFwiY29uanVuY3Rpb25cIiB8fCB3b3JkWzBdLmZsID09PSBcImRldGVybWluZXJcIiB8fCB3b3JkWzBdLmZsID09PSBcInByb25vdW4sIHBsdXJhbCBpbiBjb25zdHJ1Y3Rpb25cIikgeyAvLyBhcnJheSB3b3JkIHR5cGVzXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBhcHAuZHVwbGljYXRlQW5zd2VyKHdvcmRbMF0uZXcpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgYW5zd2VyTGlzdC5hZGQod29yZFswXS5ldyk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBhcHAuZmluZFdoaXRlU3BhY2Uod29yZFswXS5ldyk7XG5cbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpZiAod29yZFswXS5ldyA9PT0gd29yZFswXS5ldy50b1VwcGVyQ2FzZSgpIHx8IHdvcmRbMF0uZXcgPT09ICh3b3JkWzBdLmV3KS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArICh3b3JkWzBdLmV3KS5zbGljZSgxKSkgeyAvLyB3b3JkIGlzIHVwcGVyY2FzZSBhYmJyZXYgT1IgY2FwaXRhbGl6ZWRcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5kZWxldGUod29yZFswXS5ldyk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGFwcC53cm9uZ0FsZXJ0KCk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSAvL2VuZCBvZiB3b3JkIGlzIHVwcGVyY2FzZSBhYmJyZXYgT1IgY2FwaXRhbGl6ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0gLy9lbmQgb2YgYXJyYXkgd29yZCB0eXBlc1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgZWxzZSBpZiAod29yZFswXS5jeC5jdCB8fCB3b3JkWzBdLmN4WzBdLmN0KSB7IC8vdGFyZ2V0aW5nIHBhc3QgdGVuc2Ugd29yZHMgZm9yIGFycmF5c1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGFwcC5kdXBsaWNhdGVBbnN3ZXIod29yZFswXS5ldyk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYW5zd2VyTGlzdC5hZGQod29yZFswXS5ldyk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYXBwLmZpbmRXaGl0ZVNwYWNlKHdvcmRbMF0uZXcpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSAvL2VuZCBvZiBwYXN0IHRlbnNlIHdvcmRzIGZvciBhcnJheXNcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGVsc2UgeyAvLyB1bmFjY2VwdGVkIHdvcmQgdHlwZSBmb3IgYXJyYXlzXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0gLy9lbmQgb2YgdW5hY2NlcHRlZCB3b3JkIHR5cGUgZm9yIGFycmF5c1xuXG5cbiAgICAgICAgICAgICAgICAvLyAgICAgfSAvLyBlbmQgb2YgaXMgYXJyYXlcbiAgICAgICAgICAgICAgICAvLyAgICAgZWxzZSB7IC8vaXMgb2JqZWN0XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBpZiAod29yZC5mbCA9PT0gXCJub3VuXCIgfHwgd29yZC5mbCA9PT0gXCJ2ZXJiXCIgfHwgd29yZC5mbCA9PT0gXCJhZGplY3RpdmVcIiB8fCB3b3JkLmZsID09PSBcImFkdmVyYlwiIHx8IHdvcmQuZmwgPT09IFwicHJvbm91blwiIHx8IHdvcmQuZmwgPT09IFwicHJlcG9zaXRpb25cIiB8fCB3b3JkLmZsID09PSBcImNvbmp1bmN0aW9uXCIgfHwgd29yZC5mbCA9PT0gXCJkZXRlcm1pbmVyXCIgfHwgd29yZC5mbCA9PT0gXCJwcm9ub3VuLCBwbHVyYWwgaW4gY29uc3RydWN0aW9uXCIpIHsgLy8gb2JqZWN0IHdvcmQgdHlwZXMgXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBhcHAuZHVwbGljYXRlQW5zd2VyKHdvcmQuZXcpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgYW5zd2VyTGlzdC5hZGQod29yZC5ldyk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBhcHAuZmluZFdoaXRlU3BhY2Uod29yZC5ldyk7XG5cbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpZiAod29yZC5ldyA9PT0gd29yZC5ldy50b1VwcGVyQ2FzZSgpIHx8IHdvcmQuZXcgPT09ICh3b3JkLmV3KS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArICh3b3JkLmV3KS5zbGljZSgxKSkgeyAvLyB3b3JkIGlzIHVwcGVyY2FzZSBhYmJyZXYgT1IgY2FwaXRhbGl6ZWRcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgYW5zd2VyTGlzdC5kZWxldGUod29yZC5ldyk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGFwcC53cm9uZ0FsZXJ0KCk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSAvL2VuZCBvZiB3b3JkIGlzIHVwcGVyY2FzZSBhYmJyZXYgT1IgY2FwaXRhbGl6ZWRcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBlbHNlIGlmICh3b3JkLmV0ID09PSBcImJ5IHNob3J0ZW5pbmcgJiBhbHRlcmF0aW9uXCIpIHsgLy9zaG9ydGZvcm0gd29yZFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBhbnN3ZXJMaXN0LmRlbGV0ZSh3b3JkLmV3KTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9IC8vIGVuZCBvZiBzaG9ydGZvcm0gd29yZCBsaWtlIFwiaGVsb1wiXG5cbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0gLy9lbmQgb2Ygb2JqZWN0IHdvcmQgdHlwZXNcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGVsc2UgaWYgKHdvcmQuY3guY3QgfHwgd29yZC5jeFswXS5jdCkgeyAvL3RhcmdldGluZyBwYXN0IHRlbnNlIHdvcmRzIGZvciBvYmplY3RzIFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGFwcC5kdXBsaWNhdGVBbnN3ZXIod29yZC5ldyk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYW5zd2VyTGlzdC5hZGQod29yZC5ldyk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYXBwLmZpbmRXaGl0ZVNwYWNlKHdvcmQuZXcpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSAvL2VuZCBvZiBwYXN0IHRlbnNlIHdvcmRzIGZvciBvYmplY3RzXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBlbHNlIHsgLy8gdW5hY2NlcHRlZCB3b3JkIHR5cGUgZm9yIG9iamVjdHNcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSAvL2VuZCBvZiB1bmFjY2VwdGVkIHdvcmQgdHlwZSBmb3Igb2JqZWN0c1xuXG4gICAgICAgICAgICAgICAgLy8gICAgIH0gLy9lbmQgb2YgaXMgb2JqZWN0XG5cbiAgICAgICAgICAgICAgICAvLyB9IC8vIGVuZCBvZiBpZiAod29yZClcbiAgICAgICAgICAgICAgICAvLyBlbHNlIHsgLy9ub3QgYSB3b3JkXG4gICAgICAgICAgICAgICAgLy8gICAgIGFwcC53cm9uZ0FsZXJ0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyB9OyAvL2VuZCBvZiBpZiBzdGF0ZW1lbnRzISFcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgJCgnLnVzZXJBbnN3ZXInKS5lbXB0eSgpO1xuICAgICAgICAgICAgICAgIGFuc3dlciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgJCgnLmxldHRlcicpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFuc3dlckxpc3QpO1xuXG4gICAgICAgICAgICAgICAgYXBwLmRpc3BsYXlBbnN3ZXJzKCk7XG4gICAgICAgICAgICAgICAgYXBwLmNoYW5nZVNjb3JlKCk7XG4gICAgICAgICAgICAgICAgJCgnLmxldHRlcicpLnJlbW92ZUNsYXNzKCd1bmNsaWNrYWJsZScpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSk7IC8vIGVuZCBvZiB0aGVuXG5cbiAgICAgICAgfTsgLy8gZW5kIG9mIGdldEFQSSBmdW5jdGlvblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhnZXRBUEkoc3VibWl0QW5zd2VyKSk7XG4gICAgICAgIGdldEFQSShzdWJtaXRBbnN3ZXIpO1xuICAgICAgICBcbiAgICAgICAgXG4gICAgfSk7ICAvLyBlbmQgb2YgZm9ybSBzdWJtaXRcbiAgICBcbn07IC8vIGVuZCBvZiBldmVudCBmdW5jdGlvblxuXG5cbi8vIEFQUEVORCBBTlNXRVIgVE8gVEhFIERJU1BMQVlFREFOU1dFUlMgRElWXG5cbmFwcC5kaXNwbGF5QW5zd2VycyA9IGZ1bmN0aW9uKCkge1xuICAgIGFuc3dlckxpc3QuZm9yRWFjaChmdW5jdGlvbih3b3JkKXtcbiAgICAgICAgLy8gJCgnLmRpc3BsYXllZEFuc3dlcnMnKS5lbXB0eSgpO1xuICAgICAgICAkKCcuZGlzcGxheWVkQW5zd2VycycpLmFwcGVuZChgPGxpPiR7d29yZH08L2xpPmApXG4gICAgfSk7XG59OyAvLyBlbmQgb2YgZGlzcGxheUFuc3dlcnMgZnVjbnRpb25cblxuXG4vLyBJRiBEVVBMSUNBVEUsIE1BS0UgVEhFIFNVQk1JVCBCVVRUT04gU0hPVyBUSEFUIFRIRVkgQVJFIFdST05HXG5cbmFwcC5kdXBsaWNhdGVBbnN3ZXIgPSBmdW5jdGlvbih3b3JkKSB7IFxuICAgIGlmIChhbnN3ZXJMaXN0Lmhhcyh3b3JkKSkge1xuICAgICAgICBhcHAud3JvbmdBbGVydCgpO1xuICAgIH07XG59OyAvLyBlbmQgb2YgZHVwbGljYXRlQW5zd2VyIGZ1bmN0aW9uXG5cbmFwcC53cm9uZ0FsZXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgJCgnLnN1Ym1pdEJ1dHRvbicpLnJlbW92ZUNsYXNzKCdwdWxzZSBpbmZpbml0ZScpLmFkZENsYXNzKCd3cm9uZyB3b2JibGUnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgJCgnLnN1Ym1pdEJ1dHRvbicpLnJlbW92ZUNsYXNzKCd3cm9uZyB3b2JibGUnKS5hZGRDbGFzcygnaW5maW5pdGUgcHVsc2UnKTtcbiAgICB9LCAxMDAwKTtcbiAgICAkKCcubGV0dGVyLnNlbGVjdGVkJykuYWRkQ2xhc3MoJ3dyb25nJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICQoJy5sZXR0ZXInKS5yZW1vdmVDbGFzcygnd3JvbmcnKTtcbiAgICB9LCAxMDAwKTtcbn1cblxuXG4vLyBTQ09SRSBXSUxMIEJFIFRIRSBTQU1FIEFTIFRIRSBOVU1CRVIgT0YgSVRFTVMgT04gVEhFIFNFVFxuXG5hcHAuY2hhbmdlU2NvcmUgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgc2NvcmUgPSBhbnN3ZXJMaXN0LnNpemU7XG4gICAgJCgnLnNjb3JlJykuaHRtbChgJHtzY29yZX1gKTtcbiAgICAkKCcuc2NvcmVCb2FyZCcpLmFkZENsYXNzKCdncm93Jyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICQoJy5zY29yZUJvYXJkJykucmVtb3ZlQ2xhc3MoJ2dyb3cnKTtcbiAgICB9LCA1MDApO1xufTtcblxuXG4vLyBpZiBBUEkgcmVzdWx0IGhhcyBhIHNwYWNlIGluIGl0LCBkb24ndCBzaG93IGl0IGFuZCBjb3VudCBpdCBhcyB3cm9uZ1xuXG5hcHAuZmluZFdoaXRlU3BhY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgYW5zd2VyTGlzdC5mb3JFYWNoKGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgICAgIGxldCBuID0gd29yZC5pbmNsdWRlcyhcIiBcIik7XG4gICAgICAgIGlmICh3b3JkID0gbikge1xuICAgICAgICAgICAgYXBwLndyb25nQWxlcnQoKTtcbiAgICAgICAgICAgIGFuc3dlckxpc3QuZGVsZXRlKHdvcmQpO1xuICAgICAgICB9O1xuICAgIH0pOyAvLyBlbmQgb2YgZm9yRWFjaCBsb29wXG59OyAvLyBlbmQgb2YgZmluZFdoaXRlU3BhY2VcblxuXG4vLyBUSU1FUlxuXG5hcHAudGltZXIgPSBmdW5jdGlvbihzZWNvbmRzKSB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCB0aGVuID0gbm93ICsgc2Vjb25kcyAqIDEwMDA7XG4gICAgZGlzcGxheVRpbWVMZWZ0KHNlY29uZHMpO1xuICAgIGNvdW50ZG93biA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgbGV0IHNlY29uZHNMZWZ0ID0gKHRoZW4gLSBEYXRlLm5vdygpKSAvIDEwMDA7XG4gICAgICAgIGlmKHNlY29uZHNMZWZ0IDw9IDApIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoY291bnRkb3duKTtcbiAgICAgICAgICAgIGFwcC5nYW1lT3ZlcigpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGxheVRpbWVMZWZ0KHNlY29uZHNMZWZ0KTtcbiAgICB9LCAxMDAwKTtcbn0gLy8gZW5kIG9mIHRpbWVyIGZ1bmN0aW9uXG5cbi8vIERJU1BMQVkgVEhFIFRJTUVcblxuZnVuY3Rpb24gZGlzcGxheVRpbWVMZWZ0KHNlY29uZHMpIHtcbiAgICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApO1xuICAgIGxldCByZW1haW5kZXJTZWNvbmRzID0gTWF0aC5mbG9vcihzZWNvbmRzICUgNjApO1xuICAgIGxldCBkaXNwbGF5ID0gYCR7bWludXRlc306JHtyZW1haW5kZXJTZWNvbmRzfWA7XG4gICAgaWYgKHJlbWFpbmRlclNlY29uZHMgPCAxMCkge1xuICAgICAgICByZW1haW5kZXJTZWNvbmRzID0gXCIwXCIgKyByZW1haW5kZXJTZWNvbmRzO1xuICAgICAgICBkaXNwbGF5ID0gYCR7bWludXRlc306JHtyZW1haW5kZXJTZWNvbmRzfWA7XG4gICAgfVxuICAgIHRpbWVyRGlzcGxheS50ZXh0Q29udGVudCA9IGRpc3BsYXk7XG59IC8vIGVuZCBvZiBkaXNwbGF5aW5nIHRoZSB0aW1lXG5cbi8vIEdBTUUgT1ZFUiBPVkVSTEFZXG5hcHAuZ2FtZU92ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAkKCcub3ZlcmxheScpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgJCgnLnBsYXlBZ2FpbicpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAkKCcub3ZlcmxheScpLmFkZENsYXNzKCdoaWRlJyk7XG4gICAgfSk7IC8vIGVuZCBvZiBzdGFydCBldmVudCBmdW5jdGlvblxuXG59XG5cbi8vIGluaXRpYWxpemUgZnVuY3Rpb25cbmFwcC5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIGFwcC5zd2l0Y2hTY3JlZW5zKCk7XG4gICAgYXBwLmdldEJvYXJkKCk7XG4gICAgYXBwLmV2ZW50cygpO1xufTtcblxuLy8gcnVuIGluaXRpYWxpemUgZnVuY3Rpb24gdGhyb3VnaCB0aGUgZG9jIHJlYWR5IGZ1bmN0aW9uIChvbiBwYWdlIGxvYWQpXG4kKGZ1bmN0aW9uICgpIHtcbiAgICBhcHAuaW5pdCgpO1xufSk7Il19
