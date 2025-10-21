window.addEventListener('load', function () {
    const audios = document.querySelectorAll('audio');
    const beats = document.querySelectorAll('.beat');

    // Array of dark gradient backgrounds for each song
    const backgrounds = [
        'linear-gradient(135deg, #4d0026 0%, #3d001f 50%, #26004d 100%)', // dark magenta/purple
        'linear-gradient(135deg, #4d2a00 0%, #3d2100 50%, #4d0026 100%)', // dark orange/magenta
        'linear-gradient(135deg, #4d4100 0%, #3d3300 50%, #4d2a00 100%)', // dark gold/orange
        'linear-gradient(135deg, #004d00 0%, #003d00 50%, #4d4100 100%)', // dark green/gold
        'linear-gradient(135deg, #003d4d 0%, #00303d 50%, #004d00 100%)', // dark cyan/green
        'linear-gradient(135deg, #00264d 0%, #001e3d 50%, #003d4d 100%)', // dark blue/cyan
        'linear-gradient(135deg, #26004d 0%, #1e003d 50%, #00264d 100%)', // dark purple/blue
        'linear-gradient(135deg, #4d001e 0%, #3d0016 50%, #26004d 100%)', // dark pink/purple
    ];

    let currentBackgroundIndex = 0;

    // Jackson Pollock style random positioning
    function positionBeatsRandomly() {
        const container = document.getElementById('beats');
        const containerWidth = window.innerWidth - 400; // Leave margin for beat width
        const beatHeight = 200; // Approximate beat height
        const positions = [];

        beats.forEach((beat, index) => {
            // Random position - more clustered
            const x = Math.random() * containerWidth;
            const y = (index * 100) + (Math.random() * 200 - 100); // Closer vertical spacing with less randomness

            // Random rotation
            const rotation = (Math.random() * 20 - 10) + 'deg'; // -10 to +10 degrees

            beat.style.left = x + 'px';
            beat.style.top = y + 'px';
            beat.style.transform = `rotate(${rotation})`;
            beat.style.setProperty('--rotation', rotation);
        });

        // Adjust container height based on last element
        const lastBeat = beats[beats.length - 1];
        if (lastBeat) {
            const lastBeatBottom = parseFloat(lastBeat.style.top) + 250;
            container.style.minHeight = lastBeatBottom + 'px';
        }
    }

    // Position on load
    positionBeatsRandomly();

    // Reposition on window resize
    window.addEventListener('resize', positionBeatsRandomly);

    // Auto-play next track when current ends
    audios.forEach((audio, i) => {
        audio.addEventListener('ended', () => {
            if (audios[i + 1]) {
                audios[i + 1].play();
            }
        }, false);
    });

    // Pause all other tracks when one plays
    audios.forEach((audio, i) => {
        audio.addEventListener('play', () => {
            // Add playing class to body for background animation
            document.body.classList.add('playing');

            // Change background color to next in cycle
            currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
            document.body.style.background = backgrounds[currentBackgroundIndex];

            // Add now-playing class to current beat
            const beatDiv = audio.closest('.beat');
            if (beatDiv) {
                // Remove now-playing from all beats
                document.querySelectorAll('.beat').forEach(b => b.classList.remove('now-playing'));
                // Add to current beat
                beatDiv.classList.add('now-playing');

                // Update URL hash when playing
                if (beatDiv.id) {
                    history.replaceState(null, null, '#' + beatDiv.id);
                }
            }

            // Pause other tracks
            audios.forEach((otherAudio, ii) => {
                if (i !== ii) otherAudio.pause();
            });
        }, false);

        // Remove playing class when audio pauses
        audio.addEventListener('pause', () => {
            // Remove now-playing class from beat
            const beatDiv = audio.closest('.beat');
            if (beatDiv) {
                beatDiv.classList.remove('now-playing');
            }

            // Check if any audio is still playing
            const anyPlaying = Array.from(audios).some(a => !a.paused);
            if (!anyPlaying) {
                document.body.classList.remove('playing');
                // Reset to default background
                document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
            }
        }, false);
    });

    // Handle direct link to song via URL hash
    function playFromHash() {
        const hash = window.location.hash.slice(1); // Remove #
        if (hash) {
            const beatDiv = document.getElementById(hash);
            if (beatDiv) {
                const audio = beatDiv.querySelector('audio');
                if (audio) {
                    // Scroll to the beat
                    beatDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Play after a brief delay to ensure scrolling
                    setTimeout(() => {
                        const playPromise = audio.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                console.log('Autoplay prevented:', error);
                            });
                        }
                    }, 100);
                }
            }
        }
    }

    // Play on initial load if hash present
    playFromHash();

    // Handle hash changes (back/forward navigation)
    window.addEventListener('hashchange', playFromHash);
});
