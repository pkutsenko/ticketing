export default function Loading() {
    return 'Loading...'
}

const triggerInputEvent = () => {
    const inputElement = document.getElementById('yourInputElementId')!; // Replace 'yourInputElementId' with the actual ID of your input element
    const inputEvent = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(inputEvent);

    var textarea = $0!;

    // Simulate the paste action
    textarea.focus();
    document.execCommand("paste", undefined, '/');
};
