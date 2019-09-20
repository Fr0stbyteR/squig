import { Squig } from "./Squig";

export declare const window: Window & {
    squig: Squig;
};

document.addEventListener("DOMContentLoaded", () => {
    window.squig = new Squig();
});
