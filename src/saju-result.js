import { buildManseResponse } from "./manse.js";

const nameEl = document.getElementById("result-name");
const subtitleEl = document.getElementById("result-subtitle");

const seasonalSummaryBadgeEl = document.getElementById("result-seasonal-summary-badge");
const seasonalSummaryTextEl = document.getElementById("result-seasonal-summary-text");
const seasonalSummaryIconEl = document.getElementById("result-seasonal-summary-icon");
const elementSummaryEl = document.getElementById("element-summary-text");
const pillarDescriptionEls = {
  hour: document.getElementById("hour-pillar-description"),
  day: document.getElementById("day-pillar-description"),
  month: document.getElementById("month-pillar-description"),
  year: document.getElementById("year-pillar-description")
};

const pillarEls = {
  hour: document.getElementById("hour-pillar"),
  day: document.getElementById("day-pillar"),
  month: document.getElementById("month-pillar"),
  year: document.getElementById("year-pillar")
};

const pillarHanjaEls = {
  hour: document.getElementById("hour-pillar-hanja"),
  day: document.getElementById("day-pillar-hanja"),
  month: document.getElementById("month-pillar-hanja"),
  year: document.getElementById("year-pillar-hanja")
};

const PILLAR_META = {
  hour: { type: "hour", label: "시주" },
  day: { type: "day", label: "일주" },
  month: { type: "month", label: "월주" },
  year: { type: "year", label: "년주" }
};

const DAY_STEM_TO_LABEL = {
  갑: "자라난 나무",
  을: "피어난 꽃",
  병: "뜬 태양",
  정: "밝힌 등불",
  무: "솟아난 태산",
  기: "일구어진 비옥한 땅",
  경: "제련된 강철",
  신: "빛나는 보석",
  임: "찰랑이는 바다",
  계: "맺힌 이슬"
};

const MONTH_BRANCH_TO_SEASON = {
  자: "한겨울에",
  축: "늦겨울에",
  인: "초봄에",
  묘: "봄에",
  진: "늦봄에",
  사: "초여름에",
  오: "한여름에",
  미: "늦여름에",
  신: "초가을에",
  유: "가을에",
  술: "늦가을에",
  해: "초겨울에"
};

const DAY_STEM_TO_ICON = {
  갑: "park",
  을: "local_florist",
  병: "wb_sunny",
  정: "lightbulb",
  무: "terrain",
  기: "grass",
  경: "hardware",
  신: "diamond",
  임: "waves",
  계: "water_drop"
};

const DAY_STEM_TO_SUMMARY_THEME = {
  갑: {
    background: "rgba(47, 111, 78, 0.14)",
    border: "rgba(47, 111, 78, 0.28)",
    text: "#2f6f4e"
  },
  을: {
    background: "rgba(47, 111, 78, 0.14)",
    border: "rgba(47, 111, 78, 0.28)",
    text: "#2f6f4e"
  },
  병: {
    background: "rgba(255, 218, 214, 0.7)",
    border: "rgba(194, 34, 37, 0.2)",
    text: "#c22225"
  },
  정: {
    background: "rgba(255, 218, 214, 0.7)",
    border: "rgba(194, 34, 37, 0.2)",
    text: "#c22225"
  },
  무: {
    background: "rgba(218, 166, 37, 0.18)",
    border: "rgba(185, 126, 13, 0.32)",
    text: "#8a6500"
  },
  기: {
    background: "rgba(218, 166, 37, 0.18)",
    border: "rgba(185, 126, 13, 0.32)",
    text: "#8a6500"
  },
  경: {
    background: "rgba(255, 255, 255, 0.82)",
    border: "rgba(129, 129, 120, 0.32)",
    text: "#55585a"
  },
  신: {
    background: "rgba(255, 255, 255, 0.82)",
    border: "rgba(129, 129, 120, 0.32)",
    text: "#55585a"
  },
  임: {
    background: "rgba(55, 116, 170, 0.14)",
    border: "rgba(55, 116, 170, 0.28)",
    text: "#356d9d"
  },
  계: {
    background: "rgba(55, 116, 170, 0.14)",
    border: "rgba(55, 116, 170, 0.28)",
    text: "#356d9d"
  }
};

