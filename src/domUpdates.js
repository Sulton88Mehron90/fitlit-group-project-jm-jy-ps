/* ~~~~~~~~~~ IMPORTS ~~~~~~~~~~*/

import {
  getAvgSleep,
  getAvgQuality,
  getHoursByDay,
  getWeekSleep,
  getFluidDrankForSpecificDay,
  getWeeklyFluid,
  weeklySteps,
  getAvgStepGoal,
  calculateMilesUserWalked,
  stepsPerDay,
  milesPerDay,
  activeMinutesPerDay,
} from './utils';


import {
  activity,
  hydration,
  currentUser,
  sleep,
  users,
  currentDate,
  sleepCurrentDate,
  activityCurrentDate,
} from './scripts';
import quotes from './data/quotes';

import {
  createHydrationChart,
  createSleepChart,
  createActivityChart,
} from './charts';

/* ~~~~~~~~~~ QUERY SELECTORS ~~~~~~~~~~*/

const personalData = document.querySelector('.user-data');
const stepGoal = document.querySelector('.step-goal');
const milesWalked = document.querySelector('.miles-walked');
const allUserAvg = document.querySelector('.all-user-average');
const userName = document.querySelector('.user-name');
const hydrationInfo = document.querySelector('.hydration-message');
const dailySleep = document.querySelector('#dailySleep');
const weeklySleep = document.querySelector('#weeklySleepHours');
const averageSleep = document.querySelector('#averageSleep');
const sleepQuality = document.querySelector('#sleepQuality');
const oneWeekHydrationChart = document.querySelector('.weekly-hydration-data');
const weeklyActivityData = document.querySelector(
  '.weekly-activity-from-calendar-data'
);
const oneWeekActivityChart = document.querySelector('.weekly-activity-data');
const dailySteps = document.querySelector('.activity-daily-steps');
const dailyMinutes = document.querySelector('.activity-daily-minutes');
const dailyMiles = document.querySelector('.activity-daily-miles');
const oneWeekSleepChart = document.querySelector('.weekly-sleep-data');
const oneWeekSleepFromCalendar = document.querySelector(
  '.weekly-sleep-from-calendar-data'
);
const weeklyHydrationButton = document.querySelector('.hydration-button');
const sleepButton = document.querySelector('.sleep-button');
const chickenImage = document.querySelector('.graphs-bg-img');
const inputField = document.getElementById('start-date-input');
const dataField = document.querySelector('.data-view');
const sleepFromCalendarButton = document.querySelector('.sleep-button');
const oneWeekHydrationFromCalendar = document.querySelector(
  '.weekly-hydration-from-calendar-data'
);
const hydrationFromCalendarButton = document.querySelector('.hydration-button');
const oneWeekActivityDataFromCalendarButton =
  document.querySelector('.activity-button');
const form = document.querySelector('#form');
const formInput = document.querySelector('.water-intake');
const quote = document.querySelector('#headerQuote');
const addHydration = document.querySelector('.recorded-ounces');
const personalUserName = document.querySelector('.personal-name');
const personalAddress = document.querySelector('.personal-address');
const personalEmail = document.querySelector('.personal-email');
const personalStrideLength = document.querySelector('.personal-stride-length');

/* ~~~~~~~~~~ Motivation Track ~~~~~~~~~~*/

const motivationDropdown = document.querySelector('.motivation-level-dropdown');
const motivationImage = document.querySelector('.motivation-image');
const motivationText = document.querySelector('.motivation-text');
const motivationTitle = document.querySelector('.motivation-card h2');
const motivationAdvice = document.querySelector('.motivation-advice');
const motivationDescription = document.querySelector('.motivation-description');

function displayRandomQuote() {
  quote.innerText = quotes[Math.floor(Math.random() * quotes.length)];
}

/* ~~~~ DOM MANIPULATION FUNCTIONS ~~~~*/

