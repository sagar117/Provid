require('dotenv').config();
const apiKey = process.env.apiKey;

const { Configuration, OpenAIApi } = require("openai");
      
       
       async function fetchChatCompletion(fileContent) {
            const data = JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "user", content: `Feature Name: ${featureName}\nObjective/Purpose: ${objective}\nUser Interface (UI) Requirements: ${uiRequirements}\nFunctionality: ${functionality}\nData Requirements: ${dataRequirements}\nDependencies: ${dependencies}\nPlatform/Technology: ${platform}\nConstraints/Limitations: ${constraints}\nExpected Output/Result: ${outputResult}\n +Instructions: ${instructions}`+ fileContent }
                ],
            });

            const options = {
                hostname: 'api.openai.com',
                path: '/v1/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                    'Authorization': `Bearer ${apiKey}`,
                },
            };

            return new Promise((resolve, reject) => {
                const req = https.request(options, (res) => {
                    let responseData = '';

                    res.on('data', (chunk) => {
                        responseData += chunk;
                    });

                    res.on('end', () => {
                        const parsedData = JSON.parse(responseData);
                        if (parsedData && parsedData.choices && parsedData.choices.length > 0) {
                            resolve(parsedData.choices[0].message);
                        } else {
                            reject(new Error("Invalid response from OpenAI API"));
                        }
                    });
                });

                req.on('error', (error) => {
                    reject(error);
                });

                req.write(data);
                req.end();
            });
        }