const ELEMENT_KEYS = ["wood", "fire", "earth", "metal", "water"];
const ELEMENT_TOTAL = 8;
const ELEMENT_LABELS = {
  wood: "목(木)",
  fire: "화(火)",
  earth: "토(土)",
  metal: "금(金)",
  water: "수(水)"
};
const ELEMENT_TRAIT_KEYWORDS = {
  wood: "성장력",
  fire: "표현력",
  earth: "안정감",
  metal: "판단력",
  water: "통찰력"
};
const ELEMENT_WEAK_TIPS = {
  wood: "새로운 시도와 시작 에너지를 의식적으로 보강해보세요.",
  fire: "감정 표현과 실행의 온도를 조금 더 올려보세요.",
  earth: "생활 리듬을 안정적으로 유지해 중심을 단단히 잡아보세요.",
  metal: "기준 정리와 우선순위 설정을 더 선명하게 해보세요.",
  water: "휴식과 성찰 시간을 확보해 내면의 흐름을 채워보세요."
};

const PILLAR_DESCRIPTION_MAP = {
  갑술: "늦가을 바위 위에 홀로 선 고목",
  갑신: "깎아지른 절벽 끝에 선 장대한 노송",
  갑오: "햇빛을 등지고 숭고히 빛을 밝히는 거목",
  갑인: "숲의 중심을 곧게 세운 장대한 소나무",
  갑자: "얼어붙은 호수 위로 뿌리 내린 노송",
  갑진: "비옥한 들판에 굵은 뿌리를 펼친 거목",

  경술: "황혼빛에 서늘하게 번뜩이는 검",
  경신: "강대하게 제련된 웅대한 대검",
  경오: "뜨거운 열기 속에서 제련된 칼날",
  경인: "숲을 옹골차게 다듬어 나가는 도끼",
  경자: "얼음물 한가운데 담금질한 냉철한 검",
  경진: "젖은 대지 위에 우뚝 솟은 강철",

  계묘: "봄비 아래 새싹을 깨우는 투명한 이슬",
  계미: "메마른 사막 위에 내리는 반가운 단비",
  계사: "태양 아래 싱그럽게 빛나는 물방울",
  계유: "수정잔 안에 담긴 반짝이는 고운 이슬",
  계축: "겨울 언 땅 틈을 뚫고 오르는 물줄기",
  계해: "끝 없이 펼쳐진 바다에 내리는 세찬 빗줄기",

  기묘: "봄기운을 머금은 땅에 피어나는 어린 줄기",
  기미: "끝을 모르는 광활한 사막",
  기사: "따뜻한 볕 아래 생명을 밀어 올리는 땅",
  기유: "보석을 품은 비옥한 생명의 터전",
  기축: "얼어붙은 땅 아래 봄을 기다리는 비옥한 땅",
  기해: "대양을 항해하는 생명이 움트는 섬",

  무술: "고개 너머 끝까지 펼차진 바위산",
  무신: "광맥을 품고 보석빛을 뿜는 대산",
  무오: "용암을 속에 품은 뜨거운 활화산",
  무인: "거대한 명품 노송을 품은 바위산",
  무자: "큰 호수를 중심으로 펼쳐진 태산",
  무진: "끝없이 펼쳐진 비옥하고 묵직한 태산",

  병술: "가을 산 노을 위로 뜨겁게 타오르는 태양",
  병신: "바위를 황금빛으로 비추는 붉은 태양",
  병오: "거세게 작열하며 이글거리는 태양",
  병인: "숲을 아름답게 장엄하는 따스한 해",
  병자: "겨울 호수를 비추는 눈부신 태양",
  병진: "늪지의 생명을 움틔우는 봄의 태양",

  신묘: "정원을 아름답게 가꾸는 보석 가위",
  신미: "사막에 묻힌 영롱히 빛나는 보석",
  신사: "불에 제련되어 단단하고 또렷해진 보석",
  신유: "완벽하게 정제된 순수 다이아몬드",
  신축: "얼어붙은 땅속에서도 또렷이 빛나는 보석",
  신해: "깊은 바다속 아름답게 빛나는 진주",

  을묘: "정원을 끝없이 장식하는 넝쿨줄기",
  을미: "사막에서도 꼿꼿이 자라난 선인장",
  을사: "태양 아래 선명하게 피어난 화사한 꽃",
  을유: "날카롭고 완벽히 다듬어진 분재",
  을축: "언땅을 뚫고 당당히 피어난 야생초",
  을해: "겨울호수 위로 피어난 단아한 연꽃",

  임술: "바위산맥 속 맑고 깊은 호수",
  임신: "단단한 바위를 뚫고 나오는 거센 물줄기",
  임오: "용암을 품은 달빛 비치는 밤바다",
  임인: "숲속으로 세차게 흘러들어가는 시내",
  임자: "세찬 소용돌이를 품은 심연깊은 대양",
  임진: "거대한 댐안에 응축된 담수",

  정묘: "어린나무를 지키며 피어오르는 작은 등불",
  정미: "사막에서 뜨겁게 타오르는 모닥불",
  정사: "끝없이 열기를 일으키는 용광로",
  정유: "반짝이는 보석을 비추는 촛불",
  정축: "얼어붙은 땅을 녹여내는 모닥불",
  정해: "밤바다를 비추는 고요한 별빛"
};

