<!--
Copyright: Ankitects Pty Ltd and contributors
License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html
-->
<script lang="ts">
    import IconButton from "../../components/IconButton.svelte";
    import Shortcut from "../../components/Shortcut.svelte";
    import WithState from "../../components/WithState.svelte";
    import { MatchResult } from "../../domlib/surround";
    import * as tr from "../../lib/ftl";
    import { getPlatformString } from "../../lib/shortcuts";
    import { context } from "../NoteEditor.svelte";
    import type { RichTextInputAPI } from "../rich-text-input";
    import { editingInputIsRichText } from "../rich-text-input";
    import { getSurrounder } from "../surround";
    import { underlineIcon } from "./icons";

    function matchUnderline(element: Element): Exclude<MatchResult, MatchResult.ALONG> {
        if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
            return MatchResult.NO_MATCH;
        }

        if (element.tagName === "U") {
            return MatchResult.MATCH;
        }

        return MatchResult.NO_MATCH;
    }

    const { focusedInput } = context.get();

    $: input = $focusedInput as RichTextInputAPI;
    $: disabled = !editingInputIsRichText($focusedInput);
    $: surrounder = disabled ? null : getSurrounder(input);

    function updateStateFromActiveInput(): Promise<boolean> {
        return disabled
            ? Promise.resolve(false)
            : surrounder!.isSurrounded(matchUnderline);
    }

    const element = document.createElement("u");
    function makeUnderline(): void {
        surrounder!.surroundCommand(element, matchUnderline);
    }

    const keyCombination = "Control+U";
</script>

<WithState
    key="underline"
    update={updateStateFromActiveInput}
    let:state={active}
    let:updateState
>
    <IconButton
        tooltip="{tr.editingUnderlineText()} ({getPlatformString(keyCombination)})"
        {active}
        {disabled}
        on:click={(event) => {
            makeUnderline();
            updateState(event);
        }}
    >
        {@html underlineIcon}
    </IconButton>

    <Shortcut
        {keyCombination}
        on:action={(event) => {
            makeUnderline();
            updateState(event);
        }}
    />
</WithState>
