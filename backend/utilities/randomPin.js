export default function createRandom6DigitPin() {
    let pin = '';
    for (let i = 0; i < 6; i++) {
        pin = `${pin}${Math.floor(Math.random() * 10)}`;
    }
    return pin;
}