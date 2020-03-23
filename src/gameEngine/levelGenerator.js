const LevelGenerator = (
  {
    timeOfRest,
    timeToFix,
    boardSize,
    maxOverdue,
    pointsMultiplier,
  },
  {
    timeDecrease,
    sizeIncrease,
    pointsIncrease,
  },
) => {
  const make = (level) => {
    const timeDecreaseFactor = Math.pow(timeDecrease, level - 1);
    const sizeIncreaseFactor = Math.pow(sizeIncrease, level - 1);

    return ({
      timeOfRest: timeOfRest * timeDecreaseFactor,
      timeToFix: timeToFix * timeDecreaseFactor,
      boardSize: Math.floor(boardSize * sizeIncreaseFactor),
      maxOverdue: Math.floor(maxOverdue * sizeIncreaseFactor),
      pointsMultiplier: pointsMultiplier * Math.pow(pointsIncrease, level - 1),
    });
  };

  return {
    make,
  };
};

LevelGenerator.PREDEFINED = {
  noob: () => LevelGenerator(
    {
      timeOfRest: 750,
      timeToFix: 1500,
      boardSize: 3,
      maxOverdue: 3,
      pointsMultiplier: 1,
    },
    {
      timeDecrease: 1 / 1.1,
      sizeIncrease: 1.05,
      pointsIncrease: 1.1,
    },
  ),
  pro: () => LevelGenerator(
    {
      timeOfRest: 500,
      timeToFix: 1250,
      boardSize: 4,
      maxOverdue: 4,
      pointsMultiplier: 1.2,
    },
    {
      timeDecrease: 1 / 1.2,
      sizeIncrease: 1.05,
      pointsIncrease: 1.2,
    },
  ),
  filip: () => LevelGenerator(
    {
      timeOfRest: 300,
      timeToFix: 1000,
      boardSize: 5,
      maxOverdue: 3,
      pointsMultiplier: 3,
    },
    {
      timeDecrease: 1 / 1.5,
      sizeIncrease: 1.1,
      pointsIncrease: 2,
    },
  ),
};
export { LevelGenerator };