const pillarCards = {
  hour: pillarEls.hour?.closest("div.relative") ?? null,
  day: pillarEls.day?.closest("div.relative") ?? null,
  month: pillarEls.month?.closest("div.relative") ?? null,
  year: pillarEls.year?.closest("div.relative") ?? null
};
const pillarTrackEl = document.querySelector(".pillar-cards-track");
const pillarCardEntries = Object.entries(pillarCards).filter(([, cardEl]) => Boolean(cardEl));
const pillarCardsDesktopQuery = window.matchMedia("(min-width: 640px)");
const DEFAULT_ACTIVE_PILLAR = "day";
let activePillarSyncFrame = null;

function formatCalendarLabel(calendarType) {
  return calendarType === "lunar" ? "음력 기준" : "양력 기준";
}

function getQueryParams() {
  const query = new URLSearchParams(window.location.search);
  return {
    name: query.get("name") ?? "",
    birthDate: query.get("birthDate") ?? "",
    calendarType: query.get("calendarType") ?? query.get("calendar_type") ?? "solar",
    timeBranch: query.get("timeBranch") ?? "unknown"
  };
}

function getDetailPassThroughParams() {
  const query = new URLSearchParams(window.location.search);
  return {
    name: query.get("name") ?? "",
    hanjaName: query.get("hanjaName") ?? "",
    birthDate: query.get("birthDate") ?? "",
    gender: query.get("gender") ?? "",
    calendarType: query.get("calendarType") ?? query.get("calendar_type") ?? "",
    timeBranch: query.get("timeBranch") ?? query.get("time_branch") ?? ""
  };
}

function getStemAndBranch(pillarHangul) {
  const chars = [...String(pillarHangul ?? "").trim()];
  return {
    stem: chars[0] ?? "",
    branch: chars[1] ?? ""
  };
}

function applySeasonalSummaryTheme(dayStem) {
  const theme = DAY_STEM_TO_SUMMARY_THEME[dayStem] ?? DAY_STEM_TO_SUMMARY_THEME.병;

  if (seasonalSummaryBadgeEl) {
    seasonalSummaryBadgeEl.style.backgroundColor = theme.background;
    seasonalSummaryBadgeEl.style.borderColor = theme.border;
  }
  if (seasonalSummaryTextEl) {
    seasonalSummaryTextEl.style.color = theme.text;
  }
  if (seasonalSummaryIconEl) {
    seasonalSummaryIconEl.style.color = theme.text;
  }
}

function updateSeasonalSummary(pillars) {
  const day = getStemAndBranch(pillars?.day?.hangul ?? "");
  const month = getStemAndBranch(pillars?.month?.hangul ?? "");

  const dayLabel = DAY_STEM_TO_LABEL[day.stem];
  const seasonLabel = MONTH_BRANCH_TO_SEASON[month.branch];
  const iconName = DAY_STEM_TO_ICON[day.stem] ?? "auto_awesome";

  if (seasonalSummaryTextEl) {
    seasonalSummaryTextEl.textContent =
      dayLabel && seasonLabel ? `${seasonLabel} ${dayLabel}` : "사주의 흐름을 해석하는 중";
  }

  if (seasonalSummaryIconEl) {
    seasonalSummaryIconEl.textContent = iconName;
  }

  applySeasonalSummaryTheme(day.stem);
}

function updateSeasonalSummaryFromCurrentPillars() {
  updateSeasonalSummary({
    day: { hangul: pillarEls.day?.textContent?.trim() ?? "" },
    month: { hangul: pillarEls.month?.textContent?.trim() ?? "" }
  });
}

function getPillarDescription(pillarHangul) {
  const key = String(pillarHangul ?? "").trim();
  return PILLAR_DESCRIPTION_MAP[key] ?? "사주의 기운을 해석하는 중";
}

