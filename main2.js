function getSelected() {
    let courseSelected = document.querySelector("input[name='course']:checked").value;
    let coSelected = document.querySelector("input[name='CO']:checked").value;

    let path = `./${courseSelected}/CO-${coSelected}.ini`;
    let question = document.getElementById('query').value; // This will be the main question to search for

    let answerBox = document.getElementById("answer");
    let answers = []; // Array to hold all found answers

    // Fetch the INI file
    fetch(path)
        .then(response => response.text())
        .then(data => {
            const config = parseIni(data);  // Parse the INI content
            // Loop through all sections in the config
            for (let section in config) {
                // Check if the section name contains the question (case-insensitive)
                if (section.toLowerCase().includes(question.toLowerCase()) && question.trim() !== "") {

                    console.log(section);
                    answers.push(section + "\n" + config[section].answer + "\n");
                }
            }

            if (answers.length > 0) {
                answerBox.value = answers.join("\n");  // Display all answers joined by newlines
            } else {
                answerBox.value = "No matching section or answer found.";  // Default message if no match
            }
        });
}

// Function to parse INI data
function parseIni(text) {
    const result = {};
    let section = null;

    const lines = text.split(/\r?\n/);
    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith(';') || line.startsWith('#')) continue;

        if (line.startsWith('[') && line.endsWith(']')) {
            section = line.slice(1, -1);
            result[section] = {};
        } else if (section) {
            const [key, ...value] = line.split('=');
            result[section][key.trim()] = value.join('=').trim();
        }
    }

    return result;
}


document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".main-div #query").addEventListener("focusin", getSelected);
    document.getElementById('query').addEventListener('input', getSelected);
});


document.addEventListener("DOMContentLoaded", () => {
    const radios = document.querySelectorAll("input[name='course'], input[name='CO']");
    radios.forEach((radio) => {
        radio.addEventListener("change", getSelected);
    });
});