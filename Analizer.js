class Analizer {
    static compute(scoreList) {
        if(scoreList.length === 0) {
            return false;
        }
        const total = {
            total: scoreList.length,
            winCount: 0,
        }
        scoreList.forEach((score) => {
            if(score.winner) {
                total.winCount++
            }
        })

        return total;
    }
}

module.exports = Analizer;