function applyPillarDescriptions(pillars) {
  Object.entries(pillarDescriptionEls).forEach(([key, descriptionEl]) => {
    if (!descriptionEl) {
      return;
    }
    const hangul = pillars?.[key]?.hangul ?? "";
    descriptionEl.textContent = getPillarDescription(hangul);
  });
}

function applyPillarDescriptionsFromCurrentPillars() {
  applyPillarDescriptions({
    hour: { hangul: pillarEls.hour?.textContent?.trim() ?? "" },
    day: { hangul: pillarEls.day?.textContent?.trim() ?? "" },
    month: { hangul: pillarEls.month?.textContent?.trim() ?? "" },
    year: { hangul: pillarEls.year?.textContent?.trim() ?? "" }
  });
}

function isMobilePillarCards() {
  return !pillarCardsDesktopQuery.matches;
}

function updatePillarActionLabels() {
  const label = isMobilePillarCards() ? "터치!" : "클릭!";

  pillarCardEntries.forEach(([, cardEl]) => {
    const badgeEl = cardEl.querySelector(".pillar-action-badge");
    if (badgeEl) {
      badgeEl.textContent = label;
    }
  });
}

function setActivePillarCard(activeKey = DEFAULT_ACTIVE_PILLAR) {
  const safeActiveKey = pillarCards[activeKey] ? activeKey : DEFAULT_ACTIVE_PILLAR;

  updatePillarActionLabels();
  pillarCardEntries.forEach(([key, cardEl]) => {
    cardEl.classList.toggle("is-active", key === safeActiveKey);
  });
}

function getCenteredPillarKey() {
  if (!pillarTrackEl || pillarCardEntries.length === 0) {
    return DEFAULT_ACTIVE_PILLAR;
  }

  const trackRect = pillarTrackEl.getBoundingClientRect();
  const trackCenterX = trackRect.left + trackRect.width / 2;
  let centeredKey = DEFAULT_ACTIVE_PILLAR;
  let smallestDistance = Number.POSITIVE_INFINITY;

  pillarCardEntries.forEach(([key, cardEl]) => {
    const slideEl = cardEl.closest(".pillar-slide");
    if (!slideEl) {
      return;
    }

    const slideRect = slideEl.getBoundingClientRect();
    const slideCenterX = slideRect.left + slideRect.width / 2;
    const distance = Math.abs(slideCenterX - trackCenterX);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      centeredKey = key;
    }
  });

  return centeredKey;
}

function syncActivePillarCard() {
  if (isMobilePillarCards()) {
    setActivePillarCard(getCenteredPillarKey());
    return;
  }

  setActivePillarCard(DEFAULT_ACTIVE_PILLAR);
}

function scheduleActivePillarCardSync() {
  if (activePillarSyncFrame !== null) {
    return;
  }

  activePillarSyncFrame = window.requestAnimationFrame(() => {
    activePillarSyncFrame = null;
    syncActivePillarCard();
  });
}

function setupPillarCardHighlights() {
  setActivePillarCard(DEFAULT_ACTIVE_PILLAR);

  pillarCardEntries.forEach(([key, cardEl]) => {
    cardEl.addEventListener("mouseenter", () => {
      if (!isMobilePillarCards()) {
        setActivePillarCard(key);
      }
    });

    cardEl.addEventListener("focusin", () => {
      if (!isMobilePillarCards()) {
        setActivePillarCard(key);
      }
    });

    cardEl.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (isMobilePillarCards()) {
          return;
        }

        const focusInsideCards = pillarCardEntries.some(([, entryCardEl]) =>
          entryCardEl.contains(document.activeElement)
        );
        if (!focusInsideCards) {
          setActivePillarCard(DEFAULT_ACTIVE_PILLAR);
        }
      }, 0);
    });
  });

  if (pillarTrackEl) {
    pillarTrackEl.addEventListener(
      "scroll",
      () => {
        if (isMobilePillarCards()) {
          scheduleActivePillarCardSync();
        }
      },
      { passive: true }
    );

    pillarTrackEl.addEventListener("mouseleave", () => {
      if (!isMobilePillarCards()) {
        setActivePillarCard(DEFAULT_ACTIVE_PILLAR);
      }
    });
  }

  const onViewportModeChange = () => {
    scheduleActivePillarCardSync();
  };

  if (typeof pillarCardsDesktopQuery.addEventListener === "function") {
    pillarCardsDesktopQuery.addEventListener("change", onViewportModeChange);
  } else if (typeof pillarCardsDesktopQuery.addListener === "function") {
    pillarCardsDesktopQuery.addListener(onViewportModeChange);
  }
}

