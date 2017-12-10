module.exports = exports = {
  keptRules: {
    rank: ['>80%', '20'],  // at least 80% record's rank <20
    deltaUp: ['>50%', '>0'], // at least half of records' ranks go up
    deltaDown: ['<20%', '<0'], // at most 20% record's delta < 0, which means go down
    competitve: ['6000', '600'] // hotness above 6000 count less than 600
  },
  removedRules: {
    rank: [">80%", '80'], // at least 80% record's rank > 80
    delta: ['>70%', '<0'], // 70% record goes down
  }
}