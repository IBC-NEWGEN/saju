const root = document.documentElement;

root.style.overscrollBehaviorY = "none";
document.body.style.overscrollBehaviorY = "none";
document.body.style.overflowX = "hidden";

const isTouchDevice =
  "ontouchstart" in window || Number(navigator.maxTouchPoints) > 0;

if (isTouchDevice) {
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) {
        return;
      }

      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches.length !== 1) {
        return;
      }

      const touch = event.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaY) <= Math.abs(deltaX)) {
        return;
      }

      const scroller = document.scrollingElement || root;
      const scrollTop = scroller.scrollTop;
      const maxScrollTop = scroller.scrollHeight - window.innerHeight;
      const isPullingPastTop = scrollTop <= 0 && deltaY > 0;
      const isPullingPastBottom = scrollTop >= maxScrollTop - 1 && deltaY < 0;

      if (isPullingPastTop || isPullingPastBottom) {
        event.preventDefault();
      }
    },
    { passive: false }
  );
}
