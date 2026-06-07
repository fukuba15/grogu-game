
const IMGS = {
  normal: "image/egao.png",
  sleep: "image/ohirune.webp",
  feed: "image/mog.webp",
  snack: "image/oyatsu.webp",
  start: "image/2.jpeg",
  welcome: "image/dakko.webp",
  bad: "image/dakko.png",
  hideout: "image/hideout.webp",
  // なつき度20未満
  looking: "image/looking.webp",
  cautious: "image/cautious.webp",
  good: "image/good.webp",
  snackEnd: "image/snack-end.webp",
  senseEnd: "image/sense-end.webp",
  hardtime: "image/hardtime.webp",
  easyBad: "image/eazy_bad.webp",
  watch: "image/watch.webp",
  play: "image/play.webp",
  okashiBad: "image/okashibad.webp",
  hard_bad: "image/hard_bad.webp",
  bad: "image/bad.webp",
  hard_rotta: "image/rotta_bad.webp",
  bad_force: "image/bad_force.webp",
  force: "image/force.webp"
};

const TOTAL_TURNS = 10;
const SNACK_LIMIT_EASY = 4;
const SNACK_LIMIT_HARD = 4;
const HIDEOUT_TURNS = [3, 7];

const EASY_TIME_LOGS = {
  1: "朝。マンドーは用事のため出かけていった。\n夕方まで、グローグーのお世話をお願いされた。",
  3: "昼前。グローグーは少しずつあなたに慣れてきた。",
  5: "お昼。グローグーのおなかが小さく鳴っている。",
  7: "午後。グローグーは眠そうにしながらも、こちらを見ている。",
  9: "夕方。マンドーが戻ってくる時間が近づいてきた。"
};

const ALL_ACTIONS = {
  feed: {
    label: "ごはん",
    ico: "🍖",
    hint: "げんき+14 なつき+6",
    bond: 6,
    health: 14,
    trace: 1,
    snack: false,
    kidnap: false,
    style: "safe",
    logs: ["グローグーがパクパク食べた！", "おいしそうにもぐもぐ…", "ごはんだいすき！"]
  },
  play: {
    label: "あそぶ",
    ico: "⚽",
    hint: "げんき-10 なつき+14",
    bond: 14,
    health: -10,
    trace: 5,
    snack: false,
    kidnap: false,
    logs: ["マンドーのフィギュアを嬉しそうに見せてくれた。", "小さな手でフィギュアをぎゅっと握っている。", "楽しそうに遊んでいる。こちらもつられて笑ってしまった。"]
  },
  sleep: {
    label: "おひるね",
    ico: "💤",
    hint: "げんき+22 なつき+3",
    bond: 3,
    health: 22,
    trace: -3,
    snack: false,
    kidnap: false,
    style: "safe",
    logs: ["すやすや…おひるね中💤", "ぐっすり眠っている", "いい夢みてね…"]
  },
  snack: {
    label: "おやつ",
    ico: "🍪",
    hint: "げんき-6 なつき+18",
    bond: 18,
    health: -6,
    trace: 8,
    snack: true,
    kidnap: false,
    style: "safe",
    logs: ["おやつをあげた…目がキラキラ", "おいしそうに食べてくれた。", "一枚だけ…のつもりが止まらない。"]
  },
  watch: {
    label: "そっと見守る",
    ico: "🌙",
    hint: "げんき+16 なつき-4",
    bond: -4,
    health: 16,
    trace: -6,
    snack: false,
    kidnap: false,
    style: "safe",
    logs: ["少し距離を置いた。グローグーは落ち着いたようだ。", "無理にかまわず、そばで見守った。", "静かな時間が流れた。"]
  },
  forcePlay: {
    label: "フォース遊び",
    ico: "✨",
    hint: "げんき-22 なつき+24",
    bond: 24,
    health: -22,
    trace: 14,
    snack: false,
    kidnap: false,
    style: "safe",
    logs: ["小さな手がふわりと動き、部屋のものが浮いた！", "グローグーは得意げだ。でも少し疲れたみたい。", "楽しそうだけど、力を使いすぎたかもしれない。"]
  },
  kidnap: {
    label: "こっそり連れ去る…",
    ico: "🏃",
    hint: "",
    bond: 0,
    health: 0,
    snack: false,
    kidnap: true,
    logs: ["…手が、勝手に動いていた。\nグローグーを抱え、あなたは走り出した！"]
  }
};

