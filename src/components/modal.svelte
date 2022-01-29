<script>
	import { fade } from 'svelte/transition'
	import { createEventDispatcher, onDestroy } from 'svelte';

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');

	let modal;

	const handle_keydown = e => {
		if (e.key === 'Escape') {
			close();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll('*');
			const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused = typeof document !== 'undefined' && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			previously_focused.focus();
		});
	}
</script>

<svelte:window on:keydown={handle_keydown}/>

<div class="modal-background" on:click={close} transition:fade></div>

<div class="modal" role="dialog" aria-modal="true" bind:this={modal} transition:fade>
	<slot></slot>
	<hr>
	<div class="buttonzone">
		<!-- svelte-ignore a11y-autofocus -->
		<button autofocus on:click={close}>닫기</button>
	</div>
</div>

<style>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.3);
	}

	.modal {
		position: absolute;
		left: 50%;
		top: 50%;
		width: calc(100vw - 4em);
		max-width: 24em;
		max-height: calc(100vh - 4em);
		overflow: auto;
		transform: translate(-50%,-50%);
		padding: 1em;
		border-radius: 0.2em;
		background: white;
	}

	.buttonzone {
		display: flex;
		justify-content: center;
	}

	hr {
		margin-top: 1em;
		margin-bottom: 1em;
	}

	button {
        width: 5em;
        height: 2.5em;
        background-color: #FFCCAA;
        border: 1px #FFBB88 solid;
        border-radius: 0.2em;
        box-shadow: 0.2em 0.2em 1em lightgray;
    }

    button:active {
        background-color: #FFFFFF;
    }
</style>