const hideChickenImage = () => {
  chickenImage.classList.remove('graphs-bg-img');
};

const activateButtons = () => {
  sleepFromCalendarButton.disabled = false;
  sleepFromCalendarButton.classList.remove('disable-button');
  hydrationFromCalendarButton.disabled = false;
  hydrationFromCalendarButton.classList.remove('disable-button');
  oneWeekActivityDataFromCalendarButton.disabled = false;
  oneWeekActivityDataFromCalendarButton.classList.remove('disable-button');
};

/* ~~~~ Helper Functions ~~~~*/

const getWeeklyInfo = (wellnessInfo) => {
  oneWeekSleepFromCalendar.innerHTML = '';
  oneWeekHydrationFromCalendar.innerHTML = '';
  weeklyActivityData.innerHTML = '';

  const startDate = new Date(inputField.value + ' 12:00:00');

  let entries = [];
  for (let i = 0; i < 7; i++) {
    let nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + i);
    let date =
      nextDate.getFullYear() +
      '/' +
      ('0' + (nextDate.getMonth() + 1)).slice(-2) +
      '/' +
      ('0' + nextDate.getDate()).slice(-2);
    let entry = wellnessInfo.find(
      (info) => info.date === date && info.userID === currentUser.id
    );
    if (entry) {
      entries.push(entry);
    }
  }
  return entries;
};

const displaySevenDayData = (displayData, chartData, button, buttonClass) => {
  displayData.classList.remove('hidden');
  chartData.classList.remove('hidden');
  button.disabled = true;
  button.classList.add(buttonClass);
};

/* ~~~~~ Display Hydration Data Functions ~~~~~*/

const getWeeklyHydration = () => {
  const waterEntries = getWeeklyInfo(hydration);

  let numOz = waterEntries.reduce((acc, entry) => {
    return acc + entry.numOunces;
  }, 0);

  if (waterEntries.length === 0) {
    return waterEntries;
  }

  let avg = Math.round(numOz / waterEntries.length);

  oneWeekHydrationFromCalendar.innerHTML = '';

  waterEntries.forEach((entry) => {
    oneWeekHydrationFromCalendar.innerHTML += `<p>On ${entry.date} you drank <strong> ${entry.numOunces} </strong> ounces of water</p></p>`;
  });
  oneWeekHydrationFromCalendar.innerHTML += `<p>Your average water consumption was <strong> ${avg} <strong> ounces</p>`;

  createHydrationChart(waterEntries);

  return waterEntries;
};

const displaySevenDayHydration = () => {
  displaySevenDayData(
    oneWeekHydrationChart,
    oneWeekHydrationChart,
    hydrationFromCalendarButton,
    'disable-button'
  );
};

const hideWeeklyHydrationChart = () => {
  oneWeekHydrationChart.classList.add('hidden');
};

/* ~~~~~ Display Random User Data Functions ~~~~~*/

const displayRandomUser = (activity, currentUser) => {
  const allUserStepGoalAvg = getAvgStepGoal(users);
  const userActivity = activity
    .filter((activityEachDay) => activityEachDay.userID === currentUser.id)
    .filter((each) => each.date === currentDate)[0];

  const currentUserMilesWalked = calculateMilesUserWalked(
    userActivity,
    currentUser
  );

  userName.innerHTML = `
  ${currentUser.name}`;

  personalUserName.innerText = `${currentUser.name}`;
  personalAddress.innerText = `${currentUser.address}`;
  personalEmail.innerText = `${currentUser.email}`;
  personalStrideLength.innerText = `${currentUser.strideLength}`;
  stepGoal.innerText = `${currentUser.dailyStepGoal}`;
  milesWalked.innerText = `${currentUserMilesWalked}`;
  allUserAvg.innerText = `${allUserStepGoalAvg}`;
};

