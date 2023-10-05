/* ~~~~~~~~~~ IMPORTS ~~~~~~~~~~*/

import './css/normalize.css';
import './css/styles.css';
import './images/FitChicks-Title-500.png';
import './images/default.jpg';
import './images/L1a.jpg';
import './images/L1b.jpg';
import './images/L2.jpg';
import './images/L3.jpg';
import './images/L4.jpg';
import './images/L5.jpg';
import userInfoImage from './images/user-info-image.jpg';
import './images/FitChicks_scene_sm.png';
import './images/hydration.png';
import './images/sleep.png';
import './images/activity.png';
import { fetchApiData, postSavedHydration } from './apiCalls';
import {
  displayRandomUser,
  displayDailySleep,
  displayAverageSleep,
  displayFluidConsumedToday,
  weeklyHydrationButton,
  sleepButton,
  displayActivity,
  displayWeeklyStepCount,
  hideChickenImage,
  getWeeklySleep,
  inputField,
  displaySevenDaySleep,
  dataField,
  sleepFromCalendarButton,
  activateButtons,
  getWeeklyHydration,
  displaySevenDayHydration,
  hydrationFromCalendarButton,
  oneWeekActivityDataFromCalendarButton,
  displaySevenDayActivity,
  displayRandomQuote,
  hideWeeklyHydrationChart,
  hideWeeklyActivityChart,
  hideWeeklySleepChart,
  displayNewHydrationEntry,
  setMotivationLevel,
} from './domUpdates';

import {
  getRandomUser,
  getAvgSleep,
  getAvgQuality,
  stepsPerDay,
  activeMinutesPerDay,
  findCurrentDate,
  findCurrentDateInRange,
} from './utils';

/* ~~~~~~~~~~ CHARTS ~~~~~~~~~~*/

import {
  Chart,
  BarController,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
} from 'chart.js';

Chart.register(
  BarController,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  Title,
  Legend
);

/* ~~~~~~~~~~ DATA MODEL ~~~~~~~~~~*/

let users,
  hydration,
  sleep,
  activity,
  currentUser,
  currentDate,
  activityCurrentDate,
  sleepCurrentDate;

/* ~~~~~~~~~~ EVENT LISTENERS ~~~~~~~~~~*/

document.addEventListener('DOMContentLoaded', function() {
  const userImageElement = document.getElementById("user-info-image");
  if (userImageElement) {
      userImageElement.src = userInfoImage;
  }
});

window.addEventListener('load', function () {
  Promise.all([
    fetchApiData('users'),
    fetchApiData('hydration'),
    fetchApiData('sleep'),
    fetchApiData('activity'),
  ])
    .then((data) => {
      users = data[0].users;
      hydration = data[1].hydrationData;
      sleep = data[2].sleepData;
      activity = data[3].activityData;
      initializeApp();
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
});

/* ~~~~ Helper Functions ~~~~*/
const handleOnClicks = (
  hideChartOne,
  hideChartTwo,
  getData,
  displaySevenDayData,
  buttonOne,
  buttonTwo
) => {
  hideChickenImage();
  hideChartOne();
  hideChartTwo();
  getData();
  displaySevenDayData();
  if (buttonOne.disabled === true) {
    buttonOne.classList.remove('disable-button');
    buttonOne.disabled = false;
  }
  if (buttonTwo.disabled === true) {
    buttonTwo.classList.remove('disable-button');
    buttonTwo.disabled = false;
  }
};

const onClickSleep = () => {
  handleOnClicks(
    hideWeeklyHydrationChart,
    hideWeeklyActivityChart,
    getWeeklySleep,
    displaySevenDaySleep,
    hydrationFromCalendarButton,
    oneWeekActivityDataFromCalendarButton
  );
};

const onClickHydration = () => {
  handleOnClicks(
    hideWeeklyActivityChart,
    hideWeeklySleepChart,
    getWeeklyHydration,
    displaySevenDayHydration,
    sleepFromCalendarButton,
    oneWeekActivityDataFromCalendarButton
  );
};

const onClickActivity = () => {
  handleOnClicks(
    hideWeeklyHydrationChart,
    hideWeeklySleepChart,
    () => displayWeeklyStepCount(currentUser),
    displaySevenDayActivity,
    sleepFromCalendarButton,
    hydrationFromCalendarButton
  );
};

const onChangeInputField = () => {
  activateButtons();
};

weeklyHydrationButton.addEventListener('click', onClickHydration);
sleepFromCalendarButton.addEventListener('click', onClickSleep);
hydrationFromCalendarButton.addEventListener('click', onClickHydration);
oneWeekActivityDataFromCalendarButton.addEventListener(
  'click',
  onClickActivity
);
inputField.addEventListener('change', onChangeInputField);

/* ~~~~~~~~~~ FUNCTIONS ~~~~~~~~~~*/

const initializeApp = () => {
  currentUser = getRandomUser(users);
  sleepCurrentDate = findCurrentDateInRange(currentUser.id, sleep, activity);
  activityCurrentDate = findCurrentDateInRange(currentUser.id, sleep, activity);
  currentDate = findCurrentDate(currentUser.id, hydration, sleep, activity);
  displayRandomUser(activity, currentUser);
  displayFluidConsumedToday(hydration, currentUser, currentDate);
  displayDailySleep(sleep, currentUser, sleepCurrentDate);
  displayAverageSleep(sleep, currentUser, sleepCurrentDate);
  displayActivity(activity, currentUser, activityCurrentDate);
  stepsPerDay(activity, currentUser, currentDate);
  activeMinutesPerDay(activity, currentUser, activityCurrentDate);
  displayWeeklyStepCount(activity, currentUser, activityCurrentDate);
  displayRandomQuote();
  setMotivationLevel('level');

  const formElement = document
    .getElementById('form')
    .addEventListener('submit', function (event) {
      console.log('Form submitted!');
      event.preventDefault();

      const formData = new FormData(event.target);

      const postUserInput = {
        userID: currentUser.id,
        date: '2023/07/02',
        numOunces: formData.get('waterIntake'),
      };

      console.log('Form submitted!');

      postSavedHydration(postUserInput)
        .then((json) => {
          displayNewHydrationEntry(json);
          console.log(json);
        })
        .catch((err) => console.error(`Error at: ${err}`));

      event.target.reset();
    });
};

export {
  currentDate,
  activity,
  users,
  hydration,
  currentUser,
  sleep,
  sleepCurrentDate,
  activityCurrentDate,
};