function applyPillars(pillars) {
  if (pillarEls.hour) {
    pillarEls.hour.textContent = pillars.hour.hangul;
  }
  if (pillarHanjaEls.hour) {
    pillarHanjaEls.hour.textContent = pillars.hour.hanja;
  }
  if (pillarEls.day) {
    pillarEls.day.textContent = pillars.day.hangul;
  }
  if (pillarHanjaEls.day) {
    pillarHanjaEls.day.textContent = pillars.day.hanja;
  }
  if (pillarEls.month) {
    pillarEls.month.textContent = pillars.month.hangul;
  }
  if (pillarHanjaEls.month) {
    pillarHanjaEls.month.textContent = pillars.month.hanja;
  }
  if (pillarEls.year) {
    pillarEls.year.textContent = pillars.year.hangul;
  }
  if (pillarHanjaEls.year) {
    pillarHanjaEls.year.textContent = pillars.year.hanja;
  }
}

function normalizeElementCounts(elements) {
  return ELEMENT_KEYS.reduce((acc, key) => {
    const count = Math.max(0, Math.min(ELEMENT_TOTAL, Number(elements?.[key]) || 0));
    acc[key] = count;
    return acc;
  }, {});
}

function formatKoreanList(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "";
  }
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return `${items[0]}와 ${items[1]}`;
  }
  return `${items.slice(0, -1).join(", ")}와 ${items.at(-1)}`;
}

function formatElementList(keys) {
  const labels = keys
    .map((key) => ELEMENT_LABELS[key])
    .filter((label) => typeof label === "string" && label.length > 0);
  return formatKoreanList(labels);
}

function readElementCountsFromDom() {
  return ELEMENT_KEYS.reduce((acc, key) => {
    const countEl = document.querySelector(`[data-element-count="${key}"]`);
    const parsed = Number(countEl?.textContent?.trim());
    acc[key] = Number.isFinite(parsed) ? parsed : 0;
    return acc;
  }, {});
}

function buildElementSummaryText(elements) {
  const normalized = normalizeElementCounts(elements);
  const values = Object.values(normalized);
  const max = Math.max(...values);
  const min = Math.min(...values);

  if (max === 0) {
    return "오행 기운을 분석하는 중입니다.";
  }

  const dominantKeys = ELEMENT_KEYS.filter((key) => normalized[key] === max);
  const weakKeys = ELEMENT_KEYS.filter((key) => normalized[key] === min);
  const dominantLabelText = formatElementList(dominantKeys);
  const dominantTraits = formatKoreanList(
    dominantKeys.map((key) => ELEMENT_TRAIT_KEYWORDS[key]).filter(Boolean)
  );

  if (max - min <= 1) {
    if (dominantKeys.length >= 3) {
      return "오행이 전반적으로 고르게 분포해 균형감이 좋은 사주입니다.";
    }
    return `오행이 비교적 고르게 분포해 균형감이 좋고, ${dominantLabelText} 기운을 중심으로 ${dominantTraits}이 안정적으로 드러납니다.`;
  }

  const weakLabelText = formatElementList(weakKeys);
  const weakAdvice =
    weakKeys.length === 1
      ? ELEMENT_WEAK_TIPS[weakKeys[0]]
      : "부족한 영역을 작은 루틴으로 보완하면 전체 흐름의 균형이 더 좋아집니다.";
  const weakTone = min === 0 ? "비어 있는 편이라" : "옅은 편이라";

  return `${dominantLabelText} 기운이 두드러져 ${dominantTraits} 중심의 성향이 강하게 드러납니다. 상대적으로 ${weakLabelText} 기운은 ${weakTone} ${weakAdvice}`;
}

function applyElementSummary(elements) {
  if (!elementSummaryEl) {
    return;
  }
  elementSummaryEl.textContent = buildElementSummaryText(elements);
}

function applyElementCounts(elements) {
  const normalized = normalizeElementCounts(elements);

  ELEMENT_KEYS.forEach((element) => {
    const count = normalized[element] ?? 0;
    const countEls = document.querySelectorAll(`[data-element-count="${element}"]`);
    const barEls = document.querySelectorAll(`[data-element-bar="${element}"]`);
    const percent = (count / ELEMENT_TOTAL) * 100;

    countEls.forEach((countEl) => {
      countEl.textContent = String(count);
    });

    barEls.forEach((barEl) => {
      barEl.style.setProperty("--element-percent", `${percent}%`);
    });
  });
}

