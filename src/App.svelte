<script>
  import ArrowUp from "./lib/icons/ArrowUp.svelte";
  import ArrowDown from "./lib/icons/ArrowDown.svelte";

  let hours = 0, minutes = 10, seconds = 0
  $: hours_formatted = `${hours}`.padStart(2, '0')
  $: minutes_formatted = `${minutes}`.padStart(2, '0')
  $: seconds_formatted = `${seconds}`.padStart(2, '0')
  $: document.title = `${hours_formatted}:${minutes_formatted}:${seconds_formatted} | campustimer`

  // unfortunately, svelte doesn't seem to let these update each other, so this is a bit verbose
  $: if (seconds < 0) {
    if (minutes > 0) { seconds += 60; minutes --; }
    else if (hours > 0) { seconds += 60; minutes += 59; hours --; }
    else seconds = 0
  }
  $: if (seconds > 59) {
    if (minutes < 59) { seconds -= 60; minutes ++; }
    else if (hours < 99) { seconds -= 60; minutes -= 59; hours ++; }
    else seconds = 59
  }
  $: if (minutes < 0) {
    if (hours > 0) { minutes += 60; hours --; }
    else minutes = 0
  }
  $: if (minutes > 59) {
    if (hours < 99) { minutes -= 60; hours ++; }
    else minutes = 59
  }
  $: if (hours < 0) hours = 0
  $: if (hours > 99) hours = 99

  //setInterval(()=>seconds--, 100)

  let secondary_text = 'löschen', primary_text = 'start'

  const path_expand = 'M10,6L16,0M11,0H16V5M6,10L0,16M0,11V16H5'
  const path_collapse = 'M0,16L6,10M1,10H6V15M16,0L10,6M10,1V6H15'
  // weird but works
  let fullscreen_element = document.fullscreenElement
  document.addEventListener('fullscreenchange', () => fullscreen_element = document.fullscreenElement)
  $: fullscreen_path = fullscreen_element ? path_collapse : path_expand

  function toggle_fullscreen() {
    if (!fullscreen_element) document.documentElement.requestFullscreen()
    else document.exitFullscreen()
  }
</script>


<div class="hidden" id="embed"></div>

<a href="https://gcm.schule/" class="fixed cursor-default p-1 m-4 rounded-md hover:bg-gray-200 home-button" title="startseite">
  <svg viewBox="-2 -2 20 20" height="24" fill="none" stroke="currentColor"><path d="M2,7V16H6V10H10V16H14V7M0,9L8,1 16,9"/></svg>
</a>

<a class="fixed m-4 font-bold hover:underline decoration-2 brand" href="https://gcm.schule/timer.html" target="_blank" title="in neuem tab öffnen" data-notrack-target="timer.open_tab">campustimer</a>

<button class="fixed right-0 p-1 m-4 rounded-md hover:bg-gray-200" on:click={toggle_fullscreen} title="vollbild">
  <svg viewBox="-2 -2 20 20" height="24" fill="none" stroke="currentColor"><path d={fullscreen_path}/></svg>
</button>

<audio src="https://gcm.schule/public/timer_over.wav" id="finish-audio"></audio>

<main class="h-screen flex flex-col items-center justify-center">
  <div class="grid grid-cols-3">
    <button class="flex justify-center z-10 rounded-md hover:bg-gray-200" on:click={()=>hours++}><ArrowUp/></button>
    <button class="flex justify-center z-10 rounded-md hover:bg-gray-200" on:click={()=>minutes++}><ArrowUp/></button>
    <button class="flex justify-center z-10 rounded-md hover:bg-gray-200" on:click={()=>seconds++}><ArrowUp/></button>
    <div class="text-5xl sm:text-9xl tabular-nums col-span-3">{ hours_formatted }:{ minutes_formatted }:{ seconds_formatted }</div>
    <button class="flex justify-center z-10 rounded-md hover:bg-gray-200" on:click={()=>hours--}><ArrowDown/></button>
    <button class="flex justify-center z-10 rounded-md hover:bg-gray-200" on:click={()=>minutes--}><ArrowDown/></button>
    <button class="flex justify-center z-10 rounded-md hover:bg-gray-200" on:click={()=>seconds--}><ArrowDown/></button>
    <div class="flex col-span-3 mt-8 -mb-14">
      <button class="grow basis-0 font-bold rounded-md px-4 hover:bg-gray-200">{ secondary_text }</button>
      <button class="grow basis-0 font-bold rounded-md px-4 hover:bg-gray-200 text-green">{ primary_text }</button>
    </div>
  </div>
</main>
