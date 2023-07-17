/* ~~~~~ Days-JS ~~~~~*/

// import dayjs from 'dayjs';
// import calendar from 'dayjs/plugin/calendar';
// dayjs.extend(calendar);
// dayjs.extend(require('dayjs/plugin/utc'));

import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';

dayjs.extend(calendar);
// dayjs.extend(utc)

/* ~~~~~ Get Random User ~~~~~*/
function getRandomUser(users) {
  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex];
}

/* ~~~~~ Get User By ID ~~~~~*/

function getUserById(users, id) {
  return users.find((user) => user.id === id);
}

// if API call gives undefined/gives back just an array
// on line 2, remove 'users' from
// userData.users

/* ~~~~~ Get Average Step Goal ~~~~~*/

const getAvgStepGoal = (users) => {
  if (!users) {
    return undefined;
  }

  let counter = 0;
  users.forEach((user) => (counter += user.dailyStepGoal));
  return Math.round(counter / users.length);
};

/* ~~~~~ Get Average Fluid ~~~~~*/

// function getAvgFluidConsumed(hydrationData, id) {
//   const days = hydrationData.reduce((days, user) => {
//     if (user.userID === id) {
//       days.push(user.date);
//     }
//     return days;
//   }, []);

//   const fluidConsumed = hydrationData.reduce((fluidOunces, user) => {
//     if (user.userID === id) {
//       fluidOunces += user.numOunces;
//     }
//     return fluidOunces;
//   }, 0);

//   return Math.round(fluidConsumed / days.length);
// }

// sleep quality all time - water for all time
function getAvgFluidForAllTime(hydrationData, id) {
  const hydrationEntries = hydrationData.filter((entry) => entry.userID === id);
  // console.log('HYDRATIONENTREIS', hydrationEntries)
  const avgHydration = hydrationEntries.reduce((acc, user) => {
    return (acc += user.numOunces);
  }, 0);
  return Math.round(avgHydration / hydrationEntries.length);
}

// function getFluidConsumedOnSpecificDay(hydrationData, day, id) {
//   const user = hydrationData.find(
//     (user) => user.userID === id && user.date === day
//   );

//   if (!user) {
//     return 0;
//   }
//   return user.numOunces;
// }
//DO THIS NEXT
// hours per day - oz per day
function getFluidDrankForSpecificDay(hydrationData, id, date) {
  const hydrationEntries = hydrationData.filter((entry) => entry.userID === id);
  const dailyEntry = hydrationEntries.find((entry) => entry.date === date);

  return dailyEntry.numOunces;
}

// function getFluidOuncesPerDay(hydrationData, day, id) {
//   let invidualUser = []

//   hydrationData.filter(user => {
//     if (user.userID = id && dayjs(user.date).isSame(day, 'day')) {
//     invidualUser.push(user)
//     }

//   })
//   const days = hydrationData.reduce((allDays, user) => {
//   if (!allDays[user.date]) {
//   allDays[user.date] = 0
//   }
//   allDays[user.date] += user.numOunces
//   return allDays;
//   }, {});

//  // console.log(days)

//   const sortedDays = Object.entries(days)
//   // sortedDays = [['date', oz], ['date', oz]]
//   // .sort(([dateA], [dateB]) => dayjs(dateA).diff(dayjs(dateB)))
//   // * the above works too but I'm more comfortable with the the lines below *
//   .sort((a, b) => dayjs(a[0]).diff(dayjs(b[0]), 'day'))
//   .slice(0, 7)
//   .reduce((sevenDays, [date, ounces]) => {
//     sevenDays[date] = ounces;
//     return sevenDays;
//   }, {});
//  // console.log('sortedDays: ', sortedDays)
//   return sortedDays
// }

// Weekly Sleep Function for 7 most current days
function getWeeklyFluid(hydrationData, userID) {
  const hydrationEntries = hydrationData.filter(
    (entry) => entry.userID === userID
  );
  const lastIndex = hydrationEntries.length - 1;
  const weeklyHydration = hydrationEntries.slice(lastIndex - 6, lastIndex + 1);
  const weeklyHydrationData = weeklyHydration.map((entry) => ({
    date: entry.date,
    numOunces: entry.numOunces + ' ounces drank ',
  }));
  return weeklyHydrationData;
}

/* ~~~~~ Sleep ~~~~~*/

function getAvgSleep(sleepData, userID) {
  const sleepEntries = sleepData.filter((entry) => entry.userID === userID);
  const avgSleep = sleepEntries.reduce((acc, user) => {
    return (acc += user.hoursSlept);
  }, 0);
  return Math.round((avgSleep / sleepEntries.length) * 10) / 10;
}

function getAvgQuality(sleepData, userID) {
  const sleepEntries = sleepData.filter((entry) => entry.userID === userID);
  const avgQuality = sleepEntries.reduce((acc, user) => {
    return (acc += user.sleepQuality);
  }, 0);
  return Math.round((avgQuality / sleepEntries.length) * 10) / 10;
}

