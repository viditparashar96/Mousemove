import { throttle } from "lodash";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const mousePointer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const throttledEmitMousePosition = throttle(
      (clientX: number, clientY: number) => {
        socket.emit("mousePosition", { mx: clientX, my: clientY });
      },
      500
    );

    const handleMouseMove = (e: MouseEvent) => {
      throttledEmitMousePosition(e.clientX, e.clientY);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      throttledEmitMousePosition.cancel();
    };
  }, []);

  useEffect(() => {
    const handleMousePositionUpdate = (data: any) => {
      if (mousePointer.current) {
        mousePointer.current.style.left = `${data.mx}px`;
        mousePointer.current.style.top = `${data.my}px`;
      }
    };

    socket.on("mousePositionUpdate", handleMousePositionUpdate);

    return () => {
      socket.off("mousePositionUpdate", handleMousePositionUpdate);
    };
  }, []);

  return (
    <>
      <h1>Mouse Move</h1>
      <p>Move your mouse to see the magic</p>
      <div
        ref={mousePointer}
        className="absolute w-[30px] h-[30px] rounded-full bg-red-400 transition-all duration-500 ease-linear"
      ></div>
    </>
  );
}

export default App;
