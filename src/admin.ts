import { SquigAdmin } from "./SquigAdmin";

declare const window: Window & {
    squig: SquigAdmin;
};

document.addEventListener("DOMContentLoaded", () => {
    window.squig = new SquigAdmin();
});
