export default function generateReferenceId() {
    const tanzaniaOptions = { timeZone: "Africa/Dar_es_Salaam" };
    const timestamp = new Date().toLocaleString("en-US", tanzaniaOptions);
    const timestampNumeric = timestamp.replace(/\D/g, "");
    const randomIdentifier = generateRandomIdentifier(
        8 - timestampNumeric.length // Adjust the length based on "WP" length
    );
    const referenceId = `WP${timestampNumeric}${randomIdentifier}`;
    return referenceId;
}

function generateRandomIdentifier(length: number) {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numLetters = Math.floor(length / 2);
    const numNumbers = length - numLetters;
    let randomIdentifier = "";
    for (let i = 0; i < numLetters; i++) {
        const randomIndex: number = Math.floor(Math.random() * 26);
        randomIdentifier += characters.charAt(randomIndex + 10);
    }
    for (let i = 0; i < numNumbers; i++) {
        const randomIndex: number = Math.floor(Math.random() * 10);
        randomIdentifier += characters.charAt(randomIndex);
    }
    randomIdentifier = randomIdentifier
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
    return randomIdentifier;
}
