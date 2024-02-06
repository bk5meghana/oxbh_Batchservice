const dotenv = require('dotenv'); 
const { v4: uuidv4 } = require('uuid');
dotenv.config();
const unifiedApiEndpoint = process.env.UNIFIED_API_LINK;

module.exports = {
    async retryFetchData(query, variables, maxretry = 3) {
        let retry = 0;
        while (retry < maxretry) {
            try {
                let response = (await fetchData(query, variables));
                if (response == undefined) {
                    response = (await fetchData(query, variables));
                }
                return response;


            }
            catch (error) {
                console.log("error in retry fetch data ", error);
                retry++;
            }
        }
        console.log("Max retry reached:", retry)
    },
    async constructOutputData(member_id, touchpoint, details = "") {
        let py = {}
        if (details != "") {
            py = details;
        }
        return new Promise(async (resolve, reject) => {
            try {
                let datenow = new Date();
                var currentdate = datenow.toISOString().replace("T", " ").substring(0, 19);
                const guid = uuidv4();
                var obj = {
                    "messages": [
                        {
                            type: touchpoint,
                            entity_id: [{
                                "type": "member",
                                "value": member_id
                            }],
                            payload: py,
                            date: currentdate,
                            originator: ['BATCH_SERVICE'],
                            traceability_id: guid
                        }
                    ]
                };
                console.log("current date and guid in constructOutputData===>", currentdate, " ", guid, "obj==>", obj);
                resolve(obj);
            } catch (err) {
                console.error("Error generating output in constructoutputdata:", err);
                reject({

                });
            }
        });

    },

}
async function fetchData(query, variables) {
    try {
        console.log("Inside fetchData===========================================================================================")
        const requestBody = {
            query,
            variables,
        };
        console.log("query================>", query)
        console.log("variables=============", variables)
        console.log("unifiedApiEndpoint=============", unifiedApiEndpoint)
        const response = await fetch(unifiedApiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok)
            console.log("Error coccuered at response.ok", response.ok)

        const data = await response.json();
        console.log('data fetched from Unified API ==============>', data);
        if (data.errors) {
            console.log("Error coccuered at data.errors", data.errors)
        }

        return data.data;
    } catch (error) {
        console.log("Error in connecting to unified Api:", error);
    }

}