const EASY_POOL = ["feed", "play", "sleep", "snack", "watch", "forcePlay", "kidnap"];
const HARD_POOL = ["feed", "play", "sleep", "snack", "watch", "forcePlay"];

const HIDEOUT_EVENTS = [
  {
    title: "潜伏先を変える",
    desc: "マンドーの追跡が近づいている。\n次の潜伏先を選んでください。",
    choices: [
      { label: "🌲 森の奥に隠れる", success: true },
      { label: "🏙️ 人混みに紛れる", success: true },
      { label: "🚀 廃船に籠もる", success: false },
      { label: "🏔️ 山岳地帯に向かう", success: false }
    ]
  },
  {
    title: "またルートを変える",
    desc: "気配を感じる。\nどのルートで移動しますか？",
    choices: [
      { label: "🌊 海沿いの道", success: true },
      { label: "🕳️ 地下水路", success: true },
      { label: "🛤️ 旧街道をまっすぐ", success: false },
      { label: "🔦 廃墟を通り抜ける", success: false }
    ]
  },
  {
    title: "マンドーの影",
    desc: "マンドーがかなり近い。\n今すぐどうする？",
    choices: [
      { label: "🤫 じっとして息をひそめる", success: true },
      { label: "🌿 茂みに飛び込む", success: true },
      { label: "💨 全力で逃げる", success: false },
      { label: "🔥 火を起こして陽動する", success: false }
    ]
  }
];

let state = null;
let diffKey = null;
let actionPool = [];
let pendingContinue = null;

function clamp(v, mn, mx) {
  return Math.max(mn, Math.min(mx, v));
}

const MOODS = [
  [70, "楽しそうにしている"],
  [45, "興味深そうに見つめている"],
  [20, "まだ少し警戒している"],
  [0, "マンドーを探しているようだ"]
];

function getMood(b) {
  if (state && state.health < 25) return "少し疲れているようだ";

  for (let [t, m] of MOODS) {
    if (b >= t) return m;
  }
  return MOODS[MOODS.length - 1][1];
}

function getTimeLabel(turn) {
  if (diffKey !== "easy") return "逃亡中";
  if (turn <= 2) return "🌅 朝";
  if (turn <= 4) return "☀️ 昼前";
  if (turn <= 6) return "🍴 お昼";
  if (turn <= 8) return "🌤️ 午後";
  return "🌇 夕方";
}

function setImg(k) {
  document.getElementById("groguImg").src = IMGS[k] || IMGS.normal;
}


function updateTurnTrack() {
  const track = document.getElementById("turnTrack");
  if (!track) return; // ← この1行を追加するだけ
  track.innerHTML = "";
  for (let i = 1; i <= TOTAL_TURNS; i++) {
    const dot = document.createElement("div");
    dot.className = "turn-dot" + (i < state.turn ? " done" : i === state.turn ? " current" : "");
    track.appendChild(dot);
  }
}

function getTraceLabel(v) {
  if (v >= 75) return "危";
  if (v >= 55) return "濃";
  if (v >= 30) return "揺";
  return "静";
}


function getHealthEmoji(v) {
  if (v >= 70) return "😆";
  if (v >= 45) return "🙂";
  if (v >= 25) return "😟";
  return "😵";
}

function getNormalImg(bond) {
  if (bond >= 70) return "normal";    // 笑顔
  if (bond >= 45) return "good";      // 興味深そう
  if (bond >= 20) return "cautious";  // 警戒してる
  return "looking";                   // マンドーを探してる
}

function traceLog(v) {
  if (v >= 75) return "気配が濃い。マンドーはすぐ近くまで来ている。";
  if (v >= 55) return "あたりがざわついている。追跡の気配が強い。";
  if (v >= 30) return "遠くで小さな物音がした。少し目立っている。";
  return "今のところ、気配は薄い。";
}

