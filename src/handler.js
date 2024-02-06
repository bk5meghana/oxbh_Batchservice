"use strict";
const kafkaConfig = require("./kafka.config");
const fs = require("fs");
const { Console } = require("console");
const func = require("./Reusablefunc");
//const workbook = new excel.Workbook();
const dotenv = require("dotenv");
dotenv.config();


exports.sendepisodereminders = async (event) => {
  console.log('event==============>', event);
  let messages=[1,2,3];
  try {
    
    console.log("Inside Send reminders");
    const lgreminderdata= await func.LoginReminder();
    console.log("lgreminder=====>",lgreminderdata);
    //await kafkaConfig.pushDataToMessageBus(messages[0]);
    return {
      statusCode: 200,
      body: JSON.stringify({ messages }),
    };
   
  } catch (error) {
    const error_msg= {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error in Validation",
        error: error.message,
      }),
    };
    await kafkaConfig.pushDataToMessageBus(error_msg)
    return error_msg
  }
};
