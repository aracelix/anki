<!--
Copyright: Ankitects Pty Ltd and contributors
License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html
-->
<script lang="ts">
    import DynamicallySlottable from "../components/DynamicallySlottable.svelte";
    import Item from "../components/Item.svelte";
    import * as tr from "../lib/ftl";
    import type { DeckOptionsState } from "./lib";
    import SpinBoxRow from "./SpinBoxRow.svelte";
    import SwitchRow from "./SwitchRow.svelte";
    import TitledContainer from "./TitledContainer.svelte";

    export let state: DeckOptionsState;
    export let api: Record<string, never>;

    const config = state.currentConfig;
    const defaults = state.defaults;
</script>

<TitledContainer title={tr.deckConfigTimerTitle()}>
    <DynamicallySlottable slotHost={Item} {api}>
        <Item>
            <SpinBoxRow
                bind:value={$config.capAnswerTimeToSecs}
                defaultValue={defaults.capAnswerTimeToSecs}
                min={30}
                max={600}
                markdownTooltip={tr.deckConfigMaximumAnswerSecsTooltip()}
            >
                {tr.deckConfigMaximumAnswerSecs()}
            </SpinBoxRow>
        </Item>

        <Item>
            <SwitchRow
                bind:value={$config.showTimer}
                defaultValue={defaults.showTimer}
                markdownTooltip={tr.deckConfigShowAnswerTimerTooltip()}
            >
                {tr.schedulingShowAnswerTimer()}
            </SwitchRow>
        </Item>
    </DynamicallySlottable>
</TitledContainer>
