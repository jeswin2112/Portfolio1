// Global score variables
let humanScore = 0;
let computerScore = 0;

// Function to get computer's choice
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

// Function to get human's choice
function getHumanChoice() {
    let choice = prompt("Choose rock, paper, or scissors:");
    while (!['rock', 'paper', 'scissors'].includes(choice?.toLowerCase())) {
        choice = prompt("Invalid choice. Please choose rock, paper, or scissors:");
    }
    return choice.toLowerCase();
}

// Function to play a single round
function playRound(humanChoice, computerChoice) {
    // Make human choice case-insensitive
    humanChoice = humanChoice.toLowerCase();
    
    if (humanChoice === computerChoice) {
        return "It's a tie!";
    }
    
    if ((humanChoice === 'rock' && computerChoice === 'scissors') ||
        (humanChoice === 'paper' && computerChoice === 'rock') ||
        (humanChoice === 'scissors' && computerChoice === 'paper')) {
        humanScore++;
        return `You win! ${humanChoice} beats ${computerChoice}`;
    } else {
        computerScore++;
        return `You lose! ${computerChoice} beats ${humanChoice}`;
    }
}

// Function to play the full game
function playGame() {
    // Reset scores
    humanScore = 0;
    computerScore = 0;
    
    // Play 3 rounds
    for (let i = 0; i < 3; i++) {
        const humanSelection = getHumanChoice();
        const computerSelection = getComputerChoice();
        console.log(playRound(humanSelection, computerSelection));
        console.log(`Score - You: ${humanScore}, Computer: ${computerScore}`);
    }
    
    // Determine the final winner
    if (humanScore > computerScore) {
        return "You win the game!";
    } else if (computerScore > humanScore) {
        return "You lose the game!";
    } else {
        return "The game is a tie!";
    }
}

// Start the game
console.log("Welcome to Rock Paper Scissors! Best of 3 wins!");
const finalResult = playGame();
console.log(finalResult);
