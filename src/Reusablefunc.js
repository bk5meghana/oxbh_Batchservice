const dotenv= require('dotenv')
const DAO = require("./apicall");
const kafkaConfig = require("./kafka.config");

dotenv.config();

const unifiedApiEndpoint = process.env.UNIFIED_API_LINK;

module.exports={
    async  LoginReminder(){

        console.log("Inside LoginReminderTrigger===========================================================================================")
        const query = `
        query GetInActiveLoggedInUsers {
            getInActiveLoggedInUsers {
              created_dt
              member_id
              patient_id
              date_difference
            }
          }`;
    
        const variables = {
            
        };
        console.log("LoginReminderTrigger query: -> ", query);
        //let response = (await fetchData(query, variables));
        let response = (await DAO.retryFetchData(query, variables));
        const users=response.getInActiveLoggedInUsers
        console.log("======return from API call of LoginReminderTrigger",users);
        users.forEach(async function(obj) {
            console.log("obj===>",obj);
            const rt= await DAO.constructOutputData(obj.member_id,'REMINDER_EVENT');
            console.log("return data====>",rt);
            await kafkaConfig.pushDataToMessageBus(rt);
    
        });
        //const inputData= response.get_member[0];  
        return response;
    }
}