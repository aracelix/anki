// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

/* eslint
@typescript-eslint/no-non-null-assertion: "off",
 */

import type { Editable } from "./editable";
import type { Codable } from "./codable";

import { updateActiveButtons } from "./toolbar";
import { bridgeCommand } from "./lib";
import { caretToEnd } from "./helpers";
import { onInput, onKey, onKeyUp } from "./inputHandlers";
import { onFocus, onBlur } from "./focusHandlers";

function onPaste(evt: ClipboardEvent): void {
    bridgeCommand("paste");
    evt.preventDefault();
}

function onCutOrCopy(): void {
    bridgeCommand("cutOrCopy");
}

export class EditingArea extends HTMLDivElement {
    editable: Editable;
    codable: Codable;
    baseStyle: HTMLStyleElement;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.className = "field";

        const rootStyle = document.createElement("link");
        rootStyle.setAttribute("rel", "stylesheet");
        rootStyle.setAttribute("href", "./_anki/css/editable.css");
        this.shadowRoot!.appendChild(rootStyle);

        this.baseStyle = document.createElement("style");
        this.baseStyle.setAttribute("rel", "stylesheet");
        this.shadowRoot!.appendChild(this.baseStyle);

        this.editable = document.createElement("anki-editable") as Editable;
        this.shadowRoot!.appendChild(this.editable);

        this.codable = document.createElement("textarea", {
            is: "anki-codable",
        }) as Codable;
        this.shadowRoot!.appendChild(this.codable);
    }

    get ord(): number {
        return Number(this.getAttribute("ord"));
    }

    set fieldHTML(content: string) {
        this.editable.fieldHTML = content;
    }

    get fieldHTML(): string {
        return this.editable.fieldHTML;
    }

    connectedCallback(): void {
        this.addEventListener("keydown", onKey);
        this.addEventListener("keyup", onKeyUp);
        this.addEventListener("input", onInput);
        this.addEventListener("focus", onFocus);
        this.addEventListener("blur", onBlur);
        this.addEventListener("paste", onPaste);
        this.addEventListener("copy", onCutOrCopy);
        this.addEventListener("oncut", onCutOrCopy);
        this.addEventListener("mouseup", updateActiveButtons);

        const baseStyleSheet = this.baseStyle.sheet as CSSStyleSheet;
        baseStyleSheet.insertRule("anki-editable {}", 0);
    }

    disconnectedCallback(): void {
        this.removeEventListener("keydown", onKey);
        this.removeEventListener("keyup", onKeyUp);
        this.removeEventListener("input", onInput);
        this.removeEventListener("focus", onFocus);
        this.removeEventListener("blur", onBlur);
        this.removeEventListener("paste", onPaste);
        this.removeEventListener("copy", onCutOrCopy);
        this.removeEventListener("oncut", onCutOrCopy);
        this.removeEventListener("mouseup", updateActiveButtons);
    }

    initialize(color: string, content: string): void {
        this.setBaseColor(color);
        this.editable.fieldHTML = content;
    }

    setBaseColor(color: string): void {
        const styleSheet = this.baseStyle.sheet as CSSStyleSheet;
        const firstRule = styleSheet.cssRules[0] as CSSStyleRule;
        firstRule.style.color = color;
    }

    setBaseStyling(fontFamily: string, fontSize: string, direction: string): void {
        const styleSheet = this.baseStyle.sheet as CSSStyleSheet;
        const firstRule = styleSheet.cssRules[0] as CSSStyleRule;
        firstRule.style.fontFamily = fontFamily;
        firstRule.style.fontSize = fontSize;
        firstRule.style.direction = direction;
    }

    isRightToLeft(): boolean {
        const styleSheet = this.baseStyle.sheet as CSSStyleSheet;
        const firstRule = styleSheet.cssRules[0] as CSSStyleRule;
        return firstRule.style.direction === "rtl";
    }

    getSelection(): Selection {
        return this.shadowRoot!.getSelection()!;
    }

    focusEditable(): void {
        this.editable.focus();
    }

    blurEditable(): void {
        this.editable.blur();
    }

    hasFocus(): boolean {
        return document.activeElement === this;
    }

    toggleHtmlEdit(): void {
        const hadFocus = this.hasFocus();

        if (this.codable.active) {
            const html = this.codable.teardown();
            this.fieldHTML = html;

            this.editable.hidden = false;
            if (hadFocus) {
                this.focusEditable();
                caretToEnd(this);
            }
        } else {
            this.editable.hidden = true;
            this.codable.setup(this.fieldHTML);

            if (hadFocus) {
                this.codable.focus();
            }
        }
    }
}