function displayFluidConsumedToday(hydration, currentUser, currentDate) {
  const fluidToday = getFluidDrankForSpecificDay(
    hydration,
    currentUser.id,
    currentDate
  );

  hydrationInfo.innerHTML += `<p>You drank <strong>${fluidToday}</strong> ounces yesterday!</p>
  <p>How many ounces will you drink today? </p>
  <p>Record them in the field below:</p>`;
}

let totalWaterIntake = 0;

function displayNewHydrationEntry(response) {
  totalWaterIntake += parseInt(response.numOunces);

  addHydration.innerHTML = `<p>Your submission of <strong>${totalWaterIntake}</strong> ounces has been recorded. Great job!</p> `;
}

/* ~~~~~ Display Sleep Data Functions ~~~~~*/

function displayDailySleep(sleep, currentUser, sleepCurrentDate) {
  const currentDayEntry = getHoursByDay(
    sleep,
    currentUser.id,
    sleepCurrentDate
  );

  dailySleep.innerHTML = `You slept <strong>${currentDayEntry} </strong> hours last night.`;
}

function displayAverageSleep(sleep, currentUser) {
  averageSleep.innerHTML = `You average <strong> ${getAvgSleep(
    sleep,
    currentUser.id
  )}</strong> hours of sleep each night.`;
  sleepQuality.innerHTML = `You have a sleep quality rating of
  <strong>${getAvgQuality(sleep, currentUser.id)} </strong>.`;
}

const getWeeklySleep = () => {
  const sleepHourEntries = getWeeklyInfo(sleep);
  let hoursSlept = sleepHourEntries.reduce((acc, entry) => {
    return acc + entry.hoursSlept;
  }, 0);

  let sleepQuality = sleepHourEntries.reduce((acc, entry) => {
    return acc + entry.sleepQuality;
  }, 0);

  if (sleepHourEntries.length === 0) {
    return sleepHourEntries;
  }

  let avgHoursSlept = Math.round(hoursSlept / sleepHourEntries.length);
  let avgSleepQuality = Math.round(sleepQuality / sleepHourEntries.length);

  sleepHourEntries.forEach((entry) => {
    oneWeekSleepFromCalendar.innerHTML += `<p>On ${entry.date}, you slept ${entry.hoursSlept} hours and your sleep quality was rated: ${entry.sleepQuality}</p>`;
  });
  oneWeekSleepFromCalendar.innerHTML += `<p>Your average hours slept was ${avgHoursSlept} hours</p>`;
  oneWeekSleepFromCalendar.innerHTML += `<p>Your average sleep quality has a rating of ${avgSleepQuality}</p>`;

  createSleepChart(sleepHourEntries);

  return sleepHourEntries;
};

const displaySevenDaySleep = () => {
  displaySevenDayData(
    oneWeekSleepFromCalendar,
    oneWeekSleepChart,
    sleepFromCalendarButton,
    'disable-button'
  );
};

const hideWeeklySleepChart = () => {
  oneWeekSleepChart.classList.add('hidden');
};

/* ~~~~~ Display Activity Data Functions ~~~~~*/

function displayWeeklyStepCount(currentUser) {
  const activityEntries = getWeeklyInfo(activity);

  activityEntries.forEach((entry) => {
    if (entry.numSteps >= currentUser.dailyStepGoal) {
      weeklyActivityData.innerHTML += `<p>On ${entry.date}, you walked ${entry.numSteps} of steps. You met your goal.  Take a nap!
      </p>  `;
    } else {
      weeklyActivityData.innerHTML += `<p>On ${entry.date}, you walked ${entry.numSteps} steps. You have not met your goal.  STEP IT UP!
      </p> `;
    }
  });
  createActivityChart(activityEntries, currentUser);

  return activityEntries;
}

