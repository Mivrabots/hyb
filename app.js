document.addEventListener('DOMContentLoaded', () => {
    // Function to handle form submission and send to webhook
    async function handleFormSubmit(event, webhookUrl, formId) {
        event.preventDefault();  // Prevent form from refreshing the page

        const formData = new FormData(event.target);  // Grab all form data
        const dataObject = {};

        formData.forEach((value, key) => {
            dataObject[key] = value;  // Convert form data to a JSON object
        });

        // Build embed message for Discord webhook
        const embed = {
            title: `${formId} Application Submitted`,
            fields: [],
        };

        // Add applicant and reason to the embed
        embed.fields.push({
            name: "Applicant",
            value: dataObject.applicant || 'Not provided',
            inline: false,
        });

        embed.fields.push({
            name: "Reason for Application",
            value: dataObject.reason || 'Not provided',
            inline: false,
        });

        // Dynamically handle questions from the form
        const formElements = event.target.elements;
        for (let i = 0; i < formElements.length; i++) {
            const field = formElements[i];
            if (field.name.startsWith("question") && field.value.trim()) {  // Only process question fields with an answer
                embed.fields.push({
                    name: field.previousElementSibling.innerText || `Question ${i + 1}`,  // Use the label of the question
                    value: field.value,
                    inline: false,
                });
            }
        }

        // Sending data to Discord
        const body = JSON.stringify({
            username: dataObject.applicant || 'Unknown',  // User's Discord name from the form
            content: `${formId} Application Submitted!`,
            embeds: [embed],
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
