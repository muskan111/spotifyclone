document.addEventListener("DOMContentLoaded", () => {
    console.log("let's write js");

    let currentSong = new Audio();
    let songs;
    let currFolder;
    const volumeIcon = document.getElementById("volume-icon");
    let songUl = document.querySelector(".songList ul");

    function secondstominsec(seconds) {
        if (isNaN(seconds) || seconds < 0) return "00:00";
        let minute = Math.floor(seconds / 60);
        let rem = Math.floor(seconds % 60);
        const formatstring = String(minute).padStart(2, "0");
        const secformat = String(rem).padStart(2, "0");
        return `${formatstring}:${secformat}`;
    }

    function setLibrarySong() {
        songUl.innerHTML = "";
        const currentPlayingSong = currentSong.src.split(`${currFolder}/`)[1];
        for (const song of songs) {
            // console.log(currentPlayingSong, song);
            songUl.innerHTML += `<li>
                        <div class = "library-song">
                        <img class="invert" width='34' src="img/music.svg" alt=" ">
                        <div class="info"><div>${song.replaceAll(
                            "%20",
                            " "
                        )}</div></div>
                        </div>
                    
                        <div class="playNow"><span> ${
                            song == currentPlayingSong ? "Playing" : "Play Now"
                        }</span>
                        <img class="invert  library-img" src=${
                            song == currentPlayingSong
                                ? "img/pause.svg"
                                : "img/play.svg"
                        } alt=" "></div>
                    </li>`;
        }
        Array.from(
            document.querySelector(".songList").getElementsByTagName("li")
        ).forEach((e) => {
            e.addEventListener("click", () => {
                playMusic(
                    e.querySelector(".info").firstElementChild.innerHTML.trim()
                );
                // setLibrarySong();
            });
        });
    }
    async function getSongs(folder) {
        currFolder = folder;
        let a = await fetch(`/${folder}/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        songs = [];
        for (let i = 0; i < as.length; i++) {
            const element = as[i];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`${folder}/`)[1]);
            }
        }
        songUl.innerHTML = "";
        for (const song of songs) {
            songUl.innerHTML += `<li>
                <div class = "library-song">
                <img class="invert" width='34' src="img/music.svg" alt=" ">
                <div class="info"><div>${song.replaceAll(
                    "%20",
                    " "
                )}</div></div>
                </div>
            
                <div class="playNow"><span>Play Now</span>
                <img class="invert  library-img" src="img/play.svg" alt=" "></div>
            </li>`;
        }

        Array.from(
            document.querySelector(".songList").getElementsByTagName("li")
        ).forEach((e) => {
            e.addEventListener("click", () => {
                playMusic(
                    e.querySelector(".info").firstElementChild.innerHTML.trim()
                );
                // setLibrarySong();
            });
        });
        //         document.querySelector(".playnow").addEventListener("click",(e)=>{
        //             console.log("hello")
        // e.style.zIndex="0";
        //         })

        return songs;
    }

    const playMusic = (track, pause = false) => {
        currentSong.src = `/${currFolder}/` + track;
        if (!pause) {
            currentSong.play();
            mid.src = "img/pause.svg";
        }
        setLibrarySong();

        document.querySelector(".songinfo").innerHTML = decodeURI(track);
        document.querySelector(".songtime").innerHTML = "00:00/00:00";
    };

    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
        card.addEventListener("click", async () => {
            const folderr = card.getAttribute("data-folder");
            console.log("fetching songs");
            songs = await getSongs(`songs/${folderr}`);
            playMusic(songs[0]);
        });
    });

    async function main() {
        await getSongs("songs/punjabi101");
        playMusic(songs[0], true);

        document.getElementById("mid").addEventListener("click", () => {
            if (currentSong.paused) {
                currentSong.play();
                document.getElementById("mid").src = "img/pause.svg";
            } else {
                currentSong.pause();
                document.getElementById("mid").src = "img/play.svg";
            }
        });

        document.getElementById("prev").addEventListener("click", () => {
            currentSong.pause();
            let i = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
            if (i - 1 >= 0) {
                playMusic(songs[i - 1]);
            }
        });

        document.getElementById("forward").addEventListener("click", () => {
            currentSong.pause();
            let i = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
            if (i + 1 < songs.length) {
                playMusic(songs[i + 1]);
            }
        });

        document
            .querySelector(".range input")
            .addEventListener("change", (e) => {
                currentSong.volume = parseInt(e.target.value) / 100;

                volumeIcon.setAttribute("src", "img/volume.svg");
            });

        currentSong.addEventListener("timeupdate", () => {
            document.querySelector(".songtime").innerHTML = `${secondstominsec(
                currentSong.currentTime
            )}/${secondstominsec(currentSong.duration)}`;
        });
        document
            .querySelector(".hamburgerContainer")
            .addEventListener("click", () => {
                console.log("cclicked");
                document.querySelector("#left").style.left = "0";
                document.querySelector("#left").style.zIndex = "20";
            });
        document.querySelector(".close").addEventListener("click", () => {
            console.log("i am clicked");

            document.querySelector("#left").style.left = "-6000px";
            document.querySelector("#right").style.left = "0";
        });

        document.querySelector(".volume>img").addEventListener("click", (e) => {
            if (e.target.src.includes("volume.svg")) {
                e.target.src = e.target.src.replace("volume.svg", "mute.svg");
                currentSong.volume = 0;
                document.querySelector(".range input").value = 0;
            } else {
                e.target.src = e.target.src.replace("mute.svg", "volume.svg");
                currentSong.volume = 1;
                document.querySelector(".range input").value = 100;
            }
        });
    }

    main();
});