function displayActivity(activityData, currentUser, activityCurrentDate) {
  dailySteps.innerHTML = `You took <strong>${stepsPerDay(
    activityData,
    currentUser,
    activityCurrentDate
  )}</strong> steps today!`;
  dailyMiles.innerHTML = `You have walked <strong>${milesPerDay(
    activityData,
    currentUser,
    activityCurrentDate
  )} </strong> miles today!`;
  dailyMinutes.innerHTML = `You were active for <strong>${activeMinutesPerDay(
    activityData,
    currentUser,
    activityCurrentDate
  )}</strong> minutes today!`;
}

const displaySevenDayActivity = () => {
  displaySevenDayData(
    weeklyActivityData,
    oneWeekActivityChart,
    oneWeekActivityDataFromCalendarButton,
    'disable-button'
  );
};

const hideWeeklyActivityChart = () => {
  oneWeekActivityChart.classList.add('hidden');
};

const motivationLevels = {
  level1: {
    title: 'Not Motivated',
    description: 'Fried',
    descriptionText: 'Feeling overwhelmed',
    image: './images/L1a.jpg',
    advice: 'Prioritize self-care. Spend some time outside.',
  },
  level2: {
    title: 'Slightly Motivated',
    description: 'Fluttering Feathers.',
    descriptionText: 'Starting to feel motivated.',
    image: './images/L2.jpg',
    advice: 'Celebrate the small wins!',
  },
  level3: {
    title: 'Moderately Motivated',
    description: 'Cluck and Strut!',
    descriptionText: 'Stepping up to the challenge.',
    image: './images/L3.jpg',
    advice: 'Stay focused and surround yourself with positive influences!',
  },
  level4: {
    title: 'Highly Motivated',
    description: 'Cock-a-doodle Can-Do!',
    descriptionText: 'Feeling eggs-cited and energized!',
    image: './images/L4.jpg',
    advice: 'Embrace challenges and maintain a can-do attitude.',
  },
  level5: {
    title: 'Extremely Motivated',
    description: 'Hard-Boiled Dynamo!',
    descriptionText: 'Congratulations! Maximum motivation achieved!',
    image: './images/L5.jpg',
    advice: 'Keep pushing your limits and inspiring others!',
  },
};

const setMotivationLevel = (level) => {
  let motivationLevel = motivationLevels[level];
  if (motivationLevel) {
    motivationTitle.innerText = motivationLevel.title;
    motivationDescription.innerText = motivationLevel.description;
    motivationText.innerHTML = motivationLevel.descriptionText;
    motivationImage.src = motivationLevel.image;
    motivationAdvice.innerHTML = motivationLevel.advice;
    motivationDropdown.value = level;
  } else {
    motivationTitle.innerText = 'Get Motivated!';
    motivationDescription.innerText = 'Choose your level';
    motivationText.innerHTML =
      'The only limit to your greatness is the extent of your determination.';
    motivationImage.src = './images/default.jpg';
    motivationImage.alt = '';
    motivationAdvice.innerHTML = '';
    motivationDropdown.value = '';
  }
};

motivationDropdown.addEventListener('change', (event) => {
  setMotivationLevel(event.target.value);
});

/* ~~~~~~~~~~ EXPORTS ~~~~~~~~~~*/

export {
  displayRandomUser,
  displayDailySleep,
  displayAverageSleep,
  displayFluidConsumedToday,
  weeklyHydrationButton,
  sleepButton,
  displayWeeklyStepCount,
  hideChickenImage,
  getWeeklySleep,
  inputField,
  displaySevenDaySleep,
  dataField,
  sleepFromCalendarButton,
  activateButtons,
  getWeeklyHydration,
  getWeeklyInfo,
  displaySevenDayHydration,
  hydrationFromCalendarButton,
  oneWeekActivityDataFromCalendarButton,
  displayActivity,
  displaySevenDayActivity,
  displayRandomQuote,
  form,
  hydrationInfo,
  hideWeeklyHydrationChart,
  hideWeeklyActivityChart,
  hideWeeklySleepChart,
  displayNewHydrationEntry,
  setMotivationLevel,
};
