// @ts-check

(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`);
  const formEl = document.getElementById("form");
  /** @type {HTMLInputElement | null} */
  //   @ts-ignore
  const inputEl = document.getElementById("input");
  //   const sendEl = document.getElementById("send");
  const chatsEl = document.getElementById("chats");

  if (!formEl || !inputEl || !chatsEl) {
    throw new Error("Init failed!");
  }

  const chats = [];

  const adjectives = ["멋진", "훌륭한", "재밌는", "새침한"];
  const animals = ["물범", "사자", "사슴", "돌고래", "독수리"];

  function pickRandom(array) {
    const randomIdx = Math.floor(Math.random() * array.length);
    const result = array[randomIdx];
    if (!result) {
      throw new Error("array length is 0.");
    }
    return result;
  }
  const mynickname = `${pickRandom(adjectives)} ${pickRandom(animals)}`;
  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    socket.send(
      JSON.stringify({
        nickname: mynickname,
        message: inputEl.value,
      })
    );
    inputEl.value = "";
  });

  const drawChats = () => {
    chatsEl.innerHTML = "";
    chats.forEach(({ message, nickname }) => {
      const div = document.createElement("div");
      div.innerHTML = `${nickname}: ${message}`;
      chatsEl.appendChild(div);
    });
  };

  socket.addEventListener("message", (event) => {
    const { type, payload } = JSON.parse(event.data);
    if (type === "sync") {
      const { chats: sycedChats } = payload;
      chats.push(...sycedChats);
    } else if (type === "chat") {
      const chat = payload;
      chats.push(chat);
    }

    drawChats();
  });
})();
