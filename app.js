document.addEventListener('DOMContentLoaded', () => {
    // Function to handle form submission and send to webhook
    async function handleFormSubmit(event, webhookUrl, formId) {
        event.preventDefault();  // Prevent form from refreshing the page

        const formData = new FormData(event.target);  // Grab all form data
        const dataObject = {};

        formData.forEach((value, key) => {
            dataObject[key] = value;  // Convert form data to a JSON object
        });

        // Build the message for Discord webhook to show submitted answers
        let messageContent = `**${formId} Application Submitted!**\n\n`;

        // Add each question and answer to the message body
        Object.keys(dataObject).forEach((key) => {
            messageContent += `**${key}:** ${dataObject[key]}\n`; // Display the field and its value
        });

        const body = JSON.stringify({
            username: dataObject.applicant,  // User's Discord name from the form
            content: messageContent,         // All the submitted answers
        });

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            if (response.ok) {
                document.getElementById('responseMessage').innerHTML = `Your ${formId} Application was submitted successfully!`;
            } else {
                throw new Error('Failed to submit application');
            }
        } catch (error) {
            console.error(error);
            document.getElementById('responseMessage').innerHTML = 'There was an error submitting your application. Please try again later.';
        }
    }

    // Attach event listeners to each form
    const discordDevForm = document.getElementById('discordDevForm');
    const gameDevForm = document.getElementById('gameDevForm');
    const staffForm = document.getElementById('staffForm');

    // Webhook URLs for each form
    const discordDevWebhook = 'https://discord.com/api/webhooks/1362237951085510856/3dA6LvEqh6YnY-PFkrLxgG5FCAMwZiOrP6sOkURZSxiig983u_G5DClRX6Yl0UJZYSDZ';
    const gameDevWebhook = 'https://discord.com/api/webhooks/1362237811041763328/tCM1liYbPKnkFTFqPtEUOG0VMht_2s0cO6QbhPVY78WeCNlrwieh9vQvhXFEGwVmWbYm';
    const staffWebhook = 'https://discord.com/api/webhooks/1362237486813941761/hH7CfZ-J4oaMJcPqN9TxbAnowBPG2GFlDdKIQ5AiZ9eHQF_vWyBDvpAb8usINzewa3Dj';

    if (discordDevForm) {
        discordDevForm.addEventListener('submit', (event) => {
            handleFormSubmit(event, discordDevWebhook, 'Discord Developer');
        });
    }

    if (gameDevForm) {
        gameDevForm.addEventListener('submit', (event) => {
            handleFormSubmit(event, gameDevWebhook, 'Game Developer');
        });
    }

    if (staffForm) {
        staffForm.addEventListener('submit', (event) => {
            handleFormSubmit(event, staffWebhook, 'Staff');
        });
    }
});
