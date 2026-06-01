// SM-2 spaced repetition algorithm
export type Rating = 0 | 1 | 2; // 0=fail, 1=good, 2=easy

export interface SRSCard {
  interval: number;       // days until next review
  easeFactor: number;     // multiplier, starts at 2.5
  repetitions: number;
  nextReview: Date;
}

export function initialCard(): SRSCard {
  return {
    interval: 1,
    easeFactor: 2.5,
    repetitions: 0,
    nextReview: new Date(),
  };
}

export function reviewCard(card: SRSCard, rating: Rating): SRSCard {
  let { interval, easeFactor, repetitions } = card;

  if (rating === 0) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (2 - rating) * (0.08 + (2 - rating) * 0.02));
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { interval, easeFactor, repetitions, nextReview };
}

export function isDue(card: SRSCard): boolean {
  return new Date() >= new Date(card.nextReview);
}
