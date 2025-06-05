import { useRef } from "react";

export function useHorizontalDragScroll<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX.current;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onMouseLeave = () => {
    isDragging.current = false;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    startX.current = e.touches[0].pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = x - startX.current;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onTouchEnd = () => {
    isDragging.current = false;
  };

  const scrollToIndexCenter = (index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const columns = container.querySelectorAll("div.grid > div");
    const target = columns[index] as HTMLElement;
    if (!target) return;

    const scrollTarget =
      target.offsetLeft - container.clientWidth / 2 + target.offsetWidth / 2;

    container.scrollTo({
      left: scrollTarget,
      behavior: "smooth",
    });
  };

  return {
    containerRef,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    scrollToIndexCenter,
  };
}