function render() {
  const s = state;

  document.getElementById("turnDisp").textContent =
    s.turn + " / " + TOTAL_TURNS;

  const diffEl = document.getElementById("diffDisp");
  if (diffKey === "easy") {
    diffEl.textContent = "やさしい";
    diffEl.className = "";
  } else {
    diffEl.textContent = "むずかしい";
    diffEl.className = "";
  }
  const mood = getMood(s.bond);
  document.getElementById("moodText").textContent = mood;

  // 状態に応じて画像変更
  if (s.health < 25) {
    setImg("sleep");
  }
  else if (s.bond < 20) {
    setImg("looking");
  }
  else {
    setImg(getNormalImg(state.bond));
  }
  document.getElementById("barBond").style.width = Math.min(s.bond, 100) + "%";
  document.getElementById("valBond").textContent = Math.round(s.bond);
  document.getElementById("barHealth").style.width = clamp(s.health, 0, 100) + "%";
  document.getElementById("valHealth").textContent = Math.round(s.health);

  const miniBond = document.getElementById("miniBond");
  if (miniBond) miniBond.textContent = Math.round(clamp(s.bond, 0, 100)) + "%";

  const miniHealth = document.getElementById("miniHealth");
  if (miniHealth) miniHealth.textContent = getHealthEmoji(s.health);

  if (diffKey === "hard") {
    document.getElementById("barTrace").style.width = clamp(s.tracking || 0, 0, 100) + "%";
    document.getElementById("valTrace").textContent = getTraceLabel(s.tracking || 0);
  }

  updateTurnTrack();

  const w = document.getElementById("snackWarn");

  if (diffKey === "easy") {
    if (s.snackCount >= 4) {
      w.textContent = "おやつ " + s.snackCount + "/4回。マンドーにバレそう…";
    } else if (s.snackCount >= 2) {
      w.textContent = "おやつ " + s.snackCount + "/4回。そろそろ食べ過ぎかも。";
    } else {
      w.textContent = "";
    }
  } else {
    const traceText = traceLog(s.tracking || 0);
    if (s.snackCount >= 5) {
      w.textContent = "おやつ " + s.snackCount + "/4回。マンドーに痕跡を追われている！ " + traceText;
    } else if (s.snackCount >= 3) {
      w.textContent = "おやつ " + s.snackCount + "/4回。甘い匂いが残っている。 " + traceText;
    } else {
      w.textContent = traceText;
    }
  }
}

function showContinue(label, callback) {
  const btn = document.getElementById("continueBtn");
  btn.textContent = label || "🐾 つづける";
  pendingContinue = callback;
  document.getElementById("actionPanel").style.display = "none";
  document.getElementById("continuePanel").style.display = "block";
  btn.onclick = () => {
    document.getElementById("continuePanel").style.display = "none";
    document.getElementById("actionPanel").style.display = "block";
    const next = pendingContinue;
    pendingContinue = null;
    if (typeof next === "function") next();
  };
}

function hideContinue() {
  document.getElementById("continuePanel").style.display = "none";
  document.getElementById("actionPanel").style.display = "block";
  pendingContinue = null;
}

function flashEffect() {
  const el = document.createElement("div");
  el.className = "action-flash";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 420);
}

function showOverlay(imgKey, title, msg, btnsHtml) {
  document.getElementById("overlay").classList.remove("collection-mode");
  document.getElementById("ovImg").src = IMGS[imgKey] || IMGS.bad;
  document.getElementById("ovTitle").textContent = title;
  document.getElementById("ovMsg").textContent = msg;
  document.getElementById("ovBtns").innerHTML = btnsHtml;
  document.getElementById("overlay").style.display = "flex";
  document.querySelectorAll(".action-btn").forEach(b => b.disabled = true);
}

function hideOverlay() {
  document.getElementById("overlay").classList.remove("collection-mode");
  document.getElementById("overlay").style.display = "none";
  document.querySelectorAll(".action-btn").forEach(b => b.disabled = false);
}

const ENDING_STORAGE_KEY = "groguEndingCollection.v1";

const ENDINGS = [
  { id: "easy_good", title: "夕方のおむかえ", desc: "グローグーと仲良く過ごし、マンドーに無事引き渡した。" },
  { id: "easy_snack", title: "おやつルート", desc: "おやつをあげすぎて、マンドーが予定より早く迎えに来た。" },
  { id: "easy_bad_health", title: "早すぎるおむかえ", desc: "グローグーの元気がなくなり、マンドーが現れた。" },
  { id: "easy_time", title: "あと少しの距離", desc: "夕方になったが、グローグーとはまだ距離があった。" },
  { id: "hard_bad_snack", title: "甘い痕跡", desc: "おやつの騒ぎで潜伏先がバレてしまった。" },
  { id: "hard_bad_health", title: "フォースの導き", desc: "弱ったグローグーの気配をルークが感じ取った。" },
  { id: "hard_bad_hideout", title: "潜伏失敗", desc: "潜伏先の選択をミスし、マンドーに場所がバレた。" },
  { id: "hard_time", title: "グローグーの紹介", desc: "すっかり懐いたグローグーが、マンドーを紹介してくれた。" },
  { id: "hard_grogu_return", title: "自分で帰る子", desc: "朝起きるとグローグーはいなくなっていた。レイザークレストの近くではしゃいでいた。" },
  { id: "hard_rotta", title: "ロッタのおむかえ", desc: "ロッタが上から転がってきた。あなたは踏み潰された。" },
];