function getHoursByDay(sleepData, id, date) {
  // console.log('getHoursByDay:', sleepData, id, date);
  const sleepEntries = sleepData.filter((entry) => entry.userID === id);
  // console.log('sleepEntries:', sleepEntries);
  const dailyEntry = sleepEntries.find((entry) => entry.date === date);

  return dailyEntry.hoursSlept;
}

function getQualityByDay(sleepData, userID, date) {
  // console.log('getQualityByDay:', userID);
  const sleepEntries = sleepData.filter((entry) => entry.userID === userID);
  const dailyEntry = sleepEntries.find((entry) => entry.date === date);
  return dailyEntry.sleepQuality;
}

function getWeekSleep(sleepData, userID, startDate) {
  const sleepEntries = sleepData.filter((entry) => entry.userID === userID);
  const indexOfCurrentDayEntry = sleepEntries.findIndex(
    (entry) => entry.date === startDate
  );
  let weeklySleep = [];
  for (let i = indexOfCurrentDayEntry; i > indexOfCurrentDayEntry - 7; i--) {
    if (i >= 0 && sleepEntries[i]) {
      weeklySleep.push(sleepEntries[i]);
    }
  }
  const weeklySleepData = weeklySleep.map((entry) => {
    return {
      date: entry.date,
      hoursSlept: entry.hoursSlept + ' hours slept',
      sleepQuality: ' a sleep quality rating of ' + entry.sleepQuality,
    };
  });
  return weeklySleepData;
}

/* ~~~~~ Activity ~~~~~*/

// Judy's functions
// function getMilesWalked(userData, activityData, id, day) {
//   const user = userData.find((user) => user.id === id);

//   const activity = activityData.find(
//     (activity) => activity.userID === id && activity.date === day

//first 3 functions are making sure that the userID, date, and data for the random user match - may be redundant based on Parvin's work on the Promise

// const findUserActivityData = (activityData, userID) => activityData
//   .filter(entry => entry.userID === userID); // passing in random user id

// const findUserDailyData = (activityEntries, date) => activityEntries
//   .find(entry => entry.date === date); //looking for last date of activity and making sure it matches with our random user's date

// const findUserData = (userData, userID) => userData
//   .find(user => user.id === userID); // this I think is redundant based on getRandomUser

const returnDailySteps = (activityData, userID, date) => {
  const activityEntries = activityData.filter(
    (entry) => entry.userID === userID
  );
  console.log('ACTIVITY ENTRIES', activityEntries);
  const avgActivity = activityEntries.reduce((acc, user) => {
    return (acc += user.hoursActivity);
  }, 0);
  return Math.round((avgActivity / activityEntries.length) * 10) / 10;

  // const userActivityData = findUserActivityData(activityData, userID);
  // const dailyData = findUserDailyData(userActivityData, date);
  // return dailyData.numSteps;
};



// function getFluidDrankForSpecificDay(hydrationData, id, date) {
//   const hydrationEntries = hydrationData.filter((entry) => entry.userID === id);
//   const dailyEntry = hydrationEntries.find((entry) => entry.date === date);

//   return dailyEntry.numOunces;
// }

// **********

const returnWeeklySteps = (activityData, userID, startDate) => {
  const userActivityData = findUserActivityData(activityData, userID);
  const startDataIndex = userActivityData.findIndex(
    (entry) => entry.date === startDate
  );
  const weeklyData = userActivityData
    .slice(startDataIndex - 6, startDataIndex + 1)
    .reverse();

  return weeklyData.map((entry) => ({
    date: entry.date,
    steps: entry.numSteps + ' steps taken',
  }));
};

const returnMiles = (activityData, userData, userID, date) => {
  const userInfo = findUserData(userData, userID);
  const userActivityData = findUserActivityData(activityData, userID);
  const dailyData = findUserDailyData(userActivityData, date);

  return Math.round((userInfo.strideLength * dailyData.numSteps) / 5280);
};

const returnMinutesActive = (activityData, userID, date) => {
  const userActivityData = findUserActivityData(activityData, userID);
  const dailyData = findUserDailyData(userActivityData, date);

  return dailyData.minutesActive;
};

const returnMetStepGoal = (activityData, userData, userID, date) => {
  const userInfo = findUserData(userData, userID);
  const userActivityData = findUserActivityData(activityData, userID);
  const dailyData = findUserDailyData(userActivityData, date);

  return dailyData.numSteps >= userInfo.dailyStepGoal;
};

/* ~~~~~ Exports ~~~~~*/

export {
  getRandomUser,
  getUserById,
  getAvgStepGoal,
  // getAvgFluidForAllTime, DO WE EVEN NEED THIS
  getFluidDrankForSpecificDay,
  getWeeklyFluid,
  // getFluidPerWeek,
  // getFluidOuncesPerDay,
  // getAvgFluidConsumed,
  // getFluidConsumedOnSpecificDay,
  getAvgSleep,
  getAvgQuality,
  getHoursByDay,
  getQualityByDay,
  //getSleepDataByDate,
  getWeekSleep,
  returnDailySteps,
};
