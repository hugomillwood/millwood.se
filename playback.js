window.addEventListener('load', function () {

    document.querySelectorAll('audio').forEach((e,i) => { 
        e.addEventListener('ended', 
            () => { document.querySelectorAll('audio')[i+1].play() }, 
            false
        )
    })

    document.querySelectorAll('audio').forEach((e,i) => { 
        e.addEventListener('play', 
            () => { 
                document.querySelectorAll('audio').forEach(
                    (ee,ii) => {
                        if (i!=ii) ee.pause()
                    } )}, 
            false)
    })
})