function applyPillarImages() {
  const imageEls = document.querySelectorAll("img[data-pillar-image]");
  const pillarsByKey = {
    hour: pillarEls.hour?.textContent?.trim() ?? "",
    day: pillarEls.day?.textContent?.trim() ?? "",
    month: pillarEls.month?.textContent?.trim() ?? "",
    year: pillarEls.year?.textContent?.trim() ?? ""
  };

  imageEls.forEach((imgEl) => {
    const key = imgEl.dataset.pillarImage;
    const pillar = key ? pillarsByKey[key] ?? "" : "";

    if (!pillar) {
      imgEl.removeAttribute("src");
      imgEl.style.display = "none";
      return;
    }

    const imagePath = `./images-webp/${pillar}.webp`;
    const probe = new Image();

    probe.onload = () => {
      imgEl.src = probe.src;
      imgEl.style.display = "";
    };

    probe.onerror = () => {
      imgEl.removeAttribute("src");
      imgEl.style.display = "none";
    };

    probe.src = imagePath;
  });
}

function applyPillarVideos() {
  const imageEls = document.querySelectorAll("img[data-pillar-image]");
  const pillarsByKey = {
    hour: pillarEls.hour?.textContent?.trim() ?? "",
    day: pillarEls.day?.textContent?.trim() ?? "",
    month: pillarEls.month?.textContent?.trim() ?? "",
    year: pillarEls.year?.textContent?.trim() ?? ""
  };

  imageEls.forEach((imgEl) => {
    const card = imgEl.closest("div.relative");
    if (!card) {
      return;
    }

    let videoEl = card.querySelector("video[data-pillar-video]");
    if (!videoEl) {
      videoEl = document.createElement("video");
      videoEl.dataset.pillarVideo = "true";
      videoEl.className =
        "absolute inset-0 h-full w-full object-cover object-center opacity-0 pointer-events-none transition-opacity duration-300";
      videoEl.muted = true;
      videoEl.loop = true;
      videoEl.playsInline = true;
      videoEl.preload = "metadata";
      imgEl.insertAdjacentElement("afterend", videoEl);
    }

    const key = imgEl.dataset.pillarImage;
    const pillar = key ? pillarsByKey[key] ?? "" : "";
    if (!pillar) {
      videoEl.pause();
      videoEl.removeAttribute("src");
      videoEl.dataset.ready = "false";
      videoEl.classList.add("opacity-0");
      return;
    }

    videoEl.pause();
    videoEl.currentTime = 0;
    videoEl.dataset.ready = "false";
    videoEl.classList.add("opacity-0");
    videoEl.onloadeddata = () => {
      videoEl.dataset.ready = "true";
    };
    videoEl.onerror = () => {
      videoEl.dataset.ready = "false";
      videoEl.removeAttribute("src");
    };
    videoEl.src = `./videos/${pillar}.mp4`;
    videoEl.load();

    const stopVideoPreview = () => {
      videoEl.onended = null;
      videoEl.loop = true;
      videoEl.dataset.playMode = "idle";
      videoEl.classList.add("opacity-0");
      videoEl.pause();
      videoEl.currentTime = 0;
    };

    const playVideoPreview = (mode = "hover") => {
      if (videoEl.dataset.ready !== "true") {
        return;
      }

      videoEl.onended = null;
      if (mode === "once") {
        videoEl.loop = false;
        videoEl.currentTime = 0;
        videoEl.dataset.playMode = "once";
        videoEl.onended = () => {
          stopVideoPreview();
        };
      } else {
        videoEl.loop = true;
        videoEl.currentTime = 0;
        videoEl.dataset.playMode = "hover";
      }

      videoEl.classList.remove("opacity-0");
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    };

    card.onmouseenter = () => {
      if (videoEl.dataset.playMode === "once") {
        return;
      }
      playVideoPreview("hover");
    };

    card.onmouseleave = () => {
      if (videoEl.dataset.playMode === "once") {
        return;
      }
      stopVideoPreview();
    };

    // Mobile long-press preview: start once, then keep playing until it ends.
    let longPressTimer = null;
    let longPressTriggered = false;
    let pressStartX = 0;
    let pressStartY = 0;
    const LONG_PRESS_DELAY_MS = 260;
    const MOVE_CANCEL_THRESHOLD = 12;

    const clearLongPressTimer = () => {
      if (longPressTimer !== null) {
        window.clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };

    const cancelLongPress = () => {
      clearLongPressTimer();
    };

    card.onpointerdown = (event) => {
      if (event.pointerType !== "touch") {
        return;
      }

      pressStartX = event.clientX;
      pressStartY = event.clientY;
      longPressTriggered = false;
      clearLongPressTimer();

      longPressTimer = window.setTimeout(() => {
        longPressTimer = null;
        longPressTriggered = true;
        card.dataset.suppressClickUntil = String(Date.now() + 1400);
        playVideoPreview("once");
      }, LONG_PRESS_DELAY_MS);
    };

    card.onpointermove = (event) => {
      if (event.pointerType !== "touch") {
        return;
      }

      const movedX = Math.abs(event.clientX - pressStartX);
      const movedY = Math.abs(event.clientY - pressStartY);
      if (movedX < MOVE_CANCEL_THRESHOLD && movedY < MOVE_CANCEL_THRESHOLD) {
        return;
      }

      cancelLongPress();
    };

    card.onpointerup = (event) => {
      if (event.pointerType !== "touch") {
        return;
      }
      // If long press was triggered, keep playback running until video end.
      if (!longPressTriggered) {
        cancelLongPress();
      } else {
        clearLongPressTimer();
      }
    };

    card.onpointercancel = (event) => {
      if (event.pointerType !== "touch") {
        return;
      }
      if (!longPressTriggered) {
        cancelLongPress();
      } else {
        clearLongPressTimer();
      }
    };

    card.onpointerleave = (event) => {
      if (event.pointerType !== "touch") {
        return;
      }
      if (!longPressTriggered) {
        cancelLongPress();
      } else {
        clearLongPressTimer();
      }
    };
  });
}

function moveToPillarDetail(cardEl) {
  if (!cardEl) {
    return;
  }

  const targetUrl = cardEl.dataset.targetUrl;
  if (targetUrl) {
    window.location.href = targetUrl;
  }
}

function bindPillarNavigation() {
  Object.values(pillarCards).forEach((cardEl) => {
    if (!cardEl || cardEl.dataset.navBound === "true") {
      return;
    }

    cardEl.addEventListener("click", (event) => {
      const suppressUntil = Number(cardEl.dataset.suppressClickUntil || "0");
      if (suppressUntil > Date.now()) {
        cardEl.dataset.suppressClickUntil = "0";
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      moveToPillarDetail(cardEl);
    });

    cardEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        moveToPillarDetail(cardEl);
      }
    });

    cardEl.dataset.navBound = "true";
  });
}

