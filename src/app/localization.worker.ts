/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const localizedData = processLocalizationData(data); // Mock function
  postMessage(localizedData);
});
function processLocalizationData(data: any) {
  // Simulate a heavy computation task
  return { localizedStrings: ['string1', 'string2'], lang: 'en-US' };
}