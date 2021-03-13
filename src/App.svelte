<script>

	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
  import { mapAsync } from '../helpers/asyncUtils';

  let _displayRangeVal = 0;
  const tweeningRangeVal = tweened(0, { duration: 100 });
  const steps = 50;

  const frames = [];

  $: realRangeVal = +_displayRangeVal;
  $: $tweeningRangeVal = realRangeVal;
  $: currentIdx = Math.round($tweeningRangeVal);
  $: isOnLowerEdge = !realRangeVal;
  $: isOnUpperEdge = realRangeVal === frames.length - 1;
  $: isOnEdge = isOnLowerEdge || isOnUpperEdge;

  let autotweeningInterval = null;
  let startAutotweeningTimeout = null;
  let pauseOnEdge = false;
  let tweenDelta = 1;

  const cleanAutotweening = () => {
    clearInterval(autotweeningInterval);
    clearTimeout(startAutotweeningTimeout);
    autotweeningInterval = null;
    startAutotweeningTimeout = null;
  }

  const doTweeningStep = () => {
    if (isOnEdge) {
      tweenDelta = isOnLowerEdge ? 1 : -1;
      if (pauseOnEdge) {
        cleanAutotweening();
        startAutoTweening();
      } else {
        realRangeVal += tweenDelta;
      }
      pauseOnEdge = !pauseOnEdge;
    } else {
      realRangeVal += tweenDelta;
    }
  }

  const startAutoTweening = () => {
    if (autotweeningInterval || startAutotweeningTimeout) return;

    startAutotweeningTimeout = setTimeout(
      () => { autotweeningInterval = setInterval(doTweeningStep, 30) },
      2000
    )
  }

  const onMouseUp = () => {
    if (frames.length === steps) {
      pauseOnEdge = !isOnEdge;
      startAutoTweening();
    }
  }

  const onChange = () => {
    pauseOnEdge = !isOnEdge;
    cleanAutotweening();
    startAutoTweening();
  }

  $: if (frames.length) {
    if (frames[currentIdx]) {
      frames[currentIdx].style.display = 'block';
    }

    frames.slice(0, currentIdx).forEach((img) => { img.style.display = 'none'; })
    frames.slice(currentIdx + 1).forEach((img) => { img.style.display = 'none'; })
  }

	onMount(async () => {
    await mapAsync(frames, async (img) => {
      await new Promise((res) => { img.onload = res; });
      img.onload = null;
    });

    startAutoTweening();
	});
</script>

<svelte:window on:mouseup={onMouseUp}/>
<svelte:body/>

<main>
  <div>
    <h1>TWEENING DEMO</h1>
    <input
      type="range"
      max={frames.length - 1}
      on:mousedown={cleanAutotweening}
      on:change={onChange}
      bind:value={realRangeVal}
    />
  </div>
  <div>
    {#each { length: steps } as _, i }
      <img src="/static/olds/{i}.jpg" alt="{i}" class='transition-image' bind:this={frames[i]}>
    {/each}
  </div>
</main>


<style>
  main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
  }
  .transition-image {
    height: 500px;
    width: 500px;
    border-radius: 50%;
  }
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  input {
    width: 500px;
  }
</style>