function updatePillarNavigation() {
  const passThroughParams = getDetailPassThroughParams();
  const pillarContext = {
    hour: pillarEls.hour?.textContent?.trim() ?? "",
    day: pillarEls.day?.textContent?.trim() ?? "",
    month: pillarEls.month?.textContent?.trim() ?? "",
    year: pillarEls.year?.textContent?.trim() ?? ""
  };

  Object.entries(PILLAR_META).forEach(([key, meta]) => {
    const cardEl = pillarCards[key];
    const pillarEl = pillarEls[key];

    if (!cardEl || !pillarEl) {
      return;
    }

    const pillar = pillarEl.textContent?.trim() ?? "";
    let targetUrl = "";

    if (pillar) {
      const query = new URLSearchParams();
      query.set("type", meta.type);
      query.set("pillar", pillar);

      Object.entries(pillarContext).forEach(([contextKey, contextValue]) => {
        if (contextValue) {
          query.set(contextKey, contextValue);
        }
      });

      Object.entries(passThroughParams).forEach(([contextKey, contextValue]) => {
        if (contextValue) {
          query.set(contextKey, contextValue);
        }
      });

      targetUrl = `./pillar.html?${query.toString()}`;
    }

    cardEl.dataset.targetUrl = targetUrl;

    if (targetUrl) {
      cardEl.classList.add("cursor-pointer");
      cardEl.setAttribute("role", "link");
      cardEl.setAttribute("tabindex", "0");
      cardEl.setAttribute("aria-label", `${pillar} ${meta.label} 상세 페이지로 이동`);
    } else {
      cardEl.classList.remove("cursor-pointer");
      cardEl.removeAttribute("role");
      cardEl.removeAttribute("tabindex");
      cardEl.removeAttribute("aria-label");
    }
  });
}

