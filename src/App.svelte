<script>
  import Spinner from './lib/Spinner.svelte'

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

  //setInterval(()=>seconds--, 1000)

  let secondary = { text: 'abbrechen', action: reset }, primary = { text: 'start', action: start }

  let finish_audio, interval, state = 'initial', finished = false
  function start() {
    interval = setInterval(tick, 1000)
    primary.text = 'pause'
    primary.action = pause
    state = 'running'
    if (!finish_audio) finish_audio = new Audio('https://gcm.schule/timer_over.wav')
  }
  function pause() {
    clearInterval(interval)
    primary.text = 'weiter'
    primary.action = start
    state = 'paused'
  }
  function reset() {
    pause()
    set(0, 10, 0)
    primary.text = 'start'
    state = 'initial'
    finished = false
  }

  function tick() {
    if (finished) seconds ++
    else seconds --
    if (hours + minutes + seconds === 0) {
      finish_audio.play()
      finished = true
      primary.text = 'fertig'
      primary.action = reset
    }
  }

  function set(h, m, s) {
    hours = h; minutes = m; seconds = s
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

<main class="h-screen flex flex-col items-center justify-center">
  <div class="grid grid-cols-3">
    <Spinner direction="up" hidden={state === 'running'} on:click={()=>hours++} />
    <Spinner direction="up" hidden={state === 'running'} on:click={()=>minutes++} />
    <Spinner direction="up" hidden={state === 'running'} on:click={()=>seconds++} />
    <div class="text-5xl sm:text-9xl tabular-nums col-span-3" class:pulse={finished}>{ hours_formatted }:{ minutes_formatted }:{ seconds_formatted }</div>
    <Spinner direction="down" hidden={state === 'running'} on:click={()=>hours--} />
    <Spinner direction="down" hidden={state === 'running'} on:click={()=>minutes--} />
    <Spinner direction="down" hidden={state === 'running'} on:click={()=>seconds--} />
    <div class="flex col-span-3 mt-8 -mb-14">
      {#if state === 'initial'}
        <div class="grow basis-0">
          {#each [5,10,15,20,25,30,45,60] as t}
            <button class="font-bold rounded-md px-2 -mr-1 hover:bg-gray-200 relative hover:z-10 max-sm:hidden" on:click={() => set(0, t, 0)}>{t}</button>
          {/each}
        </div>
      {:else}
        <button class="grow basis-0 box-border font-bold rounded-md hover:bg-gray-200" on:click={secondary.action}>{ secondary.text }</button>
      {/if}
      <button class="grow basis-0 box-border font-bold rounded-md hover:bg-gray-200 text-green" on:click={primary.action}>{ primary.text }</button>
    </div>
  </div>
</main>
