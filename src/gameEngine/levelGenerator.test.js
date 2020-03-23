import { LevelGenerator } from './levelGenerator';

describe('Level generator', () => {
  const makeParamsSnapshotTest = (generator, levelsCount) => {
    const levels = [];

    for (let i = 1; i < levelsCount; i += 1) {
      levels.push(generator.make(i));
    }

    expect(levels).toMatchSnapshot();
  };

  const calculateMaxPointsForLevel = (generator, levelsCount) => {
    const points = [];
    let total = 0;

    for (let i = 1; i < levelsCount; i += 1) {
      const { pointsMultiplier, timeToFix, boardSize } = generator.make(i);
      const fields = boardSize * boardSize;
      const levelPoints = timeToFix * pointsMultiplier * fields;
      total += levelPoints;

      points.push({ levelPoints, total });
    }

    expect(points).toMatchSnapshot();
  };

  it('creates levels params for a noob gameplay', () => {
    const generator = LevelGenerator.PREDEFINED.noob();

    makeParamsSnapshotTest(generator, 20);
  });

  it('creates levels params for a pro gameplay', () => {
    const generator = LevelGenerator.PREDEFINED.pro();

    makeParamsSnapshotTest(generator, 20);
  });

  it('creates levels params for a filip gameplay', () => {
    const generator = LevelGenerator.PREDEFINED.filip();

    makeParamsSnapshotTest(generator, 20);
  });

  it('calculate points for a noob gameplay', () => {
    const generator = LevelGenerator.PREDEFINED.noob();

    calculateMaxPointsForLevel(generator, 20);
  });

  it('calculate points for a pro gameplay', () => {
    const generator = LevelGenerator.PREDEFINED.pro();

    calculateMaxPointsForLevel(generator, 20);
  });

  it('calculate points for a filip gameplay', () => {
    const generator = LevelGenerator.PREDEFINED.filip();

    calculateMaxPointsForLevel(generator, 20);
  });
});