function getCenteredScrollLeft(trackEl, slideEl) {
  const centered = slideEl.offsetLeft - (trackEl.clientWidth - slideEl.clientWidth) / 2;
  const max = Math.max(0, trackEl.scrollWidth - trackEl.clientWidth);
  return Math.min(max, Math.max(0, centered));
}

function focusDayCardOnMobile() {
  if (!pillarTrackEl) {
    return;
  }

  if (window.matchMedia("(min-width: 640px)").matches) {
    return;
  }

  const daySlide = pillarTrackEl.querySelector('.pillar-slide[data-pillar="day"]');
  if (!daySlide) {
    return;
  }

  const targetLeft = getCenteredScrollLeft(pillarTrackEl, daySlide);

  pillarTrackEl.scrollTo({
    left: Math.max(0, targetLeft),
    behavior: "auto"
  });
}

function playInitialSwipeHint() {
  if (!pillarTrackEl) {
    return;
  }

  if (window.matchMedia("(min-width: 640px)").matches) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  if (pillarTrackEl.dataset.swipeHintPlayed === "true") {
    return;
  }

  const daySlide = pillarTrackEl.querySelector('.pillar-slide[data-pillar="day"]');
  if (!daySlide) {
    return;
  }

  const baseLeft = getCenteredScrollLeft(pillarTrackEl, daySlide);
  const maxLeft = Math.max(0, pillarTrackEl.scrollWidth - pillarTrackEl.clientWidth);
  const hintLeft = Math.min(maxLeft, baseLeft + 72);

  if (hintLeft <= baseLeft + 8) {
    return;
  }

  pillarTrackEl.dataset.swipeHintPlayed = "true";

  window.setTimeout(() => {
    pillarTrackEl.scrollTo({ left: hintLeft, behavior: "smooth" });
    window.setTimeout(() => {
      pillarTrackEl.scrollTo({ left: baseLeft, behavior: "smooth" });
    }, 500);
  }, 350);
}

async function loadResult() {
  const params = getQueryParams();

  if (nameEl) {
    nameEl.textContent = params.name || "이름 미입력";
  }

  if (!params.birthDate) {
    if (subtitleEl) {
      subtitleEl.textContent = "생년월일 정보가 없어 결과를 계산할 수 없습니다.";
    }
    applyElementSummary(readElementCountsFromDom());
    updateSeasonalSummaryFromCurrentPillars();
    applyPillarDescriptionsFromCurrentPillars();
    applyPillarImages();
    applyPillarVideos();
    updatePillarNavigation();
    requestAnimationFrame(() => {
      focusDayCardOnMobile();
      syncActivePillarCard();
      playInitialSwipeHint();
    });
    return;
  }

  if (subtitleEl) {
    subtitleEl.textContent = `${params.birthDate} ${formatCalendarLabel(params.calendarType)} 계산 중`;
  }

  try {
    const result = buildManseResponse({
      birthDate: params.birthDate,
      calendarType: params.calendarType,
      timeBranch: params.timeBranch
    });
    applyPillars(result.pillars);
    updateSeasonalSummary(result.pillars);
    applyPillarDescriptions(result.pillars);
    applyElementCounts(result.elements);
    applyElementSummary(result.elements);
    applyPillarImages();
    applyPillarVideos();
    updatePillarNavigation();
    requestAnimationFrame(() => {
      focusDayCardOnMobile();
      syncActivePillarCard();
      playInitialSwipeHint();
    });

    if (subtitleEl) {
      subtitleEl.textContent = `${result.solarDate} (양력) / ${result.lunarDate} (음력)`;
    }
  } catch (error) {
    if (subtitleEl) {
      subtitleEl.textContent =
        error instanceof Error
          ? error.message
          : "결과를 불러오는 중 오류가 발생했습니다.";
    }
    applyElementSummary(readElementCountsFromDom());
    updateSeasonalSummaryFromCurrentPillars();
    applyPillarDescriptionsFromCurrentPillars();
    applyPillarImages();
    applyPillarVideos();
    updatePillarNavigation();
    requestAnimationFrame(() => {
      focusDayCardOnMobile();
      syncActivePillarCard();
      playInitialSwipeHint();
    });
  }
}

bindPillarNavigation();
setupPillarCardHighlights();
updateSeasonalSummaryFromCurrentPillars();
applyPillarDescriptionsFromCurrentPillars();
applyElementSummary(readElementCountsFromDom());
loadResult();