function getCollectedEndings() {
  try {
    return JSON.parse(localStorage.getItem(ENDING_STORAGE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function recordEnding(id) {
  const collected = getCollectedEndings();
  if (!collected.includes(id)) {
    collected.push(id);
    localStorage.setItem(ENDING_STORAGE_KEY, JSON.stringify(collected));
  }
}

function endingCountText() {
  return getCollectedEndings().length + " / " + ENDINGS.length;
}

// エンディング振り返り用の詳細データ（id → 画像キー・本文）
const ENDING_DETAILS = {
  easy_good: { img: "welcome", msg: "夕方になり、マンドーが戻ってきた。\n\nグローグーはすぐに彼に駆け寄ったが、\n最後に一度だけ振り返り、手を振ってくれた。" },
  easy_snack: { img: "snackEnd", msg: "マンドーが予定より早く戻ってきた。\n\n「おかしの食べ過ぎだ。夕飯が入らないだろう」\n\nそう言いながら、グローグーを抱き上げる。\n\nグローグーは少しだけこちらを振り返り、名残惜しそうに手を振った。" },
  easy_bad_health: { img: "senseEnd", msg: "グローグーのげんきがなくなってしまった。\n心配したマンドーが早めにお迎えにきた。" },
  easy_time: { img: "easyBad", msg: "夕方になり、マンドーが迎えにきた。\n\nもう少しで仲良しになれたのに…" },
  hard_bad_snack: { img: "okashiBad", msg: "売店で未購入のお菓子を食べてしまい騒ぎになった。\nマンドーに居場所がバレてしまった。" },
  hard_bad_health: { img: "bad_force", msg: "グローグーが弱ってしまい、ルークが感知してやってきた。\nすべてが終わった。" },
  hard_bad_hideout: { img: "bad", msg: "物陰の向こうに、誰かが立っていた。\nグローグーは小さく声をあげる。\nまるで、帰る場所を見つけたみたいに。\n「……見つけた」\nマンドーだった。" },
  hard_time: { img: "hardtime", msg: "すっかり懐いたグローグーが、マンドーを紹介してくれた。" },
  hard_grogu_return: { img: "hard_bad", msg: "朝起きるとグローグーはいなくなっていた。\n慌てて外に出るとレイザークレストの近くではしゃぐグローグーが見えた。" },
  hard_rotta: { img: "hard_rotta", msg: "あなたは逃げ切った。\n……と思った瞬間。\n\nロッタが上から転がってきた。\nあなたは踏み潰された。" }
};

function showEndingReview(endingId) {
  const e = ENDINGS.find(e => e.id === endingId);
  const detail = ENDING_DETAILS[endingId];
  if (!e || !detail) return;

  document.getElementById("overlay").classList.remove("collection-mode");
  document.getElementById("ovImg").src = IMGS[detail.img] || IMGS.normal;
  document.getElementById("ovTitle").textContent = e.title;
  document.getElementById("ovMsg").textContent = detail.msg;
  document.getElementById("ovBtns").innerHTML =
    '<button class="sub-btn" onclick="showEndingCollection()">← 一覧に戻る</button>';
  document.getElementById("overlay").style.display = "flex";
}

function showEndingCollection() {
  const collected = getCollectedEndings();
  const cards = ENDINGS.map((e, idx) => {
    const found = collected.includes(e.id);
    if (found) {
      return '<div class="collection-card collection-card--unlocked" onclick="showEndingReview(\'' + e.id + '\')" style="cursor:pointer;">' +
        '<strong>' + String(idx + 1).padStart(2, '0') + '. ' + e.title + ' <span style="font-size:10px;color:#65cfa6;">▶ 振り返る</span></strong>' +
        '<small>' + e.desc + '</small>' +
        '</div>';
    } else {
      return '<div class="collection-card locked">' +
        '<strong>' + String(idx + 1).padStart(2, '0') + '. ？？？</strong>' +
        '<small>まだ見ていないエンディングです。</small>' +
        '</div>';
    }
  }).join('');

  document.getElementById("overlay").classList.add("collection-mode");
  document.getElementById("ovImg").src = IMGS.start;
  document.getElementById("ovTitle").textContent = "エンディング一覧";
  document.getElementById("ovMsg").textContent = "回収率 " + endingCountText();
  document.getElementById("ovBtns").innerHTML =
    '<div class="collection-rate">見つけた結末：' + endingCountText() + '</div>' +
    '<div class="collection-list">' + cards + '</div>' +
    '<button class="sub-btn" onclick="startDiffSelect()">タイトルへ戻る</button>';
  document.getElementById("overlay").style.display = "flex";
  document.querySelectorAll(".action-btn").forEach(b => b.disabled = true);
}

const RETRY = '<button class="btn-p" onclick="startDiffSelect()">もういちどあそぶ</button>' +
  '<br><button class="sub-btn" onclick="showEndingCollection()">エンディング一覧を見る</button>';

function endGame(type) {
  const d = {
    easy: {
      good: {
        title: "夕方のおむかえ",
        msg: "夕方になり、マンドーが戻ってきた。\n\nグローグーはすぐに彼に駆け寄ったが、\n最後に一度だけ振り返り、手を振ってくれた。",
        img: "welcome"
      },
      snackPickup: {
        title: "おやつルート",
        msg: "マンドーが予定より早く戻ってきた。\n\n「おかしの食べ過ぎだ。夕飯が入らないだろう」\n\nそう言いながら、グローグーを抱き上げる。\n\nグローグーは少しだけこちらを振り返り、名残惜しそうに手を振った。",
        img: "snackEnd"
      },
      badHealth: {
        title: "早すぎるおむかえ",
        msg: "グローグーのげんきがなくなってしまった。\n心配したマンドーが早めにお迎えにきた。",
        img: "senseEnd"
      },
      time: {
        title: "あと少しの距離",
        msg: "夕方になり、マンドーが迎えにきた。\n\nもう少しで仲良しになれたのに…",
        img: "easyBad"
      }
    },
    hard: {
      groguReturn: {
        title: "自分で帰る子",
        msg: "朝起きるとグローグーはいなくなっていた。\n慌てて外に出るとレイザークレストの近くではしゃぐグローグーが見えた。",
        img: "hard_bad"  // 専用絵ができたら差し替え
      },
      badSnack: {
        title: "甘い痕跡",
        msg: "売店で未購入のお菓子を食べてしまい騒ぎになった。\nマンドーに居場所がバレてしまった。",
        img: "okashiBad"
      },
      badHealth: {
        title: "フォースの導き",
        msg: "グローグーが弱ってしまい、ルークが感知してやってきた。\nすべてが終わった。",
        img: "senseEnd"
      },
      badHideout: {
        title: "潜伏失敗",
        msg: "潜伏先の選択をミスした。\nマンドーに場所がバレてしまった。",
        img: "bad"
      },
      time: {
        title: "グローグーの紹介",
        msg: "すっかり懐いたグローグーが、マンドーを紹介してくれた。",
        img: "hardtime"
      }
    }
  };

  const endingIds = {
    easy: { good: "easy_good", snackPickup: "easy_snack", badHealth: "easy_bad_health", time: "easy_time" },
    hard: { good: "hard_time", badSnack: "hard_bad_snack", badHealth: "hard_bad_health", badHideout: "hard_bad_hideout", time: "hard_time", groguReturn: "hard_grogu_return", rotta: "hard_rotta" }
  };
  recordEnding(endingIds[diffKey][type]);

  if (diffKey === "hard" && type === "badHealth") {
    showSenseDeadEnd();
    return;
  }

  const e = d[diffKey][type];
  showOverlay(e.img, e.title, e.msg, RETRY);
}


function resolveFinalEnding() {
  if (diffKey === "easy") {
    state.bond >= 80 ? endGame("good") : endGame("time");
    return;
  }

  // hard
  if ((state.tracking || 0) >= 75) {
    endGame("time");
  } else if (state.bond >= 80 && state.health >= 25 && (state.tracking || 0) < 75) {
    endGame("time");        // なつき度高い→グローグーが紹介
  } else if (state.health >= 70 && state.bond < 50 && (state.tracking || 0) < 50) {
    endGame("groguReturn"); // ← 自分で帰る子
  } else if (state.bond < 80 && state.health >= 25 && (state.tracking || 0) < 75) {
    Math.random() < 0.5 ? showRottaEnding() : endGame("groguReturn");
  } else {
    endGame("time");
  }
}

function renderActions() {
  hideContinue();

  const availableActions =
    diffKey === "easy"
      ? actionPool.filter(key =>
        !(key === "kidnap" && state.turn >= 8)
      )
      : actionPool.filter(key => key !== "kidnap");

  const pool = [...availableActions].sort(() => Math.random() - 0.5).slice(0, 3);
  const grid = document.getElementById("actionGrid");
  grid.innerHTML = "";

  pool.forEach(key => {
    const a = ALL_ACTIONS[key];
    const btn = document.createElement("button");
    btn.className = "action-btn" + (a.kidnap ? " danger" : "") + (a.style ? " " + a.style : "");
    btn.innerHTML =
      '<span class="ico">' + a.ico + '</span>' +
      '<span class="lbl">' + a.label + '</span>' +
      '<span class="hint">' + a.hint + '</span>';
    btn.onclick = () => doAction(key);
    grid.appendChild(btn);
  });
}

function showTimeLogIfNeeded() {
  if (diffKey !== "easy") return false;

  const msg = EASY_TIME_LOGS[state.turn];
  if (!msg) return false;

  document.getElementById("logText").textContent = msg;
  return true;
}

function proceedNextTurn() {
  state.turn++;
  state.health = clamp(state.health - (diffKey === "hard" ? 1.5 : 0.5), 0, 100);
  if (diffKey === "hard") {
    state.tracking = clamp((state.tracking || 0) + 2, 0, 100);
  }
  render();

  if (state.turn > TOTAL_TURNS) {
    resolveFinalEnding();
    return;
  }

  if (diffKey === "easy" && state.snackCount >= SNACK_LIMIT_EASY) {
    endGame("snackPickup");
    return;
  }

  if (diffKey === "hard" && state.snackCount >= SNACK_LIMIT_HARD) {
    endGame("badSnack");
    return;
  }

  if (state.health <= 25) {
    endGame("badHealth");
    return;
  }

  if (diffKey === "hard" && (state.tracking || 0) >= 90) {
    endGame("time");
    return;
  }

  if (diffKey === "hard" && HIDEOUT_TURNS.includes(state.turn)) {
    showHideoutEvent(HIDEOUT_TURNS.indexOf(state.turn));
    return;
  }



  const showedTimeLog = showTimeLogIfNeeded();
  if (showedTimeLog) {
    showContinue("🐾 つぎの時間へ", () => {
      document.getElementById("logText").textContent = "…";
      renderActions();
    });
  } else {
    renderActions();
  }
}

function doAction(key) {
  const a = ALL_ACTIONS[key];
  const s = state;

  if (a.kidnap) {
    document.getElementById("logText").textContent = a.logs[0];
    document.getElementById("moodText").style.visibility = "hidden";
    document.querySelectorAll(".action-btn").forEach(b => b.disabled = true);

    flashEffect();
    diffKey = "hard";
    state.tracking = 20;
    actionPool = HARD_POOL;
    document.body.classList.add("hard-mode");
    render();

    showContinue("🏃 逃げる", () => {
      document.getElementById("moodText").style.visibility = "visible";
      showHideoutEvent(0);
    });
    return;
  }

  s.bond = clamp(s.bond + a.bond, 0, 150);
  s.health = clamp(s.health + a.health, 0, 100);
  if (diffKey === "hard") {
    s.tracking = clamp((s.tracking || 0) + (a.trace || 0), 0, 100);
  }

  if (a.snack) s.snackCount++;

  document.getElementById("logText").textContent =
    a.logs[Math.floor(Math.random() * a.logs.length)];

  document.getElementById("moodText").style.visibility = "hidden";

  const imgKey =
    key === "sleep" ? "sleep" :
      key === "feed" ? "feed" :
        key === "snack" ? "snack" :
          key === "forcePlay" ? "force" :
            key === "watch" ? "watch" :
              key === "play" ? "play" :
                "normal";

  document.querySelectorAll(".action-btn").forEach(b => b.disabled = true);

  const img = document.getElementById("groguImg");
  img.classList.add("bounce");
  img.addEventListener("animationend", () => img.classList.remove("bounce"), { once: true });

  flashEffect();
  render();
  setImg(imgKey);

  showContinue("🐾 つづける", () => {
    setImg("normal");
    document.getElementById("logText").textContent = "…";
    document.getElementById("moodText").style.visibility = "visible";
    proceedNextTurn();
  });
}


function showRottaEnding() {
  recordEnding("hard_rotta");
  hideOverlay();
  hideContinue();
  document.querySelectorAll(".action-btn").forEach(b => b.disabled = true);
  const screen = document.getElementById("rottaScreen");
  const cap = document.getElementById("rottaCaption");
  cap.textContent = "あなたは逃げ切った。\n……と思った瞬間。\n\nロッタが上から転がってきた。\nあなたは踏み潰された。";
  screen.style.display = "block";
}

function resetFromRotta() {
  const screen = document.getElementById("rottaScreen");
  screen.style.display = "none";
  document.body.classList.remove("hard-mode");
  startDiffSelect();
}


function showDeadEndHideout() {
  hideOverlay();
  hideContinue();
  document.querySelectorAll(".action-btn").forEach(b => b.disabled = true);

  const screen = document.getElementById("deadEndScreen");
  const story = document.getElementById("deadStory");
  const title = document.getElementById("deadTitle");
  const btn = document.getElementById("deadResetBtn");

  screen.style.display = "flex";
  story.textContent = "";
  story.classList.remove("show");
  title.style.display = "none";
  btn.style.display = "none";

  recordEnding("hard_bad_hideout");

  const steps = [
    "物陰の向こうに、誰かが立っていた。",
    "グローグーは小さく声をあげる。",
    "まるで、帰る場所を見つけたみたいに。",
    "「……見つけた」",
    "マンドーだった。"
  ];

  let i = 0;
  function nextStep() {
    if (i >= steps.length) {
      setTimeout(() => {
        story.classList.remove("show");
        setTimeout(() => {
          story.style.display = "none";
          title.style.display = "block";
          setTimeout(() => {
            btn.style.display = "inline-block";
          }, 700);
        }, 700);
      }, 1100);
      return;
    }

    story.style.display = "block";
    story.textContent = steps[i];
    requestAnimationFrame(() => story.classList.add("show"));

    const wait = i === 2 ? 1700 : 2100;
    setTimeout(() => {
      story.classList.remove("show");
      setTimeout(() => {
        i++;
        nextStep();
      }, 650);
    }, wait);
  }

  setTimeout(nextStep, 650);
}

function showSenseDeadEnd() {
  hideOverlay();
  hideContinue();
  document.querySelectorAll(".action-btn").forEach(b => b.disabled = true);

  const screen = document.getElementById("deadEndScreen");
  const story = document.getElementById("deadStory");
  const title = document.getElementById("deadTitle");
  const btn = document.getElementById("deadResetBtn");

  screen.style.display = "flex";
  story.textContent = "";
  story.classList.remove("show");
  title.style.display = "none";
  btn.style.display = "none";

  const steps = [
    "グローグーが弱ってしまった。",
    "その異変は、\nフォースを通じて銀河へ広がる。",
    "静かな光とともに現れたのは、",
    "ルーク・スカイウォーカーだった。",
    "あなたは悟る。",
    "もう逃げられない。"
  ];

  let i = 0;

  function nextStep() {
    if (i >= steps.length) {
      setTimeout(() => {
        story.classList.remove("show");

        setTimeout(() => {
          story.style.display = "none";
          title.textContent = "DEAD END";
          title.style.display = "block";

          setTimeout(() => {
            btn.style.display = "inline-block";
          }, 700);
        }, 700);
      }, 1100);
      return;
    }

    story.style.display = "block";
    story.textContent = steps[i];

    requestAnimationFrame(() => {
      story.classList.add("show");
    });

    const wait = i === 5 ? 2400 : 2100;

    setTimeout(() => {
      story.classList.remove("show");

      setTimeout(() => {
        i++;
        nextStep();
      }, 650);
    }, wait);
  }

  setTimeout(nextStep, 650);
}

function resetFromDeadEnd() {
  const screen = document.getElementById("deadEndScreen");
  const story = document.getElementById("deadStory");
  const title = document.getElementById("deadTitle");
  const btn = document.getElementById("deadResetBtn");

  screen.style.display = "none";
  story.style.display = "block";
  story.textContent = "";
  story.classList.remove("show");
  title.style.display = "none";
  btn.style.display = "none";

  document.body.classList.remove("hard-mode");
  startDiffSelect();
}

function showHideoutEvent(idx) {
  const ev = HIDEOUT_EVENTS[idx];

  const ch = ev.choices.map((c, i) =>
    '<button class="hideout-btn" onclick="resolveHideout(' + i + ',' + idx + ')">' +
    c.label +
    '</button>'
  ).join("");

  const img = document.getElementById("ovImg");
  img.classList.add("hideout-img");
  img.src = IMGS.hideout;

  document.getElementById("ovTitle").textContent = ev.title;
  document.getElementById("ovMsg").textContent =
    ev.desc +
    (diffKey === "hard"
      ? "\n\n現在の気配：" + getTraceLabel(state.tracking || 0)
      : "");

  document.getElementById("ovBtns").innerHTML =
    '<div class="hideout-btns">' + ch + '</div>';

  document.getElementById("overlay").style.display = "flex";
  document.querySelectorAll(".action-btn").forEach(b => b.disabled = true);
}

function resolveHideout(ci, ei) {
  const choice = HIDEOUT_EVENTS[ei].choices[ci];
  hideOverlay();

  if (!choice.success || (state.tracking || 0) >= 82) {
    showDeadEndHideout();
    return;
  }

  state.tracking = clamp((state.tracking || 0) - 14, 0, 100);
  document.getElementById("logText").textContent = "うまく潜伏先を変えた。気配が少し薄くなった。";
  state.turn++;
  render();

  if (state.turn > TOTAL_TURNS) {
    resolveFinalEnding();
    return;
  }

  showContinue("🐾 つづける", () => {
    document.getElementById("logText").textContent = "…";
    renderActions();
  });
}

function startGame(key) {
  diffKey = key;

  if (key === "hard") {
    document.body.classList.add("hard-mode");
  } else {
    document.body.classList.remove("hard-mode");
  }

  actionPool = key === "easy" ? EASY_POOL : HARD_POOL;
  state = {
    turn: 1,
    bond: 0,
    health: 80,
    snackCount: 0,
    tracking: key === "hard" ? 0 : 0
  };

  hideOverlay();
  hideContinue();
  document.getElementById("rottaScreen").style.display = "none";
  setImg("start");

  document.getElementById("logText").textContent =
    key === "easy"
      ? "マンドーは用事のため出かけていった。\n\n夕方まで、グローグーのお世話をお願いされた。"
      : "ひとり歩くグローグーを見つけました。\n保護しようとしているのか、連れ去ろうとしているのか…\nあなた自身にも、わからない。";

  render();

  showContinue("🐾 お世話をはじめる", () => {
    document.getElementById("logText").textContent = "…";

    render();
    renderActions();
  });
}

function startDiffSelect() {
  document.getElementById("ovImg").src = IMGS.start;
  document.getElementById("ovTitle").textContent = "グローグーおるすばん";
  document.getElementById("ovMsg").textContent = "マンドーが帰ってくるまで、グローグーと過ごそう。\nエンド回収率：" + endingCountText();
  document.getElementById("ovBtns").innerHTML =
    '<div class="diff-btns">' +
    '<button class="diff-btn" onclick="startGame(\'easy\')">' +
    '<strong>🌸 やさしい</strong>' +
    '<small>朝から夕方まで、グローグーのお世話をします。</small>' +
    '</button>' +
    '<button class="diff-btn" onclick="startGame(\'hard\')">' +
    '<strong>🔥 むずかしい</strong>' +
    '<small>ひとり歩くグローグーを見つけました。</small>' +
    '</button>' +
    '</div>' +
    '<button class="sub-btn" onclick="showEndingCollection()">エンディング一覧</button>';

  document.getElementById("overlay").style.display = "flex";
  document.querySelectorAll(".action-btn").forEach(b => b.disabled = true);
}

startDiffSelect();

(function () {
  function updateActionLogVisibility() {
    const log = document.getElementById('logText');
    const continueArea = document.getElementById('continuePanel');
    if (!log || !continueArea) return;

    const continueVisible = getComputedStyle(continueArea).display !== 'none';

    // 「なにをする？」表示中（= つづける等が出ていない時）はログを隠す
    log.style.display = continueVisible ? '' : 'none';
  }

  const observer = new MutationObserver(updateActionLogVisibility);

  window.addEventListener('load', () => {
    const continueArea = document.getElementById('continuePanel');
    if (continueArea) {
      observer.observe(continueArea, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
    updateActionLogVisibility();
  });
})();
