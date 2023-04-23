export function randomFormArray(array: Array<string>) {
  return array[Math.floor(Math.random() * array.length)];
}

export function isMobileDevice() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}

const canvasElement = document.querySelector("canvas");
export let hammerManager: HammerManager | null;
if (canvasElement) {
  hammerManager = new Hammer.Manager(canvasElement);
}
