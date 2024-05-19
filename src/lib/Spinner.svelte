<script>
    import ArrowUp from './icons/ArrowUp.svelte'
    import ArrowDown from './icons/ArrowDown.svelte'
    import {createEventDispatcher} from 'svelte'

    export let direction
    export let hidden = false

    const dispatch = createEventDispatcher()
</script>

<button class="flex justify-center z-10 rounded-md hover:bg-gray-200"
        class:invisible={hidden}
        on:click={e => dispatch('click', e)}>
    {#if direction === 'up'}
        <ArrowUp />
    {:else}
        <ArrowDown />
    {/if}
</button>
