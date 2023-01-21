class Score {

    computer;
    user;
    winner;

    constructor(computerDigit, userDigit, winner) {
        this.computer = computerDigit;
        this.user = userDigit;
        this.winner = winner;
    }
}

module.exports = Score;